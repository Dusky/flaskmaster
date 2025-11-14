
# UI/UX Design Specification: The Compound
## "Bureaucratic Game Show" Aesthetic

---

## DESIGN CONCEPT

**Visual Identity:** Official documents from a mysterious competitive facility  
**Tone:** Authoritative yet playful, bureaucratic but theatrical  
**Inspiration:** Government briefings meet game show drama

The Compound exists in a world where absurd challenges are treated with complete seriousness. The UI reflects this - it's the interface for an official, ongoing competition, with the gravitas of a research facility but the excitement of a game show.

---

## COLOR PALETTE

### Primary Colors
```
Background:     #1a1d29  (Dark navy, almost charcoal)
Surface:        #252936  (Slightly lighter panels/cards)
Text Primary:   #e8e6e3  (Off-white/cream, easy on eyes)
Text Secondary: #9b9a97  (Muted gray for less important text)
```

### Accent Colors
```
Gold:           #f4a261  (Currency, winners, highlights)
Electric Blue:  #2a9d8f  (Betting, interactive elements)
Red:            #e63946  (Locks, warnings, disqualifications)
Green:          #06d6a0  (Success, won bets, positive outcomes)
```

### Contestant Colors (Unique ID per contestant)
```
Contestant 1:   #e76f51  (Coral)
Contestant 2:   #8338ec  (Purple)
Contestant 3:   #3a86ff  (Blue)
Contestant 4:   #fb5607  (Orange)
Contestant 5:   #06a77d  (Teal)
```

Each contestant gets assigned one of these for visual tracking throughout episodes.

---

## TYPOGRAPHY

### Font Stack

**Headers & UI Elements:**
```css
font-family: 'Space Grotesk', 'Inter', -apple-system, sans-serif;
```
- Bold, geometric sans-serif
- Use for: Navigation, buttons, contestant names, task titles
- Weights: 500 (medium), 700 (bold)

**Body Text (Episode Content):**
```css
font-family: 'IBM Plex Sans', 'Inter', -apple-system, sans-serif;
```
- Highly readable, slightly humanist
- Use for: Episode narratives, backstories, descriptions
- Weights: 400 (regular), 600 (semibold)

**Stats & Numbers:**
```css
font-family: 'JetBrains Mono', 'Courier New', monospace;
```
- Monospace for data clarity
- Use for: Point totals, currency, timers, odds
- Weights: 400 (regular), 700 (bold)

### Type Scale
```
Hero/Display:   48px / 3rem     (Season titles, major headers)
H1:             36px / 2.25rem  (Page titles)
H2:             28px / 1.75rem  (Section headers)
H3:             20px / 1.25rem  (Card titles, contestant names)
Body Large:     18px / 1.125rem (Episode content)
Body:           16px / 1rem     (Default text)
Body Small:     14px / 0.875rem (Metadata, timestamps)
Caption:        12px / 0.75rem  (Fine print, labels)
```

### Line Height
```
Headers:        1.2
Body text:      1.7
Compact UI:     1.4
```

---

## SPACING SYSTEM

Use an 8px base unit system (Tailwind default works perfectly)

```
xs:   4px   (tight padding, icon gaps)
sm:   8px   (small padding)
md:   16px  (default padding)
lg:   24px  (section spacing)
xl:   32px  (major section breaks)
2xl:  48px  (page sections)
3xl:  64px  (hero sections)
```

---

## COMPONENT SPECIFICATIONS

### 1. Card Component
The fundamental building block - used for contestants, episodes, stats, etc.

```
Background: Surface color (#252936)
Border: 1px solid rgba(255,255,255,0.1)
Border Radius: 12px
Padding: 24px (lg)
Shadow: 0 4px 6px rgba(0,0,0,0.1)

Hover state:
  Border: 1px solid rgba(255,255,255,0.2)
  Shadow: 0 8px 12px rgba(0,0,0,0.2)
  Transform: translateY(-2px)
  Transition: all 0.2s ease
```

