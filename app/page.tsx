import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatDisplay } from "@/components/ui/StatDisplay";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-6xl font-bold text-gold mb-4 font-sans">
            THE COMPOUND
          </h1>
          <p className="text-xl text-text-secondary mb-2">
            Season 3 • Episode 2 of 5
          </p>
          <Badge variant="live">LIVE NOW</Badge>
        </section>

        {/* Your Contestant */}
        <section>
          <h2 className="text-2xl font-bold mb-4 font-sans">Your Contestant</h2>
          <Card variant="highlighted">
            <div className="flex items-start space-x-6">
              {/* Avatar placeholder */}
              <div className="w-24 h-24 rounded-full bg-contestant-2 flex items-center justify-center text-4xl font-bold text-background">
                MT
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">Margaret Thompson</h3>
                <p className="text-text-secondary italic mb-3">
                  &quot;The Overthinker&quot;
                </p>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Season Progress</span>
                    <span className="text-gold font-mono">47 points • 3rd place</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-gold h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <p className="text-text-primary mb-4">
                  Last episode: <span className="text-success font-bold">18 points (1st) 🥇</span>
                </p>

                <Button variant="secondary">View Full Stats</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Current Episode */}
        <section>
          <h2 className="text-2xl font-bold mb-4 font-sans">Current Episode</h2>
          <Card>
            <h3 className="text-xl font-bold mb-3">Episode 2: &quot;The Egg Incident&quot;</h3>

            {/* Episode Progress */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="completed">Opening</Badge>
              <Badge variant="completed">Prize</Badge>
              <Badge variant="live">Task 1</Badge>
              <Badge variant="default">Task 2</Badge>
              <Badge variant="default">Task 3</Badge>
              <Badge variant="default">Live</Badge>
            </div>

            <p className="text-text-secondary mb-4">
              Currently viewing: Task 1
            </p>

            <div className="flex gap-3">
              <Button>Continue Watching</Button>
              <Button variant="secondary">Place Bets</Button>
            </div>
          </Card>
        </section>

        {/* Stats Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-4 font-sans">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <StatDisplay
                label="Your Rank"
                value="#47"
                context="of 238 players"
              />
            </Card>
            <Card>
              <StatDisplay
                label="Active Bets"
                value="3"
                context="150⚡ wagered"
              />
            </Card>
            <Card>
              <StatDisplay
                label="Win Rate"
                value="64%"
                context="16 wins / 25 bets"
                valueColor="success"
              />
            </Card>
          </div>
        </section>

        {/* Upcoming */}
        <section>
          <h2 className="text-2xl font-bold mb-4 font-sans">Upcoming</h2>
          <Card>
            <div className="text-center py-6">
              <p className="text-lg text-text-primary mb-2">
                Episode 3 airs in <span className="text-gold font-mono font-bold">4d 3h 22m</span>
              </p>
              <p className="text-text-secondary">
                Betting opens in 3d 23h 45m
              </p>
            </div>
          </Card>
        </section>

        {/* All Contestants */}
        <section>
          <h2 className="text-2xl font-bold mb-4 font-sans">Season 3 Contestants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Sarah Kim", archetype: "The Competitor", points: 65, rank: 1, color: "contestant-1" },
              { name: "David Park", archetype: "The Lateral Thinker", points: 52, rank: 2, color: "contestant-3" },
              { name: "Margaret Thompson", archetype: "The Overthinker", points: 47, rank: 3, color: "contestant-2", yours: true },
              { name: "James Wilson", archetype: "Chaos Agent", points: 31, rank: 4, color: "contestant-4" },
              { name: "Elena Rodriguez", archetype: "The Perfectionist", points: 28, rank: 5, color: "contestant-5" },
            ].map((contestant) => (
              <Card
                key={contestant.name}
                variant={contestant.yours ? "highlighted" : "interactive"}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-${contestant.color} flex items-center justify-center text-xl font-bold text-background flex-shrink-0`}
                  >
                    {contestant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-1 truncate">{contestant.name}</h3>
                    <p className="text-sm text-text-secondary italic mb-3">
                      {contestant.archetype}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-gold font-mono font-bold">{contestant.points} pts</span>
                      <span className="text-text-secondary text-sm">#{contestant.rank}</span>
                    </div>
                    {contestant.yours && (
                      <div className="mt-2">
                        <Badge variant="live">Your Pick</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Demo Section */}
        <section className="border-t border-white/10 pt-8">
          <h2 className="text-2xl font-bold mb-4 font-sans">Design System Demo</h2>
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold mb-4">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="danger">Danger Button</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold mb-4">Typography</h3>
              <div className="space-y-2">
                <p className="font-sans text-4xl font-bold">Headers use Space Grotesk</p>
                <p className="font-body text-lg">Body text uses IBM Plex Sans for readability</p>
                <p className="font-mono text-gold">Currency and stats: ⚡ 450</p>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
