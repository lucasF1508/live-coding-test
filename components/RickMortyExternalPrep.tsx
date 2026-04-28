'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  rickMortyInterviewQuestions,
  rickMortyMcq,
  rickMortyProjectSummary,
} from '@/lib/rickMortyPrep'

export default function RickMortyExternalPrep() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)

  const score = useMemo(() => {
    return rickMortyMcq.reduce((acc, item) => {
      return answers[item.id] === item.correctOptionId ? acc + 1 : acc
    }, 0)
  }, [answers])

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <Link href="/" className="mb-3 inline-flex text-sm" style={{ color: 'var(--muted)' }}>
          ← Volver al dashboard
        </Link>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
          Apartado externo: Rick & Morty Challenge
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
          Banco de preguntas multiple choice, respuestas explicadas y guia de entrevista sobre el challenge externo.
        </p>
      </header>

      <section className="mb-6 rounded-lg border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <h2 className="mb-2 text-lg font-semibold">Detalle del proyecto</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {rickMortyProjectSummary.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6 rounded-lg border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Multiple choice (con explicaciones)</h2>
          <button type="button" className="btn btn-accent" onClick={() => setShowResult((v) => !v)}>
            {showResult ? 'Ocultar resultados' : 'Mostrar resultados'}
          </button>
        </div>

        <div className="space-y-4">
          {rickMortyMcq.map((item, idx) => {
            const selected = answers[item.id]
            const isCorrect = selected === item.correctOptionId
            return (
              <article key={item.id} className="rounded-md border p-3" style={{ borderColor: 'var(--border)' }}>
                <p className="mb-2 text-xs" style={{ color: 'var(--muted)' }}>
                  {idx + 1}. {item.topic}
                </p>
                <h3 className="mb-3 text-sm font-semibold">{item.question}</h3>
                <div className="space-y-2">
                  {item.options.map((option) => (
                    <label key={option.id} className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="radio"
                        name={item.id}
                        checked={selected === option.id}
                        onChange={() => setAnswers((prev) => ({ ...prev, [item.id]: option.id }))}
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </div>
                {showResult && selected ? (
                  <div
                    className="mt-3 rounded-md border p-2 text-xs"
                    style={{
                      borderColor: isCorrect ? 'var(--mint)' : 'var(--amber)',
                      background: isCorrect ? 'var(--mint-bg)' : 'var(--amber-bg)',
                    }}
                  >
                    <p className="mb-1" style={{ color: isCorrect ? 'var(--mint)' : 'var(--amber)' }}>
                      {isCorrect ? 'Correcta' : 'Para revisar'} - Respuesta esperada:{' '}
                      {item.options.find((o) => o.id === item.correctOptionId)?.text}
                    </p>
                    <p style={{ color: 'var(--text)' }}>{item.explanation}</p>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>

        {showResult ? (
          <p className="mt-4 text-sm" style={{ color: 'var(--accent)' }}>
            Puntaje actual: {score}/{rickMortyMcq.length}
          </p>
        ) : null}
      </section>

      <section className="rounded-lg border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <h2 className="mb-2 text-lg font-semibold">Preguntas que te pueden hacer sobre el proyecto</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {rickMortyInterviewQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