**Variants:**
- **Interactive Card:** Cursor pointer, hover effects
- **Static Card:** No hover effects, for display only
- **Highlighted Card:** Gold border for "your contestant" or active selections

### 2. Button Component

**Primary Button (CTAs like "Place Bet", "Select Contestant")**
```
Background: Gold (#f4a261)
Text: Dark navy (#1a1d29)
Padding: 12px 24px
Border Radius: 8px
Font: Space Grotesk, 700 weight
Shadow: 0 2px 4px rgba(244,162,97,0.3)

Hover:
  Background: Lighter gold (#f7b77e)
  Shadow: 0 4px 8px rgba(244,162,97,0.4)
  Transform: translateY(-1px)

Disabled:
  Background: #3a3d4a
  Text: #6b6e7a
  Cursor: not-allowed
```

**Secondary Button (Less important actions)**
```
Background: transparent
Border: 1px solid #f4a261
Text: Gold (#f4a261)
Padding: 12px 24px
Border Radius: 8px

Hover:
  Background: rgba(244,162,97,0.1)
  Border: 1px solid #f7b77e
```

**Danger Button (Irreversible actions)**
```
Background: Red (#e63946)
Text: Off-white (#e8e6e3)
[Same padding/radius as primary]

Hover:
  Background: Lighter red (#f05959)
```

### 3. Stat Display Component

Used throughout for showing numbers + context

```
┌─────────────────┐
│  TOTAL POINTS   │  ← Label (Caption size, secondary text)
│      47         │  ← Value (H2 size, monospace, gold)
│    3rd / 5      │  ← Context (Body small, secondary text)
└─────────────────┘
```

**Layout:**
- Vertical stack
- Center aligned
- Label in all caps
- Value prominent with color accent
- Optional context line below

### 4. Contestant Card

```
┌─────────────────────────────────┐
│  [Avatar/Photo placeholder]     │  ← 200x200px rounded
│                                 │
│  MARGARET THOMPSON              │  ← H3, bold
│  "The Overthinker"              │  ← Body small, italic, secondary
│                                 │
│  Former escape room designer    │  ← Body, first line of backstory
│  who approaches every task...   │
│                                 │
│  [Read Full Bio] [Select] ▶    │  ← Buttons
└─────────────────────────────────┘
```

**Variants:**
- **Selection Mode:** Includes "Select" button, hover effects
- **Roster Display:** Shows current stats, no selection
- **Your Pick:** Gold border, "✓ Your Contestant" badge

### 5. Episode Navigation

Horizontal tabs with progress indicators

```
[Opening] → [Prize Task] → [Task 1] → [Task 2] → [Task 3] → [Live Task] → [Results]
   ✓            ✓            ●          ○          ○            ○            ○

✓ = Completed (green)
● = Active (gold)
○ = Upcoming (gray)
```

**Styling:**
- Pills with borders
- Active pill has gold background
- Completed pills have checkmark
- Click to jump to section (if unlocked)

### 6. Task Viewer

```
┌─────────────────────────────────────────────┐
│  📍 TASK 1 - THE WORKSHOP                   │  ← Header with icon, H2
│                                             │
│  "Make the tallest tower using only the    │  ← Task text, body large
│   items in this room. You have 10 minutes."│     Serif font, indented
│                                             │
│  Time-based • Physical                      │  ← Task tags
├─────────────────────────────────────────────┤
│  [Place Bet] ⏰ Locks in 2m 34s            │  ← Betting CTA (if open)
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ┌─┐ MARGARET THOMPSON          47 points  │  ← Contestant header
│  │●│ 3rd place                              │    with color accent
│  └─┘                                        │
├─────────────────────────────────────────────┤
│                                             │
│  Margaret enters the workshop and          │  ← Narrative text
│  immediately spots a ladder. "Oh perfect,"  │    Body large, serif
│  she says with perhaps too much confidence. │    Good line height
│  She spends three minutes trying to make   │
│  the ladder stand on its own before...     │
│                                             │
│  [Continue reading ↓]                       │  ← Expand button
│                                             │
├─────────────────────────────────────────────┤
│  Time: 9m 47s     Result: 4.2 meters       │  ← Stats row
│  Score: 4 points                            │
└─────────────────────────────────────────────┘
```

