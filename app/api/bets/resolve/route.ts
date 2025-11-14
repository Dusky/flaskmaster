import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { episodeId, taskId } = body;

    if (!episodeId) {
      return NextResponse.json(
        { error: "episodeId is required" },
        { status: 400 }
      );
    }

    // Fetch the episode with tasks and results
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: {
        tasks: {
          include: {
            results: {
              include: {
                contestant: true,
              },
            },
          },
          ...(taskId ? { where: { id: taskId } } : {}),
        },
      },
    });

    if (!episode) {
      return NextResponse.json(
        { error: "Episode not found" },
        { status: 404 }
      );
    }

    // Fetch pending bets for this episode/task
    const pendingBets = await prisma.bet.findMany({
      where: {
        episodeId,
        ...(taskId ? { taskId } : {}),
        status: "pending",
      },
    });

    if (pendingBets.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending bets to resolve",
        resolved: 0,
      });
    }

    // Resolve each bet
    const resolutions: any[] = [];

    for (const bet of pendingBets) {
      let won = false;
      let actualPayout = 0;

      switch (bet.betType) {
        case "task_winner": {
          // Find the task
          const task = episode.tasks.find((t) => t.id === bet.taskId);
          if (!task) break;

          // Find the winner (highest score)
          const sortedResults = task.results.sort((a, b) => b.score - a.score);
          const winner = sortedResults[0];

          won = winner?.contestantId === bet.betTarget;
          actualPayout = won ? bet.potentialPayout : 0;
          break;
        }

        case "episode_winner": {
          // Calculate total points per contestant
          const contestantPoints: Record<string, number> = {};

          for (const task of episode.tasks) {
            for (const result of task.results) {
              if (!contestantPoints[result.contestantId]) {
                contestantPoints[result.contestantId] = 0;
              }
              contestantPoints[result.contestantId] += result.score;
            }
          }

          // Find winner
          const winnerId = Object.entries(contestantPoints).sort(
            ([, a], [, b]) => b - a
          )[0]?.[0];

          won = winnerId === bet.betTarget;
          actualPayout = won ? bet.potentialPayout : 0;
          break;
        }

        // Add more bet types as needed
        default:
          console.warn(`Unknown bet type: ${bet.betType}`);
      }

      // Update bet status
      await prisma.$transaction(async (tx) => {
        await tx.bet.update({
          where: { id: bet.id },
          data: {
            status: won ? "won" : "lost",
            actualPayout,
            resolvedAt: new Date(),
          },
        });

        if (won && actualPayout > 0) {
          // Pay out winnings
          await tx.user.update({
            where: { id: bet.userId },
            data: {
              currencyBalance: {
                increment: actualPayout,
              },
            },
          });

          // Create transaction record
          await tx.currencyTransaction.create({
            data: {
              userId: bet.userId,
              amount: actualPayout,
              type: "bet_won",
              description: `Won bet on ${bet.betType}: ${actualPayout} ⚡`,
              episodeId: bet.episodeId,
            },
          });
        } else {
          // Record loss (already deducted when bet was placed)
          await tx.currencyTransaction.create({
            data: {
              userId: bet.userId,
              amount: 0,
              type: "bet_lost",
              description: `Lost bet on ${bet.betType}: ${bet.amount} ⚡ wagered`,
              episodeId: bet.episodeId,
            },
          });
        }
      });

      resolutions.push({
        betId: bet.id,
        won,
        actualPayout,
      });
    }

    return NextResponse.json({
      success: true,
      resolved: resolutions.length,
      results: resolutions,
    });
  } catch (error) {
    console.error("Error resolving bets:", error);
    return NextResponse.json(
      { error: "Failed to resolve bets" },
      { status: 500 }
    );
  }
}
