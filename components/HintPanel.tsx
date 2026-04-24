'use client'

import { useState } from 'react'
import type { Challenge } from '@/lib/types'

interface Props {
  challenge: Challenge
  currentCode: string
  hintsUsed: number
  onClose: () => void
  onHintUsed: () => void
}

type HintItem = { id: number; text: string; open: boolean }

export default function HintPanel({
  challenge,
  currentCode,
  hintsUsed,
  onClose,
  onHintUsed,
}: Props) {
  const [hints, setHints] = useState<HintItem[]>([])
  const [loading, setLoading] = useState(false)

  async function getHint() {
    if (loading || hintsUsed >= 3) return
    setLoading(true)
    const nextNumber = hintsUsed + 1
    setHints((prev) => [...prev.map((item) => ({ ...item, open: false })), { id: nextNumber, text: '', open: true }])

    try {
      const response = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          currentCode,
          hintNumber: nextNumber,
        }),
      })
      if (!response.body) throw new Error('No stream available')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const chunk = await reader.read()
        done = chunk.done
        if (chunk.value) {
          const text = decoder.decode(chunk.value, { stream: !done })
          setHints((prev) =>
            prev.map((item) => (item.id === nextNumber ? { ...item, text: `${item.text}${text}` } : item)),
          )
        }
      }
      onHintUsed()
    } catch (error) {
      setHints((prev) =>
        prev.map((item) =>
          item.id === nextNumber ? { ...item, text: `No se pudo cargar el hint: ${(error as Error).message}` } : item,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30">
      <button type="button" className="absolute inset-0" style={{ background: 'rgba(5,9,15,0.65)' }} onClick={onClose} />
      <aside
        className="slide-in-right absolute right-0 top-0 h-full w-[380px] border-l p-4"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Hints ({hintsUsed}/3 used)</h3>
          <button type="button" className="btn" onClick={onClose}>
            X
          </button>
        </div>
        <div className="mb-4 space-y-2 overflow-auto pr-1" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {hints.map((hint) => (
            <article key={hint.id} className="rounded-md border p-3" style={{ borderColor: 'var(--border)' }}>
              <button
                type="button"
                className="mb-2 text-left text-sm"
                style={{ color: 'var(--amber)' }}
                onClick={() => setHints((prev) => prev.map((item) => (item.id === hint.id ? { ...item, open: !item.open } : item)))}
              >
                Hint {hint.id}/3
              </button>
              {hint.open ? (
                <p className="whitespace-pre-wrap text-sm" style={{ color: 'var(--text)' }}>
                  {hint.text || '...'}
                </p>
              ) : null}
            </article>
          ))}
        </div>
        <button type="button" className="btn btn-amber w-full justify-center" onClick={getHint} disabled={hintsUsed >= 3 || loading}>
          {loading ? 'Generando hint...' : 'Get next hint'}
        </button>
      </aside>
    </div>
  )
}
