# Project Specification: The Compound
## Fantasy Taskmaster Sports Browser Game

---

## 1. CORE CONCEPT

A browser-based fantasy sports game where players pick contestants competing in Taskmaster-style challenges. Players earn currency based on their contestant's performance and can place bets on various outcomes.

**Key Differentiators:**
- Pure roster management (hands-off, no mid-episode intervention)
- AI-generated contestants, tasks, and narratives
- Heavy stats tracking with emergent properties
- Integrated betting system
- Text-based episode playback
- Self-hosted LLM for unlimited content generation

---

## 2. GAME LOOP

### Season Structure
- **5 contestants** total per season (small, focused roster)
- **5-6 episodes** per season
- Each episode follows classic Taskmaster format
- Points accumulate across episodes
- Season champion is crowned at the end

### Player Actions Per Season
1. **Season Start**: Review 5 AI-generated contestants (backstory, personality only - NO visible stats)
2. **Pick One**: Select a single contestant to back for the season
3. **Optional Switch**: Pay currency to switch contestants between episodes
4. **Bet**: Place bets before and during episodes
5. **Watch**: View text-based episode playback
6. **Earn**: Collect currency based on performance and bet outcomes
7. **Repeat**: New season begins with fresh contestants

### Episode Structure (Following Taskmaster Format)
1. Opening banter (Taskmaster + Assistant + contestants)
2. **Prize Task** - All 5 present their prize → scored
3. Banter interlude
4. **Task 1** (pre-filmed) - All 5 attempts shown → scored
5. Banter interlude
6. **Task 2** (pre-filmed) - All 5 attempts shown → scored
7. Banter interlude
8. **Task 3** (pre-filmed) - All 5 attempts shown → scored
9. Banter interlude
10. **Live Task** - All 5 perform → scored
11. Episode scoring + tie-breaker if needed
12. Episode winner declared
13. Series standings updated

---

## 3. BETTING SYSTEM

### Betting Windows
**Before Episode Starts:**
- Episode winner
- Exact episode scores (bonus for being exact)
- Series winner (ongoing)
- Over/under on total episode points

**During Episode (Between Each Task):**
- Who wins the specific upcoming task
- Score margin for a task
- Disqualification/chaos outcomes ("Will anyone get DQ'd?")
- Specific contestant performance ("Will Sarah score 1 point?")

### Betting Lock Timing
- **Prize Task**: Locks just before first contestant presents
- **Each Regular Task**: Locks after task is revealed, before first attempt is shown
- **Live Task**: Locks before performance begins

### Payout System
- Standard odds-based payouts
- **Exact score bonus**: Extra payout for predicting exact point totals
- Currency is the only reward (no real money)

---

## 4. THE COMPOUND (SETTING)

### Main Characters (Generated ONCE, persist across all seasons)
**The Taskmaster** (judge)
- Authoritative, deadpan, arbitrary but fair
- Has scoring biases that affect outcomes
- Personality similar to Greg Davies on Taskmaster

**The Assistant** (helper)
- Reads tasks, provides commentary
- Gleefully chaotic energy, fake sympathy
- Personality similar to Alex Horne on Taskmaster

### Locations (Base Set - Expandable)
1. **Main Hall** - Where judging happens, studio-style
2. **Courtyard** - Outdoor tasks, physical challenges
3. **Workshop** - Tools, materials, messy creative work
4. **Storage Room** - Cluttered, confined space challenges
5. **Rooftop** - Height-based, visibility tasks
6. **Back Room** - Mysterious, flexible space

### Task Delivery
Simple cards left in locations. AI describes: "Sarah enters the Workshop and finds a card on the workbench."

---

## 5. AI GENERATION REQUIREMENTS

### Generated Once Per Season (5 Contestants)
**Each Contestant Needs:**
- Name
- Portrait/avatar (optional - could be generated image or placeholder)
- Personality archetype (AI-generated, part of backstory)
- Detailed backstory (200-300 words)
- Voice/tone for their attempts and banter

**Hidden Stats (Never Shown to Players):**
- Creativity: 1-10
- Physical Ability: 1-10
- Lateral Thinking: 1-10
- Confidence: 1-10
- Risk-Taking: 1-10
- Panic Resistance: 1-10
- Rule Following: 1-10
- (Other stats as needed)

