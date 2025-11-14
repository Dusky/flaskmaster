"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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

interface Season {
  taskmasterName: string;
  assistantName: string;
}

interface ContestantAttemptProps {
  result: TaskResult;
  rank: number;
  totalContestants: number;
  season: Season;
}

export function ContestantAttempt({
  result,
  rank,
  totalContestants,
  season,
}: ContestantAttemptProps) {
  const [expanded, setExpanded] = useState(false);

  const getContestantColor = (colorIndex: number) => {
    const colors = [
      "bg-contestant-1",
      "bg-contestant-2",
      "bg-contestant-3",
      "bg-contestant-4",
      "bg-contestant-5",
    ];
    return colors[colorIndex - 1] || colors[0];
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const narrativePreview = result.narrative.slice(0, 300);
  const hasMore = result.narrative.length > 300;

  return (
    <Card noPadding className="overflow-hidden">
      {/* Header with color accent */}
      <div
        className={cn(
          "h-2",
          getContestantColor(result.contestantColor)
        )}
      />

      <div className="p-6">
        {/* Contestant Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-background",
                getContestantColor(result.contestantColor)
              )}
            >
              {result.contestantName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="text-xl font-bold">{result.contestantName}</h3>
              <p className="text-text-secondary text-sm">
                {rank === 1 ? "1st" : rank === 2 ? "2nd" : rank === 3 ? "3rd" : `${rank}th`} place
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-3xl font-bold text-gold mb-1">
              {result.score}
            </div>
            <div className="text-text-secondary text-sm">
              {result.score === 5 ? "points" : result.score === 1 ? "point" : "points"}
            </div>
          </div>
        </div>

        {/* Narrative */}
        <div className="prose prose-invert max-w-none mb-4">
          <p className="text-lg leading-relaxed font-body">
            {expanded ? result.narrative : narrativePreview}
            {!expanded && hasMore && "..."}
          </p>
        </div>

        {hasMore && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="mb-4"
          >
            {expanded ? "Show less" : "Continue reading"}
          </Button>
        )}

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 text-sm">
          {result.completionTime && (
            <div className="flex items-center gap-2">
              <span className="text-text-secondary">⏱</span>
              <span className="font-mono">{formatTime(result.completionTime)}</span>
            </div>
          )}

          {result.outcome && (
            <div className="flex items-center gap-2">
              <span className="text-text-secondary">📊</span>
              <span>{result.outcome}</span>
            </div>
          )}

          {result.disqualified && (
            <div className="flex items-center gap-2 text-danger">
              <span>🚫</span>
              <span className="font-medium">Disqualified</span>
            </div>
          )}

          {result.ruleViolations > 0 && (
            <div className="flex items-center gap-2 text-text-secondary">
              <span>⚠️</span>
              <span>
                {result.ruleViolations} rule violation{result.ruleViolations > 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-text-secondary">Score:</span>
            <span className="font-mono text-xl font-bold text-gold">
              {result.score} / 5
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
