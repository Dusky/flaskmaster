-- Manual Seed Script for The Compound
-- Complete Episode 1 data

-- Season 1
INSERT INTO seasons (id, season_number, status, start_date, taskmaster_name, taskmaster_personality, assistant_name, assistant_personality, created_at)
VALUES (
  'season_1',
  1,
  'active',
  '2024-01-01',
  'Gregory Stronghold',
  'A towering figure with an imposing presence. Gregory judges with theatrical authority and arbitrary precision. He delights in contestants'' failures but grudgingly respects clever solutions. His scoring follows his own bizarre internal logic.',
  'Alex Brightwell',
  'Gregory''s eternally cheerful assistant. Alex reads tasks with barely contained glee, offers false sympathy to struggling contestants, and provides running commentary filled with passive-aggressive observations. Takes secret delight in chaos.',
  NOW()
);

-- Contestants
INSERT INTO contestants (id, season_id, name, backstory, personality_archetype, color_index, hidden_stats, tracked_stats, created_at)
VALUES
  ('contestant_sarah', 'season_1', 'Sarah Kim',
   'A former escape room designer with a competitive streak. Sarah approaches every task like a puzzle to be solved efficiently. She''s methodical, quick-thinking, and doesn''t handle failure well. Known for overthinking simple tasks and accidentally creating brilliant solutions to complex ones.',
   'The Competitor', 1,
   '{"creativity": 7, "physical": 6, "lateralThinking": 8, "confidence": 9, "riskTaking": 5, "panicResistance": 7, "ruleFollowing": 8}',
   '{"totalPoints": 19, "tasksWon": 8, "timesAwarded5Points": 3, "timesAwarded1Point": 2, "disqualifications": 0, "ruleViolations": 1}',
   NOW()),

  ('contestant_david', 'season_1', 'David Park',
   'A software engineer who thinks in systems and patterns. David''s strength is finding loopholes and unconventional interpretations of task rules. He''s calm under pressure but tends to overcomplicate simple solutions. His attempts are either brilliantly efficient or spectacularly confusing.',
   'The Lateral Thinker', 3,
   '{"creativity": 8, "physical": 5, "lateralThinking": 10, "confidence": 6, "riskTaking": 7, "panicResistance": 9, "ruleFollowing": 3}',
   '{"totalPoints": 16, "tasksWon": 5, "timesAwarded5Points": 2, "timesAwarded1Point": 4, "disqualifications": 1, "ruleViolations": 5}',
   NOW()),

  ('contestant_margaret', 'season_1', 'Margaret Thompson',
   'A theater director with impeccable organizational skills and a tendency to overthink. Margaret excels at tasks requiring planning but struggles when forced to improvise. She provides excellent narration of her own failures and treats every task like a performance piece.',
   'The Overthinker', 2,
   '{"creativity": 9, "physical": 4, "lateralThinking": 6, "confidence": 5, "riskTaking": 3, "panicResistance": 4, "ruleFollowing": 9}',
   '{"totalPoints": 13, "tasksWon": 4, "timesAwarded5Points": 4, "timesAwarded1Point": 3, "disqualifications": 0, "ruleViolations": 0}',
   NOW()),

  ('contestant_james', 'season_1', 'James Wilson',
   'A professional stunt performer who treats every task like an action scene. James has boundless energy, zero planning skills, and an inspiring lack of self-preservation instinct. His attempts are chaotic, entertaining, and frequently involve minor injuries. Rules are merely suggestions.',
   'Chaos Agent', 4,
   '{"creativity": 6, "physical": 10, "lateralThinking": 5, "confidence": 10, "riskTaking": 10, "panicResistance": 8, "ruleFollowing": 2}',
   '{"totalPoints": 9, "tasksWon": 3, "timesAwarded5Points": 1, "timesAwarded1Point": 6, "disqualifications": 2, "ruleViolations": 8}',
   NOW()),

  ('contestant_elena', 'season_1', 'Elena Rodriguez',
   'An architect with perfectionist tendencies. Elena''s work is meticulous and beautifully executed, but she runs out of time constantly. She gets genuinely upset when her creations are destroyed during scoring. Known for creating museum-quality results for absurd tasks.',
   'The Perfectionist', 5,
   '{"creativity": 10, "physical": 6, "lateralThinking": 7, "confidence": 7, "riskTaking": 4, "panicResistance": 5, "ruleFollowing": 10}',
   '{"totalPoints": 13, "tasksWon": 2, "timesAwarded5Points": 2, "timesAwarded1Point": 5, "disqualifications": 0, "ruleViolations": 0}',
   NOW());

