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

  // Get the created contestants
  const contestants = await prisma.contestant.findMany({
    where: { seasonId: season.id },
    orderBy: { colorIndex: "asc" },
  });

  // Create Episode 1
  const episode1 = await prisma.episode.create({
    data: {
      seasonId: season.id,
      episodeNumber: 1,
      title: "The Tower of Babel",
      status: "completed",
      airDate: new Date("2024-01-08"),
      content: {
        opening:
          "Gregory Stronghold sits in his imposing chair as the five contestants file in. 'Welcome,' he says, his voice carrying across the Main Hall, 'to Episode 1 of The Compound. I hope you're all prepared to disappoint me in fascinating ways.' Alex Brightwell grins from the side. 'Oh, they are definitely prepared, Gregory. I've already watched the footage.' The contestants exchange nervous glances.",
      },
    },
  });

  console.log(`✅ Created episode: ${episode1.episodeNumber}`);

  // Prize Task
  const prizeTask = await prisma.task.create({
    data: {
      episodeId: episode1.id,
      taskNumber: 0,
      taskType: "prize",
      description: "Bring in the most impressive thing you own",
      location: "Main Hall",
    },
  });

  // Prize Task Results
  await prisma.taskResult.createMany({
    data: [
      {
        taskId: prizeTask.id,
        contestantId: contestants[0].id, // Sarah
        narrative:
          "Sarah presents a complex mechanical puzzle box she designed herself. 'I made this for an escape room that never opened,' she explains proudly. 'It has seventeen separate mechanisms and takes an average person four hours to solve.' Gregory picks it up, examines it for three seconds, and places it back down. 'Impressive engineering. Utterly joyless. Three points.'",
        score: 3,
        disqualified: false,
      },
      {
        taskId: prizeTask.id,
        contestantId: contestants[1].id, // David
        narrative:
          "David brings out a laptop and opens a terminal window. 'This is my custom operating system kernel I wrote from scratch,' he announces. Alex squints at the screen. 'It's just text scrolling.' David nods enthusiastically. 'Exactly! Isn't it beautiful?' Gregory massages his temples. 'David, I asked for impressive things, not reasons to develop a migraine. One point.'",
        score: 1,
        disqualified: false,
      },
      {
        taskId: prizeTask.id,
        contestantId: contestants[2].id, // Margaret
        narrative:
          "Margaret unveils an elaborate handmade theater set model, complete with tiny working lights and a functional rotating stage. 'This is from my production of Hamlet. It took me six months.' She winds a small crank and the stage rotates smoothly. Gregory leans forward, genuinely interested. 'Now THIS shows dedication to pointless perfection. I respect that. Five points.'",
        score: 5,
        disqualified: false,
      },
      {
        taskId: prizeTask.id,
        contestantId: contestants[3].id, // James
        narrative:
          "James pulls back a cloth to reveal... a dented motorcycle helmet covered in stickers. 'This helmet has survived seven crashes, three fires, and one time I used it to break through a wooden door for a stunt.' He points at a particularly large dent. 'This one's from when I jumped off a moving train.' Gregory looks both impressed and concerned. 'That's genuinely impressive and genuinely concerning. Four points.'",
        score: 4,
        disqualified: false,
      },
      {
        taskId: prizeTask.id,
        contestantId: contestants[4].id, // Elena
        narrative:
          "Elena carefully unwraps a large architectural model of an award-winning building she designed. Every detail is perfect, from the tiny landscaped gardens to the working elevator in the atrium. 'This won the Regional Architecture Prize last year,' she says softly. Gregory studies it carefully. 'Exquisite craftsmanship. Genuinely impressive. But that helmet survived train jumping. Two points.'",
        score: 2,
        disqualified: false,
      },
    ],
  });

  // Task 1: The Tower Challenge
  const task1 = await prisma.task.create({
    data: {
      episodeId: episode1.id,
      taskNumber: 1,
      taskType: "physical",
      description: "Build the tallest tower using only items in this room. You have 10 minutes.",
      location: "Workshop",
      rules: "Your time starts when you enter the room. The tower must stand unsupported for 10 seconds.",
      metadata: { timed: true },
    },
  });

  // Task 1 Results
  await prisma.taskResult.createMany({
    data: [
      {
        taskId: task1.id,
        contestantId: contestants[0].id, // Sarah
        narrative:
          "Sarah enters the workshop and immediately begins analyzing the available materials with laser focus. She spots a ladder, several wooden planks, and duct tape. 'Okay, okay, I can work with this,' she mutters, already formulating a plan. She spends the first four minutes carefully measuring and taping planks together into a stable base structure. Her tower rises methodically—each piece precisely placed. With one minute left, she's at 4.2 meters and still building. At the 10-minute mark, Alex calls time. Her tower stands at 4.8 meters. 'Will it stand?' Alex asks. Sarah steps back confidently. The tower remains perfectly still for exactly 8 seconds before the top plank slides off. Sarah's face falls. 'No!' 'It needed 10 seconds,' Alex says cheerfully. Gregory looks thoughtful. 'Structurally sound, executed well, but failed the task requirements. Three points.'",
        completionTime: 600,
        outcome: "4.8 meters (collapsed at 8 seconds)",
        score: 3,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: task1.id,
        contestantId: contestants[1].id, // David
        narrative:
          "David walks in and reads the task card three times. 'Tallest tower... using items in THIS room...' A slow smile spreads across his face. He picks up a single wooden dowel, walks to the corner of the workshop, and carefully leans it against the wall at a precise angle. Then he steps outside the room. Alex follows him, confused. 'David, what are you doing?' David grins. 'The task says I have to build it using items in the room. It doesn't say I have to stay in the room while it stands.' He closes the door. 'My tower is the room itself. The workshop building is approximately 12 meters tall.' Alex blinks. 'I... what?' They return to Gregory. After reviewing the tape, Gregory breaks into rare laughter. 'Absolutely infuriating. Completely within the rules. I hate it. Five points.'",
        completionTime: 120,
        outcome: "12 meters (the entire building)",
        score: 5,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: task1.id,
        contestantId: contestants[2].id, // Margaret
        narrative:
          "Margaret surveys the room like she's directing a play. 'This is a set design challenge,' she announces to herself. She begins constructing an elaborate tower using chairs, tables, and carefully balanced planks. Every piece is placed with theatrical precision. She even arranges smaller items aesthetically around the base. With three minutes remaining, her tower is only 2.3 meters tall but looks like an art installation. 'It's about the journey, not the destination,' she mutters, adding one more chair. Time runs out. The tower stands magnificently at 2.5 meters for well over 10 seconds. Gregory nods approvingly. 'Beautiful but short. Like a haiku about failure. Two points.'",
        completionTime: 600,
        outcome: "2.5 meters (stable)",
        score: 2,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: task1.id,
        contestantId: contestants[3].id, // James
        narrative:
          "James bursts into the workshop with characteristic chaos energy. 'TOWER TIME!' he shouts at nobody. He immediately starts grabbing anything he can reach—chairs, wood, a toolbox, a bicycle hanging on the wall—and stacking them with wild abandon. 'Higher! HIGHER!' he yells, climbing onto his own unstable creation to add more items. At the 7-minute mark, his tower is an impossible 5.4 meters of barely-connected chaos. He adds one more chair to the top while standing on a wobbly table. The entire structure sways ominously. 'James, get down,' Alex says nervously. 'Never!' James adds one more plank. The tower immediately collapses, bringing James down with it into a spectacular crash. He emerges from the wreckage grinning, miraculously uninjured. Gregory sighs deeply. 'Tallest tower before catastrophic failure: 5.4 meters. Most entertaining failure: also 5.4 meters. One point for the entertainment.'",
        completionTime: 420,
        outcome: "5.4 meters (spectacular collapse, contestant survived)",
        score: 1,
        disqualified: false,
        ruleViolations: 1,
      },
      {
        taskId: task1.id,
        contestantId: contestants[4].id, // Elena
        narrative:
          "Elena enters the workshop and her architect instincts immediately take over. She begins sketching a design on a piece of paper she finds, calculating load-bearing capacities and structural integrity. Six minutes pass as she perfects her blueprint. 'Okay, time to build,' she finally says. She constructs a geometrically perfect tower using precise measurements and careful balance. Every piece is positioned with mathematical precision. With 30 seconds left, her tower reaches 3.7 meters and is absolutely beautiful. 'Perfect,' she whispers. Time expires. The tower stands flawlessly for a full minute. Gregory studies it admirably. 'Exquisite engineering. Wasted six minutes planning. Four points for the craftsmanship.'",
        completionTime: 600,
        outcome: "3.7 meters (architecturally perfect)",
        score: 4,
        disqualified: false,
        ruleViolations: 0,
      },
    ],
  });

  console.log("✅ Created episode tasks and results");
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
