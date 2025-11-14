import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { seasonNumber: "desc" },
      include: {
        contestants: {
          select: {
            id: true,
            name: true,
            personalityArchetype: true,
            colorIndex: true,
          },
        },
        episodes: {
          select: {
            id: true,
            episodeNumber: true,
            status: true,
            airDate: true,
          },
        },
      },
    });

    return NextResponse.json(seasons);
  } catch (error) {
    console.error("Error fetching seasons:", error);
    return NextResponse.json(
      { error: "Failed to fetch seasons" },
      { status: 500 }
    );
  }
}
