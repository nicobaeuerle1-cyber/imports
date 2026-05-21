import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Top bar */}
      <header className="border-b border-border px-8 py-5 flex items-center justify-between">
        <span className="font-display text-xl tracking-wider text-foreground">
          NORVYN <span className="text-gold">Admin</span>
        </span>
        <Link
          href="/admin/login"
          className="font-sans text-xs text-muted hover:text-foreground tracking-wide transition-colors"
        >
          Abmelden
        </Link>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16">
        <div className="text-center">
          <p className="eyebrow mb-3">Norvyn Motors</p>
          <h1 className="font-display text-4xl text-foreground">Dashboard</h1>
        </div>

        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          {/* Import card */}
          <Link
            href="/admin/import"
            className="group flex flex-col gap-4 rounded-sm border border-border bg-surface p-8 transition-all duration-200 hover:border-gold/40 hover:bg-surface-elevated"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-gold/20 bg-gold/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 text-gold"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-lg text-foreground group-hover:text-gold transition-colors">
                Fahrzeug importieren
              </h2>
              <p className="mt-1 font-sans text-xs text-muted">
                Encar-URL einfügen &amp; automatisch importieren
              </p>
            </div>
            <span className="font-sans text-xs tracking-widest uppercase text-gold/70 group-hover:text-gold transition-colors">
              Starten →
            </span>
          </Link>

          {/* All vehicles card */}
          <Link
            href="/admin/vehicles"
            className="group flex flex-col gap-4 rounded-sm border border-border bg-surface p-8 transition-all duration-200 hover:border-gold/40 hover:bg-surface-elevated"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-border bg-surface-elevated">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 text-muted group-hover:text-foreground transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-lg text-foreground group-hover:text-gold transition-colors">
                Alle Fahrzeuge
              </h2>
              <p className="mt-1 font-sans text-xs text-muted">
                Bestand verwalten, bearbeiten und löschen
              </p>
            </div>
            <span className="font-sans text-xs tracking-widest uppercase text-muted group-hover:text-gold transition-colors">
              Anzeigen →
            </span>
          </Link>
        </div>
      </main>
    </div>
  )
}
