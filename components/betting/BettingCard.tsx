"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Contestant {
  id: string;
  name: string;
  colorIndex: number;
  trackedStats?: {
    totalPoints?: number;
  };
}

interface BettingCardProps {
  episodeId: string;
  taskId?: string;
  contestants: Contestant[];
  userId: string;
  userCurrency: number;
  betType: "task_winner" | "episode_winner";
  onBetPlaced: () => void;
}

export function BettingCard({
  episodeId,
  taskId,
  contestants,
  userId,
  userCurrency,
  betType,
  onBetPlaced,
}: BettingCardProps) {
  const [selectedContestant, setSelectedContestant] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<string>("50");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate odds based on contestant rank
  const getOdds = (contestantId: string): number => {
    const sorted = [...contestants].sort((a, b) => {
      const aPoints = a.trackedStats?.totalPoints || 0;
      const bPoints = b.trackedStats?.totalPoints || 0;
      return bPoints - aPoints;
    });

    const rank = sorted.findIndex((c) => c.id === contestantId) + 1;

    const oddsMap: Record<number, number> = {
      1: 2.0,
      2: 2.5,
      3: 3.5,
      4: 4.5,
      5: 6.0,
    };

    return oddsMap[rank] || 3.0;
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

  const selectedOdds = selectedContestant ? getOdds(selectedContestant) : 0;
  const amount = parseInt(betAmount) || 0;
  const potentialPayout = Math.floor(amount * selectedOdds);
  const canAfford = amount > 0 && amount <= userCurrency && amount >= 10 && amount <= 500;

  const handlePlaceBet = async () => {
    if (!selectedContestant || !canAfford) return;

    setPlacing(true);
    setError(null);

    try {
      const res = await fetch("/api/bets/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          episodeId,
          taskId: taskId || null,
          betType,
          betTarget: selectedContestant,
          amount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place bet");
        setPlacing(false);
        return;
      }

      // Success!
      onBetPlaced();
      setSelectedContestant(null);
      setBetAmount("50");
    } catch (err) {
      setError("An error occurred while placing bet");
      setPlacing(false);
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">
        Place Bet: Who Will Win?
      </h3>

      {/* Contestant Selection */}
      <div className="space-y-2 mb-4">
        {contestants
          .sort((a, b) => {
            const aPoints = a.trackedStats?.totalPoints || 0;
            const bPoints = b.trackedStats?.totalPoints || 0;
            return bPoints - aPoints;
          })
          .map((contestant) => {
            const odds = getOdds(contestant.id);
            const isSelected = selectedContestant === contestant.id;

            return (
              <button
                key={contestant.id}
                onClick={() => setSelectedContestant(contestant.id)}
                className={cn(
                  "w-full p-3 rounded-lg border transition-all",
                  isSelected
                    ? "border-gold bg-gold/10"
                    : "border-white/10 hover:border-white/20 bg-surface/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-background",
                        getContestantColor(contestant.colorIndex)
                      )}
                    >
                      {contestant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="font-medium">{contestant.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="default" className="font-mono">
                      {odds.toFixed(1)}x
                    </Badge>
                    {isSelected && <span className="text-gold">✓</span>}
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {/* Bet Amount */}
      {selectedContestant && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Bet Amount (Min: 10, Max: 500)
            </label>
            <input
              type="number"
              min="10"
              max="500"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-text-primary font-mono"
              disabled={placing}
            />
            <p className="text-xs text-text-secondary mt-1">
              Your balance: {userCurrency} ⚡
            </p>
          </div>

          {/* Payout Preview */}
          <div className="p-4 rounded-lg bg-electric-blue/10 border border-electric-blue/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-electric-blue">Potential Payout:</span>
              <span className="font-mono text-xl font-bold text-electric-blue">
                {potentialPayout} ⚡
              </span>
            </div>
            <div className="text-xs text-electric-blue/70">
              {amount} ⚡ at {selectedOdds.toFixed(1)}x odds
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-danger/20 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}

          {/* Place Bet Button */}
          <Button
            fullWidth
            onClick={handlePlaceBet}
            disabled={!canAfford || placing}
          >
            {placing
              ? "Placing Bet..."
              : !canAfford
              ? "Invalid Bet Amount"
              : `Place Bet: ${amount} ⚡`}
          </Button>
        </div>
      )}
    </Card>
  );
}
