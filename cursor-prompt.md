# DevProbe — Live Coding Test Platform
## Cursor Prompt: Build the remaining application

---

## Context

This is a Next.js 15 App Router project (TypeScript + Tailwind) called **DevProbe**.
It's an interactive live-coding interview prep platform for senior frontend positions.
The data layer is already complete: `lib/types.ts` and `lib/challenges.ts` contain 12
fully-defined challenges across TypeScript, React, React Query, Zustand, Next.js, Auth and Testing.
Each challenge has: `id`, `title`, `category`, `difficulty`, `estimatedMinutes`, `tags`,
`description`, `instructions[]`, `starterCode`, `solution`, and optional `sandpack` config.

Your job is to build everything else. Use the existing CSS variables from `globals.css`
for all styling — do not add new color values or use arbitrary Tailwind values.

---

## Design system (from globals.css — use these, don't invent new ones)

```css
/* Colors */
--bg, --bg-2, --surface, --surface-2, --surface-3   /* dark backgrounds */
--border, --border-2                                  /* borders */
--text, --muted, --dim                               /* text hierarchy */
--accent (#4fc3f7), --mint (#43d9ad), --amber (#ffa657), --red (#ff6b6b)

/* Fonts */
--font-display: 'Oxanium'   /* headings */
--font-body:    'DM Sans'   /* body text */
--font-mono:    'JetBrains Mono'  /* code, tags, badges */

/* Pre-built classes */
.btn .btn-accent .btn-mint .btn-amber .btn-red
.badge .tag
.fade-in .slide-in-right .hint-ready (amber pulse animation)
```

---

## Files to create

### 1. `app/page.tsx` — Home / Challenge Dashboard

The landing screen. Layout:

- **Header**: logo "DevProbe" (Oxanium font, --accent color) + tagline + a small legend
  showing the 7 category color dots
- **Filter bar**: horizontal pill buttons for each category
  (TypeScript, React, React Query, Zustand, Next.js, Auth, Testing) + an "All" button.
  Active filter highlighted with --accent border.
- **Challenge grid**: 3-column responsive grid (2 on tablet, 1 on mobile).
  Each card shows:
  - Category color bar on the left edge (use per-category CSS vars: --cat-ts, --cat-react, etc.)
  - Title (--font-display), difficulty badge (easy=--mint, medium=--amber, hard=--red)
  - Description (2 lines max, text-overflow ellipsis)
  - Tags as `.tag` pills
  - Bottom row: clock icon + estimatedMinutes, then a "Start →" button (btn-accent)
  - On hover: card lifts slightly (transform translateY(-2px)), border brightens
- Cards link to `/challenge/[id]`
- No external state management needed — filter is local useState

Category color mapping:
```ts
const CAT_COLORS: Record<Category, string> = {
  TypeScript:     '#3178c6',
  React:          '#61dafb',
  'Next.js':      '#e5e7eb',
  'React Query':  '#ff4154',
  Zustand:        '#f98012',
  Auth:           '#9c6ade',
  Testing:        '#99c550',
}
```

---

### 2. `app/challenge/[id]/page.tsx` — Challenge Screen

The core screen. Two-panel layout (CSS Grid, no flex):
- Left panel (38%): challenge info + instructions
- Right panel (62%): editor + preview/output

**Left panel** contains:
- Back arrow → `/`
- Category badge + difficulty badge
- Title (large, --font-display)
- Description paragraph
- Numbered instruction list (each item is a step the user must complete)
- Tags
- "Reveal Solution" button (btn-red, disabled until 5 minutes have passed OR user clicks anyway after a confirmation)
- "Compare Solutions" button (btn-amber, only visible after solution is revealed)

**Right panel** contains:
- Top toolbar:
  - Timer component (mm:ss, counts up, --font-mono)
  - "Fast Typing" toggle (enables Monaco autocomplete/suggestions; default OFF for harder mode)
  - Hint button with badge: shows "💡 Hint available" with `.hint-ready` pulse animation
    after 3 minutes. Clicking opens the hint panel drawer. Shows how many hints used (e.g. 2/3).
  - Reset code button (restores starterCode)
- Monaco Editor (bottom 55% of right panel)
- Sandpack preview OR a "output panel" (top 45% of right panel):
  - For `previewType === 'react'` or `'nextjs'`: render live with Sandpack
  - For `previewType === 'typescript'` or `'test'`: show a read-only output console panel
    (dark background, monospace, scrollable). No live execution needed for TS/test — just show
    a static message "Run in your local environment" styled nicely.

State managed with `useReducer` (not useState soup):
```ts
type ChallengeState = {
  code: string
  hintsUsed: number
  hintPanelOpen: boolean
  solutionRevealed: boolean
  compareOpen: boolean
  elapsedSeconds: number
  hintAvailable: boolean  // true after 3 minutes
}
```

---

### 3. `components/ChallengeEditor.tsx`

Wrapper around `@monaco-editor/react`.

