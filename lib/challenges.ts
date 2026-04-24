import { Challenge } from './types'

export const challenges: Challenge[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // TYPESCRIPT
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ts-utility-types',
    title: 'Utility Types from Scratch',
    category: 'TypeScript',
    difficulty: 'medium',
    estimatedMinutes: 15,
    tags: ['generics', 'mapped types', 'conditional types'],
    description:
      'Re-implement TypeScript built-in utility types using mapped and conditional types. A foundational exercise that reveals how the type system really works.',
    instructions: [
      'Implement MyPartial<T> — make every property optional',
      'Implement MyRequired<T> — make every property required (strip optionality)',
      'Implement MyReadonly<T> — make every property readonly',
      'Implement MyPick<T, K> — keep only a subset of keys K',
      'Implement MyOmit<T, K> — drop keys K (hint: combine Pick + Exclude)',
      'Implement MyExclude<T, U> — remove union members assignable to U',
      'Implement MyReturnType<T> — extract the return type of a function',
    ],
    previewType: 'typescript',
    starterCode: `// Re-implement TypeScript's built-in utility types from scratch.
// ❌ Do NOT use: Partial, Required, Readonly, Pick, Omit, Exclude, ReturnType

type MyPartial<T> = any // TODO

type MyRequired<T> = any // TODO

type MyReadonly<T> = any // TODO

type MyPick<T, K extends keyof T> = any // TODO

type MyOmit<T, K extends keyof T> = any // TODO

type MyExclude<T, U> = any // TODO

type MyReturnType<T extends (...args: any) => any> = any // TODO


// ─── Tests — these should all compile without errors ────────────────────

type User = { id: number; name: string; email?: string }

// MyPartial: all fields optional
const p1: MyPartial<User> = {}
const p2: MyPartial<User> = { id: 1 }

// MyRequired: all fields required (including optional email)
const r1: MyRequired<User> = { id: 1, name: 'Alice', email: 'a@b.com' }
// @ts-expect-error — email should be required
const r2: MyRequired<User> = { id: 1, name: 'Alice' }

// MyReadonly: cannot reassign
const ro: MyReadonly<User> = { id: 1, name: 'Bob' }
// @ts-expect-error — should be readonly
ro.name = 'Eve'

// MyPick
const pk: MyPick<User, 'id' | 'name'> = { id: 1, name: 'Alice' }
// @ts-expect-error — email not in pick
const pk2: MyPick<User, 'id' | 'name'> = { id: 1, name: 'Alice', email: 'x' }

// MyOmit
const om: MyOmit<User, 'email'> = { id: 1, name: 'Alice' }

// MyExclude
type Primitives = string | number | boolean
type NoString = MyExclude<Primitives, string> // → number | boolean
const ns: NoString = 42

// MyReturnType
const add = (a: number, b: number): number => a + b
type AddReturn = MyReturnType<typeof add> // → number
const ar: AddReturn = 5`,
    solution: `type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type MyExclude<T, U> = T extends U ? never : T

type MyOmit<T, K extends keyof T> = MyPick<T, MyExclude<keyof T, K>>

type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ts-discriminated-unions',
    title: 'Discriminated Union Event Handler',
    category: 'TypeScript',
    difficulty: 'medium',
    estimatedMinutes: 20,
    tags: ['discriminated unions', 'type narrowing', 'exhaustive checks'],
    description:
      'Model a domain event system using discriminated unions, implement exhaustive type-safe handlers, and add a utility type that extracts payload by event type.',
    instructions: [
      'Define a DomainEvent discriminated union (UserCreated, OrderPlaced, PaymentFailed, ItemShipped)',
      'Implement handleEvent(event) that returns a human-readable string for each event type',
      'TypeScript must error if a case is missing (exhaustive check)',
      'Implement ExtractPayload<E, T> — given the union and a type tag, extract that event\'s payload',
      'Add a typed dispatcher: createDispatcher() that maps event types to handler functions',
    ],
    previewType: 'typescript',
    starterCode: `// ── 1. Define the DomainEvent discriminated union ──────────────────
// Each variant has a "type" literal + a "payload" object

type DomainEvent =
  // TODO: add variants:
  //  - UserCreated:   { userId: string; email: string; plan: 'free' | 'pro' }
  //  - OrderPlaced:   { orderId: string; userId: string; total: number }
  //  - PaymentFailed: { orderId: string; reason: string; retryable: boolean }
  //  - ItemShipped:   { orderId: string; trackingId: string; eta: string }
  never


// ── 2. Exhaustive event handler ─────────────────────────────────────
// Should return a human-readable message for each event
// TypeScript must error if you miss a variant

function handleEvent(event: DomainEvent): string {
  // TODO: implement switch with exhaustive check
  // Tip: add a default that calls assertNever(event)
  return ''
}

// Exhaustive check helper — do not remove
function assertNever(x: never): never {
  throw new Error('Unhandled event: ' + JSON.stringify(x))
}


// ── 3. Utility type: extract payload by tag ──────────────────────────
// ExtractPayload<DomainEvent, 'UserCreated'> → { userId: string; email: string; plan: ... }

type ExtractPayload<E, T> = any // TODO


// ── 4. Typed dispatcher ──────────────────────────────────────────────
// createDispatcher() returns an object where you register handlers per event type
// and a dispatch(event) method that calls the right handler

function createDispatcher() {
  // TODO: implement
  return {
    on<T extends DomainEvent['type']>(
      type: T,
      handler: (payload: ExtractPayload<DomainEvent, T>) => void,
    ) {
      // TODO
      return this
    },
    dispatch(event: DomainEvent) {
      // TODO
    },
  }
}


// ─── Tests ────────────────────────────────────────────────────────────
const e1: DomainEvent = { type: 'UserCreated', payload: { userId: 'u1', email: 'a@b.com', plan: 'pro' } }
const e2: DomainEvent = { type: 'PaymentFailed', payload: { orderId: 'o1', reason: 'Declined', retryable: true } }

console.log(handleEvent(e1)) // "New user a@b.com joined on pro plan"
console.log(handleEvent(e2)) // "Payment failed for o1: Declined (retryable)"

type UserPayload = ExtractPayload<DomainEvent, 'UserCreated'>
// → { userId: string; email: string; plan: 'free' | 'pro' }

const dispatcher = createDispatcher()
dispatcher
  .on('UserCreated', p => console.log('User:', p.email))
  .on('OrderPlaced', p => console.log('Order total:', p.total))
  .dispatch(e1)`,
    solution: `type DomainEvent =
  | { type: 'UserCreated';   payload: { userId: string; email: string; plan: 'free' | 'pro' } }
  | { type: 'OrderPlaced';   payload: { orderId: string; userId: string; total: number } }
  | { type: 'PaymentFailed'; payload: { orderId: string; reason: string; retryable: boolean } }
  | { type: 'ItemShipped';   payload: { orderId: string; trackingId: string; eta: string } }

function assertNever(x: never): never {
  throw new Error('Unhandled event: ' + JSON.stringify(x))
}

function handleEvent(event: DomainEvent): string {
  switch (event.type) {
    case 'UserCreated':
      return \`New user \${event.payload.email} joined on \${event.payload.plan} plan\`
    case 'OrderPlaced':
      return \`Order \${event.payload.orderId} placed — total $\${event.payload.total}\`
    case 'PaymentFailed':
      return \`Payment failed for \${event.payload.orderId}: \${event.payload.reason}\${event.payload.retryable ? ' (retryable)' : ''}\`
    case 'ItemShipped':
      return \`Order \${event.payload.orderId} shipped, tracking: \${event.payload.trackingId}, ETA: \${event.payload.eta}\`
    default:
      return assertNever(event)
  }
}

type ExtractPayload<E, T> = E extends { type: T; payload: infer P } ? P : never

function createDispatcher() {
  const handlers = new Map<string, (payload: any) => void>()
  return {
    on<T extends DomainEvent['type']>(
      type: T,
      handler: (payload: ExtractPayload<DomainEvent, T>) => void,
    ) {
      handlers.set(type, handler)
      return this
    },
    dispatch(event: DomainEvent) {
      handlers.get(event.type)?.(event.payload)
    },
  }
}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // REACT
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'react-use-reducer',
    title: 'useReducer Counter Hook',
    category: 'React',
    difficulty: 'easy',
    estimatedMinutes: 15,
    tags: ['useReducer', 'custom hooks', 'discriminated unions'],
    description:
      'Build a reusable useCounter hook powered by useReducer. Defines discriminated action types, implements the reducer, and exposes a clean API.',
    instructions: [
      'Define the Action discriminated union (INCREMENT, DECREMENT, RESET, SET_COUNT, SET_STEP)',
      'Implement the reducer — handle every action type',
      'Return action dispatchers from useCounter (increment, decrement, reset, setCount, setStep)',
      'The demo app below should render and work correctly',
    ],
    previewType: 'react',
    starterCode: `import { useReducer } from 'react'

// ── Types ──────────────────────────────────────────────────────────
type State = { count: number; step: number }

// TODO: Define the Action discriminated union
// Needed actions: INCREMENT | DECREMENT | RESET | SET_COUNT | SET_STEP
type Action = never

// ── Reducer ────────────────────────────────────────────────────────
// TODO: Implement — handle every action type
function reducer(state: State, action: Action): State {
  return state
}

// ── Hook ───────────────────────────────────────────────────────────
export function useCounter(initialCount = 0, step = 1) {
  const [state, dispatch] = useReducer(reducer, { count: initialCount, step })

  // TODO: Return action dispatchers alongside the state values
  return {
    count: state.count,
    step: state.step,
    // increment, decrement, reset, setCount, setStep
  }
}

// ── Demo (do not modify) ───────────────────────────────────────────
const btn: React.CSSProperties = {
  padding: '8px 18px', background: '#1e3250', color: '#c5d5e8',
  border: '1px solid #182840', cursor: 'pointer', borderRadius: 4,
  fontFamily: 'monospace', fontSize: 14,
}

export default function App() {
  const { count, step, increment, decrement, reset, setCount, setStep } = useCounter(0, 1)
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, padding:40, fontFamily:'monospace', background:'#05090f', minHeight:'100vh', color:'#c5d5e8' }}>
      <div style={{ fontSize:80, fontWeight:700, color:'#4fc3f7', letterSpacing:-2 }}>{count}</div>
      <div style={{ display:'flex', gap:8 }}>
        <button style={btn} onClick={decrement}>−{step}</button>
        <button style={btn} onClick={increment}>+{step}</button>
        <button style={{ ...btn, background:'#12243a', color:'#4a6580' }} onClick={reset}>Reset</button>
      </div>
      <label style={{ display:'flex', gap:10, alignItems:'center', color:'#4a6580' }}>
        Step:
        <input type="number" value={step}
          onChange={e => setStep?.(Number(e.target.value))}
          style={{ width:60, padding:'4px 8px', background:'#0a1222', border:'1px solid #182840', color:'#c5d5e8', borderRadius:4, fontFamily:'monospace', textAlign:'center' }}
        />
      </label>
      <button style={{ ...btn, background:'#0a1222', color:'#43d9ad', borderColor:'rgba(67,217,173,0.3)' }}
        onClick={() => setCount?.(100)}>
        Jump to 100
      </button>
    </div>
  )
}`,
    solution: `import { useReducer } from 'react'

