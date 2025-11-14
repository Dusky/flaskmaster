-- Manual migration for The Compound database
-- Generated from schema.prisma

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  currency_balance INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create seasons table
CREATE TABLE IF NOT EXISTS seasons (
  id TEXT PRIMARY KEY,
  season_number INTEGER UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  taskmaster_name TEXT NOT NULL,
  taskmaster_personality TEXT NOT NULL,
  assistant_name TEXT NOT NULL,
  assistant_personality TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create contestants table
CREATE TABLE IF NOT EXISTS contestants (
  id TEXT PRIMARY KEY,
  season_id TEXT NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  backstory TEXT NOT NULL,
  personality_archetype TEXT NOT NULL,
  color_index INTEGER NOT NULL,
  hidden_stats JSONB NOT NULL,
  tracked_stats JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create episodes table
CREATE TABLE IF NOT EXISTS episodes (
  id TEXT PRIMARY KEY,
  season_id TEXT NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming',
  air_date TIMESTAMP NOT NULL,
  rewards_processed BOOLEAN NOT NULL DEFAULT false,
  content JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(season_id, episode_number)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  episode_id TEXT NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  task_number INTEGER NOT NULL,
  task_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  rules TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(episode_id, task_number)
);

-- Create task_results table
CREATE TABLE IF NOT EXISTS task_results (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  contestant_id TEXT NOT NULL REFERENCES contestants(id) ON DELETE CASCADE,
  narrative TEXT NOT NULL,
  completion_time INTEGER,
  outcome TEXT,
  score INTEGER NOT NULL,
  disqualified BOOLEAN NOT NULL DEFAULT false,
  rule_violations INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(task_id, contestant_id)
);

-- Create user_picks table
CREATE TABLE IF NOT EXISTS user_picks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  season_id TEXT NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  contestant_id TEXT NOT NULL REFERENCES contestants(id) ON DELETE CASCADE,
  picked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  currency_spent INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, season_id, active)
);

-- Create bets table
CREATE TABLE IF NOT EXISTS bets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  episode_id TEXT NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  bet_type TEXT NOT NULL,
  bet_target TEXT NOT NULL,
  amount INTEGER NOT NULL,
  odds DOUBLE PRECISION NOT NULL,
  potential_payout INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  actual_payout INTEGER NOT NULL DEFAULT 0,
  placed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Create stat_definitions table
CREATE TABLE IF NOT EXISTS stat_definitions (
  id TEXT PRIMARY KEY,
  stat_name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create currency_transactions table
CREATE TABLE IF NOT EXISTS currency_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  episode_id TEXT REFERENCES episodes(id) ON DELETE SET NULL,
  contestant_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contestants_season ON contestants(season_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season ON episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_tasks_episode ON tasks(episode_id);
CREATE INDEX IF NOT EXISTS idx_task_results_task ON task_results(task_id);
CREATE INDEX IF NOT EXISTS idx_task_results_contestant ON task_results(contestant_id);
CREATE INDEX IF NOT EXISTS idx_user_picks_user ON user_picks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_picks_season ON user_picks(season_id);
CREATE INDEX IF NOT EXISTS idx_bets_user ON bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_episode ON bets(episode_id);
CREATE INDEX IF NOT EXISTS idx_currency_transactions_user ON currency_transactions(user_id);
