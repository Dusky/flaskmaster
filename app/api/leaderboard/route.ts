import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const seasonId = searchParams.get("seasonId");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Fetch users with their currency balance and active picks
    const users = await query<any>(`
      SELECT
        u.id,
        u.username,
        u.currency_balance as "currencyBalance",
        u.created_at as "createdAt",
        up.contestant_id as "activeContestantId",
        c.name as "activeContestantName",
        c.color_index as "activeContestantColor",
        c.tracked_stats as "activeContestantStats",
        s.id as "activeSeasonId",
        s.season_number as "activeSeasonNumber"
      FROM users u
      LEFT JOIN user_picks up ON up.user_id = u.id AND up.active = true ${seasonId ? 'AND up.season_id = $2' : ''}
      LEFT JOIN contestants c ON c.id = up.contestant_id
      LEFT JOIN seasons s ON s.id = up.season_id
      ORDER BY u.currency_balance DESC
      LIMIT $1
    `, seasonId ? [limit, seasonId] : [limit]);

    // Get currency transactions for each user
    const leaderboard = await Promise.all(users.map(async (user, index) => {
      const transactions = await query<any>(`
        SELECT amount, type, created_at as "createdAt"
        FROM currency_transactions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 5
      `, [user.id]);

      const totalEarned = transactions
        .filter((t: any) => t.amount > 0)
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      const totalSpent = transactions
        .filter((t: any) => t.amount < 0)
        .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);

      return {
        rank: index + 1,
        userId: user.id,
        username: user.username,
        currencyBalance: user.currencyBalance,
        totalEarned,
        totalSpent,
        activePick: user.activeContestantId
          ? {
              contestantId: user.activeContestantId,
              contestantName: user.activeContestantName,
              contestantColor: user.activeContestantColor,
              contestantPoints: user.activeContestantStats?.totalPoints || 0,
              seasonNumber: user.activeSeasonNumber,
            }
          : null,
        memberSince: user.createdAt,
      };
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
