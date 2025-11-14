# The Compound

A fantasy sports browser game meets Taskmaster. Pick contestants, place bets, watch chaos unfold.

## 🎯 About

The Compound is a unique fantasy sports game where players pick contestants competing in Taskmaster-style challenges. Players earn currency based on their contestant's performance and can place bets on various outcomes. Episodes feature AI-generated content for endless replayability.

**Key Features:**
- Fantasy sports mechanics with Taskmaster-style challenges
- AI-generated contestants, tasks, and narratives
- Integrated betting system
- Deep stats tracking
- Text-based episode playback
- "Bureaucratic Game Show" aesthetic

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router, TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **Styling**: TailwindCSS with custom design system
- **State Management**: Zustand + React Query
- **Validation**: Zod

## 🚀 Getting Started

### Quick Start

**📋 For detailed setup instructions, see [SETUP.md](./SETUP.md)**

The setup guide includes step-by-step instructions for:
- Setting up Supabase (recommended - free & includes database + auth)
- Configuring local PostgreSQL (alternative)
- Database initialization and seeding
- Troubleshooting common issues

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended, or local PostgreSQL)
- Supabase account for authentication (free tier available)

### Quick Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd flaskmaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:
   ```env
   # Database
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

   # Supabase (for authentication)
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations (when database is set up)
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with fonts and header
│   ├── page.tsx           # Homepage/dashboard
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── StatDisplay.tsx
│   └── layout/            # Layout components
│       └── Header.tsx
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
├── SPEC.md                # Game mechanics specification
└── DESIGN.md              # UI/UX design specification
```

## 🎨 Design System

The Compound uses a "Bureaucratic Game Show" aesthetic with a dark theme.

### Colors
- **Background**: `#1a1d29` (Dark navy)
- **Surface**: `#252936` (Panels/cards)
- **Gold**: `#f4a261` (Currency, highlights)
- **Electric Blue**: `#2a9d8f` (Interactive elements)
- **Success**: `#06d6a0`
- **Danger**: `#e63946`

### Typography
- **Headers**: Space Grotesk
- **Body**: IBM Plex Sans
- **Monospace**: JetBrains Mono (stats, currency)

## 📊 Database Schema

The database includes models for:
- **Users**: Authentication and currency
- **Seasons**: Game seasons with Taskmaster/Assistant characters
- **Contestants**: AI-generated with hidden and tracked stats
- **Episodes**: Season episodes with generated content
- **Tasks**: Individual challenges with results
- **UserPicks**: Player's contestant selections
- **Bets**: Betting system with odds and payouts
- **StatDefinitions**: Dynamic stat tracking

See `prisma/schema.prisma` for the full schema.

## 🗺️ Roadmap

### Phase 1: MVP Core ✅ (Current)
- [x] Next.js project setup with TypeScript
- [x] TailwindCSS with custom design system
- [x] Prisma database schema
- [x] Core UI components (Card, Button, Layout)
- [x] Home dashboard with placeholder content

### Phase 2: Authentication & Database ✅
- [x] Supabase authentication setup
- [x] User registration and login
- [x] Database migrations and seed data
- [x] User profile pages
- [x] API routes for user data

### Phase 3: Core Game Features ✅
- [x] Season management (list, view, active season detection)
- [x] Contestant selection flow with modals
- [x] Season standings leaderboard
- [x] Individual contestant profile pages
- [x] User pick system (create and track)
- [x] Currency system foundation
- [x] Comprehensive stats tracking and display
- [x] Dynamic home dashboard based on user state
- [ ] Episode viewing interface
- [ ] Episode generation

### Phase 4: Betting System
- [ ] Betting interface
- [ ] Odds calculation
- [ ] Bet placement and resolution
- [ ] Betting history

### Phase 5: AI Integration
- [ ] LLM setup (Ollama/llama.cpp)
- [ ] Contestant generation
- [ ] Episode generation
- [ ] Task generation

## 🤖 AI Content Generation

The Compound uses a self-hosted LLM for content generation:

- **Models**: Llama 3.1 8B, Mistral 7B, or Qwen 2.5
- **Hosting**: Ollama or llama.cpp
- **Strategy**: Pre-generate content offline, store in database
- **Quality**: Human review before publishing

## 📝 Contributing

This is currently a solo project, but contributions are welcome! Please read the specifications in `SPEC.md` and `DESIGN.md` before contributing.

## 📄 License

[Your chosen license]

## 🎭 Credits

Inspired by:
- **Taskmaster** (UK) - For the challenge format and humor
- **Fantasy Sports** - For roster management mechanics
- **Blaseball** - For emergent narrative and stats obsession

---

**Built with ❤️ for chaos and competition**