### 7. Betting Slip

Modal or slide-out panel

```
┌─────────────────────────────────────────┐
│  PLACE BET                        [✕]   │  ← Header with close
├─────────────────────────────────────────┤
│  Task 1: Who will win?                  │
│                                         │
│  ○ Sarah Kim             3.2x          │  ← Radio buttons
│  ● Margaret Thompson     4.5x ←        │    Selected = gold fill
│  ○ David Park            2.1x          │
│  ○ James Wilson          2.8x          │
│  ○ Elena Rodriguez       5.0x          │
│                                         │
├─────────────────────────────────────────┤
│  BET AMOUNT                             │
│  ┌─────────────┐                        │
│  │ 50 ⚡       │  [Max: 450]           │  ← Input with currency
│  └─────────────┘                        │
│                                         │
│  Potential Payout: 225 ⚡               │  ← Calculated live
│                                         │
├─────────────────────────────────────────┤
│  [Cancel]         [Place Bet]          │  ← Action buttons
└─────────────────────────────────────────┘
```

### 8. Countdown Timer

Used for betting locks, episode releases

```
⏰ Locks in 2m 34s
```

**Styling:**
- Inline with other elements
- Monospace font
- Color transitions:
  - >5min: Secondary text color
  - 1-5min: Yellow/gold
  - <1min: Red + pulse animation

**States:**
```
Open:   "⏰ Locks in 2m 34s"
Locked: "🔒 Betting closed"
```

### 9. Status Badges

Small pills showing state

```
┌──────┐  ┌──────┐  ┌──────┐
│ LIVE │  │ NEXT │  │ ENDED│
└──────┘  └──────┘  └──────┘
```

**Styling:**
- 6px padding horizontal, 4px vertical
- 4px border radius
- All caps, caption size
- Background color indicates status:
  - Live: Green background
  - Next: Blue background
  - Ended: Gray background

### 10. Currency Display

Always visible in header

```
⚡ 450
```

**Styling:**
- Monospace font
- Gold color
- Larger size for emphasis
- Update with smooth count-up animation when changed

---

## LAYOUT PATTERNS

### Standard Page Layout

```
┌────────────────────────────────────────────┐
│  [Header: Logo, Nav, Currency, User]      │  ← Sticky, 60px height
├────────────────────────────────────────────┤
│                                            │
│  ┌────────────────────────────────────┐   │
│  │                                    │   │
│  │  [Page Content]                    │   │
│  │  Max width: 1200px                 │   │
│  │  Centered                          │   │
│  │  Padding: 32px                     │   │
│  │                                    │   │
│  └────────────────────────────────────┘   │
│                                            │
└────────────────────────────────────────────┘
```

### Sidebar Layout (Desktop only)

```
┌─────────────┬──────────────────────────────┐
│             │                              │
│  [Sidebar]  │  [Main Content]             │
│  280px      │  Remaining space            │
│  Sticky     │                              │
│             │                              │
│  - Nav      │  - Episodes                  │
│  - Stats    │  - Full content              │
│  - Quick    │                              │
│    Actions  │                              │
│             │                              │
└─────────────┴──────────────────────────────┘

Mobile: Stack vertically, sidebar becomes header
```

### Card Grid Layout

```
┌────────┐  ┌────────┐  ┌────────┐
│  Card  │  │  Card  │  │  Card  │
│        │  │        │  │        │
└────────┘  └────────┘  └────────┘

Desktop: 3 columns (gap: 24px)
Tablet:  2 columns (gap: 16px)
Mobile:  1 column (gap: 16px)
```

