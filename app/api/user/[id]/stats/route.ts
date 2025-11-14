import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    const users = await query<any>(`
      SELECT username, email, currency_balance as "currencyBalance", created_at as "createdAt"
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

    // Get active picks count
    const activePicks = await query<any>(`
      SELECT COUNT(*) as count
      FROM user_picks
      WHERE user_id = $1 AND active = true
    `, [userId]);

    // Get total bets count
    const totalBets = await query<any>(`
      SELECT COUNT(*) as count
      FROM bets
      WHERE user_id = $1
    `, [userId]);

    // Get won bets count
    const wonBets = await query<any>(`
      SELECT COUNT(*) as count
      FROM bets
      WHERE user_id = $1 AND status = 'won'
    `, [userId]);

    return NextResponse.json({
      username: user.username,
      email: user.email,
      currency: user.currencyBalance,
      memberSince: user.createdAt,
      activePicks: parseInt(activePicks[0]?.count || '0'),
      totalBets: parseInt(totalBets[0]?.count || '0'),
      wonBets: parseInt(wonBets[0]?.count || '0'),
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
