import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const SWITCH_COST = 100; // Cost to switch contestants mid-season

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, seasonId, newContestantId } = body;

    if (!userId || !seasonId || !newContestantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch user with current balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currencyBalance: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has enough currency
    if (user.currencyBalance < SWITCH_COST) {
      return NextResponse.json(
        {
          error: "Insufficient currency",
          required: SWITCH_COST,
          current: user.currencyBalance,
        },
        { status: 400 }
      );
    }

    // Get current active pick for this season
    const currentPick = await prisma.userPick.findFirst({
      where: {
        userId,
        seasonId,
        active: true,
      },
      include: {
        contestant: {
          select: { name: true },
        },
      },
    });

    if (!currentPick) {
      return NextResponse.json(
        { error: "No active pick found for this season" },
        { status: 404 }
      );
    }

    // Validate they're switching to a different contestant
    if (currentPick.contestantId === newContestantId) {
      return NextResponse.json(
        { error: "You're already backing this contestant" },
        { status: 400 }
      );
    }

    // Verify new contestant exists and belongs to this season
    const newContestant = await prisma.contestant.findFirst({
      where: {
        id: newContestantId,
        seasonId,
      },
      select: { name: true },
    });

    if (!newContestant) {
      return NextResponse.json(
        { error: "Contestant not found in this season" },
        { status: 404 }
      );
    }

    // Verify season is still active
    const season = await prisma.season.findUnique({
      where: { id: seasonId },
      select: { status: true, seasonNumber: true },
    });

    if (!season || season.status !== "active") {
      return NextResponse.json(
        { error: "Cannot switch contestants - season is not active" },
        { status: 400 }
      );
    }

    // Perform the switch in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deactivate current pick
      await tx.userPick.update({
        where: { id: currentPick.id },
        data: { active: false },
      });

      // Create new pick
      const newPick = await tx.userPick.create({
        data: {
          userId,
          seasonId,
          contestantId: newContestantId,
          active: true,
          currencySpent: SWITCH_COST,
        },
      });

      // Deduct currency from user
      await tx.user.update({
        where: { id: userId },
        data: {
          currencyBalance: {
            decrement: SWITCH_COST,
          },
        },
      });

      // Create transaction record
      await tx.currencyTransaction.create({
        data: {
          userId,
          amount: -SWITCH_COST,
          type: "contestant_switch",
          description: `Switched from ${currentPick.contestant.name} to ${newContestant.name} (Season ${season.seasonNumber})`,
          contestantId: newContestantId,
        },
      });

      return newPick;
    });

    return NextResponse.json({
      success: true,
      message: `Successfully switched to ${newContestant.name}`,
      cost: SWITCH_COST,
      newBalance: user.currencyBalance - SWITCH_COST,
      newPickId: result.id,
    });
  } catch (error) {
    console.error("Error switching contestant:", error);
    return NextResponse.json(
      { error: "Failed to switch contestant" },
      { status: 500 }
    );
  }
}
