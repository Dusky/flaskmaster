import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
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
    const existingPicks = await query<any>(`
      SELECT * FROM user_picks
      WHERE user_id = $1 AND season_id = $2 AND active = true
    `, [userId, seasonId]);

    if (existingPicks.length > 0) {
      return NextResponse.json(
        { error: "You already have a pick for this season" },
        { status: 400 }
      );
    }

    // Create the pick
    const picks = await query<any>(`
      INSERT INTO user_picks (id, user_id, season_id, contestant_id, active, currency_spent, picked_at)
      VALUES (gen_random_uuid(), $1, $2, $3, true, 0, NOW())
      RETURNING *
    `, [userId, seasonId, contestantId]);

    const pick = picks[0];

    // Fetch contestant details
    const contestants = await query<any>(`
      SELECT * FROM contestants WHERE id = $1
    `, [contestantId]);

    const contestant = contestants[0];
    if (contestant) {
      pick.contestant = {
        ...contestant,
        seasonId: contestant.season_id,
        personalityArchetype: contestant.personality_archetype,
        colorIndex: contestant.color_index,
        hiddenStats: contestant.hidden_stats,
        trackedStats: contestant.tracked_stats,
        createdAt: contestant.created_at,
      };
    }

    // Convert pick to camelCase
    pick.userId = pick.user_id;
    pick.seasonId = pick.season_id;
    pick.contestantId = pick.contestant_id;
    pick.currencySpent = pick.currency_spent;
    pick.pickedAt = pick.picked_at;

    delete pick.user_id;
    delete pick.season_id;
    delete pick.contestant_id;
    delete pick.currency_spent;
    delete pick.picked_at;

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

    let picks;
    if (seasonId) {
      picks = await query<any>(`
        SELECT up.*
        FROM user_picks up
        WHERE up.user_id = $1 AND up.season_id = $2 AND up.active = true
        ORDER BY up.picked_at DESC
      `, [userId, seasonId]);
    } else {
      picks = await query<any>(`
        SELECT up.*
        FROM user_picks up
        WHERE up.user_id = $1
        ORDER BY up.picked_at DESC
      `, [userId]);
    }

    // Fetch contestant and season details for each pick
    for (const pick of picks) {
      const contestants = await query<any>(`SELECT * FROM contestants WHERE id = $1`, [pick.contestant_id]);
      const seasons = await query<any>(`SELECT * FROM seasons WHERE id = $1`, [pick.season_id]);

      if (contestants.length > 0) {
        const c = contestants[0];
        pick.contestant = {
          id: c.id,
          name: c.name,
          seasonId: c.season_id,
          backstory: c.backstory,
          personalityArchetype: c.personality_archetype,
          colorIndex: c.color_index,
          hiddenStats: c.hidden_stats,
          trackedStats: c.tracked_stats,
          createdAt: c.created_at,
        };
      }

      if (seasons.length > 0) {
        const s = seasons[0];
        pick.season = {
          id: s.id,
          seasonNumber: s.season_number,
          status: s.status,
          startDate: s.start_date,
          endDate: s.end_date,
          taskmasterName: s.taskmaster_name,
          taskmasterPersonality: s.taskmaster_personality,
          assistantName: s.assistant_name,
          assistantPersonality: s.assistant_personality,
          createdAt: s.created_at,
        };
      }

      // Convert pick to camelCase
      pick.userId = pick.user_id;
      pick.seasonId = pick.season_id;
      pick.contestantId = pick.contestant_id;
      pick.currencySpent = pick.currency_spent;
      pick.pickedAt = pick.picked_at;

      delete pick.user_id;
      delete pick.season_id;
      delete pick.contestant_id;
      delete pick.currency_spent;
      delete pick.picked_at;
    }

    return NextResponse.json(picks);
  } catch (error) {
    console.error("Error fetching picks:", error);
    return NextResponse.json(
      { error: "Failed to fetch picks" },
      { status: 500 }
    );
  }
}
