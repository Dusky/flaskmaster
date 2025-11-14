import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: seasonId } = await params;

    const seasons = await query<any>(`SELECT * FROM seasons WHERE id = $1`, [seasonId]);
    const season = seasons[0];

    if (!season) {
      return NextResponse.json(
        { error: "Season not found" },
        { status: 404 }
      );
    }

    // Fetch contestants with their active user picks
    const contestants = await query<any>(`
      SELECT c.*
      FROM contestants c
      WHERE c.season_id = $1
      ORDER BY c.color_index
    `, [seasonId]);

    // For each contestant, fetch active user picks
    for (const contestant of contestants) {
      const userPicks = await query<any>(`
        SELECT user_id as "userId"
        FROM user_picks
        WHERE contestant_id = $1 AND active = true
      `, [contestant.id]);

      // Convert snake_case to camelCase
      contestant.seasonId = contestant.season_id;
      contestant.personalityArchetype = contestant.personality_archetype;
      contestant.colorIndex = contestant.color_index;
      contestant.hiddenStats = contestant.hidden_stats;
      contestant.trackedStats = contestant.tracked_stats;
      contestant.createdAt = contestant.created_at;
      contestant.userPicks = userPicks;

      delete contestant.season_id;
      delete contestant.personality_archetype;
      delete contestant.color_index;
      delete contestant.hidden_stats;
      delete contestant.tracked_stats;
      delete contestant.created_at;
    }

    // Fetch episodes
    const episodes = await query<any>(`
      SELECT * FROM episodes
      WHERE season_id = $1
      ORDER BY episode_number
    `, [seasonId]);

    // Convert episodes to camelCase
    for (const episode of episodes) {
      episode.seasonId = episode.season_id;
      episode.episodeNumber = episode.episode_number;
      episode.airDate = episode.air_date;
      episode.rewardsProcessed = episode.rewards_processed;
      episode.createdAt = episode.created_at;

      delete episode.season_id;
      delete episode.episode_number;
      delete episode.air_date;
      delete episode.rewards_processed;
      delete episode.created_at;
    }

    // Convert season to camelCase
    season.seasonNumber = season.season_number;
    season.startDate = season.start_date;
    season.endDate = season.end_date;
    season.taskmasterName = season.taskmaster_name;
    season.taskmasterPersonality = season.taskmaster_personality;
    season.assistantName = season.assistant_name;
    season.assistantPersonality = season.assistant_personality;
    season.createdAt = season.created_at;
    season.contestants = contestants;
    season.episodes = episodes;

    delete season.season_number;
    delete season.start_date;
    delete season.end_date;
    delete season.taskmaster_name;
    delete season.taskmaster_personality;
    delete season.assistant_name;
    delete season.assistant_personality;
    delete season.created_at;

    return NextResponse.json(season);
  } catch (error) {
    console.error("Error fetching season:", error);
    return NextResponse.json(
      { error: "Failed to fetch season" },
      { status: 500 }
    );
  }
}