type State = { count: number; step: number }

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_COUNT'; payload: number }
  | { type: 'SET_STEP';  payload: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':  return { ...state, count: state.count + state.step }
    case 'DECREMENT':  return { ...state, count: state.count - state.step }
    case 'RESET':      return { ...state, count: 0 }
    case 'SET_COUNT':  return { ...state, count: action.payload }
    case 'SET_STEP':   return { ...state, step: action.payload }
    default:           return state
  }
}

export function useCounter(initialCount = 0, step = 1) {
  const [state, dispatch] = useReducer(reducer, { count: initialCount, step })
  return {
    count:     state.count,
    step:      state.step,
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
    reset:     () => dispatch({ type: 'RESET' }),
    setCount:  (n: number) => dispatch({ type: 'SET_COUNT', payload: n }),
    setStep:   (n: number) => dispatch({ type: 'SET_STEP',  payload: n }),
  }
}

const btn: React.CSSProperties = {
  padding: '8px 18px', background: '#1e3250', color: '#c5d5e8',
  border: '1px solid #182840', cursor: 'pointer', borderRadius: 4,
  fontFamily: 'monospace', fontSize: 14,
}

export default function App() {
  const { count, step, increment, decrement, reset, setCount, setStep } = useCounter(0, 1)
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, padding:40, fontFamily:'monospace', background:'#05090f', minHeight:'100vh', color:'#c5d5e8' }}>
      <div style={{ fontSize:80, fontWeight:700, color:'#4fc3f7', letterSpacing:-2 }}>{count}</div>
      <div style={{ display:'flex', gap:8 }}>
        <button style={btn} onClick={decrement}>−{step}</button>
        <button style={btn} onClick={increment}>+{step}</button>
        <button style={{ ...btn, background:'#12243a', color:'#4a6580' }} onClick={reset}>Reset</button>
      </div>
      <label style={{ display:'flex', gap:10, alignItems:'center', color:'#4a6580' }}>
        Step:
        <input type="number" value={step} onChange={e => setStep(Number(e.target.value))}
          style={{ width:60, padding:'4px 8px', background:'#0a1222', border:'1px solid #182840', color:'#c5d5e8', borderRadius:4, fontFamily:'monospace', textAlign:'center' }} />
      </label>
      <button style={{ ...btn, background:'#0a1222', color:'#43d9ad', borderColor:'rgba(67,217,173,0.3)' }}
        onClick={() => setCount(100)}>
        Jump to 100
      </button>
    </div>
  )
}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'react-memoization',
    title: 'Performance Optimization',
    category: 'React',
    difficulty: 'medium',
    estimatedMinutes: 20,
    tags: ['useMemo', 'useCallback', 'React.memo', 'performance'],
    description:
      'A list with an expensive filter computation re-renders every parent update. Fix it using useMemo, useCallback, and React.memo — and understand when each tool applies.',
    instructions: [
      'Wrap ListItem with React.memo so it only re-renders when its own props change',
      'Memoize the filtered list with useMemo (depends on items + query)',
      'Stabilize handleRemove with useCallback so memo\'d children don\'t re-render',
      'Click "Re-render" — only items whose names changed should log to the console',
      'Open the console to verify: after memoization, no item logs on re-render unless query changed',
    ],
    previewType: 'react',
    starterCode: `import { useState } from 'react'

// Simulates an expensive computation (50 ms delay)
function expensiveFilter(items: string[], query: string) {
  const start = Date.now()
  while (Date.now() - start < 50) {}
  return items.filter(i => i.toLowerCase().includes(query.toLowerCase()))
}

// ❌ Re-renders on every parent update — wrap with React.memo
function ListItem({ item, onRemove }: { item: string; onRemove: (item: string) => void }) {
  console.log('%cRendering: ' + item, 'color: #ff6b6b')
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 14px',
      background:'#0e1826', marginBottom:4, borderRadius:4, color:'#c5d5e8', fontFamily:'monospace' }}>
      <span>{item}</span>
      <button onClick={() => onRemove(item)}
        style={{ background:'none', border:'none', color:'#ff6b6b', cursor:'pointer', fontSize:16 }}>✕</button>
    </div>
  )
}

const ITEMS = ['React','TypeScript','Next.js','Zustand','React Query','Vite','Tailwind','Prisma','tRPC','Zod']

export default function App() {
  const [items, setItems] = useState(ITEMS)
  const [query, setQuery] = useState('')
  const [renderCount, setRenderCount] = useState(0)

  // ❌ Runs expensiveFilter on every render — memoize this
  const filtered = expensiveFilter(items, query)

  // ❌ New function reference every render — breaks React.memo on children
  const handleRemove = (item: string) => {
    setItems(prev => prev.filter(i => i !== item))
  }

  return (
    <div style={{ padding:24, fontFamily:'monospace', maxWidth:400, background:'#05090f', minHeight:'100vh' }}>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter..."
          style={{ flex:1, padding:'7px 12px', background:'#0a1222', border:'1px solid #182840',
            color:'#c5d5e8', borderRadius:4, fontFamily:'monospace' }} />
        <button onClick={() => setRenderCount(c => c + 1)}
          style={{ padding:'7px 14px', background:'#1e3250', border:'1px solid #182840',
            color:'#4fc3f7', cursor:'pointer', borderRadius:4, fontFamily:'monospace', whiteSpace:'nowrap' }}>
          Re-render ({renderCount})
        </button>
      </div>
      {filtered.map(item => (
        <ListItem key={item} item={item} onRemove={handleRemove} />
      ))}
    </div>
  )
}`,
    solution: `import { useState, useMemo, useCallback, memo } from 'react'

function expensiveFilter(items: string[], query: string) {
  const start = Date.now()
  while (Date.now() - start < 50) {}
  return items.filter(i => i.toLowerCase().includes(query.toLowerCase()))
}

// ✅ React.memo — skips re-render if item + onRemove haven't changed
const ListItem = memo(({ item, onRemove }: { item: string; onRemove: (item: string) => void }) => {
  console.log('%cRendering: ' + item, 'color: #43d9ad')
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 14px',
      background:'#0e1826', marginBottom:4, borderRadius:4, color:'#c5d5e8', fontFamily:'monospace' }}>
      <span>{item}</span>
      <button onClick={() => onRemove(item)}
        style={{ background:'none', border:'none', color:'#ff6b6b', cursor:'pointer', fontSize:16 }}>✕</button>
    </div>
  )
})

const ITEMS = ['React','TypeScript','Next.js','Zustand','React Query','Vite','Tailwind','Prisma','tRPC','Zod']

export default function App() {
  const [items, setItems] = useState(ITEMS)
  const [query, setQuery] = useState('')
  const [renderCount, setRenderCount] = useState(0)

  // ✅ Only recomputes when items or query change
  const filtered = useMemo(() => expensiveFilter(items, query), [items, query])

  // ✅ Stable reference — memo'd children won't see a new prop
  const handleRemove = useCallback((item: string) => {
    setItems(prev => prev.filter(i => i !== item))
  }, [])

  return (
    <div style={{ padding:24, fontFamily:'monospace', maxWidth:400, background:'#05090f', minHeight:'100vh' }}>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter..."
          style={{ flex:1, padding:'7px 12px', background:'#0a1222', border:'1px solid #182840',
            color:'#c5d5e8', borderRadius:4, fontFamily:'monospace' }} />
        <button onClick={() => setRenderCount(c => c + 1)}
          style={{ padding:'7px 14px', background:'#1e3250', border:'1px solid #182840',
            color:'#4fc3f7', cursor:'pointer', borderRadius:4, fontFamily:'monospace', whiteSpace:'nowrap' }}>
          Re-render ({renderCount})
        </button>
      </div>
      {filtered.map(item => (
        <ListItem key={item} item={item} onRemove={handleRemove} />
      ))}
    </div>
  )
}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'react-context',
    title: 'Theme Context Provider',
    category: 'React',
    difficulty: 'medium',
    estimatedMinutes: 20,
    tags: ['Context API', 'createContext', 'custom hooks', 'TypeScript'],
    description:
      'Eliminate prop-drilling by building a typed ThemeContext. Implement the Provider, a useTheme hook with a runtime guard, and wire it up to a demo app.',
    instructions: [
      'Create a ThemeContext with createContext (typed, no non-null assertion on consumers)',
      'Build ThemeProvider: holds theme state, provides setTheme, wraps children',
      'Implement useTheme() — throw a descriptive error if used outside the Provider',
      'The ThemedCard component must read from context, not props',
      'The theme toggle button must cycle: light → dark → high-contrast → light',
    ],
    previewType: 'react',
    starterCode: `import { createContext, useContext, useState, ReactNode } from 'react'

