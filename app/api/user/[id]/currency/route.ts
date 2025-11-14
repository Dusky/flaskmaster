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
      select: { currencyBalance: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ currency: user.currencyBalance });
  } catch (error) {
    console.error("Error fetching user currency:", error);
    return NextResponse.json(
      { error: "Failed to fetch currency" },
      { status: 500 }
    );
  }
}