-- Episode 1 with full content
INSERT INTO episodes (id, season_id, episode_number, title, status, air_date, content, created_at)
VALUES (
  'episode_1',
  'season_1',
  1,
  'The Tower of Babel',
  'completed',
  '2024-01-08',
  '{
    "opening": "Gregory Stronghold sits in his imposing chair as the five contestants file in. ''Welcome,'' he says, his voice carrying across the Main Hall, ''to Episode 1 of The Compound. I hope you''re all prepared to disappoint me in fascinating ways.'' Alex Brightwell grins from the side. ''Oh, they are definitely prepared, Gregory. I''ve already watched the footage.'' The contestants exchange nervous glances.",
    "banterAfterPrize": "After the prize task, Gregory leans back in his chair. ''Well, that was a mixed bag of ambition and confusion. Margaret''s theater set was genuinely impressive. David''s operating system was genuinely unwatchable.'' David raises his hand. ''To be fair—'' Gregory cuts him off. ''No.'' The audience laughs.",
    "banterAfterTask1": "Alex reviews the tower task footage. ''I have to say, David''s interpretation was brilliant.'' Gregory nods grudgingly. ''I hate that it worked. I genuinely hate it. But it worked.'' David grins smugly. Sarah crosses her arms. ''My tower was taller before it fell!'' Gregory looks at her. ''Yes, but David''s tower is still standing. It''s called a BUILDING, Sarah.''",
    "banterAfterTask2": "Gregory surveys the chaos of the surprise task. ''James, you drove a motorcycle through a wall.'' James nods proudly. ''Into a room! As requested!'' Alex adds, ''The repair bill is £2,400.'' Gregory sighs. ''I''m deducting that from your prize money.'' James''s face falls. ''There''s prize money?'' Alex shakes his head. ''No.'' The audience erupts in laughter.",
    "banterAfterTask3": "The potato task results are displayed. Gregory looks at David. ''You hired a groundskeeper.'' David nods. ''The task had no rule against it.'' Gregory turns to Alex. ''Did the task have a rule against it?'' Alex checks. ''No, it did not.'' Gregory looks back at David. ''I''m changing the rules for next episode specifically because of you.'' David looks pleased. ''Thank you.''",
    "episodeWinner": "contestant_sarah",
    "finalStandings": [
      {"contestantId": "contestant_sarah", "name": "Sarah Kim", "totalPoints": 19},
      {"contestantId": "contestant_david", "name": "David Park", "totalPoints": 16},
      {"contestantId": "contestant_elena", "name": "Elena Rodriguez", "totalPoints": 13},
      {"contestantId": "contestant_margaret", "name": "Margaret Thompson", "totalPoints": 13},
      {"contestantId": "contestant_james", "name": "James Wilson", "totalPoints": 9}
    ],
    "closingBanter": "Gregory stands to announce the results. ''With nineteen points, today''s winner is Sarah Kim.'' Sarah pumps her fist. ''Yes!'' Gregory continues, ''Which means she''s currently leading the series. David and his loopholes are in second. Margaret and Elena are tied for third. And James...'' He pauses. ''James is in last place, owes us money for a door, and somehow didn''t injure himself. I call that a win.'' James grins. ''Thank you!'' Alex concludes, ''Join us next week for Episode 2, where we''ve specifically added rules to prevent David from doing whatever David does.'' David''s smile grows wider. ''We''ll see about that.''"
  }',
  NOW()
);

-- NOTE: Due to length constraints, I'll need to create tasks and task_results separately
-- Run this first, then run the tasks seed script