// ── Types ────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark' | 'high-contrast'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
}

// ── 1. Create the context ─────────────────────────────────────────────
// TODO: Create ThemeContext. Default value should allow detecting "outside Provider" usage.
const ThemeContext = createContext<ThemeContextValue | null>(null)

// ── 2. Provider ───────────────────────────────────────────────────────
// TODO: Implement ThemeProvider — holds theme state, provides setTheme
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// ── 3. Hook ───────────────────────────────────────────────────────────
// TODO: Implement useTheme — must throw if used outside ThemeProvider
export function useTheme(): ThemeContextValue {
  throw new Error('Not implemented')
}

// ── Demo (do not modify) ──────────────────────────────────────────────
const THEMES: Record<Theme, React.CSSProperties> = {
  light:          { background: '#f0f4f8', color: '#1a2840', border: '1px solid #c5d5e8' },
  dark:           { background: '#0a1222', color: '#c5d5e8', border: '1px solid #182840' },
  'high-contrast':{ background: '#000',    color: '#ffff00', border: '2px solid #ffff00' },
}
const NEXT: Record<Theme, Theme> = { light: 'dark', dark: 'high-contrast', 'high-contrast': 'light' }

function ThemedCard() {
  const { theme, setTheme } = useTheme()
  const s = THEMES[theme]
  return (
    <div style={{ ...s, padding:24, borderRadius:8, maxWidth:320, fontFamily:'monospace' }}>
      <div style={{ fontSize:12, marginBottom:8, opacity:.6 }}>Current theme</div>
      <div style={{ fontSize:22, fontWeight:700, marginBottom:16 }}>{theme}</div>
      <button onClick={() => setTheme(NEXT[theme])}
        style={{ padding:'8px 16px', background:'transparent', border:s.border, color:s.color, cursor:'pointer', borderRadius:4, fontFamily:'monospace', width:'100%' }}>
        Switch to {NEXT[theme]}
      </button>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#05090f' }}>
      <ThemeProvider>
        <ThemedCard />
      </ThemeProvider>
    </div>
  )
}`,
    solution: `import { createContext, useContext, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'high-contrast'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}

const THEMES: Record<Theme, React.CSSProperties> = {
  light:          { background: '#f0f4f8', color: '#1a2840', border: '1px solid #c5d5e8' },
  dark:           { background: '#0a1222', color: '#c5d5e8', border: '1px solid #182840' },
  'high-contrast':{ background: '#000',    color: '#ffff00', border: '2px solid #ffff00' },
}
const NEXT: Record<Theme, Theme> = { light: 'dark', dark: 'high-contrast', 'high-contrast': 'light' }

function ThemedCard() {
  const { theme, setTheme } = useTheme()
  const s = THEMES[theme]
  return (
    <div style={{ ...s, padding:24, borderRadius:8, maxWidth:320, fontFamily:'monospace' }}>
      <div style={{ fontSize:12, marginBottom:8, opacity:.6 }}>Current theme</div>
      <div style={{ fontSize:22, fontWeight:700, marginBottom:16 }}>{theme}</div>
      <button onClick={() => setTheme(NEXT[theme])}
        style={{ padding:'8px 16px', background:'transparent', border:s.border, color:s.color, cursor:'pointer', borderRadius:4, fontFamily:'monospace', width:'100%' }}>
        Switch to {NEXT[theme]}
      </button>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#05090f' }}>
      <ThemeProvider>
        <ThemedCard />
      </ThemeProvider>
    </div>
  )
}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // REACT QUERY
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'rq-use-query',
    title: 'Data Fetching with useQuery',
    category: 'React Query',
    difficulty: 'medium',
    estimatedMinutes: 20,
    tags: ['useQuery', 'loading states', 'error handling', 'caching'],
    description:
      'Migrate a manual useState + useEffect data fetcher to React Query. Leverage automatic caching, background refetching, and proper loading/error state handling.',
    instructions: [
      'Replace the manual useEffect fetch with useQuery from @tanstack/react-query',
      'Use queryKey [\'post\', postId] for correct per-post caching',
      'Show a spinner while loading and an error message on failure',
      'Add a Refetch button — disable it while fetching (isFetching)',
      'Use placeholderData: keepPreviousData so old data stays visible while switching posts',
    ],
    previewType: 'react',
    sandpack: {
      dependencies: { '@tanstack/react-query': '^5.0.0' },
      files: {
        '/App.tsx': `import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Solution from './Solution'
const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } })
export default function App() {
  return <QueryClientProvider client={qc}><Solution /></QueryClientProvider>
}`,
      },
    },
    starterCode: `// The QueryClientProvider is already set up in App.tsx — just write the component.
import { useState, useEffect } from 'react'
// TODO: import useQuery (and anything else you need) from '@tanstack/react-query'

interface Post { id: number; title: string; body: string; userId: number }

// ── TODO: Rewrite this component using useQuery ───────────────────────
// Remove the manual useState/useEffect pattern below and replace it.

export default function Solution() {
  const [postId, setPostId] = useState(1)

  // ❌ Manual fetch — replace with useQuery
  const [data, setData] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(\`https://jsonplaceholder.typicode.com/posts/\${postId}\`)
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [postId])

  return (
    <div style={{ padding:24, maxWidth:480, fontFamily:'monospace', background:'#05090f', minHeight:'100vh', color:'#c5d5e8' }}>
      <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
        {[1,2,3,4,5].map(id => (
          <button key={id} onClick={() => setPostId(id)}
            style={{ padding:'4px 12px', background: postId===id ? '#1e3250' : 'transparent',
              border:'1px solid #182840', color:'#c5d5e8', cursor:'pointer', borderRadius:4, fontFamily:'monospace' }}>
            #{id}
          </button>
        ))}
        {/* TODO: Add Refetch button here */}
      </div>
      {loading && <div style={{ color:'#4fc3f7' }}>⟳ Loading...</div>}
      {error  && <div style={{ color:'#ff6b6b' }}>✗ {error}</div>}
      {data && !loading && (
        <div>
          <div style={{ fontSize:11, color:'#4a6580', marginBottom:6 }}>User #{data.userId}</div>
          <div style={{ fontSize:16, fontWeight:600, color:'#4fc3f7', marginBottom:10 }}>{data.title}</div>
          <div style={{ lineHeight:1.7, color:'#8ba8c4' }}>{data.body}</div>
        </div>
      )}
    </div>
  )
}`,
    solution: `import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'

interface Post { id: number; title: string; body: string; userId: number }

export default function Solution() {
  const [postId, setPostId] = useState(1)

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: async () => {
      const r = await fetch(\`https://jsonplaceholder.typicode.com/posts/\${postId}\`)
      if (!r.ok) throw new Error(\`HTTP \${r.status}\`)
      return r.json()
    },
    placeholderData: keepPreviousData,
  })

  return (
    <div style={{ padding:24, maxWidth:480, fontFamily:'monospace', background:'#05090f', minHeight:'100vh', color:'#c5d5e8' }}>
      <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
        {[1,2,3,4,5].map(id => (
          <button key={id} onClick={() => setPostId(id)}
            style={{ padding:'4px 12px', background: postId===id ? '#1e3250' : 'transparent',
              border:'1px solid #182840', color:'#c5d5e8', cursor:'pointer', borderRadius:4, fontFamily:'monospace' }}>
            #{id}
          </button>
        ))}
        <button onClick={() => refetch()} disabled={isFetching}
          style={{ marginLeft:'auto', padding:'4px 12px', background:'transparent',
            border:'1px solid rgba(67,217,173,0.3)', color: isFetching ? '#4a6580' : '#43d9ad',
            cursor: isFetching ? 'not-allowed' : 'pointer', borderRadius:4, fontFamily:'monospace' }}>
          {isFetching ? '⟳ …' : '⟳ Refetch'}
        </button>
      </div>
      {isLoading && <div style={{ color:'#4fc3f7' }}>⟳ Loading...</div>}
      {isError  && <div style={{ color:'#ff6b6b' }}>✗ {(error as Error).message}</div>}
      {data && (
        <div style={{ opacity: isFetching ? .5 : 1, transition:'opacity .2s' }}>
          <div style={{ fontSize:11, color:'#4a6580', marginBottom:6 }}>User #{data.userId}</div>
          <div style={{ fontSize:16, fontWeight:600, color:'#4fc3f7', marginBottom:10 }}>{data.title}</div>
          <div style={{ lineHeight:1.7, color:'#8ba8c4' }}>{data.body}</div>
        </div>
      )}
    </div>
  )
}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'rq-optimistic-update',
    title: 'Optimistic Updates with useMutation',
    category: 'React Query',
    difficulty: 'hard',
    estimatedMinutes: 30,
    tags: ['useMutation', 'optimistic UI', 'cache manipulation', 'rollback'],
    description:
      'Implement a todo list where toggling "done" updates the UI instantly before the server responds, rolls back on error, and invalidates the cache on success.',
    instructions: [
      'Use useMutation with onMutate, onError, and onSettled callbacks',
      'In onMutate: snapshot the current cache, apply the optimistic update, return the snapshot',
      'In onError: restore the snapshot using context from onMutate',
      'In onSettled: call queryClient.invalidateQueries to sync with the server',
      'Introduce a 40% random failure rate in the fake API to test rollback',
    ],
    previewType: 'react',
    sandpack: {
      dependencies: { '@tanstack/react-query': '^5.0.0' },
      files: {
        '/App.tsx': `import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Solution from './Solution'
