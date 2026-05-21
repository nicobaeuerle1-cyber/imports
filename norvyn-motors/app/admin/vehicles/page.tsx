'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { VehicleWithImages } from '@/types/vehicle'
import type { BadgeVariant } from '@/components/ui/badge'

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchVehicles() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/vehicles')
      if (!res.ok) throw new Error('Fehler beim Laden')
      const data = await res.json()
      setVehicles(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  async function handleDelete(id: string) {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Löschen fehlgeschlagen')
      setDeleteId(null)
      await fetchVehicles()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Fehler beim Löschen')
    } finally {
      setDeleting(false)
    }
  }

  const statusLabel: Record<string, string> = {
    available: 'Verfügbar',
    draft: 'Entwurf',
    reserved: 'Reserviert',
    sold: 'Verkauft',
  }

  const categoryLabel: Record<string, string> = {
    performance: 'Performance',
    luxury: 'Luxury / VIP',
    german_from_korea: 'Deutsche Marken',
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* Nav */}
      <header className="border-b border-border px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/admin/dashboard"
            className="font-display text-xl tracking-wider text-foreground"
          >
            NORVYN <span className="text-gold">Admin</span>
          </Link>
          <span className="text-border">|</span>
          <span className="font-sans text-sm text-muted">Fahrzeuge</span>
        </div>
        <Link href="/admin/import">
          <Button variant="gold" size="sm">
            + Neues Fahrzeug
          </Button>
        </Link>
      </header>

      <main className="px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl text-foreground">
            Alle Fahrzeuge
          </h1>
          <span className="font-sans text-xs text-muted">
            {vehicles.length} Fahrzeug{vehicles.length !== 1 ? 'e' : ''}
          </span>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/5 px-6 py-4">
            <p className="font-sans text-sm text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-sans text-sm text-muted mb-4">
              Noch keine Fahrzeuge vorhanden.
            </p>
            <Link href="/admin/import">
              <Button variant="outline" size="sm">
                Erstes Fahrzeug importieren
              </Button>
            </Link>
          </div>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <div className="overflow-x-auto rounded-sm border border-border">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-6 py-3 text-left font-sans text-2xs font-medium tracking-widest text-muted uppercase">
                    Stock-ID
                  </th>
                  <th className="px-6 py-3 text-left font-sans text-2xs font-medium tracking-widest text-muted uppercase">
                    Fahrzeug
                  </th>
                  <th className="px-6 py-3 text-left font-sans text-2xs font-medium tracking-widest text-muted uppercase">
                    Jahr
                  </th>
                  <th className="px-6 py-3 text-left font-sans text-2xs font-medium tracking-widest text-muted uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-sans text-2xs font-medium tracking-widest text-muted uppercase">
                    Kategorie
                  </th>
                  <th className="px-6 py-3 text-right font-sans text-2xs font-medium tracking-widest text-muted uppercase">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-border/50 bg-background hover:bg-surface transition-colors"
                  >
                    <td className="px-6 py-4 font-sans text-xs text-gold font-medium tracking-wider">
                      {v.stock_id}
                    </td>
                    <td className="px-6 py-4 font-sans text-sm text-foreground">
                      {v.make} {v.model}
                      {v.trim && (
                        <span className="ml-1.5 text-muted text-xs">{v.trim}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-sans text-sm text-muted">
                      {v.year}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={v.status as BadgeVariant}>
                        {statusLabel[v.status] ?? v.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={v.category as BadgeVariant}>
                        {categoryLabel[v.category] ?? v.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/vehicles/${v.id}`}>
                          <Button variant="outline" size="sm">
                            Bearbeiten
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteId(v.id)}
                        >
                          Löschen
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Delete confirm dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6">
          <div className="w-full max-w-sm rounded-sm border border-border bg-surface p-8 shadow-2xl">
            <h2 className="font-display text-xl text-foreground mb-3">
              Fahrzeug löschen?
            </h2>
            <p className="font-sans text-sm text-muted mb-8">
              Diese Aktion kann nicht rückgängig gemacht werden. Das Fahrzeug
              und alle zugehörigen Fotos werden dauerhaft gelöscht.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Abbrechen
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
              >
                {deleting ? 'Löschen...' : 'Löschen'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
