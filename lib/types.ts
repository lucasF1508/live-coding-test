export type Difficulty = 'easy' | 'medium' | 'hard'
export type Category =
  | 'TypeScript'
  | 'React'
  | 'Next.js'
  | 'React Query'
  | 'Zustand'
  | 'Auth'
  | 'Testing'

export type PreviewType = 'react' | 'typescript' | 'nextjs' | 'test'

export interface SandpackConfig {
  /** Extra files injected into the Sandpack sandbox */
  files?: Record<string, string>
  /** Additional npm dependencies for the sandbox */
  dependencies?: Record<string, string>
}

export interface Challenge {
  id: string
  title: string
  category: Category
  difficulty: Difficulty
  estimatedMinutes: number
  tags: string[]
  description: string
  instructions: string[]
  previewType: PreviewType
  starterCode: string
  solution: string
  sandpack?: SandpackConfig
}
