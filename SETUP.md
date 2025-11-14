# The Compound - Setup Guide

This guide will help you set up The Compound with a local PostgreSQL database and NextAuth.js authentication.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL (local installation)
- Terminal/command line access

---

## Step 1: Install PostgreSQL

### On macOS (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

### On Debian/Ubuntu:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### On Windows:
Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

---

## Step 2: Create the Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql
# Or on macOS/Windows just: psql postgres

# Create database and user
CREATE DATABASE compound;
CREATE USER compound_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE compound TO compound_user;

# Exit PostgreSQL
\q
```

---

## Step 3: Set Up Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Generate a secret for NextAuth
openssl rand -base64 32
```

Edit `.env` with your values:

```env
# Database - Use your PostgreSQL credentials
DATABASE_URL="postgresql://compound_user:your_secure_password@localhost:5432/compound?schema=public"

# NextAuth - Paste the generated secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-your-generated-secret-here"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Step 4: Install Dependencies

```bash
npm install
```

---

## Step 5: Initialize the Database

```bash
# Generate Prisma client
npm run db:generate

# Create tables in your database
npm run db:push

# Load test data (5 contestants, 1 season)
npm run db:seed
```

You should see output like:
```
🌱 Starting database seed...
✅ Created season: 1
✅ Created contestant: Sarah Kim
✅ Created contestant: David Park
✅ Created contestant: Margaret Thompson
✅ Created contestant: James Wilson
✅ Created contestant: Elena Rodriguez
✅ Created stat definitions
🎉 Database seed completed successfully!
```

---

## Step 6: Start the Development Server

```bash
npm run dev
```

Visit **http://localhost:3000**

---

## ✅ Verify Everything Works

1. **Home page loads** - You should see "THE COMPOUND" welcome screen
2. **Create an account**:
   - Click "Create Account"
   - Fill in username, email, password
   - Should auto-login and redirect to dashboard
3. **View contestants**:
   - Click "View Contestants" or visit `/seasons`
   - You should see 5 contestants from the seed data
4. **Pick a contestant**:
   - Click "Select" on any contestant
   - Confirm your pick
   - Should return to dashboard showing your pick
5. **Check your profile**:
   - Click your username in the header
   - Click "Profile"
   - Should show 1,000⚡ starting currency

---

## 🗄️ Available Database Commands

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

## 🐛 Troubleshooting

### Database Connection Errors

**Error: "invalid port number in database URL"**
- Check your `DATABASE_URL` format in `.env`
- Should be: `postgresql://user:password@host:port/database`

**Error: "Can't connect to database"**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Start PostgreSQL if needed
sudo systemctl start postgresql  # Linux
brew services start postgresql@15  # macOS
```

**Error: "password authentication failed"**
- Verify your password in the `DATABASE_URL`
- Try connecting manually: `psql -U compound_user -d compound -h localhost`
- If that fails, recreate the user in PostgreSQL

### Permission Errors

```bash
# Grant all permissions to your user
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE compound TO compound_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO compound_user;
\q
```

### Prisma Errors

**Error: "Prisma client not found"**
```bash
npm run db:generate
```

**Error: "Table already exists"**
```bash
# Reset the database (⚠️ deletes all data)
npm run db:push -- --force-reset
npm run db:seed
```

### NextAuth Errors

**Error: "[next-auth][error][SIGNIN_EMAIL_ERROR]"**
- Make sure `NEXTAUTH_SECRET` is set in `.env`
- Regenerate it: `openssl rand -base64 32`

**Error: "NEXTAUTH_URL is not defined"**
- Add to `.env`: `NEXTAUTH_URL="http://localhost:3000"`

### App Errors

**Error: "next: command not found"**
```bash
npm install
```

**Port 3000 already in use**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm run dev
```

---

## 🚀 Production Deployment

For production deployment:

1. **Set up production PostgreSQL**:
   - Use managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
   - Update `DATABASE_URL` with production credentials

2. **Set environment variables**:
   - Set all variables in your hosting platform
   - Generate new `NEXTAUTH_SECRET` for production
   - Update `NEXTAUTH_URL` to your domain

3. **Run migrations**:
   ```bash
   npm run db:migrate
   npm run db:seed  # Only if you want test data
   ```

4. **Deploy**:
   - Vercel, Railway, or your preferred platform
   - Make sure to set all environment variables
   - Build command: `npm run build`
   - Start command: `npm start`

---

## 📚 Next Steps

Once everything is running:

1. ✅ Create your account
2. ✅ Pick a contestant from Season 1
3. ✅ Explore contestant profiles and standings
4. ✅ Check your profile and currency
5. 🔜 Wait for betting and episode features!

---

## 🆘 Still Having Issues?

1. Check the error message carefully
2. Verify all environment variables are set
3. Make sure PostgreSQL is running
4. Try resetting the database: `npm run db:push -- --force-reset`
5. Check the browser console for JavaScript errors
6. Open an issue on GitHub with the error details

---

**You're all set!** 🎉

The Compound is now running locally with a self-hosted database and authentication.
