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

  // Task 2: The Creative Challenge
  const task2 = await prisma.task.create({
    data: {
      episodeId: episode1.id,
      taskNumber: 2,
      taskType: "creative",
      description: "Make the most surprising thing appear in this room. You have 15 minutes.",
      location: "Storage Room",
      rules: "You may leave and return as needed. The Assistant must be genuinely surprised.",
      metadata: { timed: true },
    },
  });

  // Task 2 Results
  await prisma.taskResult.createMany({
    data: [
      {
        taskId: task2.id,
        contestantId: contestants[0].id, // Sarah
        narrative:
          "Sarah immediately leaves the room and returns three minutes later carrying an elaborate pulley system. She spends the next twelve minutes rigging it to the ceiling, creating a contraption that will drop a foam 'boulder' when the door opens. 'Alex, can you step outside and come back in?' she asks. Alex opens the door and the boulder drops directly onto his head. 'Ow!' Alex yelps, then grins. 'Okay, I'll admit, I didn't see that coming.' Sarah looks pleased with herself. Gregory nods. 'Practical, somewhat violent, moderately surprising. Four points.'",
        completionTime: 900,
        outcome: "Boulder trap successfully surprised Alex",
        score: 4,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: task2.id,
        contestantId: contestants[1].id, // David
        narrative:
          "David stares at the task for a long moment, then pulls out his phone. He spends fourteen minutes typing furiously on his laptop (which he brought from the car). With thirty seconds left, he announces: 'Done.' Alex looks confused. 'What did you do?' David grins and opens his browser to show a working website: 'www.the-compound-is-real.com' featuring 'evidence' that The Compound is a government conspiracy. 'I made the internet think this place exists outside the show. Already got three Reddit threads.' Alex's jaw drops. 'That's... actually insane.' Gregory laughs despite himself. 'Existentially surprising. Five points.'",
        completionTime: 900,
        outcome: "Created conspiracy theory website about The Compound",
        score: 5,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: task2.id,
        contestantId: contestants[2].id, // Margaret
        narrative:
          "Margaret looks around the storage room and finds a collection of old props and costume pieces. She begins assembling them into an elaborate tableau. When time is called, she's created a perfect Victorian-era parlor scene, complete with herself in period costume, frozen in a dramatic pose. Alex enters and gasps. 'It's like stepping into a different century!' Margaret breaks character. 'Thank you! I found everything in here!' Gregory studies the scene. 'Visually stunning, clearly took effort, but I'm more confused than surprised. Three points.'",
        completionTime: 900,
        outcome: "Victorian parlor scene transformation",
        score: 3,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: task2.id,
        contestantId: contestants[3].id, // James
        narrative:
          "James runs out of the storage room immediately. Thirteen minutes pass with no sign of him. Alex checks his watch nervously. At the 14-minute mark, there's a loud crash from outside. Alex runs out to find James has driven a motorcycle through the loading dock door and into the storage room. 'SURPRISE!' James yells from atop the bike, arms raised triumphantly. 'How did you— where did you— is that even street legal?!' Alex sputters. James grins. 'Borrowed it from the parking lot. Technically I made it appear in the room!' Gregory pinches the bridge of his nose. 'Genuinely surprising. Also property damage. Two points and you're paying for the door.'",
        completionTime: 840,
        outcome: "Motorcycle through wall (door repair required)",
        score: 2,
        disqualified: false,
        ruleViolations: 1,
      },
      {
        taskId: task2.id,
        contestantId: contestants[4].id, // Elena
        narrative:
          "Elena takes a different approach. She carefully constructs an origami garden—dozens of intricate paper flowers, birds, and butterflies suspended from fishing line she found. The room is transformed into a delicate floating sculpture. Each piece is mathematically precise and beautiful. When Alex enters, he stops in his tracks. 'Elena... this is incredible.' She smiles. 'I learned origami for stress relief. Turns out it's useful.' Gregory examines the work closely. 'Artistically impressive, legitimately surprising in its scale. One point.' Elena's face falls. 'ONE point?!' Gregory shrugs. 'David made the internet question reality. You made pretty paper.'",
        completionTime: 900,
        outcome: "Intricate origami garden installation",
        score: 1,
        disqualified: false,
        ruleViolations: 0,
      },
    ],
  });

  // Task 3: The Lateral Thinking Challenge
  const task3 = await prisma.task.create({
    data: {
      episodeId: episode1.id,
      taskNumber: 3,
      taskType: "lateral",
      description: "Get this potato into that box without touching the potato, the box, or the floor.",
      location: "Courtyard",
      rules: "The potato must remain intact. The box is 10 meters away. Your time starts now.",
      metadata: { timed: true },
    },
  });

  // Task 3 Results
  await prisma.taskResult.createMany({
    data: [
      {
        taskId: task3.id,
        contestantId: contestants[0].id, // Sarah
        narrative:
          "Sarah surveys the courtyard and spots a long pole. She spends two minutes fashioning a hook from wire, attaches it to the pole, and successfully spears the potato. She then uses the pole to lift the potato and drop it into the box from above. 'Done!' she announces. Alex reviews the footage. 'You touched the pole, which touched the potato. Does that count as touching the potato?' Gregory considers. 'The task said don't touch the potato. She didn't. The pole did. Legal. Four points.'",
        completionTime: 240,
        outcome: "Pole technique (debated but allowed)",
        score: 4,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: task3.id,
        contestantId: contestants[1].id, // David
        narrative:
          "David reads the task card and smiles. 'It doesn't say I can't ask someone else to do it.' He walks to the parking lot and finds a groundskeeper. 'Excuse me, could you do me a favor?' Three minutes later, the groundskeeper (who David explained nothing to) picks up the potato and places it in the box. David returns to Alex. 'Task complete.' Alex stares. 'You... you outsourced the task.' David nods. 'I didn't touch anything. The task is complete.' Gregory breaks into laughter. 'Brilliant. Infuriating. Technically correct. Five points.'",
        completionTime: 300,
        outcome: "Hired groundskeeper to complete task",
        score: 5,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: task3.id,
        contestantId: contestants[2].id, // Margaret
        narrative:
          "Margaret overthinks immediately. 'I can't touch the potato, the box, or the floor...' She builds an elaborate bridge structure using wooden planks balanced on chairs, creating a path from the potato to the box while keeping herself off the floor. The construction takes twelve minutes. She then uses a stick to push the potato along the bridge. Halfway across, the bridge wobbles and collapses, sending the potato to the ground. Margaret sighs deeply. 'Of course.' Gregory looks sympathetic. 'Overly complex solution, structural failure, entertaining to watch. Two points.'",
        completionTime: 720,
        outcome: "Bridge collapsed, potato hit floor",
        score: 2,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: task3.id,
        contestantId: contestants[3].id, // James
        narrative:
          "James picks up the potato. Alex immediately yells, 'JAMES, NO TOUCHING THE POTATO!' James grins. 'I'm not touching it.' He juggles the potato while running toward the box. 'James, you're HOLDING IT!' Alex protests. James throws the potato fifteen feet through the air, where it sails perfectly into the box. 'Didn't touch it while it was traveling!' James argues. Alex looks at Gregory helplessly. Gregory shakes his head. 'He touched it. Blatant rule violation. But that throw was impressive. One point for the athleticism, zero points for following instructions.'",
        completionTime: 45,
        outcome: "Threw potato (rule violation)",
        score: 1,
        disqualified: false,
        ruleViolations: 1,
      },
      {
        taskId: task3.id,
        contestantId: contestants[4].id, // Elena
        narrative:
          "Elena studies the problem carefully and notices a slight downward slope in the courtyard. She finds a long piece of guttering and positions it to create a ramp from the potato to the box, using only rocks to prop it up (carefully not touching the floor herself by standing on a chair). She then uses wind from a large piece of cardboard to fan the potato, which slowly rolls down the gutter and into the box. The whole operation takes nine minutes and is mechanically perfect. Gregory applauds. 'Engineering excellence. Followed all rules. Took forever. Three points.'",
        completionTime: 540,
        outcome: "Gravity ramp with wind propulsion",
        score: 3,
        disqualified: false,
        ruleViolations: 0,
      },
    ],
  });

  // Live Task
  const liveTask = await prisma.task.create({
    data: {
      episodeId: episode1.id,
      taskNumber: 4,
      taskType: "live",
      description: "Wearing a blindfold, make the highest pile of canned goods. You have 2 minutes.",
      location: "Main Hall",
      rules: "You must remain blindfolded. Each fallen can costs you one point from your final score.",
      metadata: { timed: true, live: true },
    },
  });

  // Live Task Results
  await prisma.taskResult.createMany({
    data: [
      {
        taskId: liveTask.id,
        contestantId: contestants[0].id, // Sarah
        narrative:
          "Sarah, blindfolded, moves with surprising confidence. She carefully stacks cans one at a time, feeling each placement. The studio audience watches tensely. She builds a pyramid structure: six cans base, three middle, one top. Solid, safe, methodical. When time is called, her tower stands at 10 cans with zero falls. Gregory nods approval. 'Practical, effective, boring. Four points.'",
        completionTime: 120,
        outcome: "10 cans, 0 fallen",
        score: 4,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: liveTask.id,
        contestantId: contestants[1].id, // David
        narrative:
          "David, blindfolded, immediately starts building a single tower. He stacks cans directly on top of each other with surprising accuracy. 'It's just spatial reasoning,' he mutters. His tower rises: 8, 9, 10 cans high. The audience gasps. He reaches for an eleventh can. The tower sways. He slowly places it—it holds! Twelve cans, thirteen— CRASH. The entire tower falls with thirty seconds left. David freezes. 'How many?' he asks. Alex counts. 'Thirteen cans fell.' David's shoulders slump. Final score: 0 points (13 cans - 13 penalty). Gregory laughs. 'Ambition punished. Zero points.'",
        completionTime: 90,
        outcome: "13 cans attempted, 13 fallen (0 points after penalty)",
        score: 0,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: liveTask.id,
        contestantId: contestants[2].id, // Margaret
        narrative:
          "Margaret, blindfolded, talks herself through it. 'Okay, steady hands, Margaret. You've done tech week with worse conditions.' She builds slowly, deliberately. Each can is placed with theatrical precision. She creates a wide, stable base and builds up carefully. At the end, she has 8 cans with one fallen. 'How did I do?' she asks nervously. Alex smiles. 'Eight cans, one fell.' Margaret sighs with relief. Gregory awards her three points. 'Competent but unexciting. Three points.'",
        completionTime: 120,
        outcome: "8 cans, 1 fallen (7 after penalty)",
        score: 3,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: liveTask.id,
        contestantId: contestants[3].id, // James
        narrative:
          "James, blindfolded, attacks the task with his usual chaos energy. 'CANS! WHERE ARE THE CANS!' He grabs handfuls and starts stacking wildly. Cans fall immediately. He doesn't care. More cans. More stacking. The audience is laughing. Cans are everywhere. He's built three separate piles, all falling constantly. When time ends, James has created absolute carnage. Alex counts: 'You stacked 15 cans... and 22 fell.' The audience erupts in laughter. Gregory shakes his head. 'Fifteen minus twenty-two equals negative seven. But we don't do negative points. One point for the entertainment value.'",
        completionTime: 120,
        outcome: "15 cans stacked, 22 fallen (chaos)",
        score: 1,
        disqualified: false,
        ruleViolations: 0,
      },
      {
        taskId: liveTask.id,
        contestantId: contestants[4].id, // Elena
        narrative:
          "Elena, blindfolded, treats this like an architectural challenge. She feels each can carefully, organizing them by size and shape before stacking. 'Load-bearing distribution,' she mutters. The audience watches as she constructs a geometrically perfect pyramid: 10 cans arranged in a mathematically optimal configuration. Not a single can falls. When time is called, her structure stands pristine. Gregory is genuinely impressed. 'Flawless execution. Perfect precision. Five points.' Elena beams.",
        completionTime: 120,
        outcome: "10 cans, 0 fallen, perfect structure",
        score: 5,
        disqualified: false,
        ruleViolations: 0,
      },
    ],
  });

  // Update episode content with banter interludes and final results
  await prisma.episode.update({
    where: { id: episode1.id },
    data: {
      content: {
        opening:
          "Gregory Stronghold sits in his imposing chair as the five contestants file in. 'Welcome,' he says, his voice carrying across the Main Hall, 'to Episode 1 of The Compound. I hope you're all prepared to disappoint me in fascinating ways.' Alex Brightwell grins from the side. 'Oh, they are definitely prepared, Gregory. I've already watched the footage.' The contestants exchange nervous glances.",

        banterAfterPrize:
          "After the prize task, Gregory leans back in his chair. 'Well, that was a mixed bag of ambition and confusion. Margaret's theater set was genuinely impressive. David's operating system was genuinely unwatchable.' David raises his hand. 'To be fair—' Gregory cuts him off. 'No.' The audience laughs.",

        banterAfterTask1:
          "Alex reviews the tower task footage. 'I have to say, David's interpretation was brilliant.' Gregory nods grudgingly. 'I hate that it worked. I genuinely hate it. But it worked.' David grins smugly. Sarah crosses her arms. 'My tower was taller before it fell!' Gregory looks at her. 'Yes, but David's tower is still standing. It's called a BUILDING, Sarah.'",

        banterAfterTask2:
          "Gregory surveys the chaos of the surprise task. 'James, you drove a motorcycle through a wall.' James nods proudly. 'Into a room! As requested!' Alex adds, 'The repair bill is £2,400.' Gregory sighs. 'I'm deducting that from your prize money.' James's face falls. 'There's prize money?' Alex shakes his head. 'No.' The audience erupts in laughter.",

        banterAfterTask3:
          "The potato task results are displayed. Gregory looks at David. 'You hired a groundskeeper.' David nods. 'The task had no rule against it.' Gregory turns to Alex. 'Did the task have a rule against it?' Alex checks. 'No, it did not.' Gregory looks back at David. 'I'm changing the rules for next episode specifically because of you.' David looks pleased. 'Thank you.'",

        episodeWinner: contestants[0].id, // Sarah Kim wins Episode 1

        finalStandings: [
          { contestantId: contestants[0].id, name: "Sarah Kim", totalPoints: 19 },
          { contestantId: contestants[1].id, name: "David Park", totalPoints: 16 },
          { contestantId: contestants[4].id, name: "Elena Rodriguez", totalPoints: 13 },
          { contestantId: contestants[2].id, name: "Margaret Thompson", totalPoints: 13 },
          { contestantId: contestants[3].id, name: "James Wilson", totalPoints: 9 },
        ],

        closingBanter:
          "Gregory stands to announce the results. 'With nineteen points, today's winner is Sarah Kim.' Sarah pumps her fist. 'Yes!' Gregory continues, 'Which means she's currently leading the series. David and his loopholes are in second. Margaret and Elena are tied for third. And James...' He pauses. 'James is in last place, owes us money for a door, and somehow didn't injure himself. I call that a win.' James grins. 'Thank you!' Alex concludes, 'Join us next week for Episode 2, where we've specifically added rules to prevent David from doing whatever David does.' David's smile grows wider. 'We'll see about that.'",
      },
    },
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