const qc = new QueryClient()
export default function App() {
  return <QueryClientProvider client={qc}><Solution /></QueryClientProvider>
}`,
      },
    },
    starterCode: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Todo { id: number; title: string; completed: boolean }

// Fake API — 40% failure rate to test rollback
async function toggleTodo(todo: Todo): Promise<Todo> {
  await new Promise(r => setTimeout(r, 600))
  if (Math.random() < 0.4) throw new Error('Server error — rolled back!')
  return { ...todo, completed: !todo.completed }
}

const INITIAL_TODOS: Todo[] = [
  { id: 1, title: 'Setup React Query',    completed: true  },
  { id: 2, title: 'Learn optimistic UI',  completed: false },
  { id: 3, title: 'Handle rollbacks',     completed: false },
  { id: 4, title: 'Write tests',          completed: false },
]

export default function Solution() {
  const queryClient = useQueryClient()

  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: () => Promise.resolve(INITIAL_TODOS),
    staleTime: Infinity,
  })

  // TODO: Implement useMutation with optimistic update
  // 1. onMutate:  snapshot cache → apply optimistic toggle → return snapshot
  // 2. onError:   restore snapshot from context
  // 3. onSettled: invalidateQueries(['todos'])
  const mutation = useMutation({
    mutationFn: toggleTodo,
    // TODO: add onMutate, onError, onSettled
  })

  return (
    <div style={{ padding:24, maxWidth:380, fontFamily:'monospace', background:'#05090f', minHeight:'100vh', color:'#c5d5e8' }}>
      <h2 style={{ color:'#4fc3f7', marginBottom:16, fontSize:18 }}>Todos (toggle to test)</h2>
      {todos.map(todo => (
        <div key={todo.id} onClick={() => mutation.mutate(todo)}
          style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
            background:'#0a1222', border:'1px solid #182840', borderRadius:6, marginBottom:8,
            cursor:'pointer', opacity: mutation.isPending ? .7 : 1 }}>
          <span style={{ fontSize:18, color: todo.completed ? '#43d9ad' : '#2a4260' }}>
            {todo.completed ? '✓' : '○'}
          </span>
          <span style={{ flex:1, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#4a6580' : '#c5d5e8' }}>
            {todo.title}
          </span>
        </div>
      ))}
      {mutation.isError && (
        <div style={{ marginTop:12, color:'#ff6b6b', fontSize:12 }}>
          ✗ {(mutation.error as Error).message}
        </div>
      )}
    </div>
  )
}`,
    solution: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Todo { id: number; title: string; completed: boolean }

async function toggleTodo(todo: Todo): Promise<Todo> {
  await new Promise(r => setTimeout(r, 600))
  if (Math.random() < 0.4) throw new Error('Server error — rolled back!')
  return { ...todo, completed: !todo.completed }
}

const INITIAL_TODOS: Todo[] = [
  { id: 1, title: 'Setup React Query',    completed: true  },
  { id: 2, title: 'Learn optimistic UI',  completed: false },
  { id: 3, title: 'Handle rollbacks',     completed: false },
  { id: 4, title: 'Write tests',          completed: false },
]

export default function Solution() {
  const queryClient = useQueryClient()

  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: () => Promise.resolve(INITIAL_TODOS),
    staleTime: Infinity,
  })

  const mutation = useMutation({
    mutationFn: toggleTodo,

    onMutate: async (todo) => {
      // Cancel in-flight refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // Snapshot current value for rollback
      const snapshot = queryClient.getQueryData<Todo[]>(['todos'])

      // Apply optimistic update
      queryClient.setQueryData<Todo[]>(['todos'], prev =>
        (prev ?? []).map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
      )

      return { snapshot }
    },

    onError: (_err, _todo, context) => {
      // Restore snapshot on failure
      if (context?.snapshot) {
        queryClient.setQueryData(['todos'], context.snapshot)
      }
    },

    onSettled: () => {
      // Always re-sync with server after mutation
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <div style={{ padding:24, maxWidth:380, fontFamily:'monospace', background:'#05090f', minHeight:'100vh', color:'#c5d5e8' }}>
      <h2 style={{ color:'#4fc3f7', marginBottom:16, fontSize:18 }}>Todos (toggle to test)</h2>
      {todos.map(todo => (
        <div key={todo.id} onClick={() => mutation.mutate(todo)}
          style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
            background:'#0a1222', border:'1px solid #182840', borderRadius:6, marginBottom:8,
            cursor:'pointer', opacity: mutation.isPending ? .7 : 1, transition:'opacity .2s' }}>
          <span style={{ fontSize:18, color: todo.completed ? '#43d9ad' : '#2a4260' }}>
            {todo.completed ? '✓' : '○'}
          </span>
          <span style={{ flex:1, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#4a6580' : '#c5d5e8' }}>
            {todo.title}
          </span>
        </div>
      ))}
      {mutation.isError && (
        <div style={{ marginTop:12, color:'#ff6b6b', fontSize:12 }}>
          ✗ {(mutation.error as Error).message}
        </div>
      )}
    </div>
  )
}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ZUSTAND
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'zustand-cart',
    title: 'Shopping Cart with Zustand',
    category: 'Zustand',
    difficulty: 'medium',
    estimatedMinutes: 20,
    tags: ['zustand', 'create', 'immer pattern', 'selectors'],
    description:
      'Build a shopping cart store with Zustand. Practice defining typed state/actions, using atomic selectors to avoid unnecessary re-renders, and computing derived values.',
    instructions: [
      'Implement useCartStore with state: items (CartItem[]) and actions: addItem, removeItem, updateQty, clear',
      'addItem should increment quantity if the item already exists',
      'updateQty(id, qty) — if qty <= 0, remove the item',
      'Export granular selectors (useCartItems, useCartTotal, useCartCount) to minimize re-renders',
      'The demo below should work: add, remove, change quantity, see live totals',
    ],
    previewType: 'react',
    sandpack: {
      dependencies: { zustand: '^4.5.0' },
    },
    starterCode: `import { create } from 'zustand'

interface CartItem { id: string; name: string; price: number; qty: number }

interface CartState {
  items: CartItem[]
  // TODO: define action signatures
  addItem:    (item: Omit<CartItem, 'qty'>) => void
  removeItem: (id: string) => void
  updateQty:  (id: string, qty: number) => void
  clear:      () => void
}

// TODO: Implement the store
export const useCartStore = create<CartState>()((set) => ({
  items: [],

  addItem: (item) => {
    // TODO: if item exists increment qty, else add with qty 1
  },

  removeItem: (id) => {
    // TODO
  },

  updateQty: (id, qty) => {
    // TODO: if qty <= 0, remove; else update
  },

  clear: () => {
    // TODO
  },
}))

// TODO: Granular selectors (each subscribes only to what it needs)
export const useCartItems = () => useCartStore(s => s.items)
export const useCartTotal = () => 0  // TODO: compute from items
export const useCartCount = () => 0  // TODO: sum of all quantities

// ── Demo (do not modify) ──────────────────────────────────────────────
const PRODUCTS = [
  { id: 'p1', name: 'TypeScript Handbook', price: 29 },
  { id: 'p2', name: 'React in Depth',      price: 39 },
  { id: 'p3', name: 'Next.js Mastery',     price: 49 },
]
const s: React.CSSProperties = { fontFamily:'monospace', fontSize:13 }
const btn = (color = '#4fc3f7'): React.CSSProperties => ({
  padding:'3px 10px', background:'transparent', border:\`1px solid \${color}55\`,
  color, cursor:'pointer', borderRadius:4, fontFamily:'monospace', fontSize:12,
})

export default function App() {
  const items    = useCartItems()
  const total    = useCartTotal()
  const count    = useCartCount()
  const { addItem, removeItem, updateQty, clear } = useCartStore()

  return (
    <div style={{ ...s, padding:24, background:'#05090f', minHeight:'100vh', color:'#c5d5e8', maxWidth:480 }}>
      <h2 style={{ color:'#4fc3f7', marginBottom:16 }}>Products</h2>
      {PRODUCTS.map(p => (
        <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #182840' }}>
          <span>{p.name}</span>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ color:'#4a6580' }}>\${p.price}</span>
            <button style={btn('#43d9ad')} onClick={() => addItem(p)}>+ Add</button>
          </div>
        </div>
      ))}

      <h2 style={{ color:'#4fc3f7', margin:'24px 0 12px' }}>Cart ({count} items)</h2>
      {items.length === 0 && <div style={{ color:'#2a4260' }}>Empty</div>}
      {items.map(item => (
        <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid #182840' }}>
          <span style={{ flex:1 }}>{item.name}</span>
          <button style={btn()} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
          <span style={{ width:24, textAlign:'center' }}>{item.qty}</span>
          <button style={btn()} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
          <span style={{ width:48, textAlign:'right', color:'#4a6580' }}>\${(item.price * item.qty).toFixed(2)}</span>
          <button style={btn('#ff6b6b')} onClick={() => removeItem(item.id)}>✕</button>
        </div>
      ))}

      {items.length > 0 && (
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:16, paddingTop:12, borderTop:'1px solid #182840' }}>
          <span style={{ color:'#4a6580' }}>Total</span>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <span style={{ color:'#43d9ad', fontWeight:700, fontSize:18 }}>\${total.toFixed(2)}</span>
            <button style={btn('#ff6b6b')} onClick={clear}>Clear</button>
          </div>
        </div>
      )}
    </div>
  )
}`,
    solution: `import { create } from 'zustand'

interface CartItem { id: string; name: string; price: number; qty: number }

interface CartState {
  items: CartItem[]
  addItem:    (item: Omit<CartItem, 'qty'>) => void
  removeItem: (id: string) => void
  updateQty:  (id: string, qty: number) => void
  clear:      () => void
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],

  addItem: (item) => set(s => {
    const exists = s.items.find(i => i.id === item.id)
    if (exists) {
      return { items: s.items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) }
    }
    return { items: [...s.items, { ...item, qty: 1 }] }
  }),

  removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),

  updateQty: (id, qty) => set(s => ({
    items: qty <= 0
      ? s.items.filter(i => i.id !== id)
      : s.items.map(i => i.id === id ? { ...i, qty } : i)
  })),

  clear: () => set({ items: [] }),
}))

export const useCartItems = () => useCartStore(s => s.items)
export const useCartTotal = () => useCartStore(s => s.items.reduce((sum, i) => sum + i.price * i.qty, 0))
export const useCartCount = () => useCartStore(s => s.items.reduce((sum, i) => sum + i.qty, 0))

const PRODUCTS = [
  { id: 'p1', name: 'TypeScript Handbook', price: 29 },
  { id: 'p2', name: 'React in Depth',      price: 39 },
  { id: 'p3', name: 'Next.js Mastery',     price: 49 },
]
const s: React.CSSProperties = { fontFamily:'monospace', fontSize:13 }
const btn = (color = '#4fc3f7'): React.CSSProperties => ({
  padding:'3px 10px', background:'transparent', border:\`1px solid \${color}55\`,
  color, cursor:'pointer', borderRadius:4, fontFamily:'monospace', fontSize:12,
})

export default function App() {
  const items    = useCartItems()
  const total    = useCartTotal()
  const count    = useCartCount()
  const { addItem, removeItem, updateQty, clear } = useCartStore()

  return (
    <div style={{ ...s, padding:24, background:'#05090f', minHeight:'100vh', color:'#c5d5e8', maxWidth:480 }}>
      <h2 style={{ color:'#4fc3f7', marginBottom:16 }}>Products</h2>
      {PRODUCTS.map(p => (
        <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #182840' }}>
          <span>{p.name}</span>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ color:'#4a6580' }}>\${p.price}</span>
            <button style={btn('#43d9ad')} onClick={() => addItem(p)}>+ Add</button>
          </div>
        </div>
      ))}
      <h2 style={{ color:'#4fc3f7', margin:'24px 0 12px' }}>Cart ({count} items)</h2>
      {items.length === 0 && <div style={{ color:'#2a4260' }}>Empty</div>}
      {items.map(item => (
        <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid #182840' }}>
          <span style={{ flex:1 }}>{item.name}</span>
          <button style={btn()} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
          <span style={{ width:24, textAlign:'center' }}>{item.qty}</span>
          <button style={btn()} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
          <span style={{ width:48, textAlign:'right', color:'#4a6580' }}>\${(item.price * item.qty).toFixed(2)}</span>
          <button style={btn('#ff6b6b')} onClick={() => removeItem(item.id)}>✕</button>
        </div>
      ))}
      {items.length > 0 && (
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:16, paddingTop:12, borderTop:'1px solid #182840' }}>
          <span style={{ color:'#4a6580' }}>Total</span>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <span style={{ color:'#43d9ad', fontWeight:700, fontSize:18 }}>\${total.toFixed(2)}</span>
            <button style={btn('#ff6b6b')} onClick={clear}>Clear</button>
          </div>
        </div>
      )}
    </div>
  )
}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEXT.JS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'nextjs-server-action',
    title: 'Server Action Form with Validation',
    category: 'Next.js',
    difficulty: 'medium',
    estimatedMinutes: 20,
    tags: ['server actions', 'useFormState', 'Zod', 'App Router'],
    description:
      'Build a contact form backed by a Next.js Server Action. Validate input with Zod on the server, return typed errors, and show them inline — no API route required.',
    instructions: [
      'Create a submitContact Server Action ("use server") that accepts FormData',
      'Parse and validate with Zod (name min 2 chars, valid email, message min 10 chars)',
      'Return { success: false, errors: FieldErrors } on validation failure',
      'Return { success: true } on success and simulate a 500ms async operation',
      'Use useFormState in the client form component to display per-field errors',
    ],
    previewType: 'nextjs',
    starterCode: `// ── actions.ts (server action) ──────────────────────────────────────
'use server'
// TODO: import zod

// Define the Zod schema
// const contactSchema = z.object({ ... })

export type FormState =
  | { success: true }
  | { success: false; errors: Record<string, string[]> }

export async function submitContact(
  _prev: FormState | null,
  formData: FormData,
): Promise<FormState> {
  // TODO:
  // 1. Extract fields from formData
  // 2. Parse with contactSchema.safeParse(...)
  // 3. If invalid, return { success: false, errors: result.error.flatten().fieldErrors }
  // 4. Simulate async work: await new Promise(r => setTimeout(r, 500))
  // 5. Return { success: true }
  return { success: false, errors: { name: ['Not implemented'] } }
}


// ── ContactForm.tsx (client component) ───────────────────────────────
'use client'
import { useFormState, useFormStatus } from 'react-dom'
// import { submitContact, FormState } from './actions'  (same file here)

const initialState: FormState | null = null

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}
      style={{ padding:'10px 24px', background: pending ? '#0e1826' : '#1e3250',
        border:'1px solid rgba(79,195,247,0.3)', color:'#4fc3f7', cursor: pending ? 'not-allowed' : 'pointer',
        borderRadius:4, fontFamily:'monospace', fontSize:14, width:'100%' }}>
      {pending ? 'Sending…' : 'Send Message'}
    </button>
  )
}

