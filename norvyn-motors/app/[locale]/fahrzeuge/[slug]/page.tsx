import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getVehicleBySlug, getAllVehicleSlugs, getSimilarVehicles } from '@/lib/supabase/queries/vehicles'
import { buildVehicleWhatsAppUrl } from '@/lib/utils/whatsapp'
import { formatMileage, formatPower, formatEngineDisplacement, formatPrice } from '@/lib/utils/format'
import { Link } from '@/lib/i18n/navigation'
import { ImageGallery } from '@/components/vehicles/image-gallery'
import { InquiryForm } from '@/components/vehicles/inquiry-form'
import { VehicleCard } from '@/components/vehicles/vehicle-card'
import { ArrowLeft, CheckCircle, Calendar, Gauge, Zap, Settings2, Fuel, Cog, MessageCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllVehicleSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) return {}
  return {
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model} – Norvyn Motors`,
    description: vehicle.description_de ?? `${vehicle.year} ${vehicle.make} ${vehicle.model} bei Norvyn Motors.`,
  }
}

function buildDescription(vehicle: {
  year: number; make: string; model: string; trim?: string | null
  mileage_km?: number | null; power_kw?: number | null; engine_cc?: number | null
  fuel_type?: string | null; features?: string[] | null
}): string {
  const trim = vehicle.trim ? ` ${vehicle.trim}` : ''
  const km = vehicle.mileage_km != null
    ? `Mit ${new Intl.NumberFormat('de-DE').format(vehicle.mileage_km)} km`
    : 'Mit dokumentierter Laufleistung'
  const fuelMap: Record<string, string> = { petrol: 'Benzinmotor', diesel: 'Dieselmotor', hybrid: 'Hybridantrieb', electric: 'Elektromotor' }
  const engine: string[] = []
  if (vehicle.power_kw) engine.push(`${vehicle.power_kw} kW / ${Math.round(vehicle.power_kw * 1.36)} PS`)
  if (vehicle.engine_cc) engine.push(`${(vehicle.engine_cc / 1000).toFixed(1)}L`)
  if (vehicle.fuel_type && fuelMap[vehicle.fuel_type]) engine.push(fuelMap[vehicle.fuel_type])
  const engineStr = engine.length ? ` ${engine.join(', ')}.` : ''
  const featureStr = (vehicle.features?.length ?? 0) > 0 ? ` ${vehicle.features!.length} Ausstattungsmerkmale inklusive.` : ''
  return `Der ${vehicle.year} ${vehicle.make} ${vehicle.model}${trim} aus Südkorea. ${km} bietet dieses Fahrzeug ein überzeugendes Preis-Leistungs-Verhältnis.${engineStr}${featureStr} Geprüft und aufbereitet bei Norvyn Motors.`
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) notFound()

  const similarVehicles = await getSimilarVehicles(vehicle.category, slug)

  const t = await getTranslations({ locale, namespace: 'vehicles' })
  const tInquiry = await getTranslations({ locale, namespace: 'inquiry' })

  const fuelLabels: Record<string, string> = {
    petrol: t('fuel.petrol'), diesel: t('fuel.diesel'),
    hybrid: t('fuel.hybrid'), electric: t('fuel.electric'),
  }
  const transmissionLabels: Record<string, string> = {
    automatic: t('transmission.automatic'), manual: t('transmission.manual'),
  }

  const description = (locale === 'de' && (!vehicle.description_de || vehicle.description_de.length < 100))
    ? buildDescription(vehicle)
    : (locale === 'de' ? vehicle.description_de : vehicle.description_en) ?? buildDescription(vehicle)

  const sortedImages = [...(vehicle.vehicle_images ?? [])].sort((a, b) => a.position - b.position)
  const whatsappUrl = buildVehicleWhatsAppUrl(vehicle, locale as 'de' | 'en')

  const vehicleInfo = locale === 'de'
    ? `Anfrage: ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''} (${vehicle.stock_id})`
    : `Inquiry: ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''} (${vehicle.stock_id})`

  const inquiryTranslations = {
    name: tInquiry('name'), namePlaceholder: tInquiry('name_placeholder'),
    email: tInquiry('email'), emailPlaceholder: tInquiry('email_placeholder'),
    phone: tInquiry('phone'), phonePlaceholder: tInquiry('phone_placeholder'),
    message: tInquiry('message'), messagePlaceholder: tInquiry('message_placeholder'),
    submit: tInquiry('submit'), submitting: tInquiry('submitting'),
    successTitle: tInquiry('success_title'), successMessage: tInquiry('success_message'),
    error: tInquiry('error'), whatsapp: t('cta.whatsapp'),
  }

  type StatCard = { icon: React.JSX.Element; label: string; value: string }
  const stats: StatCard[] = [
    { icon: <Calendar className="h-5 w-5 text-gold" strokeWidth={1.5} />, label: t('specs.year'), value: String(vehicle.year) },
  ]
  if (vehicle.mileage_km != null) stats.push({ icon: <Gauge className="h-5 w-5 text-gold" strokeWidth={1.5} />, label: t('specs.mileage'), value: formatMileage(vehicle.mileage_km, locale === 'de' ? 'de-DE' : 'en-GB') })
  if (vehicle.fuel_type) stats.push({ icon: <Fuel className="h-5 w-5 text-gold" strokeWidth={1.5} />, label: t('specs.fuel'), value: fuelLabels[vehicle.fuel_type] ?? vehicle.fuel_type })
  if (vehicle.transmission) stats.push({ icon: <Cog className="h-5 w-5 text-gold" strokeWidth={1.5} />, label: t('specs.transmission'), value: transmissionLabels[vehicle.transmission] ?? vehicle.transmission })
  if (vehicle.power_kw != null) stats.push({ icon: <Zap className="h-5 w-5 text-gold" strokeWidth={1.5} />, label: t('specs.power'), value: formatPower(vehicle.power_kw) })
  if (vehicle.engine_cc != null) stats.push({ icon: <Settings2 className="h-5 w-5 text-gold" strokeWidth={1.5} />, label: t('specs.engine'), value: formatEngineDisplacement(vehicle.engine_cc) })

  const sideSpecs = [
    vehicle.exterior_color && { label: t('specs.exterior'), value: vehicle.exterior_color },
    vehicle.interior_color && { label: t('specs.interior'), value: vehicle.interior_color },
    vehicle.origin_country && { label: t('specs.origin'), value: vehicle.origin_country },
    { label: t('specs.stock_id'), value: vehicle.stock_id },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <Link href="/fahrzeuge" className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {t('detail.back')}
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        {/* Left */}
        <div className="flex flex-col gap-8">
          {/* Mobile title */}
          <div className="lg:hidden">
            <p className="font-sans text-xs text-muted uppercase tracking-widest mb-1">{vehicle.year} · {vehicle.stock_id}</p>
            <h1 className="font-display text-3xl text-foreground">{vehicle.make} {vehicle.model}{vehicle.trim && <span className="text-muted"> {vehicle.trim}</span>}</h1>
            <p className="font-display text-2xl text-gold mt-3">
              {vehicle.price_visible && vehicle.price_eur != null
                ? formatPrice(vehicle.price_eur, locale === 'de' ? 'de-DE' : 'en-GB')
                : t('price_on_request')}
            </p>
          </div>

          <ImageGallery images={sortedImages} vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />

          {/* Stat cards */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="border border-border bg-surface p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">{s.icon}<span className="font-sans text-xs text-muted uppercase tracking-wide">{s.label}</span></div>
                  <p className="font-display text-base text-foreground">{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="border-t border-border pt-8">
              <h2 className="font-display text-2xl text-foreground mb-4">{t('detail.description')}</h2>
              <p className="font-sans text-sm text-muted leading-relaxed whitespace-pre-wrap">{description}</p>
            </div>
          )}

          {/* Features */}
          {(vehicle.features?.length ?? 0) > 0 && (
            <div className="border-t border-border pt-8">
              <h2 className="font-display text-2xl text-foreground mb-6">{t('detail.features')}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.features!.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 border border-border bg-surface p-3 font-sans text-sm text-muted">
                    <CheckCircle className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          {/* Title card (desktop) */}
          <div className="hidden lg:block border border-border bg-surface p-6">
            <p className="font-sans text-xs text-muted uppercase tracking-widest mb-1">{vehicle.year} · {vehicle.stock_id}</p>
            <h1 className="font-display text-3xl text-foreground leading-tight">
              {vehicle.make} {vehicle.model}
              {vehicle.trim && <span className="text-muted"> {vehicle.trim}</span>}
            </h1>
            <div className="mt-5 pt-5 border-t border-border">
              <p className="font-display text-3xl text-gold">
                {vehicle.price_visible && vehicle.price_eur != null
                  ? formatPrice(vehicle.price_eur, locale === 'de' ? 'de-DE' : 'en-GB')
                  : t('price_on_request')}
              </p>
            </div>
          </div>

          {/* Side specs */}
          {sideSpecs.length > 0 && (
            <div className="border border-border bg-surface p-6">
              <dl className="divide-y divide-border">
                {sideSpecs.map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4 py-3">
                    <dt className="font-sans text-xs text-muted uppercase tracking-wide">{label}</dt>
                    <dd className="font-sans text-sm text-foreground text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 border border-[#25D366]/40 bg-[#25D366]/10 py-4 font-sans text-sm font-medium text-[#25D366] transition-colors hover:bg-[#25D366]/20"
          >
            <MessageCircle className="h-5 w-5" />
            {t('cta.whatsapp')}
          </a>

          {/* Inquiry */}
          <div id="anfragen" className="border border-border bg-surface p-6">
            <h2 className="font-display text-2xl text-foreground mb-6">{t('detail.inquiry_title')}</h2>
            <InquiryForm vehicleInfo={vehicleInfo} whatsappUrl={whatsappUrl} locale={locale as 'de' | 'en'} translations={inquiryTranslations} />
          </div>
        </div>
      </div>

      {/* Similar vehicles */}
      {similarVehicles.length > 0 && (
        <div className="mt-20 border-t border-border pt-16">
          <p className="eyebrow mb-3">{locale === 'de' ? 'Weitere Fahrzeuge' : 'More Vehicles'}</p>
          <h2 className="font-display text-3xl text-foreground mb-10">
            {locale === 'de' ? 'Das könnte Sie auch interessieren' : 'You might also like'}
          </h2>
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {similarVehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                priceOnRequest={t('price_on_request')}
                inquireLabel={t('cta.inquire')}
                statusLabels={{
                  available: t('status.available'),
                  reserved: t('status.reserved'),
                  sold: t('status.sold'),
                  draft: t('status.draft'),
                }}
                categoryLabels={{
                  performance: t('categories.performance'),
                  luxury: t('categories.luxury'),
                  german_from_korea: t('categories.german_from_korea'),
                }}
                fuelLabels={{
                  petrol: t('fuel.petrol'), diesel: t('fuel.diesel'),
                  hybrid: t('fuel.hybrid'), electric: t('fuel.electric'),
                }}
                transmissionLabels={{
                  automatic: t('transmission.automatic'), manual: t('transmission.manual'),
                }}
                locale={locale}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