**Tracked Stats (Visible, Accumulate Over Time):**
- Total points earned
- Average points per episode
- Tasks won
- Times awarded 5 points
- Times awarded 1 point
- Disqualifications
- Rule violations
- Times used unconventional solution
- Average completion time
- Objects destroyed
- **AI can add new tracked stats** as it generates content

### Generated Per Episode

**Opening Banter:**
- Natural conversation between Taskmaster, Assistant, and all 5 contestants
- Sets tone, references previous episodes if applicable
- 2-3 paragraphs

**Prize Task:**
- Theme (e.g., "Best thing you'd never use", "Most impressive scar")
- Each contestant's prize choice with explanation (50-100 words each)
- Taskmaster's commentary and scoring
- Banter reactions

**3 Regular Tasks:**
For each task:
- Task description/rules
- Location where it takes place
- Each contestant's approach and execution (150-250 words per contestant)
- Taskmaster's scoring commentary
- Final scores (1-5 points, standard Taskmaster scoring)
- Potential disqualifications for rule violations
- Banter between attempts

**Live Task:**
- Task description
- Each contestant's performance (100-150 words each)
- Real-time banter
- Scoring

**Episode Wrap-Up:**
- Final scores
- Tie-breaker if needed (additional quick task, AI-generated on the fly)
- Episode winner declaration
- Series standings update
- Closing banter

### Task Generation Guidelines
Tasks must have:
- **Clear completion criteria** (measurable win condition)
- **Exploitable ambiguity** (rules that can be interpreted creatively)
- **Variety in type**: creative, physical, lateral thinking, comedic, performance
- **Time-based or completion-based** measurement
- **Taskmaster-style humor** (absurd premises, unnecessary constraints)

**Task Type Mix (Per Episode):**
- 1-2 creative/artistic tasks
- 1-2 physical/dexterity tasks
- 1 lateral thinking/puzzle task
- Prize task (subjective judging)
- Live task (pressure/performance)

**Starting Approach:**
- Hand-written task bank for MVP (20-30 tasks)
- Test AI generation quality
- Migrate to AI generation with validation system
- Eventually: Hybrid system (curated + AI-generated)

---

## 6. SIMULATION MECHANICS

### How Tasks Are Executed (Behind the Scenes)

**Step 1: Task Generation**
AI generates/selects task with clear rules and win conditions

**Step 2: Contestant Simulation**
For each contestant:
1. AI reads their personality + hidden stats
2. Determines their interpretation of the task
3. Simulates their approach based on stats:
   - High Creativity → unusual solutions
   - Low Rule Following → might bend/break rules
   - High Lateral Thinking → finds loopholes
   - Low Confidence → second-guesses, changes approach
   - High Risk-Taking → attempts dangerous/ambitious methods
4. Rolls for success/failure based on relevant stats
5. Determines completion time and result quality
6. Checks for rule violations or disqualifications

**Step 3: Narrative Generation**
AI writes entertaining description of what happened (150-250 words per contestant)

**Step 4: Taskmaster Scoring**
- AI considers Taskmaster's personality/biases
- Awards 1-5 points based on:
  - Objective success (did they complete it?)
  - Subjective entertainment (was it funny/creative?)
  - Taskmaster's mood/preferences
- Can award bonus points or deduct for violations

**Step 5: Stats Update**
- Update all tracked stats
- AI can flag new interesting stats to track

---

## 7. CURRENCY & PROGRESSION

### Currency Sources
- Contestant performance (points = currency earned)
  - Example: Your contestant scores 15 points this episode = 15 currency earned
- Betting winnings
- (Optional) Daily login bonuses
- (Optional) Achievement rewards

### Currency Sinks
- **Switching contestants mid-season** (primary sink)
- Entry fees for premium leagues (future feature)
- Cosmetic profile customization (future feature)
- Scouting reports on upcoming contestants (future feature)
- Additional bet bankroll (future feature)

**For MVP:** Keep it simple - earn from performance + betting, spend to switch contestants.

---

## 8. STATS SYSTEM

