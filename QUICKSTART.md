# The Compound - Quick Start Guide

Get the game up and running in 5 minutes!

## Prerequisites

✅ Node.js 18+ installed
✅ PostgreSQL database (Supabase recommended - free tier works great)
✅ Supabase account for authentication

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```env
# Database (from Supabase or local PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step 3: Run Database Migrations

This will create all the tables (users, seasons, contestants, episodes, bets, etc.):

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create database schema
npx prisma migrate dev
```

If you encounter checksum errors, use:
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

## Step 4: Seed the Database

This creates Season 1 with 5 contestants and Episode 1 "The Tower of Babel":

```bash
npm run db:seed
```

You should see:
- ✅ Created season: 1
- ✅ Created contestant: Sarah Kim, David Park, Margaret Thompson, James Wilson, Elena Rodriguez
- ✅ Created episode: 1
- ✅ Created episode tasks and results

## Step 5: Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Create an Account & Play!

### First Time Setup:
1. Click "Create Account"
2. Register with email/password
3. Pick a contestant for Season 1
4. Navigate to **Season 1 → Episodes → Episode 1**
5. Watch the episode and place bets!

### How the Game Works:

#### 📺 **Watching Episodes**
- View episodes task-by-task (Opening → Prize Task → Tasks 1-3 → Live Task → Results)
- Read hilarious contestant narratives
- See scores and rankings

#### 💰 **Earning Currency**
- You earn currency = your contestant's points each episode
- Example: Your contestant scores 15 points → you earn 15 currency
- Currency shown in header (⚡ symbol)

#### 🎲 **Placing Bets**
- Bet on task winners while watching episodes
- Odds based on current contestant rankings (2x to 6x)
- Min bet: 10 currency, Max bet: 500 currency
- View your bets at `/bets`

#### 🏆 **Leaderboard**
- Compete with other players
- Ranked by total currency
- See everyone's picks and earnings at `/leaderboard`

#### 🔄 **Switching Contestants**
- Switch contestants mid-season for 100 currency
- Only during active seasons
- Go to Season page and click "Switch to This" on any contestant

## Step 7: Process Episode Rewards (Admin)

After watching Episode 1, process rewards and resolve bets:

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Get your episode ID:
   - Option A: Check the database
   - Option B: Use Prisma Studio: `npx prisma studio` → Episodes table
3. Enter the episode ID
4. Click "Process Rewards + Resolve Bets"

This will:
- Award currency to all players based on their contestant's performance
- Resolve all pending bets
- Pay out winners automatically

## 🎮 Full Game Flow Example

1. **Register** → Pick Sarah Kim as your contestant
2. **Episode 1** → Sarah scores 8 points total
3. **You earn** → 8 currency automatically (via admin reward processing)
4. **Place bet** → 50 currency on David Park to win Task 1 at 5x odds
5. **David wins** → You get paid 250 currency (50 × 5)
6. **Check leaderboard** → See your ranking vs other players
7. **Next episode** → Repeat!

## Database Management

### View Database
```bash
npx prisma studio
```

Opens a GUI at http://localhost:5555 to browse all tables

### Reset Database
```bash
npx prisma migrate reset
npm run db:seed
```

### Check Database Schema
```bash
npx prisma db pull
```

## Troubleshooting

### "Module not found: next-auth/react"
```bash
npm install next-auth
```

### "Prisma Client not initialized"
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### "Port 3000 in use"
The app will automatically use port 3001. Check terminal output for the actual URL.

### No episodes showing up
Make sure you ran the seed:
```bash
npm run db:seed
```

Check Prisma Studio to verify data exists:
```bash
npx prisma studio
```

## What's Included

**Season 1 Seed Data:**
- 5 Contestants with personalities and backstories
- Episode 1: "The Tower of Babel"
  - Prize Task: "Most Impressive Thing You Own"
  - Task 1: "Build the Tallest Tower" (includes David's legendary loophole!)

**Features Ready to Use:**
- ✅ User registration & authentication
- ✅ Contestant selection
- ✅ Episode viewing with full narratives
- ✅ Currency system
- ✅ Betting on tasks (2x-6x odds)
- ✅ Player leaderboards
- ✅ Contestant switching
- ✅ Bet history tracking
- ✅ Admin utilities for processing rewards

## Next Steps

Want more content?
- Add more episodes to the seed file
- Create Season 2 with new contestants
- Write more hand-crafted tasks
- Eventually: Integrate AI to generate episodes automatically (Phase 4)

## Need Help?

- Check `SPEC.md` for game mechanics
- Check `DESIGN.md` for UI/UX guidelines
- Check `README.md` for detailed tech documentation
- Issues? Report at https://github.com/anthropics/claude-code/issues

---

**Have fun! May your contestant win and your bets pay out! 🎯⚡**
