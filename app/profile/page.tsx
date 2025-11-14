"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Card } from "@/components/ui/Card";
import { StatDisplay } from "@/components/ui/StatDisplay";
import { Badge } from "@/components/ui/Badge";

interface UserStats {
  username: string;
  email: string;
  currency: number;
  memberSince: string;
  activePicks: number;
  totalBets: number;
  wonBets: number;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      // Fetch user stats
      fetch(`/api/user/${user.id}/stats`)
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching stats:", error);
          setLoading(false);
        });
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="text-text-secondary">Failed to load profile</p>
        </Card>
      </div>
    );
  }

  const winRate = stats.totalBets > 0
    ? Math.round((stats.wonBets / stats.totalBets) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Header */}
        <section>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{stats.username}</h1>
              <p className="text-text-secondary">{stats.email}</p>
            </div>
            <Badge variant="live">Active Player</Badge>
          </div>
          <p className="text-text-secondary text-sm">
            Member since {new Date(stats.memberSince).toLocaleDateString()}
          </p>
        </section>

        {/* Currency */}
        <section>
          <Card>
            <div className="text-center py-6">
              <div className="text-sm uppercase tracking-wide text-text-secondary mb-2">
                Current Balance
              </div>
              <div className="text-6xl font-mono font-bold text-gold mb-2">
                ⚡ {stats.currency}
              </div>
              <p className="text-text-secondary">
                Earn more by picking winning contestants and placing smart bets
              </p>
            </div>
          </Card>
        </section>

        {/* Stats Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <StatDisplay
                label="Active Picks"
                value={stats.activePicks}
                context="contestants selected"
              />
            </Card>
            <Card>
              <StatDisplay
                label="Total Bets"
                value={stats.totalBets}
                context={`${stats.wonBets} won`}
              />
            </Card>
            <Card>
              <StatDisplay
                label="Win Rate"
                value={`${winRate}%`}
                context={stats.totalBets > 0 ? "across all bets" : "No bets yet"}
                valueColor={winRate >= 50 ? "success" : "danger"}
              />
            </Card>
          </div>
        </section>

        {/* Activity */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <Card>
            <div className="text-center py-12">
              <p className="text-text-secondary mb-4">No recent activity</p>
              <p className="text-text-secondary text-sm">
                Start by selecting a contestant for the current season!
              </p>
            </div>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="interactive">
              <h3 className="text-lg font-bold mb-2">View Current Season</h3>
              <p className="text-text-secondary text-sm">
                Check out the latest episodes and contestants
              </p>
            </Card>
            <Card variant="interactive">
              <h3 className="text-lg font-bold mb-2">Browse Betting Odds</h3>
              <p className="text-text-secondary text-sm">
                Place bets on upcoming episodes and tasks
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
