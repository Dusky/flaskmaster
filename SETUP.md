# The Compound - Setup Guide

This guide will help you set up The Compound with a database and authentication.

## Option 1: Supabase (Recommended - Free & Easy)

Supabase provides both PostgreSQL database and authentication in one service.

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: the-compound
   - **Database Password**: (create a strong password and save it)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free

### Step 2: Get Your Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

3. Go to **Settings** → **Database**
4. Scroll down to **Connection String** → **URI**
5. Copy the connection string (it will have `[YOUR-PASSWORD]` placeholder)
6. Replace `[YOUR-PASSWORD]` with the database password you created earlier

### Step 3: Update Your .env File

Edit `/home/user/flaskmaster/.env`:

```env
# Database - Use your Supabase connection string
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Initialize the Database

Run these commands to set up your database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed initial data (contestants, season)
npm run db:seed
```

### Step 5: Configure Supabase Auth (Optional but Recommended)

By default, Supabase sends confirmation emails. For development, you can disable this:

1. Go to **Authentication** → **Settings** in Supabase dashboard
2. Scroll to **Email Auth**
3. **Disable** "Enable email confirmations" for easier testing

### Step 6: Test It Out!

```bash
npm run dev
```

Visit http://localhost:3000 and:
1. Click "Sign In"
2. Click "Create one" to register
3. Create an account
4. You should be redirected to the homepage with your currency showing!

---

## Option 2: Local PostgreSQL

If you prefer to run PostgreSQL locally:

### Step 1: Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

### Step 2: Create Database

```bash
# Access PostgreSQL
psql postgres

# Create database
CREATE DATABASE compound;

# Create user (optional)
CREATE USER compound_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE compound TO compound_user;

# Exit
\q
```

### Step 3: Update .env

```env
DATABASE_URL="postgresql://compound_user:your_password@localhost:5432/compound"

# You still need Supabase for auth, OR implement a different auth solution
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```

### Step 4: Initialize Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

**Note:** Without Supabase, authentication won't work. You'll need to implement an alternative auth solution (NextAuth.js, etc.).

---

## Available Database Commands

```bash
# Generate Prisma Client (run after schema changes)
npm run db:generate

# Push schema to database (development)
npm run db:push

# Create and run migrations (production-ready)
npm run db:migrate

# Seed the database with test data
npm run db:seed

# Open Prisma Studio (visual database editor)
npm run db:studio
```

---

## Verification Checklist

- [ ] Database tables created (check with `npm run db:studio`)
- [ ] Seed data loaded (5 contestants should exist)
- [ ] Can create an account
- [ ] Can login
- [ ] Currency shows in header after login
- [ ] Profile page loads with your stats

---

## Troubleshooting

### "Failed to fetch font" errors
These are warnings about Google Fonts not loading (likely network restrictions). The app uses fallback fonts and works fine.

### "Prisma client not found"
Run `npm run db:generate` to generate the Prisma client.

### "Can't connect to database"
- Check your `DATABASE_URL` is correct
- Make sure PostgreSQL is running
- Verify firewall/network settings

### "Supabase auth not working"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check that email confirmations are disabled in Supabase dashboard for testing
- Make sure the environment variables are prefixed with `NEXT_PUBLIC_`

### Database schema changes not showing
```bash
# Reset the database (⚠️ deletes all data)
npm run db:push -- --force-reset

# Re-seed
npm run db:seed
```

---

## Next Steps

Once authentication and database are working:

1. **Explore the seed data** - Open `npm run db:studio` to see the contestants
2. **Check your profile** - Visit http://localhost:3000/profile
3. **Read the specs** - Review `SPEC.md` and `DESIGN.md` for the full vision
4. **Start building** - Next phases include episode viewing, contestant selection, and betting!

---

## Production Deployment

For production (Vercel, etc.):

1. Use Supabase production instance
2. Set environment variables in your hosting platform
3. Run migrations: `npm run db:migrate`
4. Deploy!

Supabase free tier includes:
- 500 MB database
- 2 GB bandwidth
- 50,000 monthly active users
- Unlimited API requests

More than enough for initial launch!
