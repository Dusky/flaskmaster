import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  calculateWinnerOdds,
  BINARY_BET_ODDS,
  calculatePayout,
  validateBetAmount,
} from "@/lib/betting/odds";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, episodeId, taskId, betType, betTarget, amount } = body;

    // Validate required fields
    if (!userId || !episodeId || !betType || !betTarget || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch user with currency balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currencyBalance: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate bet amount
    const validation = validateBetAmount(amount, user.currencyBalance);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Fetch episode to validate and get contestants
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: {
        season: {
          include: {
            contestants: true,
          },
        },
        tasks: taskId
          ? {
              where: { id: taskId },
            }
          : undefined,
      },
    });

    if (!episode) {
      return NextResponse.json(
        { error: "Episode not found" },
        { status: 404 }
      );
    }

    // Validate episode status (can't bet on completed episodes)
    if (episode.status === "completed") {
      return NextResponse.json(
        { error: "Cannot bet on completed episode" },
        { status: 400 }
      );
    }

    // If taskId provided, validate the task exists
    if (taskId && (!episode.tasks || episode.tasks.length === 0)) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Calculate odds based on bet type
    let odds: number;

    switch (betType) {
      case "task_winner":
      case "episode_winner":
        // betTarget should be contestantId
        odds = calculateWinnerOdds(
          episode.season.contestants,
          betTarget
        );

        // Validate contestant exists in this season
        const contestantExists = episode.season.contestants.some(
          (c) => c.id === betTarget
        );
        if (!contestantExists) {
          return NextResponse.json(
            { error: "Invalid contestant for this season" },
            { status: 400 }
          );
        }
        break;

      case "exact_score":
      case "disqualification":
      case "special_outcome":
        // Binary outcome bets - fixed odds
        odds = BINARY_BET_ODDS;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid bet type" },
          { status: 400 }
        );
    }

    const potentialPayout = calculatePayout(amount, odds);

    // Place bet in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the bet
      const bet = await tx.bet.create({
        data: {
          userId,
          episodeId,
          taskId: taskId || null,
          betType,
          betTarget,
          amount,
          odds,
          potentialPayout,
          status: "pending",
        },
      });

      // Deduct currency from user
      await tx.user.update({
        where: { id: userId },
        data: {
          currencyBalance: {
            decrement: amount,
          },
        },
      });

      // Create transaction record
      await tx.currencyTransaction.create({
        data: {
          userId,
          amount: -amount,
          type: "bet_placed",
          description: `Bet on ${betType}: ${amount} at ${odds}x odds`,
          episodeId,
        },
      });

      return bet;
    });

    return NextResponse.json({
      success: true,
      bet: {
        id: result.id,
        betType: result.betType,
        amount: result.amount,
        odds: result.odds,
        potentialPayout: result.potentialPayout,
      },
      newBalance: user.currencyBalance - amount,
    });
  } catch (error) {
    console.error("Error placing bet:", error);
    return NextResponse.json(
      { error: "Failed to place bet" },
      { status: 500 }
    );
  }
}