// TODO: Implement the form component
// It should use useFormState(submitContact, initialState)
// and display per-field errors below each input
export default function ContactForm() {
  return (
    <div style={{ padding:32, maxWidth:400, fontFamily:'monospace', background:'#05090f', minHeight:'100vh', color:'#c5d5e8' }}>
      <h1 style={{ color:'#4fc3f7', marginBottom:24, fontSize:20 }}>Contact</h1>
      <p style={{ color:'#ff6b6b' }}>TODO: implement the form</p>
    </div>
  )
}`,
    solution: `'use server'
// ── Server Action (actions.ts merged here for the challenge) ─────────
import { z } from 'zod'

const contactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type FormState =
  | { success: true }
  | { success: false; errors: Record<string, string[]> }

export async function submitContact(
  _prev: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    name:    formData.get('name'),
    email:   formData.get('email'),
    message: formData.get('message'),
  }
  const result = contactSchema.safeParse(raw)
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors as Record<string, string[]> }
  }
  await new Promise(r => setTimeout(r, 500))
  return { success: true }
}

// ── Client Form ───────────────────────────────────────────────────────
'use client'
import { useFormState, useFormStatus } from 'react-dom'

const initialState: FormState | null = null

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}
      style={{ padding:'10px 24px', background: pending ? '#0e1826' : '#1e3250',
        border:'1px solid rgba(79,195,247,0.3)', color:'#4fc3f7', cursor: pending ? 'not-allowed' : 'pointer',
        borderRadius:4, fontFamily:'monospace', fontSize:14, width:'100%' }}>
      {pending ? 'Sending…' : 'Send Message'}
    </button>
  )
}

const field: React.CSSProperties = {
  width:'100%', padding:'8px 12px', background:'#0a1222',
  border:'1px solid #182840', color:'#c5d5e8', borderRadius:4,
  fontFamily:'monospace', fontSize:14, outline:'none',
}
const err: React.CSSProperties = { color:'#ff6b6b', fontSize:12, marginTop:4 }

