"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface Contestant {
  id: string;
  name: string;
  personalityArchetype: string;
  colorIndex: number;
  trackedStats: {
    totalPoints?: number;
    tasksWon?: number;
    timesAwarded5Points?: number;
    timesAwarded1Point?: number;
    [key: string]: any;
  };
}

interface Season {
  id: string;
  seasonNumber: number;
  status: string;
  contestants: Contestant[];
}

export default function StandingsPage() {
  const params = useParams();
  const router = useRouter();
  const [season, setSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchSeason();
    }
  }, [params.id]);

  const fetchSeason = async () => {
    try {
      const res = await fetch(`/api/seasons/${params.id}`);
      const data = await res.json();
      setSeason(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching season:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!season) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="text-text-secondary">Season not found</p>
        </Card>
      </div>
    );
  }

  // Sort contestants by total points
  const sortedContestants = [...season.contestants].sort((a, b) => {
    const aPoints = a.trackedStats?.totalPoints || 0;
    const bPoints = b.trackedStats?.totalPoints || 0;
    return bPoints - aPoints;
  });

  const getContestantColor = (colorIndex: number) => {
    const colors = ["bg-contestant-1", "bg-contestant-2", "bg-contestant-3", "bg-contestant-4", "bg-contestant-5"];
    return colors[colorIndex - 1] || colors[0];
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold mb-2">
                SEASON {season.seasonNumber} STANDINGS
              </h1>
              <p className="text-xl text-text-secondary">Current rankings</p>
            </div>
            <Badge variant={season.status === "active" ? "live" : "completed"}>
              {season.status === "active" ? "Active" : "Completed"}
            </Badge>
          </div>
        </section>

        {/* Standings Table */}
        <section>
          <Card noPadding>
            <div className="divide-y divide-white/10">
              {sortedContestants.map((contestant, index) => {
                const rank = index + 1;
                const totalPoints = contestant.trackedStats?.totalPoints || 0;
                const tasksWon = contestant.trackedStats?.tasksWon || 0;

                return (
                  <Link
                    key={contestant.id}
                    href={`/contestants/${contestant.id}`}
                    className="block hover:bg-background/50 transition-colors"
                  >
                    <div className="p-6 flex items-center space-x-6">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-3xl font-bold font-mono text-gold">
                          {rank}
                        </div>
                        <div className="text-2xl">
                          {getRankEmoji(rank)}
                        </div>
                      </div>

                      {/* Avatar */}
                      <div
                        className={`w-16 h-16 rounded-full ${getContestantColor(contestant.colorIndex)} flex items-center justify-center text-xl font-bold text-background flex-shrink-0`}
                      >
                        {contestant.name.split(" ").map((n) => n[0]).join("")}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold mb-1 truncate">
                          {contestant.name}
                        </h3>
                        <p className="text-text-secondary italic text-sm">
                          {contestant.personalityArchetype}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-3xl font-mono font-bold text-gold mb-1">
                          {totalPoints}
                        </div>
                        <div className="text-text-secondary text-sm">
                          {tasksWon} {tasksWon === 1 ? "win" : "wins"}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Back Button */}
        <section>
          <button
            onClick={() => router.back()}
            className="text-gold hover:text-[#f7b77e] transition-colors"
          >
            ← Back to Season
          </button>
        </section>
      </div>
    </div>
  );
}
