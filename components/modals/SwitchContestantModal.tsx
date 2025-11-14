"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const SWITCH_COST = 100;

interface SwitchContestantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContestant: {
    id: string;
    name: string;
    colorIndex: number;
  };
  newContestant: {
    id: string;
    name: string;
    colorIndex: number;
  };
  seasonId: string;
  userId: string;
  userCurrency: number;
  onSuccess: () => void;
}

export function SwitchContestantModal({
  isOpen,
  onClose,
  currentContestant,
  newContestant,
  seasonId,
  userId,
  userCurrency,
  onSuccess,
}: SwitchContestantModalProps) {
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSwitch = async () => {
    if (userCurrency < SWITCH_COST) {
      setError(`You need ${SWITCH_COST} currency to switch contestants. You only have ${userCurrency}.`);
      return;
    }

    setSwitching(true);
    setError(null);

    try {
      const res = await fetch("/api/picks/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          seasonId,
          newContestantId: newContestant.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to switch contestant");
        setSwitching(false);
        return;
      }

      // Success!
      onSuccess();
      onClose();
    } catch (err) {
      setError("An error occurred while switching contestants");
      setSwitching(false);
    }
  };

  const canAfford = userCurrency >= SWITCH_COST;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !switching && onClose()}
      title="Switch Contestant"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Current vs New */}
        <div className="space-y-4">
          {/* Current */}
          <div>
            <p className="text-text-secondary text-sm mb-2">Current Pick:</p>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-white/10">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-background",
                  getContestantColor(currentContestant.colorIndex)
                )}
              >
                {currentContestant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span className="font-bold">{currentContestant.name}</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="text-center text-2xl text-text-secondary">↓</div>

          {/* New */}
          <div>
            <p className="text-text-secondary text-sm mb-2">New Pick:</p>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gold/10 border-2 border-gold">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-background",
                  getContestantColor(newContestant.colorIndex)
                )}
              >
                {newContestant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span className="font-bold">{newContestant.name}</span>
            </div>
          </div>
        </div>

        {/* Cost Warning */}
        <div
          className={cn(
            "p-4 rounded-lg border",
            canAfford
              ? "bg-electric-blue/10 border-electric-blue/30 text-electric-blue"
              : "bg-danger/10 border-danger/30 text-danger"
          )}
        >
          <p className="font-medium mb-1">
            {canAfford ? "Switching Cost" : "Insufficient Currency"}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm">
              {canAfford
                ? "You'll earn currency based on your new contestant's performance."
                : `You need ${SWITCH_COST - userCurrency} more currency to switch.`}
            </span>
            <span className="font-mono font-bold text-lg">
              {SWITCH_COST} ⚡
            </span>
          </div>
          {canAfford && (
            <p className="text-xs mt-2 opacity-80">
              Your new balance: {userCurrency - SWITCH_COST} ⚡
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-danger/20 border border-danger/30 text-danger text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={switching}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={handleSwitch}
            disabled={switching || !canAfford}
          >
            {switching
              ? "Switching..."
              : canAfford
              ? `Pay ${SWITCH_COST} ⚡ to Switch`
              : "Not Enough Currency"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
