import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const seasonId = params.id;

    const season = await prisma.season.findUnique({
      where: { id: seasonId },
      include: {
        contestants: {
          include: {
            userPicks: {
              where: { active: true },
              select: {
                userId: true,
              },
            },
          },
        },
        episodes: {
          orderBy: { episodeNumber: "asc" },
        },
      },
    });

    if (!season) {
      return NextResponse.json(
        { error: "Season not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(season);
  } catch (error) {
    console.error("Error fetching season:", error);
    return NextResponse.json(
      { error: "Failed to fetch season" },
      { status: 500 }
    );
  }
}