---

## SPECIFIC PAGE DESIGNS

### 1. Dashboard (Home)

```
┌─────────────────────────────────────────────┐
│  THE COMPOUND                    [User ▼]   │
│  Season 3 • Episode 2 of 5    ⚡ 450        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  YOUR CONTESTANT                            │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  ┌─┐  MARGARET THOMPSON             │   │  ← Large highlighted card
│  │  │●│  3rd place • 47 points         │   │     Gold border
│  │  └─┘                                 │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │   │  ← Progress bar
│  │  Last episode: 18 points (1st) 🥇   │   │
│  │                                      │   │
│  │  [View Full Stats]                   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  CURRENT EPISODE                            │
│                                             │
│  Episode 2: "The Egg Incident"             │
│  [Opening] [Prize] [T1] [T2] [T3] [Live]   │  ← Progress
│                    ●                        │
│                                             │
│  Currently viewing: Task 1                  │
│                                             │
│  [Continue Watching]  [Place Bets]         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  UPCOMING                                   │
│                                             │
│  Episode 3 airs in 4d 3h 22m               │
│  Betting opens in 3d 23h 45m               │
└─────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│  YOUR RANK   │  ACTIVE BETS │  WIN RATE    │  ← Stats row
│     #47      │      3       │     64%      │
│   of 238     │              │              │
└──────────────┴──────────────┴──────────────┘
```

### 2. Contestant Selection Page (Season Start)

```
┌─────────────────────────────────────────────┐
│  SEASON 4 CONTESTANTS                       │
│  Select your champion for the season        │
│  Episodes air weekly starting Monday        │
└─────────────────────────────────────────────┘

┌───────────┬───────────┬───────────┬─────────┐
│           │           │           │         │
│ [Photo]   │ [Photo]   │ [Photo]   │ [Photo] │ ...
│           │           │           │         │
│ SARAH KIM │ DAVID     │ MARGARET  │ JAMES   │
│           │ PARK      │ THOMPSON  │ WILSON  │
│ "Former   │ "The      │ "The Over-│ "Chaos  │
│  escape   │  Lateral  │  thinker" │  Agent" │
│  room     │  Thinker" │           │         │
│  designer"│           │           │         │
│           │           │           │         │
│ Sarah     │ David     │ Margaret  │ James   │
│ approaches│ has a     │ once spent│ believes│
│ every...  │ background│ forty...  │ rules...│
│           │           │           │         │
│ [Select]▶ │ [Select]▶ │ [Select]▶ │ [Select]│
└───────────┴───────────┴───────────┴─────────┘
              [Show Full Backstories ↓]
```

**Interaction:**
- Click contestant card → Modal with full backstory
- Click "Select" → Confirmation modal → Locked in
- Can't change without paying currency

### 3. Episode Viewer (Full Experience)

**Top Section:**
```
┌─────────────────────────────────────────────┐
│  ← Season 3                                 │
│                                             │
│  EPISODE 2: "The Egg Incident"             │
│  Aired Nov 10, 2025                         │
└─────────────────────────────────────────────┘

[Opening] → [Prize] → [T1] → [T2] → [T3] → [Live] → [Results]
              ✓        ●      ○      ○       ○        ○

⏰ Task 1 betting locks in 2m 45s             [Place Bet]
```

**Content Section:**
```
┌─────────────────────────────────────────────┐
│  📍 TASK 1 - THE WORKSHOP                   │
│                                             │
│  "Make the tallest tower using only the    │
│   items in this room. You have 10 minutes. │
│   Your time starts now."                    │
│                                             │
│  Time-based • Physical • Creative           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ┌─┐ SARAH KIM                 65 points   │
│  │●│ 1st place                              │
│  └─┘                                        │
├─────────────────────────────────────────────┤
│  Sarah walks into the workshop with visible │
│  confidence. She scans the room for exactly │
│  four seconds before her eyes lock onto the │
│  pile of wooden dowels in the corner...     │
│                                             │
│  [Continue reading (4 more paragraphs)]    │
├─────────────────────────────────────────────┤
│  ⏱ 6m 12s    📏 5.7 meters    ⭐ 5 points  │
└─────────────────────────────────────────────┘

[Next: David Park ↓]
```

