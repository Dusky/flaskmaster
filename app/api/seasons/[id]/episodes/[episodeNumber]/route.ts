import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    // Fetch episode with all tasks and results
    const episode = await prisma.episode.findFirst({
      where: {
        seasonId: params.id,
        episodeNumber: episodeNumber,
      },
      include: {
        tasks: {
          include: {
            results: {
              include: {
                contestant: {
                  select: {
                    id: true,
                    name: true,
                    colorIndex: true,
                  },
                },
              },
            },
          },
          orderBy: {
            taskNumber: "asc",
          },
        },
      },
    });

    if (!episode) {
      return NextResponse.json(
        { error: "Episode not found" },
        { status: 404 }
      );
    }

    // Transform the data for the frontend
    const transformedEpisode = {
      id: episode.id,
      episodeNumber: episode.episodeNumber,
      title: episode.title,
      status: episode.status,
      airDate: episode.airDate,
      content: episode.content,
      tasks: episode.tasks.map((task) => ({
        id: task.id,
        taskNumber: task.taskNumber,
        taskType: task.taskType,
        description: task.description,
        location: task.location,
        rules: task.rules,
        metadata: task.metadata,
        results: task.results.map((result) => ({
          id: result.id,
          contestantId: result.contestantId,
          contestantName: result.contestant.name,
          contestantColor: result.contestant.colorIndex,
          narrative: result.narrative,
          completionTime: result.completionTime,
          outcome: result.outcome,
          score: result.score,
          disqualified: result.disqualified,
          ruleViolations: result.ruleViolations,
        })),
      })),
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
