'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { VEHICLE_CATEGORIES, FUEL_TYPES, TRANSMISSION_TYPES, VEHICLE_STATUSES } from '@/lib/constants'

interface VehicleFormData {
  make: string
  model: string
  trim: string
  year: string
  category: string
  status: string
  fuel_type: string
  transmission: string
  mileage_km: string
  power_kw: string
  engine_cc: string
  exterior_color: string
  interior_color: string
  features: string
  description_de: string
  description_en: string
  price_visible: boolean
  import_ready: boolean
  featured: boolean
  stock_id: string
  slug: string
  origin_country: string
  sort_order: string
}

const defaultForm: VehicleFormData = {
  make: '',
  model: '',
  trim: '',
  year: '',
  category: 'luxury',
  status: 'available',
  fuel_type: 'petrol',
  transmission: 'automatic',
  mileage_km: '',
  power_kw: '',
  engine_cc: '',
  exterior_color: '',
  interior_color: '',
  features: '',
  description_de: '',
  description_en: '',
  price_visible: false,
  import_ready: true,
  featured: false,
  stock_id: '',
  slug: '',
  origin_country: 'KR',
  sort_order: '999',
}

function formToPayload(form: VehicleFormData) {
  return {
    make: form.make,
    model: form.model,
    trim: form.trim || null,
    year: parseInt(form.year, 10) || 0,
    category: form.category,
    status: form.status,
    fuel_type: form.fuel_type || null,
    transmission: form.transmission || null,
    mileage_km: form.mileage_km ? parseInt(form.mileage_km, 10) : null,
    power_kw: form.power_kw ? parseInt(form.power_kw, 10) : null,
    engine_cc: form.engine_cc ? parseInt(form.engine_cc, 10) : null,
    exterior_color: form.exterior_color || null,
    interior_color: form.interior_color || null,
    features: form.features
      ? form.features.split(',').map((s) => s.trim()).filter(Boolean)
      : null,
    description_de: form.description_de || null,
    description_en: form.description_en || null,
    price_eur: null,
    price_visible: form.price_visible,
    import_ready: form.import_ready,
    featured: form.featured,
    stock_id: form.stock_id,
    slug: form.slug,
    origin_country: form.origin_country || 'KR',
    sort_order: parseInt(form.sort_order, 10) || 999,
    seo_title_de: null,
    seo_title_en: null,
    seo_description_de: null,
    seo_description_en: null,
  }
}