**Scoring Summary:**
```
┌─────────────────────────────────────────────┐
│  TASK 1 RESULTS                             │
│                                             │
│  🥇 Sarah Kim         5.7m    5 points      │
│  🥈 Margaret Thompson 4.8m    4 points  ← You│
│  🥉 David Park        4.2m    3 points      │
│  4th James Wilson     3.1m    2 points      │
│  5th Elena Rodriguez  0.9m    1 point       │
│     (Disqualified - broke ladder)          │
└─────────────────────────────────────────────┘

[Bet Resolution: You won 75⚡] ✓
[Next: Banter Interlude ↓]
```

### 4. Stats Page

```
┌─────────────────────────────────────────────┐
│  MARGARET THOMPSON                          │
│  Season 3 • Your Contestant                 │
└─────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│ TOTAL POINTS │  RANK        │  WIN RATE    │
│     47       │  3rd / 5     │    33%       │
└──────────────┴──────────────┴──────────────┘

┌─────────────────────────────────────────────┐
│  EPISODE HISTORY                            │
│                                             │
│  Ep 1  [▓▓▓▓▓▓░░░░] 12 pts   3rd  🥉      │
│  Ep 2  [▓▓▓▓▓▓▓▓▓░] 18 pts   1st  🥇      │
│  Ep 3  [▓▓▓▓▓▓▓▓░░] 17 pts   2nd  🥈      │
│                                             │
│  Prize task avg: 2.7 points                 │
│  Live task avg: 3.0 points                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  PERFORMANCE STATS                          │
│                                             │
│  Times awarded 5 points:          6         │
│  Times awarded 1 point:           3         │
│  Disqualifications:               0         │
│  Rule violations:                 2         │
│  Average completion time:      7m 23s       │
│  Objects destroyed:               4         │
│  Unconventional solutions:        8         │
│  Times mentioned "escape room":   12        │
│                                             │
│  [View all stats →]                        │
└─────────────────────────────────────────────┘
```

### 5. Betting History

```
┌─────────────────────────────────────────────┐
│  BETTING HISTORY                            │
│  Total Wagered: 850⚡  Won: 1,240⚡  ROI: +46%│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ACTIVE BETS (3)                            │
│                                             │
│  Episode 2 Winner: Sarah Kim                │
│  50⚡ @ 2.8x  →  Potential: 140⚡          │
│  Locks: 2m 45s                              │
│                                             │
│  Task 1 Winner: Margaret Thompson           │
│  25⚡ @ 4.5x  →  Potential: 112⚡          │
│  Locks: 2m 45s                              │
│                                             │
│  Over 65 total episode points               │
│  100⚡ @ 1.9x  →  Potential: 190⚡         │
│  Resolves: End of episode                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  RECENT RESULTS                             │
│                                             │
│  ✓ Prize Task Winner: David Park            │
│    25⚡ @ 3.2x  →  Won 80⚡                │
│    Episode 2 • 2 hours ago                  │
│                                             │
│  ✗ Episode 1 Winner: Sarah Kim              │
│    50⚡ @ 2.1x  →  Lost 50⚡               │
│    Episode 1 • 1 week ago                   │
└─────────────────────────────────────────────┘
```

---

## RESPONSIVE BEHAVIOR

### Desktop (1200px+)
- Sidebar navigation on left
- Content max-width 1200px, centered
- 3-column card grids
- Side-by-side stat displays

