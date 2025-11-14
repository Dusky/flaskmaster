-- Episode 1: The Tower of Babel
INSERT INTO episodes (id, season_id, episode_number, title, status, air_date, content, created_at)
VALUES (
  'episode1',
  'season1',
  1,
  'The Tower of Babel',
  'completed',
  '2024-01-08',
  '{"opening": "Gregory Stronghold sits in his imposing chair as the five contestants file in. ''Welcome,'' he says, his voice carrying across the Main Hall, ''to Episode 1 of The Compound. I hope you''re all prepared to disappoint me in fascinating ways.'' Alex Brightwell grins from the side. ''Oh, they are definitely prepared, Gregory. I''ve already watched the footage.'' The contestants exchange nervous glances."}',
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Prize Task
INSERT INTO tasks (id, episode_id, task_number, task_type, description, location, created_at)
VALUES (
  'task_prize',
  'episode1',
  0,
  'prize',
  'Bring in the most impressive thing you own',
  'Main Hall',
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Prize Task Results
INSERT INTO task_results (id, task_id, contestant_id, narrative, score, disqualified, created_at)
VALUES
('result_prize_1', 'task_prize', 'contestant1',
 'Sarah presents a complex mechanical puzzle box she designed herself. ''I made this for an escape room that never opened,'' she explains proudly. ''It has seventeen separate mechanisms and takes an average person four hours to solve.'' Gregory picks it up, examines it for three seconds, and places it back down. ''Impressive engineering. Utterly joyless. Three points.''',
 3, false, CURRENT_TIMESTAMP),
('result_prize_2', 'task_prize', 'contestant2',
 'David brings out a laptop and opens a terminal window. ''This is my custom operating system kernel I wrote from scratch,'' he announces. Alex squints at the screen. ''It''s just text scrolling.'' David nods enthusiastically. ''Exactly! Isn''t it beautiful?'' Gregory massages his temples. ''David, I asked for impressive things, not reasons to develop a migraine. One point.''',
 1, false, CURRENT_TIMESTAMP),
('result_prize_3', 'task_prize', 'contestant3',
 'Margaret unveils an elaborate handmade theater set model, complete with tiny working lights and a functional rotating stage. ''This is from my production of Hamlet. It took me six months.'' She winds a small crank and the stage rotates smoothly. Gregory leans forward, genuinely interested. ''Now THIS shows dedication to pointless perfection. I respect that. Five points.''',
 5, false, CURRENT_TIMESTAMP),
('result_prize_4', 'task_prize', 'contestant4',
 'James pulls back a cloth to reveal... a dented motorcycle helmet covered in stickers. ''This helmet has survived seven crashes, three fires, and one time I used it to break through a wooden door for a stunt.'' He points at a particularly large dent. ''This one''s from when I jumped off a moving train.'' Gregory looks both impressed and concerned. ''That''s genuinely impressive and genuinely concerning. Four points.''',
 4, false, CURRENT_TIMESTAMP),
('result_prize_5', 'task_prize', 'contestant5',
 'Linda carefully unwraps a large architectural model of an award-winning building she designed. Every detail is perfect, from the tiny landscaped gardens to the working elevator in the atrium. ''This won the Regional Architecture Prize last year,'' she says softly. Gregory studies it carefully. ''Exquisite craftsmanship. Genuinely impressive. But that helmet survived train jumping. Two points.''',
 2, false, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

