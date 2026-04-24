'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type { Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface Props {
  value: string
  onChange: (code: string) => void
  language: 'typescript' | 'javascript'
  fastTyping: boolean
  height?: string
  readOnly?: boolean
}

const BASE_OPTIONS = {
  fontSize: 13,
  fontFamily: "'JetBrains Mono', monospace",
  fontLigatures: true,
  lineHeight: 22,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  tabSize: 2,
  padding: { top: 16, bottom: 16 },
}

function setupMonaco(monaco: Monaco) {
  monaco.editor.defineTheme('devprobe-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '4fc3f7' },
      { token: 'string', foreground: '43d9ad' },
      { token: 'number', foreground: 'ffa657' },
      { token: 'comment', foreground: '2a4260', fontStyle: 'italic' },
      { token: 'type.identifier', foreground: 'bb86fc' },
      { token: 'entity.name.function', foreground: '61dafb' },
    ],
    colors: {
      'editor.background': '#05090f',
      'editor.foreground': '#c5d5e8',
      'editorLineNumber.foreground': '#4a6580',
      'editor.lineHighlightBackground': '#0a1222',
      'editorCursor.foreground': '#4fc3f7',
      'editor.selectionBackground': '#1e3250',
    },
  })
}

export default function ChallengeEditor({
  value,
  onChange,
  language,
  fastTyping,
  height = '100%',
  readOnly = false,
}: Props) {
  const options = useMemo<editor.IStandaloneEditorConstructionOptions>(
    () => ({
      ...BASE_OPTIONS,
      readOnly,
      theme: 'devprobe-dark',
      quickSuggestions: fastTyping,
      parameterHints: { enabled: fastTyping },
      wordBasedSuggestions: fastTyping ? ('allDocuments' as const) : ('off' as const),
      suggestOnTriggerCharacters: fastTyping,
    }),
    [fastTyping, readOnly],
  )

  return (
    <MonacoEditor
      height={height}
      defaultLanguage={language}
      language={language}
      value={value}
      beforeMount={setupMonaco}
      onChange={(next) => onChange(next ?? '')}
      options={options}
    />
  )
}
