"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { StatDisplay } from "@/components/ui/StatDisplay";
import { Badge } from "@/components/ui/Badge";

interface Contestant {
  id: string;
  name: string;
  backstory: string;
  personalityArchetype: string;
  colorIndex: number;
  trackedStats: {
    totalPoints?: number;
    tasksWon?: number;
    timesAwarded5Points?: number;
    timesAwarded4Points?: number;
    timesAwarded3Points?: number;
    timesAwarded2Points?: number;
    timesAwarded1Point?: number;
    disqualifications?: number;
    ruleViolations?: number;
    [key: string]: any;
  };
  season: {
    id: string;
    seasonNumber: number;
  };
}

export default function ContestantPage() {
  const params = useParams();
  const router = useRouter();
  const [contestant, setContestant] = useState<Contestant | null>(null);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState<number | null>(null);
  const [totalContestants, setTotalContestants] = useState<number | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchContestant();
    }
  }, [params.id]);

  const fetchContestant = async () => {
    try {
      const res = await fetch(`/api/contestants/${params.id}`);
      const data = await res.json();
      setContestant(data.contestant);
      setRank(data.rank);
      setTotalContestants(data.totalContestants);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contestant:", error);
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

  if (!contestant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="text-text-secondary">Contestant not found</p>
        </Card>
      </div>
    );
  }

  const getContestantColor = (colorIndex: number) => {
    const colors = ["bg-contestant-1", "bg-contestant-2", "bg-contestant-3", "bg-contestant-4", "bg-contestant-5"];
    return colors[colorIndex - 1] || colors[0];
  };

  const stats = contestant.trackedStats || {};
  const totalPoints = stats.totalPoints || 0;
  const tasksWon = stats.tasksWon || 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <section>
          <button
            onClick={() => router.back()}
            className="text-gold hover:text-[#f7b77e] transition-colors mb-4"
          >
            ← Back
          </button>

          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div
              className={`w-32 h-32 rounded-full ${getContestantColor(contestant.colorIndex)} flex items-center justify-center text-5xl font-bold text-background flex-shrink-0`}
            >
              {contestant.name.split(" ").map((n) => n[0]).join("")}
            </div>

            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-2">{contestant.name.toUpperCase()}</h1>
              <p className="text-xl text-text-secondary italic mb-4">
                &quot;{contestant.personalityArchetype}&quot;
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="live">
                  Season {contestant.season.seasonNumber}
                </Badge>
                {rank && (
                  <div className="text-text-secondary">
                    Rank #{rank} of {totalContestants}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Backstory */}
        <section>
          <Card>
            <h2 className="text-2xl font-bold mb-4">Backstory</h2>
            <p className="text-text-primary leading-relaxed">{contestant.backstory}</p>
          </Card>
        </section>

        {/* Key Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <StatDisplay
                label="Total Points"
                value={totalPoints}
                context={`${rank ? `#${rank}` : ""}`}
              />
            </Card>
            <Card>
              <StatDisplay
                label="Tasks Won"
                value={tasksWon}
                context="victories"
              />
            </Card>
            <Card>
              <StatDisplay
                label="DQs"
                value={stats.disqualifications || 0}
                context="disqualifications"
                valueColor={stats.disqualifications > 0 ? "danger" : "success"}
              />
            </Card>
          </div>
        </section>

        {/* Scoring Breakdown */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Scoring Breakdown</h2>
          <Card>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-gold mb-1">
                  {stats.timesAwarded5Points || 0}
                </div>
                <div className="text-text-secondary text-sm">5 points</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-text-primary mb-1">
                  {stats.timesAwarded4Points || 0}
                </div>
                <div className="text-text-secondary text-sm">4 points</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-text-primary mb-1">
                  {stats.timesAwarded3Points || 0}
                </div>
                <div className="text-text-secondary text-sm">3 points</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-text-primary mb-1">
                  {stats.timesAwarded2Points || 0}
                </div>
                <div className="text-text-secondary text-sm">2 points</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-danger mb-1">
                  {stats.timesAwarded1Point || 0}
                </div>
                <div className="text-text-secondary text-sm">1 point</div>
              </div>
            </div>
          </Card>
        </section>

        {/* All Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-4">All Stats</h2>
          <Card>
            <div className="space-y-4">
              {Object.entries(stats).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-2 border-b border-white/10 last:border-0"
                >
                  <span className="text-text-primary capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="font-mono font-bold text-gold">{String(value)}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