Props:
```ts
interface Props {
  value: string
  onChange: (code: string) => void
  language: 'typescript' | 'javascript'
  fastTyping: boolean   // when false: disable quickSuggestions, parameterHints, wordBasedSuggestions
  height?: string
}
```

Monaco options to apply:
```ts
const BASE_OPTIONS = {
  fontSize: 13,
  fontFamily: "'JetBrains Mono', monospace",
  fontLigatures: true,
  lineHeight: 22,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  tabSize: 2,
  padding: { top: 16, bottom: 16 },
  theme: 'devprobe-dark',  // custom theme (see below)
}
```

Register a custom Monaco theme called `'devprobe-dark'` that matches the design system:
- background: #05090f, foreground: #c5d5e8
- keywords: #4fc3f7, strings: #43d9ad, numbers: #ffa657, comments: #2a4260 italic
- types/interfaces: #bb86fc, functions: #61dafb

When `fastTyping === false`:
```ts
quickSuggestions: false,
parameterHints: { enabled: false },
wordBasedSuggestions: 'off',
suggestOnTriggerCharacters: false,
```

---

### 4. `components/SandpackPreview.tsx`

Wraps `@codesandbox/sandpack-react` for live React preview.

Props:
```ts
interface Props {
  code: string          // user's current editor code
  challenge: Challenge  // needed for sandpack.files and sandpack.dependencies
}
```

- Use `SandpackProvider` + `SandpackPreview` (not the all-in-one `Sandpack` component)
- Merge `challenge.sandpack?.files` with the user's code file (`/Solution.tsx` or `/App.tsx`)
- Merge `challenge.sandpack?.dependencies` with base React deps
- Template: `'react-ts'`
- Theme: dark, matching --bg background
- Show a loading skeleton while Sandpack initializes (just a dark div with a subtle pulse)
- On error, show the error message in --red color with a monospace font

---

### 5. `components/HintPanel.tsx`

A slide-in drawer from the right (use `.slide-in-right` CSS animation).
Width: 380px. Overlaps the right panel with a semi-transparent backdrop.

Props:
```ts
interface Props {
  challenge: Challenge
  currentCode: string
  hintsUsed: number
  onClose: () => void
  onHintUsed: () => void
}
```

Behavior:
- Max 3 hints per challenge
- Each hint call hits `POST /api/hint` with `{ challengeId, currentCode, hintNumber }`
- Stream the response using `ReadableStream` / `TextDecoder` so the hint text appears
  letter by letter (typewriter effect)
- Previous hints in the session are stored in local component state and shown above the current one
- Each hint is numbered ("Hint 1/3", "Hint 2/3") with the --amber color
- Show a spinner while streaming
- "Get hint" button disabled when hintsUsed >= 3

UI structure:
```
[X close]  Hints (2/3 used)
─────────────────────────────
[Hint 1]  ← previous, collapsed, clickable to expand
[Hint 2]  ← current, expanded, text streaming in
─────────────────────────────
[Get next hint]  ← disabled if 3/3
```

---

### 6. `components/SolutionModal.tsx`

A centered modal (backdrop blur) with two tabs: "Solution" and "Compare".

Props:
```ts
interface Props {
  challenge: Challenge
  userCode: string
  onClose: () => void
}
```

**"Solution" tab**: Monaco editor (read-only) showing `challenge.solution`. Same theme as the main editor. Has a copy-to-clipboard button.

**"Compare" tab**: Two side-by-side Monaco editors:
- Left: user's code (read-only, label "Your code")
- Right: solution (read-only, label "Solution")
Both have `renderSideBySide: false` diff highlighting — or simply place them side by side
with the same read-only Monaco component.

Close on backdrop click or Escape key.

---

### 7. `app/api/hint/route.ts` — Hint API (streaming)

```ts
// POST /api/hint
// Body: { challengeId: string, currentCode: string, hintNumber: number }
// Returns: streaming text response
```

- Use `@anthropic-ai/sdk` (add to package.json: `"@anthropic-ai/sdk": "^0.27.0"`)
- Model: `claude-haiku-4-5-20251001` (cheapest, fast enough for hints)
- **Streaming**: use `stream.toReadableStream()` and return a `Response` with that stream
- Max tokens: 300 (hints should be concise)

System prompt:
```
You are a coding mentor helping a developer practice for a senior frontend interview.
Your role is to give HINTS, not solutions. Be concise (2-4 sentences max).
Point them in the right direction without giving away the answer.
Adjust based on hintNumber: hint 1 = conceptual nudge, hint 2 = more specific,
hint 3 = almost a direct pointer to the exact line/approach needed.
Never show code. Never reveal the full solution.
```

User prompt template:
```
Challenge: {challenge.title}
Category: {challenge.category}

Instructions the user must complete:
{challenge.instructions.join('\n')}

Current user code:
{currentCode}

This is hint #{hintNumber} of 3. Give a hint appropriate for this stage.
```

