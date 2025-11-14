-- Seed data for The Compound
-- Season 1
INSERT INTO seasons (id, season_number, status, start_date, taskmaster_name, taskmaster_personality, assistant_name, assistant_personality, created_at)
VALUES (
  'season1',
  1,
  'active',
  '2024-01-01',
  'Gregory Stronghold',
  'A towering figure with an imposing presence. Gregory judges with theatrical authority and arbitrary precision. He delights in contestants'' failures but grudgingly respects clever solutions. His scoring follows his own bizarre internal logic.',
  'Alex Brightwell',
  'Gregory''s eternally cheerful assistant. Alex reads tasks with barely contained glee, offers false sympathy to struggling contestants, and provides running commentary filled with passive-aggressive observations. Takes secret delight in chaos.',
  CURRENT_TIMESTAMP
) ON CONFLICT (season_number) DO NOTHING;

-- Contestants
INSERT INTO contestants (id, season_id, name, backstory, personality_archetype, color_index, hidden_stats, tracked_stats, created_at)
VALUES
('contestant1', 'season1', 'Sarah Kim', 'A former escape room designer with a competitive streak. Sarah approaches every task like a puzzle to be solved efficiently.', 'The Competitor', 1,
 '{"creativity": 7, "physical": 6, "lateralThinking": 8, "confidence": 9, "riskTaking": 5, "panicResistance": 7, "ruleFollowing": 8}',
 '{"totalPoints": 65, "tasksWon": 8, "timesAwarded5Points": 3, "timesAwarded1Point": 2, "disqualifications": 0, "ruleViolations": 1}',
 CURRENT_TIMESTAMP),
('contestant2', 'season1', 'David Park', 'A software engineer who thinks in systems and patterns. David''s strength is finding loopholes and unconventional interpretations of task rules.', 'The Lateral Thinker', 3,
 '{"creativity": 8, "physical": 5, "lateralThinking": 10, "confidence": 6, "riskTaking": 7, "panicResistance": 9, "ruleFollowing": 3}',
 '{"totalPoints": 52, "tasksWon": 5, "timesAwarded5Points": 2, "timesAwarded1Point": 4, "disqualifications": 1, "ruleViolations": 5}',
 CURRENT_TIMESTAMP),
('contestant3', 'season1', 'Margaret Thompson', 'A theater director with impeccable organizational skills and a tendency to overthink.', 'The Overthinker', 2,
 '{"creativity": 9, "physical": 4, "lateralThinking": 6, "confidence": 5, "riskTaking": 3, "panicResistance": 4, "ruleFollowing": 9}',
 '{"totalPoints": 47, "tasksWon": 4, "timesAwarded5Points": 4, "timesAwarded1Point": 3, "disqualifications": 0, "ruleViolations": 0}',
 CURRENT_TIMESTAMP),
('contestant4', 'season1', 'James Rodriguez', 'A personal trainer with boundless energy and poor impulse control.', 'The Chaos Agent', 4,
 '{"creativity": 5, "physical": 10, "lateralThinking": 4, "confidence": 10, "riskTaking": 10, "panicResistance": 8, "ruleFollowing": 4}',
 '{"totalPoints": 43, "tasksWon": 3, "timesAwarded5Points": 2, "timesAwarded1Point": 5, "disqualifications": 2, "ruleViolations": 7}',
 CURRENT_TIMESTAMP),
('contestant5', 'season1', 'Linda Chen', 'A retired librarian with unexpected physical capabilities and a dry sense of humor.', 'The Dark Horse', 5,
 '{"creativity": 6, "physical": 7, "lateralThinking": 7, "confidence": 4, "riskTaking": 6, "panicResistance": 10, "ruleFollowing": 7}',
 '{"totalPoints": 58, "tasksWon": 6, "timesAwarded5Points": 5, "timesAwarded1Point": 1, "disqualifications": 0, "ruleViolations": 2}',
 CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

