import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ContestantAttempt } from "./ContestantAttempt";

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

interface Season {
  taskmasterName: string;
  assistantName: string;
}

interface Episode {
  episodeNumber: number;
}

interface TaskViewerProps {
  task: Task;
  season: Season;
  episode: Episode;
  isLiveTask?: boolean;
}

export function TaskViewer({ task, season, episode, isLiveTask = false }: TaskViewerProps) {
  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case "prize":
        return "🏆";
      case "creative":
        return "🎨";
      case "physical":
        return "💪";
      case "lateral":
        return "🧠";
      case "live":
        return "⚡";
      default:
        return "📍";
    }
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Sort results by score (descending)
  const sortedResults = [...task.results].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      {/* Task Description Card */}
      <Card>
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl">{getTaskIcon(task.taskType)}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">
                {isLiveTask ? "LIVE TASK" : task.taskNumber === 0 ? "PRIZE TASK" : `TASK ${task.taskNumber}`}
              </h2>
              {task.location && (
                <Badge variant="default">{task.location}</Badge>
              )}
            </div>

            <div className="bg-background/50 p-4 rounded-lg border-l-4 border-gold mb-4">
              <p className="text-lg italic leading-relaxed font-body">
                "{task.description}"
              </p>
            </div>

            {task.rules && (
              <div className="text-sm text-text-secondary">
                <p className="font-medium mb-1">Rules:</p>
                <p>{task.rules}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="default">{task.taskType}</Badge>
              {task.metadata?.timed && (
                <Badge variant="default">⏱ Time-based</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Contestant Attempts */}
      <div className="space-y-4">
        {sortedResults.map((result, index) => (
          <ContestantAttempt
            key={result.id}
            result={result}
            rank={index + 1}
            totalContestants={sortedResults.length}
            season={season}
          />
        ))}
      </div>

      {/* Scoring Summary */}
      <Card>
        <h3 className="text-xl font-bold mb-4">
          {isLiveTask ? "Live Task" : task.taskNumber === 0 ? "Prize Task" : `Task ${task.taskNumber}`} Results
        </h3>
        <div className="space-y-2">
          {sortedResults.map((result, index) => {
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl w-8">
                    {medals[index] || `${index + 1}th`}
                  </span>
                  <span className="font-medium">{result.contestantName}</span>
                  {result.disqualified && (
                    <Badge variant="default" className="bg-danger/20 text-danger border-danger/30">
                      DQ
                    </Badge>
                  )}
                  {result.ruleViolations > 0 && (
                    <Badge variant="default" className="text-xs">
                      {result.ruleViolations} violation{result.ruleViolations > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {result.completionTime && (
                    <span className="font-mono text-text-secondary">
                      {formatTime(result.completionTime)}
                    </span>
                  )}
                  <span className="font-mono text-2xl font-bold text-gold w-16 text-right">
                    {result.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
