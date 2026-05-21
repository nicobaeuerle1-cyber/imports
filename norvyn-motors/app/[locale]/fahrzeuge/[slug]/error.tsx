'use client'

import Link from 'next/link'

export default function VehicleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-40 text-center">
      <p className="font-sans text-xs text-muted uppercase tracking-widest mb-4">Fehler</p>
      <h1 className="font-display text-3xl text-foreground mb-3">
        Diese Seite konnte nicht geladen werden
      </h1>
      <p className="font-sans text-sm text-muted mb-8 max-w-md mx-auto">
        {error.message || 'Ein unbekannter Fehler ist aufgetreten.'}
        {error.digest && (
          <span className="block mt-1 font-mono text-xs opacity-50">{error.digest}</span>
        )}
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="border border-gold/50 bg-gold/10 px-5 py-2 font-sans text-sm text-gold hover:bg-gold/20 transition-colors"
        >
          Erneut versuchen
        </button>
        <Link
          href="/fahrzeuge"
          className="border border-border px-5 py-2 font-sans text-sm text-muted hover:text-foreground transition-colors"
        >
          Alle Fahrzeuge
        </Link>
      </div>
    </div>
  )
}
