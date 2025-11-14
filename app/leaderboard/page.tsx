"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  currencyBalance: number;
  totalEarned: number;
  totalSpent: number;
  activePick: {
    contestantId: string;
    contestantName: string;
    contestantColor: number;
    contestantPoints: number;
    seasonNumber: number;
  } | null;
  memberSince: string;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [seasonFilter, setSeasonFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [seasonFilter]);

  const fetchLeaderboard = async () => {
    try {
      const url = seasonFilter
        ? `/api/leaderboard?seasonId=${seasonFilter}`
        : "/api/leaderboard";
      const res = await fetch(url);
      const data = await res.json();
      setLeaderboard(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    }
  };

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

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <section className="text-center py-8">
          <h1 className="text-5xl font-bold mb-4">LEADERBOARD</h1>
          <p className="text-xl text-text-secondary">
            Top players ranked by total currency
          </p>
        </section>

        {/* Leaderboard Table */}
        <section>
          <Card noPadding>
            <div className="divide-y divide-white/10">
              {leaderboard.map((entry) => {
                const isCurrentUser = user?.id === entry.userId;
                const medal = getMedalEmoji(entry.rank);

                return (
                  <div
                    key={entry.userId}
                    className={cn(
                      "p-6 transition-colors",
                      isCurrentUser && "bg-gold/10 border-l-4 border-gold"
                    )}
                  >
                    <div className="flex items-center gap-6">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-16 text-center">
                        {medal ? (
                          <div className="text-4xl">{medal}</div>
                        ) : (
                          <div className="text-3xl font-bold font-mono text-text-secondary">
                            {entry.rank}
                          </div>
                        )}
                      </div>

                      {/* Username */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold truncate">
                            {entry.username}
                          </h3>
                          {isCurrentUser && (
                            <Badge variant="live" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>

                        {/* Active Pick */}
                        {entry.activePick && (
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-background",
                                getContestantColor(entry.activePick.contestantColor)
                              )}
                            >
                              {entry.activePick.contestantName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span className="text-sm text-text-secondary">
                              {entry.activePick.contestantName} •{" "}
                              <span className="text-gold font-mono">
                                {entry.activePick.contestantPoints} pts
                              </span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-3xl font-mono font-bold text-gold mb-1">
                          ⚡ {entry.currencyBalance.toLocaleString()}
                        </div>
                        <div className="text-sm text-text-secondary space-x-3">
                          <span className="text-success">
                            +{entry.totalEarned.toLocaleString()} earned
                          </span>
                          {entry.totalSpent > 0 && (
                            <span className="text-danger">
                              -{entry.totalSpent.toLocaleString()} spent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Your Ranking */}
        {user && (
          <section>
            <Card>
              <div className="text-center">
                <p className="text-text-secondary mb-2">Your Position</p>
                <div className="flex items-center justify-center gap-4">
                  {(() => {
                    const userEntry = leaderboard.find(
                      (e) => e.userId === user.id
                    );
                    if (userEntry) {
                      const medal = getMedalEmoji(userEntry.rank);
                      return (
                        <>
                          {medal && <span className="text-4xl">{medal}</span>}
                          <div>
                            <div className="text-4xl font-bold font-mono text-gold">
                              #{userEntry.rank}
                            </div>
                            <div className="text-text-secondary text-sm">
                              of {leaderboard.length}
                            </div>
                          </div>
                        </>
                      );
                    }
                    return (
                      <p className="text-text-secondary">
                        Not in top {leaderboard.length}
                      </p>
                    );
                  })()}
                </div>
              </div>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
