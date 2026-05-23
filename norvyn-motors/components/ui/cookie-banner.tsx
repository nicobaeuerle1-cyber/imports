'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { X } from 'lucide-react'

export function CookieBanner() {
  const locale = useLocale()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    window.dispatchEvent(new Event('clarity:consent'))
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  const isDE = locale === 'de'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-xs leading-relaxed text-muted max-w-2xl">
          {isDE
            ? 'Wir nutzen Analyse-Tools (Vercel Analytics, Microsoft Clarity) um diese Website zu verbessern. Clarity erstellt dabei Aufzeichnungen von Seitenbesuchen.'
            : 'We use analytics tools (Vercel Analytics, Microsoft Clarity) to improve this website. Clarity records page sessions.'}
          {' '}
          <Link href="/datenschutz" className="text-gold underline underline-offset-2 hover:text-gold/80 transition-colors">
            {isDE ? 'Datenschutzerklärung' : 'Privacy Policy'}
          </Link>
        </p>

        <div className="flex flex-shrink-0 items-center gap-3">
          <button
            onClick={decline}
            className="font-sans text-xs text-subtle transition-colors hover:text-foreground"
          >
            {isDE ? 'Ablehnen' : 'Decline'}
          </button>
          <button
            onClick={accept}
            className="border border-gold/50 bg-gold/10 px-4 py-2 font-sans text-xs text-gold transition-colors hover:bg-gold/20"
          >
            {isDE ? 'Akzeptieren' : 'Accept'}
          </button>
          <button
            onClick={decline}
            aria-label={isDE ? 'Schließen' : 'Close'}
            className="text-subtle hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
