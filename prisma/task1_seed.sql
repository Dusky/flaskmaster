-- Task 1: The Tower Challenge
INSERT INTO tasks (id, episode_id, task_number, task_type, description, location, rules, metadata, created_at)
VALUES (
  'task1',
  'episode1',
  1,
  'physical',
  'Build the tallest tower using only items in this room. You have 10 minutes.',
  'Workshop',
  'Your time starts when you enter the room. The tower must stand unsupported for 10 seconds.',
  '{"timed": true}',
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Task 1 Results
INSERT INTO task_results (id, task_id, contestant_id, narrative, completion_time, outcome, score, disqualified, rule_violations, created_at)
VALUES
('result_t1_1', 'task1', 'contestant1',
 'Sarah enters the workshop and immediately begins analyzing the available materials with laser focus. She spots a ladder, several wooden planks, and duct tape. ''Okay, okay, I can work with this,'' she mutters, already formulating a plan. She spends the first four minutes carefully measuring and taping planks together into a stable base structure. Her tower rises methodically—each piece precisely placed. With one minute left, she''s at 4.2 meters and still building. At the 10-minute mark, Alex calls time. Her tower stands at 4.8 meters. ''Will it stand?'' Alex asks. Sarah steps back confidently. The tower remains perfectly still for exactly 8 seconds before the top plank slides off. Sarah''s face falls. ''No!'' ''It needed 10 seconds,'' Alex says cheerfully. Gregory looks thoughtful. ''Structurally sound, executed well, but failed the task requirements. Three points.''',
 600, '4.8 meters (collapsed at 8 seconds)', 3, false, 0, CURRENT_TIMESTAMP),
('result_t1_2', 'task1', 'contestant2',
 'David walks in and reads the task card three times. ''Tallest tower... using items in THIS room...'' A slow smile spreads across his face. He picks up a single wooden dowel, walks to the corner of the workshop, and carefully leans it against the wall at a precise angle. Then he steps outside the room. Alex follows him, confused. ''David, what are you doing?'' David grins. ''The task says I have to build it using items in the room. It doesn''t say I have to stay in the room while it stands.'' He closes the door. ''My tower is the room itself. The workshop building is approximately 12 meters tall.'' Alex blinks. ''I... what?'' They return to Gregory. After reviewing the tape, Gregory breaks into rare laughter. ''Absolutely infuriating. Completely within the rules. I hate it. Five points.''',
 120, '12 meters (the entire building)', 5, false, 0, CURRENT_TIMESTAMP),
('result_t1_3', 'task1', 'contestant3',
 'Margaret surveys the room like she''s directing a play. ''This is a set design challenge,'' she announces to herself. She begins constructing an elaborate tower using chairs, tables, and carefully balanced planks. Every piece is placed with theatrical precision. She even arranges smaller items aesthetically around the base. With three minutes remaining, her tower is only 2.3 meters tall but looks like an art installation. ''It''s about the journey, not the destination,'' she mutters, adding one more chair. Time runs out. The tower stands magnificently at 2.5 meters for well over 10 seconds. Gregory nods approvingly. ''Beautiful but short. Like a haiku about failure. Two points.''',
 600, '2.5 meters (stable)', 2, false, 0, CURRENT_TIMESTAMP),
('result_t1_4', 'task1', 'contestant4',
 'James bursts into the workshop with characteristic chaos energy. ''TOWER TIME!'' he shouts at nobody. He immediately starts grabbing anything he can reach—chairs, wood, a toolbox, a bicycle hanging on the wall—and stacking them with wild abandon. ''Higher! HIGHER!'' he yells, climbing onto his own unstable creation to add more items. At the 7-minute mark, his tower is an impossible 5.4 meters of barely-connected chaos. He adds one more chair to the top while standing on a wobbly table. The entire structure sways ominously. ''James, get down,'' Alex says nervously. ''Never!'' James adds one more plank. The tower immediately collapses, bringing James down with it into a spectacular crash. He emerges from the wreckage grinning, miraculously uninjured. Gregory sighs deeply. ''Tallest tower before catastrophic failure: 5.4 meters. Most entertaining failure: also 5.4 meters. One point for the entertainment.''',
 420, '5.4 meters (spectacular collapse, contestant survived)', 1, false, 1, CURRENT_TIMESTAMP),
('result_t1_5', 'task1', 'contestant5',
 'Linda enters the workshop with quiet confidence. She begins sketching a design on a piece of paper she finds, calculating load-bearing capacities and structural integrity. Six minutes pass as she perfects her blueprint. ''Okay, time to build,'' she finally says. She constructs a geometrically perfect tower using precise measurements and careful balance. Every piece is positioned with mathematical precision. With 30 seconds left, her tower reaches 3.7 meters and is absolutely beautiful. ''Perfect,'' she whispers. Time expires. The tower stands flawlessly for a full minute. Gregory studies it admirably. ''Exquisite engineering. Wasted six minutes planning. Four points for the craftsmanship.''',
 600, '3.7 meters (architecturally perfect)', 4, false, 0, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

