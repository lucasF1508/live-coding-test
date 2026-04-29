'use client'

import { useEffect, useState } from 'react'
import type { Challenge } from '@/lib/types'
import ChallengeEditor from '@/components/ChallengeEditor'

interface Props {
  challenge: Challenge
  userCode: string
  onClose: () => void
}

export default function SolutionModal({ challenge, userCode, onClose }: Props) {
  const [tab, setTab] = useState<'solution' | 'compare'>('solution')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  async function copySolution() {
    await navigator.clipboard.writeText(challenge.solution)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(5,9,15,0.65)' }}
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 h-[90vh] w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-lg border p-3 sm:h-[80vh] sm:w-[90vw] sm:p-4" style={{ background: 'var(--bg-2)', borderColor: 'var(--border-2)' }}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`btn ${tab === 'solution' ? 'btn-accent' : ''}`} onClick={() => setTab('solution')}>
              Solution
            </button>
            <button type="button" className={`btn ${tab === 'compare' ? 'btn-amber' : ''}`} onClick={() => setTab('compare')}>
              Compare
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn btn-mint" onClick={copySolution}>
              Copy to clipboard
            </button>
            {copied ? <span className="text-xs" style={{ color: 'var(--mint)' }}>Copied!</span> : null}
            <button type="button" className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        {tab === 'solution' ? (
          <ChallengeEditor
            value={challenge.solution}
            onChange={() => undefined}
            language={challenge.previewType === 'test' ? 'javascript' : 'typescript'}
            fastTyping
            readOnly
            height="calc(90vh - 132px)"
          />
        ) : (
          <div className="grid h-[calc(90vh-132px)] grid-cols-1 gap-3 sm:grid-cols-2">
            <section className="overflow-hidden rounded-md border" style={{ borderColor: 'var(--border)' }}>
              <header className="border-b px-3 py-2 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                Your code
              </header>
              <ChallengeEditor value={userCode} onChange={() => undefined} language="typescript" fastTyping readOnly height="100%" />
            </section>
            <section className="overflow-hidden rounded-md border" style={{ borderColor: 'var(--border)' }}>
              <header className="border-b px-3 py-2 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                Solution
              </header>
              <ChallengeEditor value={challenge.solution} onChange={() => undefined} language="typescript" fastTyping readOnly height="100%" />
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
