"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Season {
  id: string;
  seasonNumber: number;
  status: string;
  startDate: string;
  contestants: { id: string; name: string }[];
  episodes: { id: string; episodeNumber: number; status: string }[];
}

export default function SeasonsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const authLoading = status === "loading";
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPicks, setUserPicks] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchSeasons();
      fetchUserPicks();
    }
  }, [user, authLoading]);

  const fetchSeasons = async () => {
    try {
      const res = await fetch("/api/seasons");
      const data = await res.json();
      setSeasons(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching seasons:", error);
      setLoading(false);
    }
  };

  const fetchUserPicks = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/picks?userId=${user.id}`);
      const picks = await res.json();
      const picksMap: Record<string, string> = {};
      picks.forEach((pick: any) => {
        if (pick.active) {
          picksMap[pick.seasonId] = pick.contestant.name;
        }
      });
      setUserPicks(picksMap);
    } catch (error) {
      console.error("Error fetching picks:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  const activeSeason = seasons.find((s) => s.status === "active");
  const upcomingSeasons = seasons.filter((s) => s.status === "upcoming");
  const completedSeasons = seasons.filter((s) => s.status === "completed");

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <section>
          <h1 className="text-5xl font-bold mb-4">SEASONS</h1>
          <p className="text-xl text-text-secondary">
            Browse all seasons of The Compound
          </p>
        </section>

        {/* Active Season */}
        {activeSeason && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Current Season</h2>
            <Card variant="highlighted">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-3xl font-bold mb-2">
                    SEASON {activeSeason.seasonNumber}
                  </h3>
                  <Badge variant="live">Active</Badge>
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-sm mb-1">
                    {activeSeason.contestants.length} contestants
                  </p>
                  <p className="text-text-secondary text-sm">
                    {activeSeason.episodes.length} episodes
                  </p>
                </div>
              </div>

              {userPicks[activeSeason.id] ? (
                <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/30">
                  <p className="text-success text-sm">
                    ✓ Your pick: <span className="font-bold">{userPicks[activeSeason.id]}</span>
                  </p>
                </div>
              ) : (
                <div className="mb-4 p-3 rounded-lg bg-gold/10 border border-gold/30">
                  <p className="text-gold text-sm font-medium">
                    ⚡ You haven&apos;t picked a contestant yet!
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={() => router.push(`/seasons/${activeSeason.id}`)}>
                  {userPicks[activeSeason.id] ? "View Season" : "Pick a Contestant"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/seasons/${activeSeason.id}/standings`)}
                >
                  View Standings
                </Button>
              </div>
            </Card>
          </section>
        )}

        {/* Upcoming Seasons */}
        {upcomingSeasons.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Upcoming</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingSeasons.map((season) => (
                <Card key={season.id} variant="interactive">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        SEASON {season.seasonNumber}
                      </h3>
                      <Badge variant="upcoming">Upcoming</Badge>
                    </div>
                  </div>

                  <p className="text-text-secondary text-sm mb-4">
                    Starts {new Date(season.startDate).toLocaleDateString()}
                  </p>

                  <Button variant="secondary" fullWidth disabled>
                    Coming Soon
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Completed Seasons */}
        {completedSeasons.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Archive</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedSeasons.map((season) => (
                <Card key={season.id} variant="interactive">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        SEASON {season.seasonNumber}
                      </h3>
                      <Badge variant="completed">Completed</Badge>
                    </div>
                  </div>

                  {userPicks[season.id] && (
                    <p className="text-text-secondary text-sm mb-4">
                      Your pick: {userPicks[season.id]}
                    </p>
                  )}

                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => router.push(`/seasons/${season.id}`)}
                  >
                    View Results
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}

        {seasons.length === 0 && (
          <section>
            <Card>
              <div className="text-center py-12">
                <p className="text-text-secondary mb-4">No seasons available yet</p>
                <p className="text-text-secondary text-sm">
                  Check back soon for the first season of The Compound!
                </p>
              </div>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
