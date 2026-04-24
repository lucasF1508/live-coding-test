'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type { Challenge } from '@/lib/types'

const Sandpack = dynamic(
  async () => {
    const mod = await import('@codesandbox/sandpack-react')
    return function SandpackInner({
      files,
      dependencies,
    }: {
      files: Record<string, string>
      dependencies: Record<string, string>
    }) {
      return (
        <mod.SandpackProvider
          template="react-ts"
          files={files}
          customSetup={{ dependencies }}
          theme="dark"
          options={{ recompileMode: 'immediate' }}
        >
          <mod.SandpackLayout style={{ height: '100%' }}>
            <mod.SandpackPreview
              style={{ height: '100%', border: '0', background: 'var(--bg)' }}
              showNavigator={false}
              showRefreshButton
              showOpenInCodeSandbox={false}
            />
          </mod.SandpackLayout>
        </mod.SandpackProvider>
      )
    }
  },
  { ssr: false, loading: () => <div className="h-full animate-pulse rounded-md" style={{ background: 'var(--surface)' }} /> },
)

interface Props {
  code: string
  challenge: Challenge
}

export default function SandpackPreview({ code, challenge }: Props) {
  const { files, dependencies } = useMemo(() => {
    const baseFiles = challenge.sandpack?.files ?? {}
    const filename = baseFiles['/Solution.tsx'] ? '/Solution.tsx' : '/App.tsx'
    return {
      files: { ...baseFiles, [filename]: code },
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        ...(challenge.sandpack?.dependencies ?? {}),
      },
    }
  }, [challenge, code])

  try {
    return <Sandpack files={files} dependencies={dependencies} />
  } catch (error) {
    return (
      <pre className="h-full overflow-auto rounded-md p-3 text-xs" style={{ color: 'var(--red)', background: 'var(--surface)', fontFamily: 'var(--font-mono)' }}>
        {(error as Error).message}
      </pre>
    )
  }
}
