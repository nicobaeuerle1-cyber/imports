'use client'

import { useEffect } from 'react'

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

export function ClarityLoader() {
  useEffect(() => {
    if (!CLARITY_ID) return

    function loadClarity() {
      if (typeof window === 'undefined') return
      if ((window as { clarity?: unknown }).clarity) return
      const s = document.createElement('script')
      s.async = true
      s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`
      document.head.appendChild(s)
    }

    const consent = localStorage.getItem('cookie_consent')
    if (consent === 'accepted') loadClarity()

    const handler = () => loadClarity()
    window.addEventListener('clarity:consent', handler)
    return () => window.removeEventListener('clarity:consent', handler)
  }, [])

  return null
}