### Tablet (768px - 1199px)
- Top navigation, no sidebar
- Content full-width with padding
- 2-column card grids
- Stacked stat displays

### Mobile (<768px)
- Hamburger menu
- Single column everything
- Full-width cards
- Larger touch targets (48px minimum)
- Bottom sticky navigation for key actions

---

## ANIMATIONS & TRANSITIONS

### Subtle Motion (Fast, Not Distracting)

**Standard Transitions:**
```css
transition: all 0.2s ease-in-out;
```

**Hover Effects:**
- Card lift: `transform: translateY(-2px)`
- Button brighten: Lighten background color
- Border glow: Increase border opacity

**State Changes:**
- Currency updates: Count-up animation (0.5s)
- Points reveal: Fade in + scale (0.3s)
- Betting lock: Pulse red → lock icon

**Loading States:**
- Skeleton screens (gray pulse)
- Spinner for actions: Simple circular spin
- Progress bars for episode watching

**Bet Placement:**
```
1. Button click → Disable button
2. Show spinner → "Placing bet..."
3. Success → Green checkmark + "Bet placed!" (1s)
4. Animate currency change
5. Fade back to normal state
```

### No Animation for:
- Text content appearing (readability)
- Navigation (instant)
- Large layout shifts

---

## SPECIAL UI STATES

### Empty States
```
┌─────────────────────────────────────────────┐
│                                             │
│              🎯                             │
│                                             │
│        No bets placed yet.                  │
│   The Taskmaster is watching...            │
│                                             │
│        [Place Your First Bet]              │
│                                             │
└─────────────────────────────────────────────┘
```

Use icon + message + CTA button

### Loading States
```
┌─────────────────────────────────────────────┐
│  [Skeleton Card - Gray pulsing blocks]     │
│                                             │
│  ████████████                               │
│  ████████                                   │
│  ████████████████████                       │
└─────────────────────────────────────────────┘
```

### Error States
```
┌─────────────────────────────────────────────┐
│  ⚠️ Unable to place bet                    │
│  Insufficient currency. You need 50⚡ more.│
│                                             │
│  [Dismiss]                                  │
└─────────────────────────────────────────────┘
```

Red accent, clear message, actionable

### Success Confirmations
```
┌─────────────────────────────────────────────┐
│  ✓ Bet placed successfully!                │
│  50⚡ on Margaret Thompson to win Task 1   │
│  Potential payout: 225⚡                    │
└─────────────────────────────────────────────┘
```

Green accent, auto-dismiss after 3s

---

## ACCESSIBILITY REQUIREMENTS

### Color Contrast
- All text: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1
- Use tools like WebAIM contrast checker

### Interactive Elements
- Min touch target: 48x48px on mobile
- Keyboard navigation support
- Focus indicators (gold outline)
- Skip to main content link

### Screen Reader Support
- Semantic HTML (header, nav, main, article)
- ARIA labels for icons
- Alt text for images
- Announce live updates (betting locks, score changes)

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## TECHNICAL IMPLEMENTATION NOTES

