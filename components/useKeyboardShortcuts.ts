'use client'

import { useEffect } from 'react'

interface Params {
  onFocusEditor: () => void
  onEscape: () => void
  onHint: () => void
  onReset: () => void
}

export default function useKeyboardShortcuts({ onFocusEditor, onEscape, onHint, onReset }: Params) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const cmd = event.ctrlKey || event.metaKey

      if (cmd && event.key === 'Enter') {
        event.preventDefault()
        onFocusEditor()
      } else if (event.key === 'Escape') {
        onEscape()
      } else if (cmd && event.shiftKey && event.key.toLowerCase() === 'h') {
        event.preventDefault()
        onHint()
      } else if (cmd && event.shiftKey && event.key.toLowerCase() === 'r') {
        event.preventDefault()
        onReset()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onEscape, onFocusEditor, onHint, onReset])
}
