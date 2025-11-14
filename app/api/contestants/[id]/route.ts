import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contestantId = params.id;

    const contestant = await prisma.contestant.findUnique({
      where: { id: contestantId },
      include: {
        season: {
          select: {
            id: true,
            seasonNumber: true,
          },
        },
      },
    });

    if (!contestant) {
      return NextResponse.json(
        { error: "Contestant not found" },
        { status: 404 }
      );
    }

    // Get all contestants in the same season to calculate rank
    const allContestants = await prisma.contestant.findMany({
      where: { seasonId: contestant.seasonId },
      select: {
        id: true,
        trackedStats: true,
      },
    });

    // Sort by total points to get rank
    const sorted = allContestants.sort((a, b) => {
      const aPoints = (a.trackedStats as any)?.totalPoints || 0;
      const bPoints = (b.trackedStats as any)?.totalPoints || 0;
      return bPoints - aPoints;
    });

    const rank = sorted.findIndex((c) => c.id === contestantId) + 1;

    return NextResponse.json({
      contestant,
      rank,
      totalContestants: allContestants.length,
    });
  } catch (error) {
    console.error("Error fetching contestant:", error);
    return NextResponse.json(
      { error: "Failed to fetch contestant" },
      { status: 500 }
    );
  }
}
