'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface Props {
  onThreeMinutes: () => void
  onTick?: (elapsedSeconds: number) => void
  resetSignal?: number
}

function formatElapsed(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export default function Timer({ onThreeMinutes, onTick, resetSignal = 0 }: Props) {
  const [seconds, setSeconds] = useState(0)
  const fired = useRef(false)

  useEffect(() => {
    setSeconds(0)
    fired.current = false
  }, [resetSignal])

  useEffect(() => {
    const id = setInterval(() => setSeconds((prev) => prev + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    onTick?.(seconds)
    if (!fired.current && seconds >= 180) {
      fired.current = true
      onThreeMinutes()
    }
  }, [onThreeMinutes, onTick, seconds])

  const color = useMemo(() => {
    if (seconds >= 300) return 'var(--red)'
    if (seconds >= 180) return 'var(--amber)'
    return 'var(--muted)'
  }, [seconds])

  return (
    <span style={{ fontFamily: 'var(--font-mono)', color }} className="text-sm">
      {formatElapsed(seconds)}
    </span>
  )
}
