import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPickSchema = z.object({
  userId: z.string(),
  seasonId: z.string(),
  contestantId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, seasonId, contestantId } = createPickSchema.parse(body);

    // Check if user already has an active pick for this season
    const existingPick = await prisma.userPick.findFirst({
      where: {
        userId,
        seasonId,
        active: true,
      },
    });

    if (existingPick) {
      return NextResponse.json(
        { error: "You already have a pick for this season" },
        { status: 400 }
      );
    }

    // Create the pick
    const pick = await prisma.userPick.create({
      data: {
        userId,
        seasonId,
        contestantId,
        active: true,
        currencySpent: 0, // First pick is free
      },
      include: {
        contestant: true,
      },
    });

    return NextResponse.json(pick, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating pick:", error);
    return NextResponse.json(
      { error: "Failed to create pick" },
      { status: 500 }
    );
  }
}

// Get user's picks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const seasonId = searchParams.get("seasonId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const where: any = { userId };
    if (seasonId) {
      where.seasonId = seasonId;
      where.active = true;
    }

    const picks = await prisma.userPick.findMany({
      where,
      include: {
        contestant: true,
        season: true,
      },
      orderBy: {
        pickedAt: "desc",
      },
    });

    return NextResponse.json(picks);
  } catch (error) {
    console.error("Error fetching picks:", error);
    return NextResponse.json(
      { error: "Failed to fetch picks" },
      { status: 500 }
    );
  }
}
