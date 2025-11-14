import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contestantId } = await params;

    const contestants = await query<any>(`
      SELECT c.*, s.id as season_id, s.season_number
      FROM contestants c
      JOIN seasons s ON s.id = c.season_id
      WHERE c.id = $1
    `, [contestantId]);

    const contestant = contestants[0];

    if (!contestant) {
      return NextResponse.json(
        { error: "Contestant not found" },
        { status: 404 }
      );
    }

    // Get all contestants in the same season to calculate rank
    const allContestants = await query<any>(`
      SELECT id, tracked_stats as "trackedStats"
      FROM contestants
      WHERE season_id = $1
    `, [contestant.season_id]);

    // Sort by total points to get rank
    const sorted = allContestants.sort((a: any, b: any) => {
      const aPoints = a.trackedStats?.totalPoints || 0;
      const bPoints = b.trackedStats?.totalPoints || 0;
      return bPoints - aPoints;
    });

    const rank = sorted.findIndex((c: any) => c.id === contestantId) + 1;

    // Transform contestant to camelCase
    const transformedContestant = {
      id: contestant.id,
      seasonId: contestant.season_id,
      name: contestant.name,
      backstory: contestant.backstory,
      personalityArchetype: contestant.personality_archetype,
      colorIndex: contestant.color_index,
      hiddenStats: contestant.hidden_stats,
      trackedStats: contestant.tracked_stats,
      createdAt: contestant.created_at,
      season: {
        id: contestant.season_id,
        seasonNumber: contestant.season_number,
      },
    };

    return NextResponse.json({
      contestant: transformedContestant,
      rank,
      totalContestants: allContestants.length,
    });
  } catch (error) {
    console.error("Error fetching contestant:", error);
    return NextResponse.json(
      { error: "Failed to fetch contestant" },
      { status: 500 }
    );
  }
}
