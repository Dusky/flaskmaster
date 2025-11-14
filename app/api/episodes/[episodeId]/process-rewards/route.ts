import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { episodeId: string } }
) {
  try {
    const { episodeId } = params;

    // Fetch episode with all tasks and results
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
        },
        season: {
          include: {
            userPicks: {
              where: { active: true },
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!episode) {
      return NextResponse.json(
        { error: "Episode not found" },
        { status: 404 }
      );
    }

    // Check if rewards have already been processed
    if (episode.rewardsProcessed) {
      return NextResponse.json(
        { error: "Rewards for this episode have already been processed" },
        { status: 400 }
      );
    }

    // Calculate points per contestant for this episode
    const contestantPoints: Record<string, number> = {};

    for (const task of episode.tasks) {
      for (const result of task.results) {
        if (!contestantPoints[result.contestantId]) {
          contestantPoints[result.contestantId] = 0;
        }
        contestantPoints[result.contestantId] += result.score;
      }
    }

    // Process rewards for each contestant
    const transactions = [];
    const userUpdates = [];

    for (const [contestantId, points] of Object.entries(contestantPoints)) {
      // Find users who picked this contestant
      const picks = episode.season.userPicks.filter(
        (pick) => pick.contestantId === contestantId
      );

      for (const pick of picks) {
        // Create currency transaction
        const transaction = await prisma.currencyTransaction.create({
          data: {
            userId: pick.userId,
            amount: points,
            type: "episode_reward",
            description: `Episode ${episode.episodeNumber} reward: ${points} points earned by your contestant`,
            episodeId: episode.id,
            contestantId: contestantId,
          },
        });

        transactions.push(transaction);

        // Update user's currency balance
        await prisma.user.update({
          where: { id: pick.userId },
          data: {
            currencyBalance: {
              increment: points,
            },
          },
        });

        userUpdates.push({
          userId: pick.userId,
          contestantId,
          pointsEarned: points,
        });
      }
    }

    // Mark episode as rewards processed
    await prisma.episode.update({
      where: { id: episodeId },
      data: {
        rewardsProcessed: true,
      },
    });

    return NextResponse.json({
      success: true,
      episodeId: episode.id,
      episodeNumber: episode.episodeNumber,
      transactionsCreated: transactions.length,
      usersRewarded: userUpdates.length,
      rewards: Object.entries(contestantPoints).map(([contestantId, points]) => ({
        contestantId,
        points,
        usersRewarded: episode.season.userPicks.filter(
          (pick) => pick.contestantId === contestantId
        ).length,
      })),
    });
  } catch (error) {
    console.error("Error processing episode rewards:", error);
    return NextResponse.json(
      { error: "Failed to process episode rewards" },
      { status: 500 }
    );
  }
}
