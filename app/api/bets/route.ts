import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const episodeId = searchParams.get("episodeId");
    const status = searchParams.get("status"); // pending, won, lost

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = {
      userId,
    };

    if (episodeId) {
      where.episodeId = episodeId;
    }

    if (status) {
      where.status = status;
    }

    // Fetch bets with related data
    const bets = await prisma.bet.findMany({
      where,
      include: {
        episode: {
          select: {
            id: true,
            episodeNumber: true,
            title: true,
            status: true,
            season: {
              select: {
                seasonNumber: true,
              },
            },
          },
        },
        task: {
          select: {
            id: true,
            taskNumber: true,
            taskType: true,
            description: true,
          },
        },
      },
      orderBy: {
        placedAt: "desc",
      },
    });

    // Format the bets for the frontend
    const formattedBets = bets.map((bet) => ({
      id: bet.id,
      betType: bet.betType,
      betTarget: bet.betTarget,
      amount: bet.amount,
      odds: bet.odds,
      potentialPayout: bet.potentialPayout,
      status: bet.status,
      actualPayout: bet.actualPayout,
      placedAt: bet.placedAt,
      resolvedAt: bet.resolvedAt,
      episode: {
        id: bet.episode.id,
        episodeNumber: bet.episode.episodeNumber,
        title: bet.episode.title,
        status: bet.episode.status,
        seasonNumber: bet.episode.season.seasonNumber,
      },
      task: bet.task
        ? {
            id: bet.task.id,
            taskNumber: bet.task.taskNumber,
            taskType: bet.task.taskType,
            description: bet.task.description,
          }
        : null,
    }));

    return NextResponse.json(formattedBets);
  } catch (error) {
    console.error("Error fetching bets:", error);
    return NextResponse.json(
      { error: "Failed to fetch bets" },
      { status: 500 }
    );
  }
}
