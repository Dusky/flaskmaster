"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function AdminPage() {
  const [episodeId, setEpisodeId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const processRewards = async () => {
    if (!episodeId) {
      alert("Please enter an episode ID");
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const res = await fetch(`/api/episodes/${episodeId}/process-rewards`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ error: data.error });
      } else {
        setResult({ success: true, data });
      }
    } catch (error) {
      setResult({ error: "Failed to process rewards" });
    } finally {
      setProcessing(false);
    }
  };

  const resolveBets = async () => {
    if (!episodeId) {
      alert("Please enter an episode ID");
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const res = await fetch("/api/bets/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ error: data.error });
      } else {
        setResult({ success: true, data });
      }
    } catch (error) {
      setResult({ error: "Failed to resolve bets" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <section className="text-center py-8">
          <h1 className="text-5xl font-bold mb-4">ADMIN UTILITIES</h1>
          <p className="text-xl text-text-secondary">
            Process rewards and resolve bets for completed episodes
          </p>
          <Badge variant="completed" className="mt-4">
            Development/Testing Tool
          </Badge>
        </section>

        {/* Episode ID Input */}
        <Card>
          <h2 className="text-2xl font-bold mb-4">Episode ID</h2>
          <input
            type="text"
            value={episodeId}
            onChange={(e) => setEpisodeId(e.target.value)}
            placeholder="Enter episode ID (e.g., clxxx...)"
            className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-text-primary font-mono mb-4"
          />
          <p className="text-sm text-text-secondary">
            You can get the episode ID from the database or by inspecting the episode page URL
          </p>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold mb-3">1. Process Rewards</h3>
            <p className="text-text-secondary text-sm mb-4">
              Award currency to players based on their contestant's episode performance.
              Run this AFTER an episode is completed.
            </p>
            <Button
              fullWidth
              onClick={processRewards}
              disabled={processing || !episodeId}
            >
              {processing ? "Processing..." : "Process Episode Rewards"}
            </Button>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-3">2. Resolve Bets</h3>
            <p className="text-text-secondary text-sm mb-4">
              Resolve all pending bets for this episode and pay out winners. Run this AFTER
              processing rewards.
            </p>
            <Button
              fullWidth
              onClick={resolveBets}
              disabled={processing || !episodeId}
            >
              {processing ? "Resolving..." : "Resolve Episode Bets"}
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-xl font-bold mb-3">Quick Action: Process Full Episode</h3>
          <p className="text-text-secondary text-sm mb-4">
            Process rewards AND resolve bets in sequence (recommended workflow)
          </p>
          <Button
            fullWidth
            variant="secondary"
            onClick={async () => {
              await processRewards();
              setTimeout(() => resolveBets(), 1000);
            }}
            disabled={processing || !episodeId}
          >
            {processing ? "Processing..." : "Process Rewards + Resolve Bets"}
          </Button>
        </Card>

        {/* Result Display */}
        {result && (
          <Card>
            <h3 className="text-xl font-bold mb-4">Result</h3>
            {result.error ? (
              <div className="p-4 rounded-lg bg-danger/20 border border-danger/30 text-danger">
                <p className="font-medium mb-2">Error:</p>
                <p>{result.error}</p>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-success/20 border border-success/30 text-success">
                <p className="font-medium mb-2">Success!</p>
                <pre className="text-xs overflow-auto bg-background/50 p-3 rounded">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <h3 className="text-xl font-bold mb-3">How to Use</h3>
          <div className="text-sm text-text-secondary space-y-2">
            <p>
              <strong className="text-text-primary">1.</strong> After creating/completing an
              episode, get its ID from the database
            </p>
            <p>
              <strong className="text-text-primary">2.</strong> Enter the episode ID above
            </p>
            <p>
              <strong className="text-text-primary">3.</strong> Click "Process Rewards" to award
              currency to players
            </p>
            <p>
              <strong className="text-text-primary">4.</strong> Click "Resolve Bets" to pay out
              betting winnings
            </p>
            <p className="pt-2 text-electric-blue">
              Note: These operations are idempotent - running them multiple times won't double-pay
              rewards, but bets will only resolve once.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
