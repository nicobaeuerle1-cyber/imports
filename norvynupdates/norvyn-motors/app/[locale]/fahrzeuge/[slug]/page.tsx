import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { getMockVehicleBySlug } from '@/lib/data/mock-vehicles'
import { InquiryForm } from '@/components/vehicles/inquiry-form'
import { Link } from '@/lib/i18n/navigation'
import { formatPrice, formatMileage, formatPower, formatEngineDisplacement } from '@/lib/utils/format'
import { buildVehicleWhatsAppUrl } from '@/lib/utils/whatsapp'
import { cn } from '@/lib/utils/cn'
import { ArrowLeft, MessageCircle, CheckCircle, MapPin, Zap, Fuel } from 'lucide-react'
import { Button } from '@/components/ui/button'

const categoryGradient: Record<string, string> = {
  luxury: 'from-[#1c1408] via-[#120e05] to-background',
  performance: 'from-[#08140a] via-[#080f08] to-background',
  german_from_korea: 'from-[#080c1a] via-[#080912] to-background',
}

const statusLabel: Record<string, { de: string; en: string; className: string }> = {
  available: { de: 'Verfügbar', en: 'Available', className: 'text-status-available border-status-available/30 bg-status-available/10' },
  reserved: { de: 'Reserviert', en: 'Reserved', className: 'text-status-reserved border-status-reserved/30 bg-status-reserved/10' },
  sold: { de: 'Verkauft', en: 'Sold', className: 'text-status-sold border-status-sold/30 bg-status-sold/10' },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const vehicle = getMockVehicleBySlug(slug)
  if (!vehicle) return {}

  const title =
    locale === 'de'
      ? vehicle.seo_title_de ?? `${vehicle.make} ${vehicle.model} ${vehicle.year} kaufen`
      : vehicle.seo_title_en ?? `Buy ${vehicle.make} ${vehicle.model} ${vehicle.year}`

  const description =
    locale === 'de'
      ? vehicle.seo_description_de ?? vehicle.description_de ?? ''
      : vehicle.seo_description_en ?? vehicle.description_en ?? ''

  return generatePageMetadata({ title, description: description ?? '', locale })
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const vehicleMaybe = getMockVehicleBySlug(slug)
  if (!vehicleMaybe) notFound()
  const vehicle = vehicleMaybe as NonNullable<typeof vehicleMaybe>

  const t = await getTranslations('vehicles')
  const gradient = categoryGradient[vehicle.category] ?? 'from-surface to-background'
  const status = statusLabel[vehicle.status] ?? statusLabel.available

  const description = locale === 'de' ? vehicle.description_de : vehicle.description_en
  const vehicleLabel = `${vehicle.make} ${vehicle.model} (${vehicle.year}) — ${vehicle.stock_id}`
  const whatsappUrl = buildVehicleWhatsAppUrl(vehicle, locale as 'de' | 'en')

  const specs = [
    vehicle.mileage_km != null && {
      label: t('specs.mileage'),
      value: formatMileage(vehicle.mileage_km, locale === 'en' ? 'en-DE' : 'de-DE'),
    },
    vehicle.year && { label: t('specs.year'), value: vehicle.year.toString() },
    vehicle.fuel_type && {
      label: t('specs.fuel'),
      value: locale === 'de'
        ? { petrol: 'Benzin', diesel: 'Diesel', hybrid: 'Hybrid', electric: 'Elektro' }[vehicle.fuel_type] ?? vehicle.fuel_type
        : { petrol: 'Petrol', diesel: 'Diesel', hybrid: 'Hybrid', electric: 'Electric' }[vehicle.fuel_type] ?? vehicle.fuel_type,
    },
    vehicle.transmission && {
      label: t('specs.transmission'),
      value: locale === 'de'
        ? vehicle.transmission === 'automatic' ? 'Automatik' : 'Schaltgetriebe'
        : vehicle.transmission === 'automatic' ? 'Automatic' : 'Manual',
    },
    vehicle.power_kw != null && { label: t('specs.power'), value: formatPower(vehicle.power_kw) },
    vehicle.engine_cc != null && { label: t('specs.engine'), value: formatEngineDisplacement(vehicle.engine_cc) },
    vehicle.exterior_color && { label: t('specs.exterior'), value: vehicle.exterior_color },
    vehicle.interior_color && { label: t('specs.interior'), value: vehicle.interior_color },
    { label: t('specs.origin'), value: locale === 'de' ? 'Südkorea' : 'South Korea' },
    { label: t('specs.stock_id'), value: vehicle.stock_id },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      {/* Back navigation */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/fahrzeuge"
            className="inline-flex items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('detail.back')}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">

          {/* ── Left column ──────────────────────────────────────── */}
          <div className="flex flex-col gap-10">

            {/* Image placeholder */}
            <div className={cn('relative aspect-video w-full overflow-hidden bg-gradient-to-br', gradient)}>
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center select-none"
              >
                <span className="font-display text-[10rem] font-normal leading-none text-white/[0.03]">
                  NM
                </span>
              </div>

              {/* Badges */}
              <div className="absolute top-5 left-5 flex gap-2">
                <span
                  className={cn(
                    'inline-block rounded-sm border px-2.5 py-1 font-sans text-xs font-medium tracking-wide uppercase',
                    status.className,
                  )}
                >
                  {locale === 'de' ? status.de : status.en}
                </span>
                {vehicle.import_ready && (
                  <span className="inline-block rounded-sm border border-gold/30 bg-gold/10 px-2.5 py-1 font-sans text-xs font-medium tracking-wide text-gold uppercase">
                    {t('detail.import_ready')}
                  </span>
                )}
              </div>

              {/* Fuel indicator */}
              {vehicle.fuel_type === 'electric' ? (
                <div className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-sm border border-border/50 bg-background/60 px-3 py-1.5 backdrop-blur-sm">
                  <Zap className="h-3.5 w-3.5 text-gold" />
                  <span className="font-sans text-xs text-muted">{locale === 'de' ? 'Elektro' : 'Electric'}</span>
                </div>
              ) : vehicle.fuel_type ? (
                <div className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-sm border border-border/50 bg-background/60 px-3 py-1.5 backdrop-blur-sm">
                  <Fuel className="h-3.5 w-3.5 text-muted" />
                  <span className="font-sans text-xs text-muted capitalize">{vehicle.fuel_type}</span>
                </div>
              ) : null}
            </div>

            {/* Title (mobile — shown above specs on small screens) */}
            <div className="lg:hidden">
              <p className="eyebrow mb-3">{vehicle.stock_id}</p>
              <h1 className="font-display text-4xl leading-tight text-foreground">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-1 font-sans text-base text-muted">
                {vehicle.year}{vehicle.trim ? ` · ${vehicle.trim}` : ''}
              </p>
              {vehicle.price_visible && vehicle.price_eur != null ? (
                <p className="mt-4 font-display text-4xl text-foreground">
                  {formatPrice(vehicle.price_eur, locale === 'en' ? 'en-DE' : 'de-DE')}
                </p>
              ) : (
                <p className="mt-4 font-sans text-base italic text-muted">{t('price_on_request')}</p>
              )}
            </div>

            {/* Specs grid */}
            <div>
              <h2 className="mb-5 font-sans text-xs font-medium tracking-widest text-gold uppercase">
                {locale === 'de' ? 'Fahrzeugdaten' : 'Specifications'}
              </h2>
              <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
                {specs.map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-1 bg-background p-4">
                    <span className="font-sans text-2xs font-medium tracking-wide text-subtle uppercase">
                      {label}
                    </span>
                    <span className="font-sans text-sm text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {description && (
              <div>
                <h2 className="mb-4 font-sans text-xs font-medium tracking-widest text-gold uppercase">
                  {t('detail.description')}
                </h2>
                <p className="font-sans text-sm leading-relaxed text-muted">{description}</p>
              </div>
            )}

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div>
                <h2 className="mb-5 font-sans text-xs font-medium tracking-widest text-gold uppercase">
                  {t('detail.features')}
                </h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {vehicle.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-gold" strokeWidth={1.5} />
                      <span className="font-sans text-sm text-muted">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Origin note */}
            <div className="flex items-center gap-3 border-t border-border pt-6">
              <MapPin className="h-4 w-4 flex-shrink-0 text-subtle" />
              <p className="font-sans text-xs text-subtle">
                {locale === 'de'
                  ? 'Dieses Fahrzeug wird direkt aus Südkorea importiert. Import, Verzollung, TÜV und Zulassung inklusive.'
                  : 'This vehicle is imported directly from South Korea. Import, customs, TÜV and registration included.'}
              </p>
            </div>
          </div>

          {/* ── Right column (sticky sidebar) ─────────────────── */}
          <div className="flex flex-col gap-6">
            <div className="sticky top-24">

              {/* Title block */}
              <div className="mb-8 hidden lg:block">
                <p className="eyebrow mb-3">{vehicle.stock_id}</p>
                <h1 className="font-display text-4xl leading-tight text-foreground">
                  {vehicle.make} {vehicle.model}
                </h1>
                <p className="mt-1 font-sans text-sm text-muted">
                  {vehicle.year}{vehicle.trim ? ` · ${vehicle.trim}` : ''}
                </p>
                <div className="mt-5 border-t border-border pt-5">
                  {vehicle.price_visible && vehicle.price_eur != null ? (
                    <p className="font-display text-4xl text-foreground">
                      {formatPrice(vehicle.price_eur, locale === 'en' ? 'en-DE' : 'de-DE')}
                    </p>
                  ) : (
                    <p className="font-sans text-sm italic text-muted">{t('price_on_request')}</p>
                  )}
                </div>
              </div>

              {/* Inquiry form */}
              <div className="border border-border bg-surface p-6">
                <h2 className="mb-6 font-display text-xl text-foreground">
                  {t('detail.inquiry_title')}
                </h2>
                <InquiryForm
                  vehicleId={vehicle.id}
                  stockId={vehicle.stock_id}
                  vehicleLabel={vehicleLabel}
                  locale={locale as 'de' | 'en'}
                />
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 border border-border bg-background py-3 font-sans text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                {t('cta.whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
