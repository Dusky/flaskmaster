import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        picks: {
          where: { active: true },
        },
        bets: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const wonBets = user.bets.filter((bet) => bet.status === "won").length;

    return NextResponse.json({
      username: user.username,
      email: user.email,
      currency: user.currencyBalance,
      memberSince: user.createdAt,
      activePicks: user.picks.length,
      totalBets: user.bets.length,
      wonBets,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