Route handler:
```ts
export async function POST(req: Request) {
  const { challengeId, currentCode, hintNumber } = await req.json()
  // validate inputs...
  // build prompt...
  const stream = await anthropic.messages.stream({ ... })
  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
```

---

### 8. `components/Timer.tsx`

```ts
interface Props {
  onThreeMinutes: () => void  // called once when elapsed hits 180s
  onReset: () => void
}
```

- Counts up from 0 using `useEffect` + `setInterval`
- Displays `mm:ss` in `--font-mono`
- Color changes: 0-2min = --muted, 3-5min = --amber, 5min+ = --red
- Exposes a reset function via `useImperativeHandle` or just via the `onReset` prop
- Does NOT use localStorage — keep it in component state (resets on page refresh)

---

## Additional improvements to implement

### A. Progress persistence
Use `localStorage` to remember which challenges the user has attempted.
Key: `devprobe:progress`. Value: `Record<challengeId, { attempted: boolean, completed: boolean, bestTimeSeconds: number }>`.
Show a green checkmark or "Attempted" badge on challenge cards in the home grid.

### B. Keyboard shortcuts
Add a `useKeyboardShortcuts` hook used in the challenge page:
- `Ctrl/Cmd + Enter` → focus editor
- `Escape` → close any open modal/panel
- `Ctrl/Cmd + Shift + H` → request hint (if available)
- `Ctrl/Cmd + Shift + R` → reset code to starter

Show a keyboard shortcut legend at the bottom of the left panel (small, --muted color).

### C. Difficulty filter + sort on home page
Add a second filter row on the home page:
- Difficulty pills: All / Easy / Medium / Hard
- Sort dropdown: "Default" | "Easiest first" | "Hardest first" | "Shortest first"

### D. Code reset confirmation
When the user clicks "Reset code", show an inline confirmation banner
("Reset to starter code? This will erase your progress. [Confirm] [Cancel]")
instead of a browser `confirm()` dialog.

### E. Copy solution button
In `SolutionModal`, add a "Copy to clipboard" button using the Clipboard API.
Show a brief "Copied!" tooltip (1.5s) after copying.

### F. Challenge completion detection (heuristic)
After the user has been coding for >2 minutes AND the code length is >50% of the
solution length, show a subtle banner at the bottom of the editor:
"Looks like you're close! Want to compare with the solution?"
This is a UX nudge, not automated evaluation.

### G. `not-found.tsx` and `loading.tsx`
- `app/challenge/[id]/not-found.tsx`: shown when challengeId doesn't match any challenge.
  Show a centered message with a link back to home.
- `app/challenge/[id]/loading.tsx`: shown while the page is loading.
  A skeleton layout that mimics the two-panel structure.

---

## Package additions needed

Add these to `package.json` dependencies:
```json
"@anthropic-ai/sdk": "^0.27.0",
"@monaco-editor/react": "^4.6.0",
"@codesandbox/sandpack-react": "^2.18.1",
"monaco-editor": "^0.52.0"
```

---

## File structure when done

```
live-coding-test/
├── app/
│   ├── globals.css               ✅ done
│   ├── layout.tsx                ✅ done
│   ├── page.tsx                  ← BUILD THIS
│   ├── not-found.tsx             ← BUILD THIS
│   └── challenge/
│       └── [id]/
│           ├── page.tsx          ← BUILD THIS (main challenge screen)
│           ├── loading.tsx       ← BUILD THIS
│           └── not-found.tsx     ← BUILD THIS
├── api/
│   └── hint/
│       └── route.ts              ← BUILD THIS
├── components/
│   ├── ChallengeEditor.tsx       ← BUILD THIS
│   ├── SandpackPreview.tsx       ← BUILD THIS
│   ├── HintPanel.tsx             ← BUILD THIS
│   ├── SolutionModal.tsx         ← BUILD THIS
│   └── Timer.tsx                 ← BUILD THIS
├── lib/
│   ├── challenges.ts             ✅ done
│   └── types.ts                  ✅ done
├── .env.example                  ✅ done
├── package.json                  ✅ done (needs sdk added)
├── next.config.js                ✅ done
├── tailwind.config.js            ✅ done
├── tsconfig.json                 ✅ done
└── postcss.config.js             ✅ done
```

---

## Important constraints

- All components are client components (`'use client'`) except the API route and page.tsx
  server components (which just read params and pass data down)
- `app/page.tsx` and `app/challenge/[id]/page.tsx` are server components that import
  challenge data from `lib/challenges.ts` and pass it to client components
- Do not use any CSS-in-JS library — use the CSS variables from globals.css + Tailwind utility classes
- Do not add any new dependencies beyond those listed above
- `ANTHROPIC_API_KEY` comes from `process.env.ANTHROPIC_API_KEY` — never expose it to the client
- All Monaco usage must be inside a `dynamic(() => import(...), { ssr: false })` to avoid SSR issues
- All Sandpack usage must also be `dynamic` with `ssr: false`