export default function AdminImportPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [fetchFailed, setFetchFailed] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [form, setForm] = useState<VehicleFormData>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  function setField(key: keyof VehicleFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleFetch() {
    if (!url.trim()) return
    setFetchLoading(true)
    setFetchError(null)
    setFetchFailed(false)
    setFormVisible(false)

    try {
      const res = await fetch('/api/admin/fetch-encar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()

      if (data.success && data.vehicle) {
        const v = data.vehicle
        setForm({
          make: v.make ?? '',
          model: v.model ?? '',
          trim: v.trim ?? '',
          year: String(v.year ?? ''),
          category: v.category ?? 'luxury',
          status: v.status ?? 'available',
          fuel_type: v.fuel_type ?? 'petrol',
          transmission: v.transmission ?? 'automatic',
          mileage_km: v.mileage_km != null ? String(v.mileage_km) : '',
          power_kw: v.power_kw != null ? String(v.power_kw) : '',
          engine_cc: v.engine_cc != null ? String(v.engine_cc) : '',
          exterior_color: v.exterior_color ?? '',
          interior_color: v.interior_color ?? '',
          features: Array.isArray(v.features) ? v.features.join(', ') : '',
          description_de: v.description_de ?? '',
          description_en: v.description_en ?? '',
          price_visible: false,
          import_ready: v.import_ready ?? true,
          featured: v.featured ?? false,
          stock_id: v.stock_id ?? '',
          slug: v.slug ?? '',
          origin_country: v.origin_country ?? 'KR',
          sort_order: String(v.sort_order ?? 999),
        })
        setFetchFailed(false)
      } else {
        setFetchFailed(true)
        setForm(defaultForm)
      }
    } catch {
      setFetchFailed(true)
      setForm(defaultForm)
    } finally {
      setFetchLoading(false)
      setFormVisible(true)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)

    try {
      const payload = formToPayload(form)
      const res = await fetch('/api/admin/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Speichern fehlgeschlagen')
      router.push(`/admin/vehicles/${data.id}`)
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Unbekannter Fehler')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* Nav */}
      <header className="border-b border-border px-8 py-5 flex items-center gap-6">
        <Link
          href="/admin/dashboard"
          className="font-display text-xl tracking-wider text-foreground"
        >
          NORVYN <span className="text-gold">Admin</span>
        </Link>
        <span className="text-border">|</span>
        <span className="font-sans text-sm text-muted">Fahrzeug importieren</span>
      </header>

      <main className="mx-auto max-w-3xl px-8 py-10">
        <h1 className="font-display text-3xl text-foreground mb-10">
          Fahrzeug importieren
        </h1>

        {/* Step 1: URL Input */}
        <div className="mb-8 rounded-sm border border-border bg-surface p-6">
          <p className="font-sans text-xs tracking-widest text-muted uppercase mb-4">
            Schritt 1 — Encar-URL
          </p>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                id="encar-url"
                type="url"
                placeholder="https://www.encar.com/dc/dc_cardetailview.do?carid=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleFetch()
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="gold"
              onClick={handleFetch}
              disabled={fetchLoading || !url.trim()}
              className="shrink-0"
            >
              {fetchLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Laden...
                </span>
              ) : (
                'Laden'
              )}
            </Button>
          </div>
          {fetchError && (
            <p className="mt-3 font-sans text-xs text-destructive">{fetchError}</p>
          )}
        </div>

        {/* Step 2: Form */}
        {formVisible && (
          <form onSubmit={handleSave}>
            {fetchFailed && (
              <div className="mb-6 rounded-sm border border-warning/30 bg-warning/5 px-5 py-4">
                <p className="font-sans text-sm text-warning">
                  Automatischer Import fehlgeschlagen — bitte manuell ausfüllen
                </p>
              </div>
            )}

            <div className="mb-6 rounded-sm border border-border bg-surface p-6">
              <p className="font-sans text-xs tracking-widest text-muted uppercase mb-6">
                Schritt 2 — Fahrzeugdaten
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Make */}
                <Input
                  id="make"
                  label="Marke *"
                  value={form.make}
                  onChange={(e) => setField('make', e.target.value)}
                  required
                />
                {/* Model */}
                <Input
                  id="model"
                  label="Modell *"
                  value={form.model}
                  onChange={(e) => setField('model', e.target.value)}
                  required
                />
                {/* Trim */}
                <Input
                  id="trim"
                  label="Ausstattungslinie"
                  value={form.trim}
                  onChange={(e) => setField('trim', e.target.value)}
                />
                {/* Year */}
                <Input
                  id="year"
                  label="Baujahr *"
                  type="number"
                  min={1990}
                  max={2030}
                  value={form.year}
                  onChange={(e) => setField('year', e.target.value)}
                  required
                />
                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="category" className="font-sans text-xs font-medium tracking-wide text-muted uppercase">
                    Kategorie *
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setField('category', e.target.value)}
                    className="h-11 w-full rounded-sm border border-border bg-surface px-4 font-sans text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
                    required
                  >
                    {VEHICLE_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.labelDe}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="status" className="font-sans text-xs font-medium tracking-wide text-muted uppercase">
                    Status *
                  </label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => setField('status', e.target.value)}
                    className="h-11 w-full rounded-sm border border-border bg-surface px-4 font-sans text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
                    required
                  >
                    {VEHICLE_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.labelDe}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Fuel Type */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fuel_type" className="font-sans text-xs font-medium tracking-wide text-muted uppercase">
                    Kraftstoff
                  </label>
                  <select
                    id="fuel_type"
                    value={form.fuel_type}
                    onChange={(e) => setField('fuel_type', e.target.value)}
                    className="h-11 w-full rounded-sm border border-border bg-surface px-4 font-sans text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.labelDe}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Transmission */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="transmission" className="font-sans text-xs font-medium tracking-wide text-muted uppercase">
                    Getriebe
                  </label>
                  <select
                    id="transmission"
                    value={form.transmission}
                    onChange={(e) => setField('transmission', e.target.value)}
                    className="h-11 w-full rounded-sm border border-border bg-surface px-4 font-sans text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
                  >
                    {TRANSMISSION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.labelDe}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Mileage */}
                <Input
                  id="mileage_km"
                  label="Kilometerstand (km)"
                  type="number"
                  min={0}
                  value={form.mileage_km}
                  onChange={(e) => setField('mileage_km', e.target.value)}
                />
                {/* Power */}
                <Input
                  id="power_kw"
                  label="Leistung (kW)"
                  type="number"
                  min={0}
                  value={form.power_kw}
                  onChange={(e) => setField('power_kw', e.target.value)}
                />
                {/* Engine CC */}
                <Input
                  id="engine_cc"
                  label="Hubraum (cc)"
                  type="number"
                  min={0}
                  value={form.engine_cc}
                  onChange={(e) => setField('engine_cc', e.target.value)}
                />
                {/* Exterior color */}
                <Input
                  id="exterior_color"
                  label="Außenfarbe"
                  value={form.exterior_color}
                  onChange={(e) => setField('exterior_color', e.target.value)}
                />
                {/* Interior color */}
                <Input
                  id="interior_color"
                  label="Innenfarbe"
                  value={form.interior_color}
                  onChange={(e) => setField('interior_color', e.target.value)}
                />
                {/* Stock ID */}
                <Input
                  id="stock_id"
                  label="Stock-ID *"
                  value={form.stock_id}
                  onChange={(e) => setField('stock_id', e.target.value)}
                  required
                />
                {/* Slug */}
                <Input
                  id="slug"
                  label="URL-Slug *"
                  value={form.slug}
                  onChange={(e) => setField('slug', e.target.value)}
                  required
                />
              </div>

              {/* Features */}
              <div className="mt-5">
                <Textarea
                  id="features"
                  label="Ausstattung (kommagetrennt)"
                  placeholder="Schiebedach, Leder, Navigationssystem, ..."
                  value={form.features}
                  onChange={(e) => setField('features', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Description DE */}
              <div className="mt-5">
                <Textarea
                  id="description_de"
                  label="Beschreibung (Deutsch)"
                  value={form.description_de}
                  onChange={(e) => setField('description_de', e.target.value)}
                />
              </div>

              {/* Description EN */}
              <div className="mt-5">
                <Textarea
                  id="description_en"
                  label="Description (English)"
                  value={form.description_en}
                  onChange={(e) => setField('description_en', e.target.value)}
                />
              </div>

              {/* Checkboxes */}
              <div className="mt-6 flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.price_visible}
                    onChange={(e) => setField('price_visible', e.target.checked)}
                    className="h-4 w-4 rounded-sm border-border bg-surface accent-gold"
                  />
                  <span className="font-sans text-sm text-foreground">Preis anzeigen</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.import_ready}
                    onChange={(e) => setField('import_ready', e.target.checked)}
                    className="h-4 w-4 rounded-sm border-border bg-surface accent-gold"
                  />
                  <span className="font-sans text-sm text-foreground">Import-Ready</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setField('featured', e.target.checked)}
                    className="h-4 w-4 rounded-sm border-border bg-surface accent-gold"
                  />
                  <span className="font-sans text-sm text-foreground">Featured</span>
                </label>
              </div>
            </div>

            {saveError && (
              <div className="mb-4 rounded-sm border border-destructive/30 bg-destructive/5 px-5 py-4">
                <p className="font-sans text-sm text-destructive">{saveError}</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button type="submit" variant="gold" disabled={saving}>
                {saving ? 'Speichern...' : 'Fahrzeug speichern'}
              </Button>
              <Link href="/admin/dashboard">
                <Button type="button" variant="ghost">
                  Abbrechen
                </Button>
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