### Philosophy
- **Most stats are tracked but not explicitly shown** during initial contestant selection
- Stats emerge over time through performance
- AI can dynamically add new stats as interesting patterns emerge
- Stats feed into community discussion and betting strategy

### Predefined Tracked Stats (Always Visible)

**Basic Performance:**
- Total points
- Average points per episode
- Tasks won
- Episode wins
- Series wins

**Scoring Patterns:**
- Times awarded 5 points
- Times awarded 4 points
- Times awarded 3 points
- Times awarded 2 points
- Times awarded 1 point
- Bonus points awarded
- Points deducted

**Behavior:**
- Disqualifications
- Rule violations
- Times used unconventional solution
- Times followed obvious approach
- Average completion time
- Tasks abandoned

**Chaos Metrics:**
- Objects destroyed
- Injuries sustained
- Times required Assistant intervention
- Apologies made
- Times argued with Taskmaster

**Personality Indicators:**
- Times mentioned their background/job
- Confidence trajectory (rising/falling)
- Risk-taking instances
- Panic moments

### AI-Generated Stats (Dynamic)
AI can flag interesting patterns and create new stat categories:
- "Times brought up their fear of heights"
- "Paper clips used across all tasks"
- "Percentage of tasks where they asked for clarification"
- "Average words spoken during attempt narration"

**Implementation:** AI includes a "new_stats_detected" field in its generation output with suggested new tracking categories.

---

## 9. TECHNICAL ARCHITECTURE

### Constraints
- Self-hosted LLM (no paid API costs)
- Browser-based game
- Text-based content (no video)
- Lightweight enough for MVP solo development

### Recommended Stack

**Frontend:**
- Next.js (React framework) or SvelteKit
- TailwindCSS for styling
- Deployed on Vercel (free tier)

**Backend:**
- Next.js API routes (serverless) OR Express.js
- PostgreSQL database (Supabase/Railway/Neon free tier)
- Optional: Redis for caching/sessions

**Authentication:**
- Supabase Auth OR NextAuth.js
- Simple email/password for MVP

**AI Generation:**
- Self-hosted LLM (Llama 3.1/3.3, Mistral, Qwen, or similar)
- Separate generation service/script
- Pre-generate content OR generate on-demand (TBD based on model speed)

**Content Storage:**
- Generated episodes stored in PostgreSQL as JSON/text
- Cached after generation (never regenerate the same content)

### Database Schema (Simplified)

**users**
- id, username, email, password_hash
- currency_balance
- created_at

**seasons**
- id, season_number, start_date, end_date, status
- taskmaster_name, taskmaster_personality
- assistant_name, assistant_personality

**contestants**
- id, season_id, name, backstory, personality_archetype
- hidden_stats (JSON: creativity, physical, lateral_thinking, etc.)
- tracked_stats (JSON: total_points, tasks_won, dqs, etc.)

**episodes**
- id, season_id, episode_number, release_date
- content (JSON: all banter, tasks, attempts, scoring)
- status (pre-generated, live, completed)

