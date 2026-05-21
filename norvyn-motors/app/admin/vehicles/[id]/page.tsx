'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { VEHICLE_CATEGORIES, FUEL_TYPES, TRANSMISSION_TYPES, VEHICLE_STATUSES } from '@/lib/constants'
import type { VehicleWithImages, VehicleImage } from '@/types/vehicle'

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

function vehicleToForm(v: VehicleWithImages): VehicleFormData {
  return {
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
    price_visible: v.price_visible ?? false,
    import_ready: v.import_ready ?? true,
    featured: v.featured ?? false,
    stock_id: v.stock_id ?? '',
    slug: v.slug ?? '',
    origin_country: v.origin_country ?? 'KR',
    sort_order: String(v.sort_order ?? 999),
  }
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
    price_visible: form.price_visible,
    import_ready: form.import_ready,
    featured: form.featured,
    stock_id: form.stock_id,
    slug: form.slug,
    origin_country: form.origin_country || 'KR',
    sort_order: parseInt(form.sort_order, 10) || 999,
  }
}

export default function AdminVehicleDetailPage() {
  const { id } = useParams<{ id: string }>()

  // Vehicle data state
  const [vehicle, setVehicle] = useState<VehicleWithImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState<VehicleFormData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Photo state
  const [images, setImages] = useState<VehicleImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)

  // Drag-to-reorder state
  const dragIndexRef = useRef<number | null>(null)

  function setField(key: keyof VehicleFormData, value: string | boolean) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev)
  }

  async function fetchVehicle() {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch('/api/admin/vehicles')
      if (!res.ok) throw new Error('Laden fehlgeschlagen')
      const data: VehicleWithImages[] = await res.json()
      const found = data.find((v) => v.id === id)
      if (!found) throw new Error('Fahrzeug nicht gefunden')
      setVehicle(found)
      setForm(vehicleToForm(found))
      const sorted = [...(found.vehicle_images ?? [])].sort((a, b) => a.position - b.position)
      setImages(sorted)
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchVehicle()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const payload = formToPayload(form)
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Speichern fehlgeschlagen')
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    } finally {
      setSaving(false)
    }
  }

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    const valid = fileArray.filter((f) => validTypes.includes(f.type) && f.size <= 10 * 1024 * 1024)

    if (valid.length === 0) {
      setUploadProgress('Keine gültigen Dateien (JPG/PNG/WEBP, max 10MB)')
      setTimeout(() => setUploadProgress(null), 3000)
      return
    }

    setUploading(true)
    let nextPosition = images.length > 0 ? Math.max(...images.map((i) => i.position)) + 1 : 0

    for (let i = 0; i < valid.length; i++) {
      const file = valid[i]
      setUploadProgress(`Hochladen ${i + 1} / ${valid.length}: ${file.name}`)
      const fd = new FormData()
      fd.append('file', file)
      fd.append('position', String(nextPosition))

      try {
        const res = await fetch(`/api/admin/vehicles/${id}/images`, {
          method: 'POST',
          body: fd,
        })
        const imgData = await res.json()
        if (res.ok) {
          setImages((prev) => [...prev, imgData])
          nextPosition++
        }
      } catch {
        // continue with next file
      }
    }

    setUploading(false)
    setUploadProgress(null)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files)
      e.target.value = ''
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files)
    }
  }

  async function handleDeleteImage(imgId: string) {
    setDeletingImageId(imgId)
    try {
      const res = await fetch(`/api/admin/vehicles/${id}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: imgId }),
      })
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imgId))
      }
    } finally {
      setDeletingImageId(null)
    }
  }

  // Drag-to-reorder handlers
  const handleDragStart = useCallback((_e: React.DragEvent, index: number) => {
    dragIndexRef.current = index
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    const from = dragIndexRef.current
    if (from === null || from === index) return
    setImages((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      dragIndexRef.current = index
      return next.map((img, pos) => ({ ...img, position: pos }))
    })
  }, [])

  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null
    // Positions are tracked locally — the new order is reflected immediately in the grid.
    // On next full save / page reload the DB order will resync from vehicle_images.position.
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    )
  }

  if (loadError || !vehicle || !form) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background gap-4">
        <p className="font-sans text-sm text-destructive">{loadError ?? 'Fahrzeug nicht gefunden'}</p>
        <Link href="/admin/vehicles">
          <Button variant="outline" size="sm">Zurück zur Übersicht</Button>
        </Link>
      </div>
    )
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
        <Link href="/admin/vehicles" className="font-sans text-sm text-muted hover:text-foreground transition-colors">
          Fahrzeuge
        </Link>
        <span className="text-border">|</span>
        <span className="font-sans text-sm text-gold">{vehicle.stock_id}</span>
      </header>

      <main className="mx-auto max-w-3xl px-8 py-10 space-y-12">
        <div>
          <h1 className="font-display text-3xl text-foreground">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-1 font-sans text-sm text-muted">{vehicle.stock_id} · {vehicle.year}</p>
        </div>

        {/* Section 1: Vehicle Data */}
        <section>
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-display text-xl text-foreground">Fahrzeugdaten</h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSave}>
            <div className="rounded-sm border border-border bg-surface p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input id="edit-make" label="Marke *" value={form.make} onChange={(e) => setField('make', e.target.value)} required />
                <Input id="edit-model" label="Modell *" value={form.model} onChange={(e) => setField('model', e.target.value)} required />
                <Input id="edit-trim" label="Ausstattungslinie" value={form.trim} onChange={(e) => setField('trim', e.target.value)} />
                <Input id="edit-year" label="Baujahr *" type="number" min={1990} max={2030} value={form.year} onChange={(e) => setField('year', e.target.value)} required />

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-category" className="font-sans text-xs font-medium tracking-wide text-muted uppercase">Kategorie *</label>
                  <select
                    id="edit-category"
                    value={form.category}
                    onChange={(e) => setField('category', e.target.value)}
                    className="h-11 w-full rounded-sm border border-border bg-surface px-4 font-sans text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
                    required
                  >
                    {VEHICLE_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.labelDe}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-status" className="font-sans text-xs font-medium tracking-wide text-muted uppercase">Status *</label>
                  <select
                    id="edit-status"
                    value={form.status}
                    onChange={(e) => setField('status', e.target.value)}
                    className="h-11 w-full rounded-sm border border-border bg-surface px-4 font-sans text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
                    required
                  >
                    {VEHICLE_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.labelDe}</option>
                    ))}
                  </select>
                </div>

                {/* Fuel */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-fuel" className="font-sans text-xs font-medium tracking-wide text-muted uppercase">Kraftstoff</label>
                  <select
                    id="edit-fuel"
                    value={form.fuel_type}
                    onChange={(e) => setField('fuel_type', e.target.value)}
                    className="h-11 w-full rounded-sm border border-border bg-surface px-4 font-sans text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f.value} value={f.value}>{f.labelDe}</option>
                    ))}
                  </select>
                </div>

                {/* Transmission */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-transmission" className="font-sans text-xs font-medium tracking-wide text-muted uppercase">Getriebe</label>
                  <select
                    id="edit-transmission"
                    value={form.transmission}
                    onChange={(e) => setField('transmission', e.target.value)}
                    className="h-11 w-full rounded-sm border border-border bg-surface px-4 font-sans text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
                  >
                    {TRANSMISSION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.labelDe}</option>
                    ))}
                  </select>
                </div>

                <Input id="edit-mileage" label="Kilometerstand (km)" type="number" min={0} value={form.mileage_km} onChange={(e) => setField('mileage_km', e.target.value)} />
                <Input id="edit-power" label="Leistung (kW)" type="number" min={0} value={form.power_kw} onChange={(e) => setField('power_kw', e.target.value)} />
                <Input id="edit-engine" label="Hubraum (cc)" type="number" min={0} value={form.engine_cc} onChange={(e) => setField('engine_cc', e.target.value)} />
                <Input id="edit-ext-color" label="Außenfarbe" value={form.exterior_color} onChange={(e) => setField('exterior_color', e.target.value)} />
                <Input id="edit-int-color" label="Innenfarbe" value={form.interior_color} onChange={(e) => setField('interior_color', e.target.value)} />
                <Input id="edit-stock" label="Stock-ID *" value={form.stock_id} onChange={(e) => setField('stock_id', e.target.value)} required />
                <Input id="edit-slug" label="URL-Slug *" value={form.slug} onChange={(e) => setField('slug', e.target.value)} required />
              </div>

              <div className="mt-5">
                <Textarea id="edit-features" label="Ausstattung (kommagetrennt)" placeholder="Schiebedach, Leder, ..." value={form.features} onChange={(e) => setField('features', e.target.value)} className="min-h-[80px]" />
              </div>
              <div className="mt-5">
                <Textarea id="edit-desc-de" label="Beschreibung (Deutsch)" value={form.description_de} onChange={(e) => setField('description_de', e.target.value)} />
              </div>
              <div className="mt-5">
                <Textarea id="edit-desc-en" label="Description (English)" value={form.description_en} onChange={(e) => setField('description_en', e.target.value)} />
              </div>

              <div className="mt-6 flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.price_visible} onChange={(e) => setField('price_visible', e.target.checked)} className="h-4 w-4 accent-gold" />
                  <span className="font-sans text-sm text-foreground">Preis anzeigen</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.import_ready} onChange={(e) => setField('import_ready', e.target.checked)} className="h-4 w-4 accent-gold" />
                  <span className="font-sans text-sm text-foreground">Import-Ready</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setField('featured', e.target.checked)} className="h-4 w-4 accent-gold" />
                  <span className="font-sans text-sm text-foreground">Featured</span>
                </label>
              </div>
            </div>

            {saveError && (
              <div className="mt-4 rounded-sm border border-destructive/30 bg-destructive/5 px-5 py-3">
                <p className="font-sans text-sm text-destructive">{saveError}</p>
              </div>
            )}
            {saveSuccess && (
              <div className="mt-4 rounded-sm border border-success/30 bg-success/5 px-5 py-3">
                <p className="font-sans text-sm text-success">Änderungen gespeichert.</p>
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <Button type="submit" variant="gold" disabled={saving}>
                {saving ? 'Speichern...' : 'Änderungen speichern'}
              </Button>
              <Link href="/admin/vehicles">
                <Button type="button" variant="ghost">Zurück</Button>
              </Link>
            </div>
          </form>
        </section>

        {/* Section 2: Photos */}
        <section>
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-display text-xl text-foreground">Fotos</h2>
            <div className="flex-1 h-px bg-border" />
            <span className="font-sans text-xs text-muted">{images.length} Foto{images.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Drop zone */}
          <label
            htmlFor="photo-upload"
            className={`relative flex flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed px-6 py-12 cursor-pointer transition-colors ${
              isDragOver
                ? 'border-gold/60 bg-gold/5'
                : 'border-border hover:border-gold/40 hover:bg-surface'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            {uploading ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                <p className="font-sans text-sm text-muted">{uploadProgress}</p>
              </>
            ) : (
              <>
                <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <div className="text-center">
                  <p className="font-sans text-sm text-foreground">Fotos hierher ziehen oder klicken</p>
                  <p className="font-sans text-xs text-muted mt-1">JPG, PNG, WEBP · max. 10 MB pro Datei</p>
                </div>
              </>
            )}
            <input
              id="photo-upload"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleFileInput}
              disabled={uploading}
            />
          </label>

          {/* Photo grid */}
          {images.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-surface cursor-grab active:cursor-grabbing"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt_text ?? `Foto ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  {/* Position badge */}
                  <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-2xs font-medium text-foreground">
                    {img.position + 1}
                  </div>
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    disabled={deletingImageId === img.id}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-background disabled:opacity-50"
                  >
                    {deletingImageId === img.id ? (
                      <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <p className="mt-3 font-sans text-xs text-muted">
              Fotos per Drag &amp; Drop neu anordnen. Das erste Foto wird als Cover verwendet.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
