"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Bet {
  id: string;
  betType: string;
  betTarget: string;
  amount: number;
  odds: number;
  potentialPayout: number;
  status: string;
  actualPayout: number;
  placedAt: string;
  resolvedAt?: string;
  episode: {
    id: string;
    episodeNumber: number;
    title?: string;
    status: string;
    seasonNumber: number;
  };
  task?: {
    id: string;
    taskNumber: number;
    taskType: string;
    description: string;
  };
}

export default function MyBetsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "won" | "lost">("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchBets();
    }
  }, [user, authLoading, filter]);

  const fetchBets = async () => {
    if (!user) return;

    try {
      const url =
        filter === "all"
          ? `/api/bets?userId=${user.id}`
          : `/api/bets?userId=${user.id}&status=${filter}`;

      const res = await fetch(url);
      const data = await res.json();
      setBets(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bets:", error);
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const stats = {
    total: bets.length,
    pending: bets.filter((b) => b.status === "pending").length,
    won: bets.filter((b) => b.status === "won").length,
    lost: bets.filter((b) => b.status === "lost").length,
    totalWagered: bets.reduce((sum, b) => sum + b.amount, 0),
    totalWon: bets
      .filter((b) => b.status === "won")
      .reduce((sum, b) => sum + b.actualPayout, 0),
  };

  const formatBetType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <section className="text-center py-8">
          <h1 className="text-5xl font-bold mb-4">MY BETS</h1>
          <p className="text-xl text-text-secondary">Your betting history and stats</p>
        </section>

        {/* Stats Summary */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <div className="text-center">
                <div className="text-text-secondary text-sm mb-1">Total Bets</div>
                <div className="text-3xl font-bold font-mono text-gold">
                  {stats.total}
                </div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-text-secondary text-sm mb-1">Pending</div>
                <div className="text-3xl font-bold font-mono text-electric-blue">
                  {stats.pending}
                </div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-text-secondary text-sm mb-1">Won</div>
                <div className="text-3xl font-bold font-mono text-success">
                  {stats.won}
                </div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-text-secondary text-sm mb-1">Lost</div>
                <div className="text-3xl font-bold font-mono text-danger">
                  {stats.lost}
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Wagered vs Won */}
        <section>
          <Card>
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="text-text-secondary text-sm mb-2">Total Wagered</div>
                <div className="text-2xl font-mono font-bold text-danger">
                  {stats.totalWagered} ⚡
                </div>
              </div>
              <div>
                <div className="text-text-secondary text-sm mb-2">Total Won</div>
                <div className="text-2xl font-mono font-bold text-success">
                  {stats.totalWon} ⚡
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Filter Tabs */}
        <section>
          <div className="flex gap-2">
            {[
              { label: "All", value: "all" as const },
              { label: "Pending", value: "pending" as const },
              { label: "Won", value: "won" as const },
              { label: "Lost", value: "lost" as const },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all",
                  filter === tab.value
                    ? "bg-gold text-background"
                    : "bg-surface text-text-secondary hover:text-text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Bets List */}
        <section>
          {bets.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-2xl mb-2">🎲</p>
                <p className="text-text-secondary">
                  {filter === "all"
                    ? "You haven't placed any bets yet"
                    : `No ${filter} bets`}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {bets.map((bet) => (
                <Card key={bet.id} noPadding>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">
                            {formatBetType(bet.betType)}
                          </h3>
                          <Badge
                            variant={
                              bet.status === "pending"
                                ? "upcoming"
                                : bet.status === "won"
                                ? "live"
                                : "completed"
                            }
                          >
                            {bet.status}
                          </Badge>
                        </div>
                        <p className="text-text-secondary text-sm">
                          Season {bet.episode.seasonNumber} • Episode{" "}
                          {bet.episode.episodeNumber}
                          {bet.episode.title && ` - "${bet.episode.title}"`}
                        </p>
                        {bet.task && (
                          <p className="text-text-secondary text-sm">
                            Task {bet.task.taskNumber}: {bet.task.description.slice(0, 60)}
                            ...
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <div
                          className={cn(
                            "text-2xl font-mono font-bold mb-1",
                            bet.status === "won"
                              ? "text-success"
                              : bet.status === "lost"
                              ? "text-danger"
                              : "text-gold"
                          )}
                        >
                          {bet.status === "won"
                            ? `+${bet.actualPayout} ⚡`
                            : bet.status === "lost"
                            ? `-${bet.amount} ⚡`
                            : `${bet.amount} ⚡`}
                        </div>
                        {bet.status === "pending" && (
                          <div className="text-sm text-text-secondary">
                            Potential: {bet.potentialPayout} ⚡
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span>Wagered: {bet.amount} ⚡</span>
                        <span>Odds: {bet.odds.toFixed(1)}x</span>
                        <span>
                          Placed: {new Date(bet.placedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {bet.resolvedAt && (
                        <div className="text-sm text-text-secondary">
                          Resolved: {new Date(bet.resolvedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
