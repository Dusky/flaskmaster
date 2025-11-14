import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    const users = await query<any>(`
      SELECT currency_balance as "currencyBalance"
      FROM users
      WHERE id = $1
    `, [userId]);

    const user = users[0];

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