**tasks**
- id, episode_id, task_number, task_type
- description, location, rules
- results (JSON: each contestant's attempt + score)

**user_picks**
- id, user_id, season_id, contestant_id
- picked_at, currency_spent_on_switches

**bets**
- id, user_id, episode_id, bet_type, bet_target
- amount, odds, potential_payout, result, payout

**stats_definitions**
- id, stat_name, description, category
- ai_generated (boolean)

### Generation Pipeline Options

**Option A: Pre-Generate Everything**
- Generate entire season before it starts
- Store in database
- Episodes "air" on schedule by changing status
- **Pros:** Consistent quality, no generation delays
- **Cons:** Can't react to community feedback

**Option B: Generate Episodes On-Demand**
- Generate episode just before it airs
- Cache after generation
- **Pros:** Could theoretically incorporate community input
- **Cons:** Generation delay risk, more complex scheduling

**Option C: Hybrid (Recommended for MVP)**
- Pre-generate contestants at season start
- Pre-generate episodes 1-2 days before air date
- Gives time for quality control
- Cache everything permanently

---

## 10. MVP FEATURE SCOPE

### Phase 1: Core Viewing Experience
**Goal:** Players can watch generated episodes

- [ ] User registration/login
- [ ] Generate 1 season (5 contestants, 5 episodes) using hand-written tasks
- [ ] Basic episode viewing interface (text display)
- [ ] Season standings page
- [ ] Contestant profile pages with stats

### Phase 2: Roster Management
**Goal:** Players can pick contestants and earn currency

- [ ] Season start: display 5 contestants
- [ ] Player picks 1 contestant
- [ ] Currency earned based on contestant's episode performance
- [ ] Leaderboard of players by total currency
- [ ] Mid-season contestant switching (with currency cost)

### Phase 3: Betting System
**Goal:** Players can bet on outcomes

- [ ] Pre-episode betting interface
- [ ] During-episode betting (between tasks)
- [ ] Bet resolution and payout
- [ ] Bet history page

### Phase 4: AI Task Generation
**Goal:** Move from hand-written to AI-generated tasks

- [ ] Prompt engineering for task generation
- [ ] Quality validation system
- [ ] Gradual rollout (mix hand-written + AI)

### Phase 5: Enhanced Stats & Community
**Goal:** Deepen engagement

- [ ] Expanded stats dashboard
- [ ] AI-generated new stat categories
- [ ] Community leaderboards
- [ ] Achievement system

### Future Features (Post-MVP)
- Multiple concurrent seasons
- Private leagues with friends
- Premium cosmetics shop
- Historical season archives
- Advanced scouting tools
- Mobile app
- Generated contestant portraits (Stable Diffusion)
- Audio narration (TTS)

---

## 11. LLM INTEGRATION DETAILS

### Model Selection Criteria
- Must run on your hardware
- Needs strong instruction following
- Good at creative writing + consistent character voices
- Context window: 8K+ tokens (full episode generation)

**Candidates:**
- Llama 3.1 70B (best quality, needs strong GPU)
- Llama 3.1 8B (good balance)
- Mistral 7B (efficient)
- Qwen 2.5 (strong instruction following)

**Start with:** Lightweight model (8B) for testing, scale up if quality isn't sufficient

### Generation Workflow

**Season Generation (Run Once):**
```
Prompt: Generate 5 contestants for a Taskmaster-style competition
Output: JSON with names, backstories, personalities, hidden stats
Store: Database
```

**Episode Generation (Per Episode):**
```
Input: 
- Taskmaster + Assistant personalities
- All 5 contestants (personalities, current stats)
- Task bank (hand-written or generated)
- Current series standings

Process:
1. Generate opening banter
2. Generate prize task + results
3. For each of 3 regular tasks:
   - Select/generate task
   - Simulate each contestant's attempt
   - Generate narrative descriptions
   - Determine scoring
4. Generate live task + results
5. Generate wrap-up banter
6. Update contestant stats

Output: Complete episode as structured JSON
Store: Database (cached permanently)
```

### Prompt Engineering Needs
You'll need well-structured prompts for:
- Contestant generation
- Task generation (if not hand-written)
- Banter generation (conversational, in-character)
- Attempt simulation (narratively compelling)
- Scoring decisions (consistent with Taskmaster personality)
- Stats flagging (identifying interesting patterns)

**Tip:** Use JSON schema outputs to ensure consistent structure for database storage.

---

## 12. CONTENT CADENCE

### Episode Release Schedule (TBD - Depends on Generation Speed)

**Options:**

**Daily:**
- High engagement, always something to check
- Requires very fast generation OR extensive pre-generation
- Risk of burnout

**3x per week (Mon/Wed/Fri):**
- Balanced engagement
- Allows time for generation + quality control
- Sustainable for solo dev

**Weekly:**
- Easy to maintain
- Allows polished content
- Lower engagement, harder to build habits

**Recommended for MVP:** Start with **weekly episodes**. Adjust based on:
- LLM generation speed
- Content quality consistency
- Player retention data

### Season Length
- 5-6 episodes per season
- 5-6 weeks at weekly cadence
- 2-3 weeks break between seasons for:
  - Season wrap-up content
  - Next season generation
  - System improvements

---

## 13. RISKS & MITIGATION

### Content Quality Risk
**Risk:** AI generates boring/nonsensical tasks or narratives
**Mitigation:**
- Start with hand-written task bank
- Human review of generated content before going live
- Iterative prompt engineering
- Quality scoring system (flag bad outputs)

### Engagement Risk
**Risk:** Players lose interest after novelty wears off
**Mitigation:**
- Strong stats system (long-term tracking hooks)
- Betting adds variability and tension
- Regular content updates (new seasons)
- Community features (leaderboards, achievements)

### Technical Risk
**Risk:** LLM too slow/unreliable for consistent content
**Mitigation:**
- Pre-generation strategy
- Fallback content bank
- Gradual rollout of AI generation

### Economic Balance Risk
**Risk:** Currency/betting economy breaks (too easy to earn, too hard, etc.)
**Mitigation:**
- Extensive playtesting
- Adjustable currency rewards
- Seasonal currency resets or inflation control

---

## 14. SUCCESS METRICS

### MVP Goals
- 100+ registered users
- 80% of users pick a contestant in Season 1
- 50% of users place at least one bet
- 30% retention week-over-week
- Consistent content generation (0 missed episode releases)

### Long-Term Goals
- 1,000+ active users per season
- Thriving community discussion (Reddit/Discord)
- Self-sustaining economy (currency in/out balanced)
- 10+ seasons generated with increasing quality
- Potential monetization (cosmetics, premium features)

---

## 15. OPEN QUESTIONS

1. **Episode timing:** Generate in advance or on-demand?
2. **Currency balance:** What's the right earning rate vs. switching cost?
3. **Bet odds:** Fixed odds or dynamic based on community betting patterns?
4. **Contestant portraits:** Text-only or generate images?
5. **Season gaps:** Continuous seasons or breaks in between?
6. **LLM model:** Which specific model gives best quality/speed tradeoff?
7. **Task variety:** How many hand-written tasks needed before AI takeover?
8. **Multi-season progression:** Do stats carry over? Should there be "legendary" contestants?

---

## 16. NEXT STEPS

### Immediate Actions (For Claude Code)
1. **Set up project structure** (Next.js + PostgreSQL recommended)
2. **Design database schema** (users, seasons, contestants, episodes, bets)
3. **Create basic auth system** (Supabase Auth or NextAuth)
4. **Build episode viewing UI** (simple text display)
5. **Write 20-30 hand-written tasks** for initial testing
6. **Create contestant generation prompt** for LLM
7. **Build episode generation script** (hand-written tasks → full episode)
8. **Test generation pipeline** with 1 complete season
9. **Implement contestant picking** (season start flow)
10. **Add currency system** (earn from performance)

### Development Philosophy
- **Start simple, iterate based on what works**
- **Quality over quantity** (one good episode > five mediocre ones)
- **Playtest early and often** (test economy, engagement)
- **Don't over-engineer** (build features when needed, not speculatively)

---

## 17. INSPIRATION & REFERENCES

**Taskmaster** (obviously)
- Episode structure and pacing
- Task variety and creativity
- Judge/assistant dynamic

**Fantasy Sports**
- Roster management
- Point accumulation systems
- Waiver wire/trading mechanics (future)

**Blaseball** (loosely)
- Stats tracking obsession
- Emergent narratives
- Community-driven chaos

**Keep What Works, Avoid What Doesn't:**
- ✅ Clear win/loss conditions
- ✅ Meaningful player decisions
- ✅ Short-term and long-term goals
- ❌ Pay-to-win mechanics
- ❌ Overly complex UI
- ❌ Grinding for minimal rewards

---

## CONCLUSION

This is a unique concept with strong potential for community engagement. The combination of fantasy sports mechanics, AI-generated content, and Taskmaster-style humor creates something that doesn't exist in the current market.

**Core Appeal:**
- Low time investment (check in, make picks, watch episodes)
- High entertainment value (funny content, betting tension)
- Long-term progression (stats accumulation, currency growth)
- Social potential (discussing contestants, betting strategies)

**The path to MVP is clear:**
1. Build basic viewing experience
2. Add picking/currency mechanics
3. Implement betting
4. Refine AI generation
5. Iterate based on player feedback

**Key to success:** Consistent, quality content generation. If the episodes are funny and engaging, everything else falls into place.

Good luck building The Compound! 🎯