### Tailwind CSS Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#1a1d29',
        surface: '#252936',
        'text-primary': '#e8e6e3',
        'text-secondary': '#9b9a97',
        gold: '#f4a261',
        'electric-blue': '#2a9d8f',
        danger: '#e63946',
        success: '#06d6a0',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        body: ['IBM Plex Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 6px rgba(0,0,0,0.1)',
        'card-hover': '0 8px 12px rgba(0,0,0,0.2)',
      },
    },
  },
}
```

### Component Library Recommendation
- **Headless UI** (by Tailwind): Unstyled, accessible components
- Or build from scratch for full control

### State Management
- **Zustand** or **React Context** for global state
- Currency balance
- Current user + contestant
- Active bets

### Data Fetching
- **React Query** or **SWR** for server state
- Caching
- Automatic refetching
- Optimistic updates for betting

---

## BRAND VOICE IN UI COPY

### Tone Guidelines

**Authoritative but not stuffy:**
- ✓ "The Taskmaster has made their decision."
- ✗ "Please await the decision of the adjudicator."

**Playful but not silly:**
- ✓ "Betting locked. Good luck."
- ✗ "OMG betting is closed LOL!"

**Clear and direct:**
- ✓ "Insufficient currency. You need 50⚡ more."
- ✗ "Oopsie! Looks like you don't have enough coins!"

### Example Microcopy

**Buttons:**
- "Place Bet" not "Submit Bet"
- "Select Contestant" not "Choose"
- "View Full Stats" not "See More"

**Status Messages:**
- "Bet placed successfully"
- "Episode available now"
- "Betting closes in 2m"
- "Margaret earned you 18⚡"

**Empty States:**
- "No bets placed yet. The Taskmaster is watching..."
- "Your season hasn't started. Select your contestant to begin."
- "Episode 1 airs in 3 days. Prepare yourself."

**Errors:**
- "Unable to place bet. Betting has closed."
- "Contestant already selected. Pay 100⚡ to switch."
- "Connection lost. Attempting to reconnect..."

---

## ICONS & IMAGERY

### Icon System
Use **Lucide Icons** (clean, consistent, MIT licensed)

**Common Icons:**
- ⚡ Currency (bolt)
- 🏆 Winner (trophy)
- 📍 Location (map-pin)
- ⏱️ Time (clock)
- 📊 Stats (bar-chart)
- ⏰ Countdown (alarm-clock)
- 🔒 Locked (lock)
- ✓ Success (check)
- ✗ Failed (x)
- ⚠️ Warning (alert-triangle)

### Contestant Avatars
**MVP:** Simple colored circles with initials
```
┌─────┐
│  MT │  ← Initials in contestant color
└─────┘
```

**Future:** Generated portraits
- Consistent art style
- Recognizable personalities
- Could use Stable Diffusion or DALL-E

### Taskmaster & Assistant
**MVP:** Text names only, no images needed
**Future:** Stylized avatars/portraits

---

## DARK MODE ONLY

This design is **dark mode by default** and only.

Light mode would require:
- Complete color palette inversion
- Reduced shadows
- Different approach to emphasis

**Reason for dark-only:**
- Fits the mysterious/bureaucratic theme
- Easier on eyes for long reading sessions
- Single design to maintain for MVP

---

## IMPLEMENTATION PRIORITY

### Phase 1: Core Components
1. Layout shell (header, navigation, content area)
2. Card component
3. Button component
4. Typography system

### Phase 2: Content Display
5. Episode viewer
6. Task display
7. Contestant cards
8. Stats displays

### Phase 3: Interactivity
9. Betting interface
10. Countdown timers
11. Form inputs
12. Modals/dialogs

### Phase 4: Polish
13. Animations & transitions
14. Empty/loading/error states
15. Responsive refinements
16. Accessibility audit

---

## DESIGN SYSTEM DOCUMENTATION

Once built, maintain a **living style guide** at `/styleguide` route:
- Color palette with hex codes
- Typography examples
- Component variations
- Interactive examples
- Code snippets

Helps maintain consistency as features are added.

---

## CONCLUSION

This design balances **readability** (lots of text content), **clarity** (complex betting/stats), and **personality** (mysterious bureaucratic game show).

The "Bureaucratic Game Show" aesthetic gives The Compound a unique identity that's:
- ✓ Memorable and distinctive
- ✓ Appropriate for the content
- ✓ Scalable for future features
- ✓ Implementable with standard web tech

Hand this document to Claude Code alongside the game spec, and the visual direction should be clear.

**Key Success Factors:**
1. Typography must be excellent (so much text to read)
2. Hierarchy must be clear (guide attention)
3. Loading states must be smooth (AI generation takes time)
4. Betting UX must be frictionless (core engagement loop)

Build it. Ship it. Let the chaos begin. 🎯
