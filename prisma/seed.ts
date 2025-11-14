import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create a test season
  const season = await prisma.season.upsert({
    where: { seasonNumber: 1 },
    update: {},
    create: {
      seasonNumber: 1,
      status: "active",
      startDate: new Date("2024-01-01"),
      taskmasterName: "Gregory Stronghold",
      taskmasterPersonality:
        "A towering figure with an imposing presence. Gregory judges with theatrical authority and arbitrary precision. He delights in contestants' failures but grudgingly respects clever solutions. His scoring follows his own bizarre internal logic.",
      assistantName: "Alex Brightwell",
      assistantPersonality:
        "Gregory's eternally cheerful assistant. Alex reads tasks with barely contained glee, offers false sympathy to struggling contestants, and provides running commentary filled with passive-aggressive observations. Takes secret delight in chaos.",
    },
  });

  console.log(`✅ Created season: ${season.seasonNumber}`);

  // Create 5 contestants for Season 1
  const contestantsData = [
    {
      name: "Sarah Kim",
      backstory:
        "A former escape room designer with a competitive streak. Sarah approaches every task like a puzzle to be solved efficiently. She's methodical, quick-thinking, and doesn't handle failure well. Known for overthinking simple tasks and accidentally creating brilliant solutions to complex ones.",
      personalityArchetype: "The Competitor",
      colorIndex: 1,
      hiddenStats: {
        creativity: 7,
        physical: 6,
        lateralThinking: 8,
        confidence: 9,
        riskTaking: 5,
        panicResistance: 7,
        ruleFollowing: 8,
      },
      trackedStats: {
        totalPoints: 65,
        tasksWon: 8,
        timesAwarded5Points: 3,
        timesAwarded1Point: 2,
        disqualifications: 0,
        ruleViolations: 1,
      },
    },
    {
      name: "David Park",
      backstory:
        "A software engineer who thinks in systems and patterns. David's strength is finding loopholes and unconventional interpretations of task rules. He's calm under pressure but tends to overcomplicate simple solutions. His attempts are either brilliantly efficient or spectacularly confusing.",
      personalityArchetype: "The Lateral Thinker",
      colorIndex: 3,
      hiddenStats: {
        creativity: 8,
        physical: 5,
        lateralThinking: 10,
        confidence: 6,
        riskTaking: 7,
        panicResistance: 9,
        ruleFollowing: 3,
      },
      trackedStats: {
        totalPoints: 52,
        tasksWon: 5,
        timesAwarded5Points: 2,
        timesAwarded1Point: 4,
        disqualifications: 1,
        ruleViolations: 5,
      },
    },
    {
      name: "Margaret Thompson",
      backstory:
        "A theater director with impeccable organizational skills and a tendency to overthink. Margaret excels at tasks requiring planning but struggles when forced to improvise. She provides excellent narration of her own failures and treats every task like a performance piece.",
      personalityArchetype: "The Overthinker",
      colorIndex: 2,
      hiddenStats: {
        creativity: 9,
        physical: 4,
        lateralThinking: 6,
        confidence: 5,
        riskTaking: 3,
        panicResistance: 4,
        ruleFollowing: 9,
      },
      trackedStats: {
        totalPoints: 47,
        tasksWon: 4,
        timesAwarded5Points: 4,
        timesAwarded1Point: 3,
        disqualifications: 0,
        ruleViolations: 0,
      },
    },
    {
      name: "James Wilson",
      backstory:
        "A professional stunt performer who treats every task like an action scene. James has boundless energy, zero planning skills, and an inspiring lack of self-preservation instinct. His attempts are chaotic, entertaining, and frequently involve minor injuries. Rules are merely suggestions.",
      personalityArchetype: "Chaos Agent",
      colorIndex: 4,
      hiddenStats: {
        creativity: 6,
        physical: 10,
        lateralThinking: 5,
        confidence: 10,
        riskTaking: 10,
        panicResistance: 8,
        ruleFollowing: 2,
      },
      trackedStats: {
        totalPoints: 31,
        tasksWon: 3,
        timesAwarded5Points: 1,
        timesAwarded1Point: 6,
        disqualifications: 2,
        ruleViolations: 8,
      },
    },
    {
      name: "Elena Rodriguez",
      backstory:
        "An architect with perfectionist tendencies. Elena's work is meticulous and beautifully executed, but she runs out of time constantly. She gets genuinely upset when her creations are destroyed during scoring. Known for creating museum-quality results for absurd tasks.",
      personalityArchetype: "The Perfectionist",
      colorIndex: 5,
      hiddenStats: {
        creativity: 10,
        physical: 6,
        lateralThinking: 7,
        confidence: 7,
        riskTaking: 4,
        panicResistance: 5,
        ruleFollowing: 10,
      },
      trackedStats: {
        totalPoints: 28,
        tasksWon: 2,
        timesAwarded5Points: 2,
        timesAwarded1Point: 5,
        disqualifications: 0,
        ruleViolations: 0,
      },
    },
  ];

  for (const contestantData of contestantsData) {
    const contestant = await prisma.contestant.create({
      data: {
        ...contestantData,
        seasonId: season.id,
      },
    });
    console.log(`✅ Created contestant: ${contestant.name}`);
  }

  // Create some stat definitions
  const statDefinitions = [
    {
      statName: "Total Points",
      description: "Cumulative points earned across all episodes",
      category: "performance",
    },
    {
      statName: "Tasks Won",
      description: "Number of tasks where contestant scored highest",
      category: "performance",
    },
    {
      statName: "Times Awarded 5 Points",
      description: "Perfect scores received",
      category: "performance",
    },
    {
      statName: "Disqualifications",
      description: "Number of times disqualified from a task",
      category: "behavior",
    },
    {
      statName: "Rule Violations",
      description: "Times the contestant broke or bent the rules",
      category: "behavior",
    },
    {
      statName: "Objects Destroyed",
      description: "Number of items broken during task attempts",
      category: "chaos",
    },
  ];

  for (const statDef of statDefinitions) {
    await prisma.statDefinition.create({
      data: statDef,
    });
  }

  console.log("✅ Created stat definitions");

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
