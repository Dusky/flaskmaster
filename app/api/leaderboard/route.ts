import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const seasonId = searchParams.get("seasonId");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Fetch users with their currency balance and active picks
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        currencyBalance: true,
        createdAt: true,
        picks: {
          where: {
            active: true,
            ...(seasonId ? { seasonId } : {}),
          },
          include: {
            contestant: {
              select: {
                id: true,
                name: true,
                colorIndex: true,
                trackedStats: true,
              },
            },
            season: {
              select: {
                id: true,
                seasonNumber: true,
              },
            },
          },
        },
        currencyTransactions: {
          select: {
            amount: true,
            type: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
      orderBy: {
        currencyBalance: "desc",
      },
      take: limit,
    });

    // Calculate additional stats for each user
    const leaderboard = users.map((user, index) => {
      const totalEarned = user.currencyTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const totalSpent = user.currencyTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      // Get active pick for the season (if seasonId provided)
      const activePick = user.picks.find((pick) =>
        seasonId ? pick.season.id === seasonId : pick.active
      );

      return {
        rank: index + 1,
        userId: user.id,
        username: user.username,
        currencyBalance: user.currencyBalance,
        totalEarned,
        totalSpent,
        activePick: activePick
          ? {
              contestantId: activePick.contestant.id,
              contestantName: activePick.contestant.name,
              contestantColor: activePick.contestant.colorIndex,
              contestantPoints: activePick.contestant.trackedStats?.totalPoints || 0,
              seasonNumber: activePick.season.seasonNumber,
            }
          : null,
        memberSince: user.createdAt,
      };
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