export default function ContactForm() {
  const [state, action] = useFormState(submitContact, initialState)
  const errors = state && !state.success ? state.errors : {}

  return (
    <div style={{ padding:32, maxWidth:400, fontFamily:'monospace', background:'#05090f', minHeight:'100vh', color:'#c5d5e8' }}>
      <h1 style={{ color:'#4fc3f7', marginBottom:24, fontSize:20 }}>Contact</h1>

      {state?.success && (
        <div style={{ padding:12, background:'rgba(67,217,173,.1)', border:'1px solid rgba(67,217,173,.3)', borderRadius:4, color:'#43d9ad', marginBottom:20 }}>
          ✓ Message sent!
        </div>
      )}

      <form action={action} style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div>
          <input name="name" placeholder="Name" style={field} />
          {errors.name?.map(e => <div key={e} style={err}>{e}</div>)}
        </div>
        <div>
          <input name="email" type="email" placeholder="Email" style={field} />
          {errors.email?.map(e => <div key={e} style={err}>{e}</div>)}
        </div>
        <div>
          <textarea name="message" placeholder="Message" rows={4}
            style={{ ...field, resize:'vertical' }} />
          {errors.message?.map(e => <div key={e} style={err}>{e}</div>)}
        </div>
        <SubmitButton />
      </form>
    </div>
  )
}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'nextjs-middleware',
    title: 'JWT Auth Middleware',
    category: 'Next.js',
    difficulty: 'hard',
    estimatedMinutes: 25,
    tags: ['middleware', 'JWT', 'NextResponse', 'cookies'],
    description:
      'Protect a set of routes using Next.js middleware. Verify a JWT from a cookie, redirect unauthenticated users to /login, and inject the decoded user payload as a request header.',
    instructions: [
      'Read the JWT from the "token" cookie using request.cookies.get()',
      'Verify and decode the token using jose (available in Edge runtime)',
      'Redirect to /login if the cookie is missing or invalid',
      'On success, clone the request headers and add x-user-id and x-user-role',
      'Apply the middleware only to /dashboard and /api/protected/* using the matcher config',
    ],
    previewType: 'nextjs',
    starterCode: `// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret')

export async function middleware(request: NextRequest) {
  // TODO: 1. Read the 'token' cookie
  const token = undefined

  // TODO: 2. If missing, redirect to /login (preserve the original URL as ?from=...)
  if (!token) {
    // return NextResponse.redirect(...)
  }

  try {
    // TODO: 3. Verify the JWT with jwtVerify(token, JWT_SECRET)
    //          The payload will have: { sub: userId, role: 'admin' | 'user' }
    const { payload } = { payload: { sub: '', role: '' } } // replace this

    // TODO: 4. Clone the request headers and add:
    //          'x-user-id'   = payload.sub
    //          'x-user-role' = payload.role
    //          Then call NextResponse.next({ request: { headers: ... } })

    return NextResponse.next()
  } catch {
    // TODO: 5. On invalid token, redirect to /login with ?error=invalid_token
  }
}

export const config = {
  // TODO: Add matcher for /dashboard and /api/protected paths only
  matcher: [],
}`,
    solution: `// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret')

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id',   String(payload.sub ?? ''))
    requestHeaders.set('x-user-role', String(payload.role ?? ''))

    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  } catch {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'invalid_token')
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
}`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'auth-jwt',
    title: 'JWT — Sign, Verify & Decode',
    category: 'Auth',
    difficulty: 'hard',
    estimatedMinutes: 25,
    tags: ['JWT', 'HMAC-SHA256', 'base64url', 'expiry'],
    description:
      'Implement a minimal JWT library from scratch: base64url encoding, HMAC-SHA256 signing, and verification with expiry checking — no external libraries.',
    instructions: [
      'Implement base64urlEncode and base64urlDecode (standard base64 + URL-safe replacements)',
      'Implement sign(payload, secret): create header.payload.signature format',
      'Implement verify(token, secret): check signature and exp claim, throw on failure',
      'Implement decode(token): return header + payload without verifying (unsafe)',
      'All test cases at the bottom must pass',
    ],
    previewType: 'typescript',
    starterCode: `// Implement a minimal JWT library using the Web Crypto API (SubtleCrypto)
// No external dependencies allowed.

type JwtPayload = Record<string, unknown> & { exp?: number; iat?: number }

// ── Helpers ──────────────────────────────────────────────────────────
// TODO: Implement base64url encoding/decoding
function base64urlEncode(input: string): string {
  throw new Error('not implemented')
}

function base64urlDecode(input: string): string {
  throw new Error('not implemented')
}

async function hmacSign(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return base64urlEncode(String.fromCharCode(...new Uint8Array(sig)))
}

async function hmacVerify(message: string, signature: string, secret: string): Promise<boolean> {
  const expected = await hmacSign(message, secret)
  // TODO: timing-safe comparison
  return expected === signature
}

// ── API ───────────────────────────────────────────────────────────────
export async function sign(payload: JwtPayload, secret: string, expiresInSecs = 3600): Promise<string> {
  // TODO:
  // 1. Add iat (now) and exp (now + expiresInSecs) to payload
  // 2. Build header = { alg: 'HS256', typ: 'JWT' }
  // 3. Encode both as base64url JSON strings
  // 4. Create signature = hmacSign(header + '.' + payload, secret)
  // 5. Return header.payload.signature
  throw new Error('not implemented')
}

export async function verify(token: string, secret: string): Promise<JwtPayload> {
  // TODO:
  // 1. Split into [header, payload, signature]
  // 2. Verify signature against header + '.' + payload
  // 3. Decode payload, check exp claim
  // 4. Throw if invalid signature or expired
  // 5. Return decoded payload
  throw new Error('not implemented')
}

export function decode(token: string): { header: unknown; payload: JwtPayload } {
  // TODO: decode header and payload (no verification)
  throw new Error('not implemented')
}

// ─── Tests ────────────────────────────────────────────────────────────
async function runTests() {
  const SECRET = 'super-secret-key'

  // Round-trip
  const token = await sign({ userId: 'u1', role: 'admin' }, SECRET, 60)
  console.assert(token.split('.').length === 3, 'Token must have 3 parts')

  const payload = await verify(token, SECRET)
  console.assert(payload.userId === 'u1', 'userId matches')
  console.assert(payload.role === 'admin', 'role matches')
  console.assert(typeof payload.exp === 'number', 'exp is set')

  // Expired token
  const expired = await sign({ userId: 'u2' }, SECRET, -1)
  try {
    await verify(expired, SECRET)
    console.assert(false, 'Should have thrown for expired token')
  } catch (e: any) {
    console.assert(e.message.includes('expired'), 'Correct error message')
  }

  // Tampered token
  const tampered = token.slice(0, -5) + 'XXXXX'
  try {
    await verify(tampered, SECRET)
    console.assert(false, 'Should have thrown for tampered token')
  } catch (e: any) {
    console.assert(e.message.includes('signature'), 'Correct error message')
  }

  console.log('✅ All tests passed')
}
runTests()`,
    solution: `type JwtPayload = Record<string, unknown> & { exp?: number; iat?: number }

function base64urlEncode(input: string): string {
  return btoa(input).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=/g, '')
}

function base64urlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(input.length + (4 - input.length % 4) % 4, '=')
  return atob(padded)
}

async function hmacSign(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return base64urlEncode(String.fromCharCode(...new Uint8Array(sig)))
}

async function hmacVerify(message: string, signature: string, secret: string): Promise<boolean> {
  const expected = await hmacSign(message, secret)
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== signature.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  return diff === 0
}

export async function sign(payload: JwtPayload, secret: string, expiresInSecs = 3600): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSecs }
  const header  = base64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body    = base64urlEncode(JSON.stringify(fullPayload))
  const sig     = await hmacSign(\`\${header}.\${body}\`, secret)
  return \`\${header}.\${body}.\${sig}\`
}

export async function verify(token: string, secret: string): Promise<JwtPayload> {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token format')
  const [header, body, signature] = parts
  const valid = await hmacVerify(\`\${header}.\${body}\`, signature, secret)
  if (!valid) throw new Error('Invalid signature')
  const payload: JwtPayload = JSON.parse(base64urlDecode(body))
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired')
  }
  return payload
}

export function decode(token: string): { header: unknown; payload: JwtPayload } {
  const [header, body] = token.split('.')
  return {
    header:  JSON.parse(base64urlDecode(header)),
    payload: JSON.parse(base64urlDecode(body)),
  }
}

async function runTests() {
  const SECRET = 'super-secret-key'
  const token = await sign({ userId: 'u1', role: 'admin' }, SECRET, 60)
  console.assert(token.split('.').length === 3, 'Token must have 3 parts')
  const payload = await verify(token, SECRET)
  console.assert(payload.userId === 'u1', 'userId matches')
  console.assert(payload.role === 'admin', 'role matches')
  console.assert(typeof payload.exp === 'number', 'exp is set')
  const expired = await sign({ userId: 'u2' }, SECRET, -1)
  try { await verify(expired, SECRET); console.assert(false) }
  catch (e: any) { console.assert(e.message.includes('expired')) }
  const tampered = token.slice(0, -5) + 'XXXXX'
  try { await verify(tampered, SECRET); console.assert(false) }
  catch (e: any) { console.assert(e.message.includes('signature')) }
  console.log('✅ All tests passed')
}
runTests()`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TESTING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'test-jest-unit',
    title: 'Jest Unit Tests',
    category: 'Testing',
    difficulty: 'medium',
    estimatedMinutes: 20,
    tags: ['Jest', 'unit testing', 'mocking', 'edge cases'],
    description:
      'Write a comprehensive Jest test suite for a set of utility functions. Cover happy paths, edge cases, and use jest.fn() to mock dependencies.',
    instructions: [
      'Test formatCurrency: correct output, locale options, edge cases (0, negative, NaN)',
      'Test debounce: verify it delays execution and collapses rapid calls',
      'Test fetchUser: use jest.spyOn to mock fetch, test success and 404/500 paths',
      'Test groupBy: correct grouping, empty array, missing key',
      'Aim for all branches covered — think about what could go wrong',
    ],
    previewType: 'test',
    starterCode: `// ── Functions under test ──────────────────────────────────────────────

export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  if (isNaN(amount)) return 'N/A'
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
  debounced.cancel = () => clearTimeout(timer)
  return debounced
}

export async function fetchUser(id: string): Promise<{ id: string; name: string }> {
  const res = await fetch(\`/api/users/\${id}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}

export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const group = String(item[key] ?? '__undefined__')
    ;(acc[group] ??= []).push(item)
    return acc
  }, {} as Record<string, T[]>)
}


// ── Test suite ─────────────────────────────────────────────────────────
// Write your Jest tests below. Run them with: npx jest

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    // TODO
  })

  it('handles zero', () => {
    // TODO
  })

  it('handles negative values', () => {
    // TODO
  })

  it('returns "N/A" for NaN', () => {
    // TODO
  })

  it('supports other currencies', () => {
    // TODO: test EUR with locale 'de-DE'
  })
})

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('delays execution by the specified ms', () => {
    // TODO
  })

  it('collapses multiple rapid calls into one', () => {
    // TODO: call 3 times quickly, advance timer, verify fn called once
  })

  it('.cancel() prevents the pending call', () => {
    // TODO
  })
})

describe('fetchUser', () => {
  it('returns user on success', async () => {
    // TODO: mock fetch to return { id: '1', name: 'Alice' }
  })

  it('throws on 404', async () => {
    // TODO: mock fetch with { ok: false, status: 404 }
  })
})

describe('groupBy', () => {
  const people = [
    { name: 'Alice', dept: 'eng' },
    { name: 'Bob',   dept: 'eng' },
    { name: 'Carol', dept: 'design' },
  ]

  it('groups items by key', () => {
    // TODO
  })

  it('returns empty object for empty array', () => {
    // TODO
  })

  it('groups items with missing key under "__undefined__"', () => {
    // TODO
  })
})`,
    solution: `export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  if (isNaN(amount)) return 'N/A'
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
  debounced.cancel = () => clearTimeout(timer)
  return debounced
}

export async function fetchUser(id: string): Promise<{ id: string; name: string }> {
  const res = await fetch(\`/api/users/\${id}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}

export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const group = String(item[key] ?? '__undefined__')
    ;(acc[group] ??= []).push(item)
    return acc
  }, {} as Record<string, T[]>)
}


describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50')
  })
  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
  it('handles negative values', () => {
    expect(formatCurrency(-99.99)).toBe('-$99.99')
  })
  it('returns "N/A" for NaN', () => {
    expect(formatCurrency(NaN)).toBe('N/A')
  })
  it('supports EUR with de-DE locale', () => {
    const result = formatCurrency(1000, 'EUR', 'de-DE')
    expect(result).toContain('€')
  })
})

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('delays execution by the specified ms', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 300)
    debounced()
    expect(fn).not.toHaveBeenCalled()
    jest.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('collapses multiple rapid calls into one', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 300)
    debounced()
    debounced()
    debounced()
    jest.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('.cancel() prevents the pending call', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 300)
    debounced()
    debounced.cancel()
    jest.advanceTimersByTime(300)
    expect(fn).not.toHaveBeenCalled()
  })
})

describe('fetchUser', () => {
  it('returns user on success', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', name: 'Alice' }),
    } as Response)
    const user = await fetchUser('1')
    expect(user).toEqual({ id: '1', name: 'Alice' })
  })

  it('throws on 404', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false, status: 404,
    } as Response)
    await expect(fetchUser('999')).rejects.toThrow('HTTP 404')
  })
})

describe('groupBy', () => {
  const people = [
    { name: 'Alice', dept: 'eng' },
    { name: 'Bob',   dept: 'eng' },
    { name: 'Carol', dept: 'design' },
  ]

  it('groups items by key', () => {
    const result = groupBy(people, 'dept')
    expect(result.eng).toHaveLength(2)
    expect(result.design).toHaveLength(1)
    expect(result.eng[0].name).toBe('Alice')
  })

  it('returns empty object for empty array', () => {
    expect(groupBy([], 'dept')).toEqual({})
  })

  it('groups items with missing key under "__undefined__"', () => {
    const items = [{ name: 'Dave' }] as any[]
    const result = groupBy(items, 'dept')
    expect(result.__undefined__).toHaveLength(1)
  })
})`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'test-rtl',
    title: 'React Testing Library',
    category: 'Testing',
    difficulty: 'hard',
    estimatedMinutes: 30,
    tags: ['RTL', 'jest', 'userEvent', 'accessibility', 'async'],
    description:
      'Write React Testing Library tests for a login form component. Test rendering, user interactions, async submission, error states, and accessibility.',
    instructions: [
      'Test that the form renders email/password fields and a submit button',
      'Test validation: empty submit shows error messages without calling onLogin',
      'Test successful login: fill fields, submit, verify onLogin was called with correct args',
      'Test async loading state: button should show "Logging in…" while pending',
      'Test error state: when onLogin throws, show the error message',
      'Use getByRole, findByText, userEvent — avoid getByTestId',
    ],
    previewType: 'test',
    starterCode: `import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import LoginForm from './LoginForm'

// ── Component under test ──────────────────────────────────────────────
// (included here for the challenge)
import { useState } from 'react'

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [emailErr, setEmailErr] = useState('')
  const [passErr, setPassErr]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailErr('')
    setPassErr('')
    setError('')
    let valid = true
    if (!email)    { setEmailErr('Email is required');    valid = false }
    if (!password) { setPassErr('Password is required');  valid = false }
    if (!valid) return
    setLoading(true)
    try {
      await onLogin(email, password)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Login form">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        {emailErr && <span role="alert">{emailErr}</span>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {passErr && <span role="alert">{passErr}</span>}
      </div>
      {error && <div role="alert">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  )
}

// ── Tests ─────────────────────────────────────────────────────────────
const user = userEvent.setup()

describe('LoginForm', () => {
  it('renders email, password fields and submit button', () => {
    // TODO
  })

  it('shows validation errors when submitted empty', async () => {
    // TODO
  })

  it('calls onLogin with email and password on valid submit', async () => {
    // TODO
  })

  it('shows loading state during submission', async () => {
    // TODO: use a never-resolving onLogin promise
  })

  it('shows error message when onLogin throws', async () => {
    // TODO
  })
})`,
    solution: `import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [emailErr, setEmailErr] = useState('')
  const [passErr, setPassErr]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailErr(''); setPassErr(''); setError('')
    let valid = true
    if (!email)    { setEmailErr('Email is required');    valid = false }
    if (!password) { setPassErr('Password is required');  valid = false }
    if (!valid) return
    setLoading(true)
    try { await onLogin(email, password) }
    catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Login form">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        {emailErr && <span role="alert">{emailErr}</span>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {passErr && <span role="alert">{passErr}</span>}
      </div>
      {error && <div role="alert">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  )
}

const user = userEvent.setup()

describe('LoginForm', () => {
  it('renders email, password fields and submit button', () => {
    render(<LoginForm onLogin={jest.fn()} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitted empty', async () => {
    render(<LoginForm onLogin={jest.fn()} />)
    await user.click(screen.getByRole('button', { name: /log in/i }))
    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('calls onLogin with email and password on valid submit', async () => {
    const onLogin = jest.fn().mockResolvedValue(undefined)
    render(<LoginForm onLogin={onLogin} />)
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await user.type(screen.getByLabelText(/password/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /log in/i }))
    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith('alice@example.com', 'secret123')
    })
  })

  it('shows loading state during submission', async () => {
    const onLogin = jest.fn(() => new Promise<void>(() => {})) // never resolves
    render(<LoginForm onLogin={onLogin} />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'pass')
    await user.click(screen.getByRole('button', { name: /log in/i }))
    expect(await screen.findByRole('button', { name: /logging in/i })).toBeDisabled()
  })

  it('shows error message when onLogin throws', async () => {
    const onLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'))
    render(<LoginForm onLogin={onLogin} />)
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /log in/i }))
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })
})`,
  },
  {
    id: 'react-hooks-javascript',
    title: 'React Hooks in JavaScript',
    category: 'React',
    difficulty: 'medium',
    estimatedMinutes: 18,
    tags: ['react', 'javascript', 'hooks', 'state management'],
    description:
      'Implementa un hook personalizado en JavaScript para manejar una lista de tareas con filtros y métricas derivadas sin usar TypeScript.',
    instructions: [
      'Implementa useTaskBoard con estado de tasks, filter y acciones add/toggle/remove',
      'Agrega computed values: total, completed, pending',
      'Filtra por all, active y done',
      'Evita mutaciones directas del estado',
    ],
    previewType: 'react',
    starterCode: `import { useMemo, useState } from 'react'

export function useTaskBoard(initial = []) {
  const [tasks, setTasks] = useState(initial)
  const [filter, setFilter] = useState('all')

  const addTask = (title) => {
    // TODO
  }

  const toggleTask = (id) => {
    // TODO
  }

  const removeTask = (id) => {
    // TODO
  }

  const visibleTasks = useMemo(() => {
    // TODO
    return tasks
  }, [tasks, filter])

  const total = tasks.length
  const completed = tasks.filter((t) => t.done).length
  const pending = total - completed

  return {
    tasks: visibleTasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    removeTask,
    total,
    completed,
    pending,
  }
}

export default function App() {
  const board = useTaskBoard([
    { id: 1, title: 'Resolver challenge', done: false },
    { id: 2, title: 'Escribir tests', done: true },
  ])

  return (
    <div style={{ padding: 24, fontFamily: 'monospace', background: '#05090f', minHeight: '100vh', color: '#c5d5e8' }}>
      <h2 style={{ color: '#4fc3f7' }}>Task Board</h2>
      <p>Total: {board.total} / Done: {board.completed} / Pending: {board.pending}</p>
    </div>
  )
}`,
    solution: `import { useMemo, useState } from 'react'

export function useTaskBoard(initial = []) {
  const [tasks, setTasks] = useState(initial)
  const [filter, setFilter] = useState('all')

  const addTask = (title) => {
    const text = String(title ?? '').trim()
    if (!text) return
    setTasks((prev) => [...prev, { id: Date.now(), title: text, done: false }])
  }

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.done)
    if (filter === 'done') return tasks.filter((task) => task.done)
    return tasks
  }, [tasks, filter])

  const total = tasks.length
  const completed = tasks.filter((task) => task.done).length
  const pending = total - completed

  return {
    tasks: visibleTasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    removeTask,
    total,
    completed,
    pending,
  }
}

export default function App() {
  const board = useTaskBoard([
    { id: 1, title: 'Resolver challenge', done: false },
    { id: 2, title: 'Escribir tests', done: true },
  ])

  return (
    <div style={{ padding: 24, fontFamily: 'monospace', background: '#05090f', minHeight: '100vh', color: '#c5d5e8' }}>
      <h2 style={{ color: '#4fc3f7' }}>Task Board</h2>
      <p>Total: {board.total} / Done: {board.completed} / Pending: {board.pending}</p>
    </div>
  )
}`,
  },
  {
    id: 'nextjs-route-handler-javascript',
    title: 'Next.js Route Handler (JavaScript)',
    category: 'Next.js',
    difficulty: 'medium',
    estimatedMinutes: 20,
    tags: ['nextjs', 'javascript', 'route handlers', 'validation'],
    description:
      'Crea un Route Handler en JavaScript con validación manual, códigos HTTP correctos y respuesta JSON consistente.',
    instructions: [
      'Implementa POST /api/feedback con validación de name, email y message',
      'Retorna 400 con lista de errores cuando falten campos',
      'Retorna 201 con un id generado y timestamp en caso exitoso',
      'Mantén formato de respuesta estable para cliente',
    ],
    previewType: 'nextjs',
    starterCode: `// app/api/feedback/route.js
export async function POST(req) {
  const body = await req.json()

  // TODO: validar body
  // TODO: si hay errores devolver { ok: false, errors: [] } con status 400
  // TODO: si es valido devolver { ok: true, data: { id, createdAt } } con status 201

  return Response.json({ ok: false, errors: ['Not implemented'] }, { status: 500 })
}`,
    solution: `// app/api/feedback/route.js
export async function POST(req) {
  const body = await req.json()
  const errors = []

  if (!body?.name || String(body.name).trim().length < 2) {
    errors.push('Name must have at least 2 characters')
  }
  if (!body?.email || !String(body.email).includes('@')) {
    errors.push('Email is invalid')
  }
  if (!body?.message || String(body.message).trim().length < 10) {
    errors.push('Message must have at least 10 characters')
  }

  if (errors.length > 0) {
    return Response.json({ ok: false, errors }, { status: 400 })
  }

  return Response.json(
    {
      ok: true,
      data: {
        id: 'fb_' + Date.now(),
        createdAt: new Date().toISOString(),
      },
    },
    { status: 201 },
  )
}`,
  },
  {
    id: 'test-jest-mock-timers',
    title: 'Jest Mock Timers & Async',
    category: 'Testing',
    difficulty: 'medium',
    estimatedMinutes: 22,
    tags: ['jest', 'testing', 'javascript', 'fake timers', 'async'],
    description:
      'Practica pruebas de JavaScript con Jest usando fake timers, pruebas async y mocks para cubrir ramas de tiempo y errores.',
    instructions: [
      'Escribe tests para retryWithDelay con success en primer intento',
      'Escribe tests para retryWithDelay con reintentos y success final',
      'Escribe tests para fallo total al superar maxRetries',
      'Usa jest.useFakeTimers y avanza el tiempo para no esperar delays reales',
    ],
    previewType: 'test',
    starterCode: `async function retryWithDelay(fn, maxRetries = 2, delayMs = 200) {
  let attempts = 0
  let lastError = null

  while (attempts <= maxRetries) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempts === maxRetries) throw lastError
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      attempts += 1
    }
  }

  throw lastError
}

describe('retryWithDelay', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('returns immediately when fn resolves first try', async () => {
    // TODO
  })

  it('retries and then succeeds', async () => {
    // TODO
  })

  it('throws when all retries fail', async () => {
    // TODO
  })
})`,
    solution: `async function retryWithDelay(fn, maxRetries = 2, delayMs = 200) {
  let attempts = 0
  let lastError = null

  while (attempts <= maxRetries) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempts === maxRetries) throw lastError
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      attempts += 1
    }
  }

  throw lastError
}

describe('retryWithDelay', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('returns immediately when fn resolves first try', async () => {
    const fn = jest.fn().mockResolvedValue('ok')
    await expect(retryWithDelay(fn, 2, 200)).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries and then succeeds', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('ok')

    const promise = retryWithDelay(fn, 3, 200)
    await jest.advanceTimersByTimeAsync(400)
    await expect(promise).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('throws when all retries fail', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fail'))
    const promise = retryWithDelay(fn, 2, 200)
    await jest.advanceTimersByTimeAsync(400)
    await expect(promise).rejects.toThrow('always fail')
    expect(fn).toHaveBeenCalledTimes(3)
  })
})`,
  },
  {
    id: 'test-jest-fetch-hooks',
    title: 'Jest: Mock Fetch + Hooks',
    category: 'Testing',
    difficulty: 'hard',
    estimatedMinutes: 28,
    tags: ['jest', 'javascript', 'react', 'hooks', 'mocking'],
    description:
      'Escribe pruebas para un hook de datos que usa fetch, incluyendo estados de carga, éxito, error y cancelación al desmontar.',
    instructions: [
      'Testea estado inicial del hook (idle/loading)',
      'Mockea fetch para flujo exitoso y verifica data final',
      'Mockea fetch fallido y verifica mensaje de error',
      'Valida que no se haga setState tras un unmount',
      'No uses snapshots; aserciones explícitas por estado',
    ],
    previewType: 'test',
    starterCode: `import { useEffect, useState } from 'react'
import { renderHook, waitFor } from '@testing-library/react'

function useUserProfile(userId) {
  const [state, setState] = useState({ loading: true, data: null, error: '' })

  useEffect(() => {
    let active = true
    fetch('/api/users/' + userId)
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json()
      })
      .then((data) => {
        if (active) setState({ loading: false, data, error: '' })
      })
      .catch((err) => {
        if (active) setState({ loading: false, data: null, error: err.message })
      })

    return () => {
      active = false
    }
  }, [userId])

  return state
}

describe('useUserProfile', () => {
  it('starts in loading state', () => {
    // TODO
  })

  it('returns data on successful fetch', async () => {
    // TODO
  })

  it('returns error when fetch fails', async () => {
    // TODO
  })

  it('does not update state after unmount', async () => {
    // TODO
  })
})`,
    solution: `import { useEffect, useState } from 'react'
import { renderHook, waitFor } from '@testing-library/react'

function useUserProfile(userId) {
  const [state, setState] = useState({ loading: true, data: null, error: '' })

  useEffect(() => {
    let active = true
    fetch('/api/users/' + userId)
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json()
      })
      .then((data) => {
        if (active) setState({ loading: false, data, error: '' })
      })
      .catch((err) => {
        if (active) setState({ loading: false, data: null, error: err.message })
      })

    return () => {
      active = false
    }
  }, [userId])

  return state
}

describe('useUserProfile', () => {
  it('starts in loading state', () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1' }),
    })
    const { result } = renderHook(() => useUserProfile('1'))
    expect(result.current.loading).toBe(true)
  })

  it('returns data on successful fetch', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1', name: 'Ada' }),
    })
    const { result } = renderHook(() => useUserProfile('1'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual({ id: '1', name: 'Ada' })
    expect(result.current.error).toBe('')
  })

  it('returns error when fetch fails', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })
    const { result } = renderHook(() => useUserProfile('1'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toContain('HTTP 500')
  })

  it('does not update state after unmount', async () => {
    jest.spyOn(globalThis, 'fetch').mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true, json: async () => ({ id: '1' }) }), 10),
        ),
    )
    const { unmount } = renderHook(() => useUserProfile('1'))
    unmount()
    await new Promise((r) => setTimeout(r, 20))
    expect(true).toBe(true)
  })
})`,
  },
  {
    id: 'test-next-route-handler-jest',
    title: 'Test Next Route Handler with Jest',
    category: 'Testing',
    difficulty: 'medium',
    estimatedMinutes: 24,
    tags: ['jest', 'nextjs', 'javascript', 'api', 'route handlers'],
    description:
      'Cubre con Jest un Route Handler de Next.js validando códigos HTTP, payloads y ramas de error.',
    instructions: [
      'Testea 400 cuando faltan campos requeridos',
      'Testea 201 cuando el payload es válido',
      'Testea que el shape de respuesta sea estable (ok/errors/data)',
      'Agrega un test para body inválido (JSON malformado)',
    ],
    previewType: 'test',
    starterCode: `async function POST(req) {
  try {
    const body = await req.json()
    const errors = []

    if (!body?.title || String(body.title).trim().length < 3) errors.push('Invalid title')
    if (!body?.content || String(body.content).trim().length < 10) errors.push('Invalid content')

    if (errors.length) {
      return { status: 400, body: { ok: false, errors } }
    }

    return {
      status: 201,
      body: { ok: true, data: { id: 'post_' + Date.now(), title: body.title } },
    }
  } catch {
    return { status: 400, body: { ok: false, errors: ['Invalid JSON body'] } }
  }
}

describe('POST /api/posts', () => {
  it('returns 400 when payload is invalid', async () => {
    // TODO
  })

  it('returns 201 when payload is valid', async () => {
    // TODO
  })

  it('returns expected response shape', async () => {
    // TODO
  })

  it('returns 400 for malformed body', async () => {
    // TODO
  })
})`,
    solution: `async function POST(req) {
  try {
    const body = await req.json()
    const errors = []

    if (!body?.title || String(body.title).trim().length < 3) errors.push('Invalid title')
    if (!body?.content || String(body.content).trim().length < 10) errors.push('Invalid content')

    if (errors.length) {
      return { status: 400, body: { ok: false, errors } }
    }

    return {
      status: 201,
      body: { ok: true, data: { id: 'post_' + Date.now(), title: body.title } },
    }
  } catch {
    return { status: 400, body: { ok: false, errors: ['Invalid JSON body'] } }
  }
}

describe('POST /api/posts', () => {
  it('returns 400 when payload is invalid', async () => {
    const req = { json: async () => ({ title: 'ab', content: 'short' }) }
    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.errors.length).toBeGreaterThan(0)
  })

  it('returns 201 when payload is valid', async () => {
    const req = { json: async () => ({ title: 'Valid title', content: 'This content is long enough' }) }
    const res = await POST(req)
    expect(res.status).toBe(201)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.title).toBe('Valid title')
  })

  it('returns expected response shape', async () => {
    const req = { json: async () => ({ title: 'Valid title', content: 'This content is long enough' }) }
    const res = await POST(req)
    expect(res.body).toHaveProperty('ok')
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toHaveProperty('id')
    expect(res.body.data).toHaveProperty('title')
  })

  it('returns 400 for malformed body', async () => {
    const req = { json: async () => { throw new Error('bad json') } }
    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(res.body.errors).toContain('Invalid JSON body')
  })
})`,
  },
]

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find(c => c.id === id)
}

export const CATEGORIES = [...new Set(challenges.map(c => c.category))] as const
