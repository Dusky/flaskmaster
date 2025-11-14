# Local Development Setup

## What Was Fixed

### 1. Database Connection Issue
**Problem**: The `pg` Node.js library couldn't connect to PostgreSQL using TCP/IP because it required SCRAM-SHA-256 authentication with a password.

**Solution**: Updated `.env` to use Unix socket connection instead:
```
DATABASE_URL="postgresql://postgres@/compound?host=/var/run/postgresql"
```

This uses peer authentication (no password required) instead of TCP/IP authentication.

### 2. Episode Page Error Handling
**Problem**: When API calls failed, the episode page would set error responses as state, causing runtime errors like "can't access property 'find', episode.tasks is undefined".

**Solution**: Added proper response validation in `fetchEpisodeData()`:
- Check `response.ok` before parsing JSON
- Check for `error` field in parsed responses
- Throw errors instead of setting invalid data to state

## Running the Application Locally

### Prerequisites
1. PostgreSQL 16 must be installed and running
2. Database `compound` must exist and be seeded with data
3. Node.js and npm must be installed

### Steps to Run

1. **Pull the latest changes:**
   ```bash
   git pull origin claude/fix-nextauth-import-018kMEEK9H1vRvVtyk958Uhi
   ```

2. **Install dependencies** (if you haven't already):
   ```bash
   npm install
   ```

   This will install the `pg` package and other dependencies needed for raw SQL queries.

3. **Ensure PostgreSQL is running:**
   ```bash
   service postgresql start
   # OR
   sudo service postgresql start
   ```

4. **Verify database exists and is seeded:**
   ```bash
   psql -U postgres -d compound -c "SELECT COUNT(*) FROM seasons;"
   ```

   Should return: `count: 1`

5. **Update your `.env` file:**
   Make sure your `.env` contains:
   ```
   DATABASE_URL="postgresql://postgres@/compound?host=/var/run/postgresql"
   ```

   **Important**: This uses Unix socket connection, not TCP/IP. Don't use `localhost:5432` format.

6. **Start the dev server:**
   ```bash
   npm run dev
   ```

7. **Access the application:**
   Open your browser to: `http://localhost:3000` (or whatever port Next.js assigns)

## Verified Working Endpoints

- `GET /api/seasons` - Lists all seasons with contestants
- `GET /api/seasons/season1` - Season 1 details
- `GET /api/seasons/season1/episodes/1` - Episode 1 "The Tower of Babel" with full task data
- Homepage - Renders successfully

## Database Setup (If Not Done Yet)

If you need to set up the database from scratch:

```bash
# Create database
psql -U postgres -c "CREATE DATABASE compound;"

# Run migrations
psql -d compound -U postgres -f prisma/manual_migration.sql

# Seed data
psql -d compound -U postgres -f prisma/seed_data.sql
psql -d compound -U postgres -f prisma/episode_seed.sql
psql -d compound -U postgres -f prisma/task1_seed.sql
```

## Troubleshooting

### "Module not found: Can't resolve 'pg'"
Run: `npm install`

### "ECONNREFUSED 127.0.0.1:5432"
PostgreSQL is not running. Start it with:
```bash
service postgresql start
```

### "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"
Your `.env` is using TCP/IP connection. Change it to use Unix socket:
```
DATABASE_URL="postgresql://postgres@/compound?host=/var/run/postgresql"
```

### Episode page showing "Episode not found" or errors
Check the dev server console logs for API errors. The error handling has been improved to show clearer error messages.

## Next Steps for Testing the Game

1. **Register/Login** - Create a user account
2. **Pick a Contestant** - Navigate to Season 1 and select your contestant
3. **Watch Episodes** - Click on Episode 1 to see the episode viewer with task-by-task navigation
4. **Place Bets** - If logged in, you'll see betting cards on each task (when episode is not completed)
5. **Check Leaderboard** - View rankings of all players

## Technical Notes

- All API routes use **raw SQL queries** via the `pg` library (not Prisma Client)
- Database fields use **snake_case**, but API responses transform to **camelCase**
- Next.js 15 requires **awaiting params** in dynamic routes
- Episode status determines whether betting is available
- Currency is earned 1:1 with contestant points when episodes are processed
