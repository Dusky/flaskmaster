import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; episodeNumber: string } }
) {
  try {
    const episodeNumber = parseInt(params.episodeNumber);

    if (isNaN(episodeNumber)) {
      return NextResponse.json(
        { error: "Invalid episode number" },
        { status: 400 }
      );
    }

    // Fetch episode
    const episodes = await query<any>(`
      SELECT * FROM episodes
      WHERE season_id = $1 AND episode_number = $2
    `, [params.id, episodeNumber]);

    const episode = episodes[0];

    if (!episode) {
      return NextResponse.json(
        { error: "Episode not found" },
        { status: 404 }
      );
    }

    // Fetch tasks for this episode
    const tasks = await query<any>(`
      SELECT * FROM tasks
      WHERE episode_id = $1
      ORDER BY task_number
    `, [episode.id]);

    // For each task, fetch results with contestant info
    for (const task of tasks) {
      const results = await query<any>(`
        SELECT
          tr.*,
          c.name as contestant_name,
          c.color_index as contestant_color
        FROM task_results tr
        JOIN contestants c ON c.id = tr.contestant_id
        WHERE tr.task_id = $1
        ORDER BY tr.score DESC
      `, [task.id]);

      // Transform results
      task.results = results.map((result: any) => ({
        id: result.id,
        contestantId: result.contestant_id,
        contestantName: result.contestant_name,
        contestantColor: result.contestant_color,
        narrative: result.narrative,
        completionTime: result.completion_time,
        outcome: result.outcome,
        score: result.score,
        disqualified: result.disqualified,
        ruleViolations: result.rule_violations,
      }));

      // Convert task to camelCase
      task.taskNumber = task.task_number;
      task.taskType = task.task_type;

      delete task.episode_id;
      delete task.task_number;
      delete task.task_type;
      delete task.created_at;
    }

    // Transform the episode data
    const transformedEpisode = {
      id: episode.id,
      episodeNumber: episode.episode_number,
      title: episode.title,
      status: episode.status,
      airDate: episode.air_date,
      content: episode.content,
      tasks: tasks,
    };

    return NextResponse.json(transformedEpisode);
  } catch (error) {
    console.error("Error fetching episode:", error);
    return NextResponse.json(
      { error: "Failed to fetch episode" },
      { status: 500 }
    );
  }
}
