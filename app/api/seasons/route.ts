import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const seasons = await query<any>(`
      SELECT * FROM seasons ORDER BY season_number DESC
    `);

    // Fetch contestants and episodes for each season
    for (const season of seasons) {
      const contestants = await query<any>(`
        SELECT id, name, personality_archetype as "personalityArchetype", color_index as "colorIndex"
        FROM contestants
        WHERE season_id = $1
        ORDER BY color_index
      `, [season.id]);

      const episodes = await query<any>(`
        SELECT id, episode_number as "episodeNumber", status, air_date as "airDate"
        FROM episodes
        WHERE season_id = $1
        ORDER BY episode_number
      `, [season.id]);

      season.contestants = contestants;
      season.episodes = episodes;

      // Convert snake_case to camelCase for season fields
      season.seasonNumber = season.season_number;
      season.startDate = season.start_date;
      season.endDate = season.end_date;
      season.taskmasterName = season.taskmaster_name;
      season.taskmasterPersonality = season.taskmaster_personality;
      season.assistantName = season.assistant_name;
      season.assistantPersonality = season.assistant_personality;
      season.createdAt = season.created_at;

      delete season.season_number;
      delete season.start_date;
      delete season.end_date;
      delete season.taskmaster_name;
      delete season.taskmaster_personality;
      delete season.assistant_name;
      delete season.assistant_personality;
      delete season.created_at;
    }

    return NextResponse.json(seasons);
  } catch (error) {
    console.error("Error fetching seasons:", error);
    return NextResponse.json(
      { error: "Failed to fetch seasons" },
      { status: 500 }
    );
  }
}
