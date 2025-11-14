"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EpisodeNavigation } from "@/components/episodes/EpisodeNavigation";
import { TaskViewer } from "@/components/episodes/TaskViewer";
import { BettingCard } from "@/components/betting/BettingCard";

interface Task {
  id: string;
  taskNumber: number;
  taskType: string;
  description: string;
  location?: string;
  rules?: string;
  metadata?: any;
  results: TaskResult[];
}

interface TaskResult {
  id: string;
  contestantId: string;
  contestantName: string;
  contestantColor: number;
  narrative: string;
  completionTime?: number;
  outcome?: string;
  score: number;
  disqualified: boolean;
  ruleViolations: number;
}

interface Episode {
  id: string;
  episodeNumber: number;
  title?: string;
  status: string;
  airDate: string;
  content?: any;
  tasks: Task[];
}

interface Contestant {
  id: string;
  name: string;
  colorIndex: number;
  trackedStats?: {
    totalPoints?: number;
  };
}

interface Season {
  id: string;
  seasonNumber: number;
  taskmasterName: string;
  assistantName: string;
  contestants?: Contestant[];
}

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<number>(0); // 0=opening, 1=prize, 2-4=tasks, 5=live, 6=results
  const [userCurrency, setUserCurrency] = useState<number>(0);

  useEffect(() => {
    if (params.id && params.episodeNumber) {
      fetchEpisodeData();
    }
  }, [params.id, params.episodeNumber]);

  const fetchEpisodeData = async () => {
    try {
      // Fetch season info (includes contestants)
      const seasonRes = await fetch(`/api/seasons/${params.id}`);
      if (!seasonRes.ok) {
        throw new Error('Failed to fetch season');
      }
      const seasonData = await seasonRes.json();
      if (seasonData.error) {
        throw new Error(seasonData.error);
      }
      setSeason(seasonData);

      // Fetch episode with tasks and results
      const episodeRes = await fetch(
        `/api/seasons/${params.id}/episodes/${params.episodeNumber}`
      );
      if (!episodeRes.ok) {
        throw new Error('Failed to fetch episode');
      }
      const episodeData = await episodeRes.json();
      if (episodeData.error) {
        throw new Error(episodeData.error);
      }
      setEpisode(episodeData);

      // Fetch user currency if logged in
      if (user) {
        const currencyRes = await fetch(`/api/user/${user.id}/currency`);
        if (currencyRes.ok) {
          const currencyData = await currencyRes.json();
          setUserCurrency(currencyData.currency || 0);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching episode:", error);
      setLoading(false);
    }
  };

  const handleBetPlaced = () => {
    // Refresh user currency after placing bet
    if (user) {
      fetch(`/api/user/${user.id}/currency`)
        .then((res) => res.json())
        .then((data) => setUserCurrency(data.currency || 0))
        .catch(console.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading episode...</div>
      </div>
    );
  }

  if (!episode || !season) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="text-text-secondary">Episode not found</p>
          <Button
            className="mt-4"
            onClick={() => router.push(`/seasons/${params.id}`)}
          >
            Back to Season
          </Button>
        </Card>
      </div>
    );
  }

  const sections = [
    { id: 0, label: "Opening", type: "opening" },
    { id: 1, label: "Prize Task", type: "prize", taskNumber: 0 },
    { id: 2, label: "Task 1", type: "task", taskNumber: 1 },
    { id: 3, label: "Task 2", type: "task", taskNumber: 2 },
    { id: 4, label: "Task 3", type: "task", taskNumber: 3 },
    { id: 5, label: "Live Task", type: "live", taskNumber: 4 },
    { id: 6, label: "Results", type: "results" },
  ];

  const currentSectionData = sections[currentSection];
  const currentTask = episode.tasks.find(
    (t) => t.taskNumber === currentSectionData.taskNumber
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <section>
          <button
            onClick={() => router.push(`/seasons/${params.id}/standings`)}
            className="text-text-secondary hover:text-text-primary mb-4 flex items-center gap-2"
          >
            ← Season {season.seasonNumber}
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                EPISODE {episode.episodeNumber}
                {episode.title && `: "${episode.title}"`}
              </h1>
              <p className="text-text-secondary">
                Aired {new Date(episode.airDate).toLocaleDateString()}
              </p>
            </div>
            <Badge
              variant={
                episode.status === "live"
                  ? "live"
                  : episode.status === "completed"
                  ? "completed"
                  : "upcoming"
              }
            >
              {episode.status}
            </Badge>
          </div>
        </section>

        {/* Episode Navigation */}
        <EpisodeNavigation
          sections={sections}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          completedSections={episode.status === "completed" ? sections.length : currentSection}
        />

        {/* Content Section */}
        <section>
          {currentSectionData.type === "opening" && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">Opening</h2>
              <div className="prose prose-invert max-w-none">
                {episode.content?.opening ? (
                  <p className="text-lg leading-relaxed">{episode.content.opening}</p>
                ) : (
                  <p className="text-text-secondary italic">
                    {season.taskmasterName} welcomes the contestants to Episode {episode.episodeNumber}.
                  </p>
                )}
              </div>
            </Card>
          )}

          {(currentSectionData.type === "prize" ||
            currentSectionData.type === "task" ||
            currentSectionData.type === "live") &&
            currentTask && (
              <div className="space-y-6">
                <TaskViewer
                  task={currentTask}
                  season={season}
                  episode={episode}
                  isLiveTask={currentSectionData.type === "live"}
                />

                {/* Betting Section - Only show if logged in and episode not completed */}
                {user && episode.status !== "completed" && season.contestants && (
                  <BettingCard
                    episodeId={episode.id}
                    taskId={currentTask.id}
                    contestants={season.contestants}
                    userId={user.id}
                    userCurrency={userCurrency}
                    betType="task_winner"
                    onBetPlaced={handleBetPlaced}
                  />
                )}
              </div>
            )}

          {currentSectionData.type === "results" && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">Episode Results</h2>
              <div className="space-y-4">
                {episode.tasks
                  .flatMap((task) => task.results)
                  .reduce((acc: any, result) => {
                    const existing = acc.find((r: any) => r.contestantId === result.contestantId);
                    if (existing) {
                      existing.totalScore += result.score;
                    } else {
                      acc.push({
                        contestantId: result.contestantId,
                        contestantName: result.contestantName,
                        contestantColor: result.contestantColor,
                        totalScore: result.score,
                      });
                    }
                    return acc;
                  }, [])
                  .sort((a: any, b: any) => b.totalScore - a.totalScore)
                  .map((contestant: any, index: number) => {
                    const medals = ["🥇", "🥈", "🥉"];
                    return (
                      <div
                        key={contestant.contestantId}
                        className="flex items-center justify-between p-4 rounded-lg bg-surface/50 border border-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{medals[index] || `${index + 1}th`}</span>
                          <span className="font-bold text-lg">{contestant.contestantName}</span>
                        </div>
                        <span className="font-mono text-2xl font-bold text-gold">
                          {contestant.totalScore} points
                        </span>
                      </div>
                    );
                  })}
              </div>
            </Card>
          )}
        </section>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
          >
            ← Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentSection(Math.min(sections.length - 1, currentSection + 1))
            }
            disabled={currentSection === sections.length - 1}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
