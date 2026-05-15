import { setRequestLocale, getTranslations } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { mockVehicles } from '@/lib/data/mock-vehicles'
import { VehicleCard } from '@/components/vehicles/vehicle-card'
import { VEHICLE_CATEGORIES, FUEL_TYPES } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'vehicles' })

  return generatePageMetadata({
    title: t('page_title'),
    description: t('page_description'),
    locale,
  })
}

export default async function VehiclesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; fuel?: string }>
}) {
  const { locale } = await params
  const { category, fuel } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations('vehicles')

  const filtered = mockVehicles.filter((v) => {
    if (v.status === 'draft') return false
    if (category && v.category !== category) return false
    if (fuel && v.fuel_type !== fuel) return false
    return true
  })

  const basePath = locale === 'de' ? '/de/fahrzeuge' : '/en/vehicles'

  function buildFilterUrl(params: Record<string, string | undefined>) {
    const q = new URLSearchParams()
    if (params.category) q.set('category', params.category)
    if (params.fuel) q.set('fuel', params.fuel)
    const qs = q.toString()
    return `${basePath}${qs ? `?${qs}` : ''}`
  }

  return (
    <>
      {/* Page header */}
      <section className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow mb-4">
            {locale === 'de' ? 'Unser Bestand' : 'Our Inventory'}
          </p>
          <h1 className="font-display text-5xl text-foreground sm:text-6xl">
            {t('page_title')}
          </h1>
          <p className="mt-4 font-sans text-sm text-muted max-w-xl">
            {t('page_description')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-0 overflow-x-auto">
            {/* Category filter */}
            <a
              href={buildFilterUrl({ fuel })}
              className={cn(
                'flex-shrink-0 border-b-2 px-4 py-4 font-sans text-xs font-medium tracking-wide transition-colors',
                !category
                  ? 'border-gold text-foreground'
                  : 'border-transparent text-muted hover:text-foreground',
              )}
            >
              {locale === 'de' ? 'Alle' : 'All'}
            </a>
            {VEHICLE_CATEGORIES.map((cat) => (
              <a
                key={cat.value}
                href={buildFilterUrl({ category: cat.value, fuel })}
                className={cn(
                  'flex-shrink-0 border-b-2 px-4 py-4 font-sans text-xs font-medium tracking-wide transition-colors whitespace-nowrap',
                  category === cat.value
                    ? 'border-gold text-foreground'
                    : 'border-transparent text-muted hover:text-foreground',
                )}
              >
                {locale === 'de' ? cat.labelDe : cat.labelEn}
              </a>
            ))}

            {/* Divider */}
            <div className="mx-4 h-4 w-px flex-shrink-0 bg-border" />

            {/* Fuel filter */}
            {FUEL_TYPES.map((f) => (
              <a
                key={f.value}
                href={buildFilterUrl({ category, fuel: fuel === f.value ? undefined : f.value })}
                className={cn(
                  'flex-shrink-0 border-b-2 px-4 py-4 font-sans text-xs font-medium tracking-wide transition-colors whitespace-nowrap',
                  fuel === f.value
                    ? 'border-gold text-gold'
                    : 'border-transparent text-subtle hover:text-muted',
                )}
              >
                {locale === 'de' ? f.labelDe : f.labelEn}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle grid */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        {/* Results count */}
        <p className="mb-8 font-sans text-xs text-subtle">
          {filtered.length}{' '}
          {locale === 'de'
            ? `Fahrzeug${filtered.length !== 1 ? 'e' : ''}`
            : `vehicle${filtered.length !== 1 ? 's' : ''}`}
          {category || fuel ? (locale === 'de' ? ' gefunden' : ' found') : ''}
        </p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="font-display text-3xl text-foreground">{t('no_results')}</p>
            <p className="font-sans text-sm text-muted">{t('no_results_hint')}</p>
            <a
              href={basePath}
              className="mt-4 font-sans text-sm text-gold underline underline-offset-4 hover:text-gold-light"
            >
              {locale === 'de' ? 'Filter zurücksetzen' : 'Reset filters'}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-surface py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-4">
            {locale === 'de' ? 'Nichts Passendes gefunden?' : "Didn't find the right car?"}
          </p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            {locale === 'de'
              ? 'Wir importieren auf Anfrage.'
              : 'We import on demand.'}
          </h2>
          <p className="mx-auto mt-4 max-w-md font-sans text-sm text-muted">
            {locale === 'de'
              ? 'Teilen Sie uns Ihre Wunschspezifikation mit — wir beschaffen das Fahrzeug direkt aus Südkorea.'
              : 'Share your desired specifications with us — we source the vehicle directly from South Korea.'}
          </p>
          <a
            href={locale === 'de' ? '/de/kontakt' : '/en/contact'}
            className="mt-8 inline-flex h-12 items-center gap-2 border border-border px-8 font-sans text-sm text-foreground transition-colors hover:bg-surface-elevated"
          >
            {locale === 'de' ? 'Fahrzeug anfragen' : 'Request a vehicle'}
          </a>
        </div>
      </section>
    </>
  )
}
