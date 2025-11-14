"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/modals/Modal";
import { SwitchContestantModal } from "@/components/modals/SwitchContestantModal";

interface Contestant {
  id: string;
  name: string;
  backstory: string;
  personalityArchetype: string;
  colorIndex: number;
  trackedStats: any;
}

interface Season {
  id: string;
  seasonNumber: number;
  status: string;
  startDate: string;
  taskmasterName: string;
  taskmasterPersonality: string;
  assistantName: string;
  assistantPersonality: string;
  contestants: Contestant[];
}

export default function SeasonPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [season, setSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [showBackstory, setShowBackstory] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [picking, setPicking] = useState(false);
  const [userPick, setUserPick] = useState<string | null>(null);
  const [userPickData, setUserPickData] = useState<Contestant | null>(null);
  const [userCurrency, setUserCurrency] = useState<number>(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (params.id) {
      fetchSeason();
      if (user) {
        checkUserPick();
      }
    }
  }, [params.id, user, authLoading]);

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

  const checkUserPick = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/picks?userId=${user.id}&seasonId=${params.id}`);
      const picks = await res.json();
      if (picks.length > 0) {
        setUserPick(picks[0].contestantId);
        setUserPickData(picks[0].contestant);
      }

      // Fetch user currency
      const currencyRes = await fetch(`/api/user/${user.id}/currency`);
      const currencyData = await currencyRes.json();
      setUserCurrency(currencyData.currency || 0);
    } catch (error) {
      console.error("Error checking pick:", error);
    }
  };

  const handleSelectClick = (contestant: Contestant) => {
    setSelectedContestant(contestant);
    setShowConfirmation(true);
  };

  const handleViewBackstory = (contestant: Contestant) => {
    setSelectedContestant(contestant);
    setShowBackstory(true);
  };

  const handleSwitchClick = (contestant: Contestant) => {
    setSelectedContestant(contestant);
    setShowSwitchModal(true);
  };

  const handleSwitchSuccess = () => {
    // Refresh data after successful switch
    fetchSeason();
    checkUserPick();
  };

  const confirmPick = async () => {
    if (!user || !selectedContestant || !season) return;

    setPicking(true);
    try {
      const res = await fetch("/api/picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          seasonId: season.id,
          contestantId: selectedContestant.id,
        }),
      });

      if (res.ok) {
        setUserPick(selectedContestant.id);
        setShowConfirmation(false);
        router.push("/");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save pick");
      }
    } catch (error) {
      console.error("Error saving pick:", error);
      alert("Failed to save pick");
    } finally {
      setPicking(false);
    }
  };

  if (authLoading || loading) {
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

  const getContestantColor = (colorIndex: number) => {
    const colors = ["bg-contestant-1", "bg-contestant-2", "bg-contestant-3", "bg-contestant-4", "bg-contestant-5"];
    return colors[colorIndex - 1] || colors[0];
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <section className="text-center py-8">
          <h1 className="text-5xl font-bold mb-4">SEASON {season.seasonNumber} CONTESTANTS</h1>
          <p className="text-xl text-text-secondary mb-2">
            {userPick ? "You've locked in your pick" : "Select your champion for the season"}
          </p>
          <Badge variant={season.status === "active" ? "live" : "upcoming"}>
            {season.status === "active" ? "Season Active" : "Season Upcoming"}
          </Badge>
        </section>

        {/* Contestants Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {season.contestants.map((contestant) => {
              const isPicked = userPick === contestant.id;

              return (
                <Card
                  key={contestant.id}
                  variant={isPicked ? "highlighted" : "default"}
                  className="relative"
                >
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-32 h-32 rounded-full ${getContestantColor(contestant.colorIndex)} flex items-center justify-center text-4xl font-bold text-background`}
                    >
                      {contestant.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  </div>

                  {/* Name and archetype */}
                  <h3 className="text-xl font-bold text-center mb-1">
                    {contestant.name.toUpperCase()}
                  </h3>
                  <p className="text-text-secondary italic text-center mb-4">
                    &quot;{contestant.personalityArchetype}&quot;
                  </p>

                  {/* Backstory preview */}
                  <p className="text-text-primary text-sm mb-4 line-clamp-3">
                    {contestant.backstory}
                  </p>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => handleViewBackstory(contestant)}
                    >
                      Read Full Bio
                    </Button>

                    {!userPick ? (
                      <Button
                        fullWidth
                        onClick={() => handleSelectClick(contestant)}
                      >
                        Select ▶
                      </Button>
                    ) : isPicked ? (
                      <div className="text-center py-2">
                        <Badge variant="live">✓ Your Pick</Badge>
                      </div>
                    ) : season.status === "active" ? (
                      <Button
                        fullWidth
                        variant="secondary"
                        onClick={() => handleSwitchClick(contestant)}
                      >
                        Switch to This (100 ⚡)
                      </Button>
                    ) : (
                      <Button fullWidth disabled>
                        Not Selected
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* The Compound Info */}
        <section>
          <h2 className="text-2xl font-bold mb-4">The Compound</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-xl font-bold mb-2">{season.taskmasterName}</h3>
              <p className="text-text-secondary text-sm mb-2 italic">The Taskmaster</p>
              <p className="text-text-primary text-sm">{season.taskmasterPersonality}</p>
            </Card>

            <Card>
              <h3 className="text-xl font-bold mb-2">{season.assistantName}</h3>
              <p className="text-text-secondary text-sm mb-2 italic">The Assistant</p>
              <p className="text-text-primary text-sm">{season.assistantPersonality}</p>
            </Card>
          </div>
        </section>
      </div>

      {/* Backstory Modal */}
      <Modal
        isOpen={showBackstory}
        onClose={() => setShowBackstory(false)}
        title={selectedContestant?.name}
        maxWidth="lg"
      >
        {selectedContestant && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <div
                className={`w-20 h-20 rounded-full ${getContestantColor(selectedContestant.colorIndex)} flex items-center justify-center text-2xl font-bold text-background`}
              >
                {selectedContestant.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-text-secondary italic">
                  &quot;{selectedContestant.personalityArchetype}&quot;
                </p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-text-primary leading-relaxed">
                {selectedContestant.backstory}
              </p>
            </div>

            {!userPick && (
              <div className="pt-4 border-t border-white/10">
                <Button
                  fullWidth
                  onClick={() => {
                    setShowBackstory(false);
                    handleSelectClick(selectedContestant);
                  }}
                >
                  Select This Contestant
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => !picking && setShowConfirmation(false)}
        title="Confirm Your Pick"
        maxWidth="md"
      >
        {selectedContestant && (
          <div className="space-y-6">
            <div className="text-center">
              <div
                className={`w-24 h-24 rounded-full ${getContestantColor(selectedContestant.colorIndex)} flex items-center justify-center text-3xl font-bold text-background mx-auto mb-4`}
              >
                {selectedContestant.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="text-2xl font-bold mb-2">{selectedContestant.name}</h3>
              <p className="text-text-secondary italic">
                &quot;{selectedContestant.personalityArchetype}&quot;
              </p>
            </div>

            <div className="p-4 rounded-lg bg-electric-blue/10 border border-electric-blue/30 text-electric-blue text-sm">
              <p className="font-medium mb-1">Ready to commit?</p>
              <p className="text-xs">
                You&apos;ll earn currency based on {selectedContestant.name.split(" ")[0]}&apos;s performance
                throughout the season. You can switch contestants later, but it will cost currency.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowConfirmation(false)}
                disabled={picking}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={confirmPick}
                disabled={picking}
              >
                {picking ? "Locking in..." : "Lock In My Pick"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Switch Contestant Modal */}
      {selectedContestant && userPickData && user && (
        <SwitchContestantModal
          isOpen={showSwitchModal}
          onClose={() => setShowSwitchModal(false)}
          currentContestant={{
            id: userPickData.id,
            name: userPickData.name,
            colorIndex: userPickData.colorIndex,
          }}
          newContestant={{
            id: selectedContestant.id,
            name: selectedContestant.name,
            colorIndex: selectedContestant.colorIndex,
          }}
          seasonId={season!.id}
          userId={user.id}
          userCurrency={userCurrency}
          onSuccess={handleSwitchSuccess}
        />
      )}
    </div>
  );
}
