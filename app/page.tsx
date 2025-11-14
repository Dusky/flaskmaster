"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatDisplay } from "@/components/ui/StatDisplay";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface UserPick {
  contestant: {
    id: string;
    name: string;
    personalityArchetype: string;
    colorIndex: number;
    trackedStats: any;
  };
  season: {
    id: string;
    seasonNumber: number;
  };
}

interface Episode {
  id: string;
  episodeNumber: number;
  title?: string;
  status: string;
  airDate: string;
}

interface Season {
  id: string;
  seasonNumber: number;
  status: string;
  contestants: any[];
  episodes?: Episode[];
}

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [userPick, setUserPick] = useState<UserPick | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch active season
      const seasonsRes = await fetch("/api/seasons");
      const seasons = await seasonsRes.json();
      const activeBasic = seasons.find((s: Season) => s.status === "active");

      // Fetch full season details with episodes if we have an active season
      if (activeBasic) {
        const seasonDetailRes = await fetch(`/api/seasons/${activeBasic.id}`);
        const seasonDetail = await seasonDetailRes.json();
        setActiveSeason(seasonDetail);

        // Fetch user's pick if logged in
        if (user) {
          const picksRes = await fetch(`/api/picks?userId=${user.id}&seasonId=${seasonDetail.id}`);
          const picks = await picksRes.json();
          if (picks.length > 0) {
            setUserPick(picks[0]);
          }
        }
      } else {
        setActiveSeason(null);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const getContestantColor = (colorIndex: number) => {
    const colors = ["bg-contestant-1", "bg-contestant-2", "bg-contestant-3", "bg-contestant-4", "bg-contestant-5"];
    return colors[colorIndex - 1] || colors[0];
  };

  // Calculate rank for user's contestant
  const getUserRank = () => {
    if (!userPick || !activeSeason) return null;

    const sorted = [...activeSeason.contestants].sort((a, b) => {
      const aPoints = a.trackedStats?.totalPoints || 0;
      const bPoints = b.trackedStats?.totalPoints || 0;
      return bPoints - aPoints;
    });

    return sorted.findIndex((c) => c.id === userPick.contestant.id) + 1;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  // Not logged in - show welcome
  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <section className="text-center py-20">
            <h1 className="text-6xl font-bold text-gold mb-4 font-sans">
              THE COMPOUND
            </h1>
            <p className="text-2xl text-text-secondary mb-8">
              Fantasy Taskmaster • Pick contestants, place bets, watch chaos unfold
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push("/register")}>
                Create Account
              </Button>
              <Button variant="secondary" onClick={() => router.push("/login")}>
                Sign In
              </Button>
            </div>
          </section>

          {activeSeason && (
            <section className="max-w-3xl mx-auto">
              <Card>
                <div className="text-center py-8">
                  <h2 className="text-3xl font-bold mb-2">
                    Season {activeSeason.seasonNumber} is Live!
                  </h2>
                  <p className="text-text-secondary mb-6">
                    {activeSeason.contestants.length} contestants competing in absurd challenges
                  </p>
                  <Button onClick={() => router.push("/register")}>
                    Join Now to Pick Your Contestant
                  </Button>
                </div>
              </Card>
            </section>
          )}
        </div>
      </div>
    );
  }

  // No active season
  if (!activeSeason) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">No Active Season</h2>
              <p className="text-text-secondary">
                Check back soon for the next season of The Compound!
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // User hasn't picked a contestant yet
  if (!userPick) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <section className="text-center py-12">
            <h1 className="text-6xl font-bold text-gold mb-4 font-sans">
              THE COMPOUND
            </h1>
            <p className="text-xl text-text-secondary mb-2">
              Season {activeSeason.seasonNumber}
            </p>
            <Badge variant="live">Active Season</Badge>
          </section>

          <section className="max-w-3xl mx-auto">
            <Card variant="highlighted">
              <div className="text-center py-8">
                <h2 className="text-3xl font-bold mb-4">
                  ⚡ Pick Your Contestant!
                </h2>
                <p className="text-text-secondary mb-6">
                  You haven&apos;t selected a contestant yet. Choose your champion to start earning currency!
                </p>
                <Button onClick={() => router.push(`/seasons/${activeSeason.id}`)}>
                  View Contestants
                </Button>
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Current Standings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSeason.contestants
                .sort((a, b) => {
                  const aPoints = a.trackedStats?.totalPoints || 0;
                  const bPoints = b.trackedStats?.totalPoints || 0;
                  return bPoints - aPoints;
                })
                .slice(0, 3)
                .map((contestant, index) => {
                  const rank = index + 1;
                  const emoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";

                  return (
                    <Card key={contestant.id} variant="interactive">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{emoji}</div>
                        <div
                          className={`w-16 h-16 rounded-full ${getContestantColor(contestant.colorIndex)} flex items-center justify-center text-xl font-bold text-background`}
                        >
                          {contestant.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold">{contestant.name}</h3>
                          <p className="text-gold font-mono text-sm">
                            {contestant.trackedStats?.totalPoints || 0} pts
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // User has picked - show dashboard
  const rank = getUserRank();
  const totalPoints = userPick.contestant.trackedStats?.totalPoints || 0;
  const tasksWon = userPick.contestant.trackedStats?.tasksWon || 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-6xl font-bold text-gold mb-4 font-sans">
            THE COMPOUND
          </h1>
          <p className="text-xl text-text-secondary mb-2">
            Season {activeSeason.seasonNumber}
          </p>
          <Badge variant="live">Active Season</Badge>
        </section>

        {/* Your Contestant */}
        <section>
          <h2 className="text-2xl font-bold mb-4 font-sans">Your Contestant</h2>
          <Card variant="highlighted">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div
                className={`w-24 h-24 rounded-full ${getContestantColor(userPick.contestant.colorIndex)} flex items-center justify-center text-4xl font-bold text-background`}
              >
                {userPick.contestant.name.split(" ").map((n) => n[0]).join("")}
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{userPick.contestant.name}</h3>
                <p className="text-text-secondary italic mb-3">
                  &quot;{userPick.contestant.personalityArchetype}&quot;
                </p>

                {/* Stats */}
                <div className="mb-4">
                  <p className="text-gold font-mono font-bold text-lg">
                    {totalPoints} points • {rank ? `#${rank}` : "Unranked"}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {tasksWon} {tasksWon === 1 ? "task" : "tasks"} won
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/contestants/${userPick.contestant.id}`)}
                  >
                    View Full Stats
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/seasons/${activeSeason.id}/standings`)}
                  >
                    View Standings
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Episodes */}
        {activeSeason.episodes && activeSeason.episodes.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Episodes</h2>
              <Link
                href={`/seasons/${activeSeason.id}/standings`}
                className="text-gold hover:text-[#f7b77e] transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSeason.episodes
                .sort((a, b) => b.episodeNumber - a.episodeNumber) // Most recent first
                .slice(0, 3) // Show only latest 3
                .map((episode) => (
                  <Link
                    key={episode.id}
                    href={`/seasons/${activeSeason.id}/episodes/${episode.episodeNumber}`}
                  >
                    <Card variant="interactive" className="h-full">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold">
                          Episode {episode.episodeNumber}
                        </h3>
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
                      {episode.title && (
                        <p className="text-text-primary mb-2 italic">
                          &quot;{episode.title}&quot;
                        </p>
                      )}
                      <p className="text-text-secondary text-sm">
                        {new Date(episode.airDate).toLocaleDateString()}
                      </p>
                    </Card>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* Quick Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Season {activeSeason.seasonNumber} Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <StatDisplay
                label="Your Rank"
                value={rank ? `#${rank}` : "-"}
                context={`of ${activeSeason.contestants.length}`}
              />
            </Card>
            <Card>
              <StatDisplay
                label="Total Points"
                value={totalPoints}
                context={`${tasksWon} wins`}
              />
            </Card>
            <Card>
              <StatDisplay
                label="Competitors"
                value={activeSeason.contestants.length}
                context="contestants"
              />
            </Card>
          </div>
        </section>

        {/* All Contestants */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-sans">All Contestants</h2>
            <Link
              href={`/seasons/${activeSeason.id}/standings`}
              className="text-gold hover:text-[#f7b77e] transition-colors"
            >
              View Full Standings →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSeason.contestants
              .sort((a, b) => {
                const aPoints = a.trackedStats?.totalPoints || 0;
                const bPoints = b.trackedStats?.totalPoints || 0;
                return bPoints - aPoints;
              })
              .map((contestant, index) => {
                const isYours = contestant.id === userPick.contestant.id;

                return (
                  <Link key={contestant.id} href={`/contestants/${contestant.id}`}>
                    <Card variant={isYours ? "highlighted" : "interactive"}>
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-16 h-16 rounded-full ${getContestantColor(contestant.colorIndex)} flex items-center justify-center text-xl font-bold text-background flex-shrink-0`}
                        >
                          {contestant.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold mb-1 truncate">{contestant.name}</h3>
                          <p className="text-sm text-text-secondary italic mb-2 truncate">
                            {contestant.personalityArchetype}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-gold font-mono font-bold">
                              {contestant.trackedStats?.totalPoints || 0} pts
                            </span>
                            <span className="text-text-secondary text-sm">#{index + 1}</span>
                          </div>
                          {isYours && (
                            <div className="mt-2">
                              <Badge variant="live">Your Pick</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
