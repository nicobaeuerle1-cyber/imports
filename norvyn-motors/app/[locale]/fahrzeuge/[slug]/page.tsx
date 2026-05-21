import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'
import { generateVehicleMetadata } from '@/lib/seo/metadata'
import { getVehicleBySlug, getAllVehicleSlugs } from '@/lib/supabase/queries/vehicles'
import { buildVehicleWhatsAppUrl } from '@/lib/utils/whatsapp'
import { formatPrice, formatMileage, formatPower, formatEngineDisplacement } from '@/lib/utils/format'
import { Badge } from '@/components/ui/badge'
import type { BadgeVariant } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/lib/i18n/navigation'
import { ImageGallery } from '@/components/vehicles/image-gallery'
import { InquiryForm } from '@/components/vehicles/inquiry-form'
import { ArrowLeft, CheckCircle, Calendar, Gauge, Zap, Settings2, Fuel, Cog } from 'lucide-react'
import { JsonLd } from '@/components/seo/json-ld'
import { siteConfig } from '@/lib/seo/site-config'

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
  const { locale, slug } = await params
  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) return {}
  return generateVehicleMetadata(vehicle, locale as 'de' | 'en')
}

/** Generate an enhanced German marketing description server-side */
function generateEnhancedDescription(vehicle: {
  year: number
  make: string
  model: string
  trim?: string | null
  mileage_km?: number | null
  power_kw?: number | null
  engine_cc?: number | null
  fuel_type?: string | null
  transmission?: string | null
  exterior_color?: string | null
  features?: string[] | null
}): string {
  const trimPart = vehicle.trim ? ` ${vehicle.trim}` : ''
  const mileagePart =
    vehicle.mileage_km != null
      ? `Mit nur ${new Intl.NumberFormat('de-DE').format(vehicle.mileage_km)} km auf dem Tacho`
      : 'Mit einer sorgfältig dokumentierten Laufleistung'

  const fuelMap: Record<string, string> = {
    petrol: 'Benzinmotor',
    diesel: 'Dieselmotor',
    hybrid: 'Hybridantrieb',
    electric: 'Elektromotor',
  }
  const transmissionMap: Record<string, string> = {
    automatic: 'Automatikgetriebe',
    manual: 'Schaltgetriebe',
  }

  const engineDetails: string[] = []
  if (vehicle.power_kw) {
    const ps = Math.round(vehicle.power_kw * 1.36)
    engineDetails.push(`${vehicle.power_kw} kW (${ps} PS)`)
  }
  if (vehicle.engine_cc) {
    const liters = (vehicle.engine_cc / 1000).toFixed(1)
    engineDetails.push(`${liters}L Hubraum`)
  }
  if (vehicle.fuel_type && fuelMap[vehicle.fuel_type]) {
    engineDetails.push(fuelMap[vehicle.fuel_type])
  }
  if (vehicle.transmission && transmissionMap[vehicle.transmission]) {
    engineDetails.push(transmissionMap[vehicle.transmission])
  }

  const engineSentence =
    engineDetails.length > 0
      ? ` Der ${engineDetails.join(', ')} sorgt für ein überzeugendes Fahrerlebnis.`
      : ''

  const featureCount = vehicle.features?.length ?? 0
  const featureSentence =
    featureCount > 0
      ? ` Mit ${featureCount} Ausstattungsmerkmalen ist dieses Fahrzeug bestens ausgestattet.`
      : ''

  return `Der ${vehicle.year} ${vehicle.make} ${vehicle.model}${trimPart} überzeugt mit seiner imposanten Präsenz und einer sorgfältig gepflegten Ausstattung. ${mileagePart} bietet dieses Fahrzeug ein hervorragendes Preis-Leistungs-Verhältnis.${engineSentence}${featureSentence} Aus Südkorea importiert — geprüft und aufbereitet bei Norvyn Motors.`
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) notFound()

  const t = await getTranslations('vehicles')
  const tInquiry = await getTranslations('inquiry')

  const fuelLabels: Record<string, string> = {
    petrol: t('fuel.petrol'),
    diesel: t('fuel.diesel'),
    hybrid: t('fuel.hybrid'),
    electric: t('fuel.electric'),
  }
  const transmissionLabels: Record<string, string> = {
    automatic: t('transmission.automatic'),
    manual: t('transmission.manual'),
  }
  const statusLabels: Record<string, string> = {
    available: t('status.available'),
    reserved: t('status.reserved'),
    sold: t('status.sold'),
    draft: t('status.draft'),
  }
  const categoryLabels: Record<string, string> = {
    performance: t('categories.performance'),
    luxury: t('categories.luxury'),
    german_from_korea: t('categories.german_from_korea'),
  }

  const whatsappUrl = buildVehicleWhatsAppUrl(vehicle, locale as 'de' | 'en')
  const vehicleInfo =
    locale === 'de'
      ? `Fahrzeuganfrage: ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''} (Nr. ${vehicle.stock_id})`
      : `Vehicle inquiry: ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''} (Stock: ${vehicle.stock_id})`

  // Auto-generate enhanced description if description_de is basic (< 100 chars) or missing
  let description: string | null | undefined =
    locale === 'de' ? vehicle.description_de : vehicle.description_en

  if (locale === 'de' && (!description || description.length < 100)) {
    description = generateEnhancedDescription(vehicle)
  }

  const sortedImages = [...(vehicle.vehicle_images ?? [])].sort(
    (a, b) => a.position - b.position,
  )

  const inquiryTranslations = {
    name: tInquiry('name'),
    namePlaceholder: tInquiry('name_placeholder'),
    email: tInquiry('email'),
    emailPlaceholder: tInquiry('email_placeholder'),
    phone: tInquiry('phone'),
    phonePlaceholder: tInquiry('phone_placeholder'),
    message: tInquiry('message'),
    messagePlaceholder: tInquiry('message_placeholder'),
    submit: tInquiry('submit'),
    submitting: tInquiry('submitting'),
    successTitle: tInquiry('success_title'),
    successMessage: tInquiry('success_message'),
    error: tInquiry('error'),
    whatsapp: t('cta.whatsapp'),
  }

  const primaryImage = sortedImages[0]
  const fuelTypeSchema: Record<string, string> = {
    petrol: 'Gasoline',
    diesel: 'Diesel',
    hybrid: 'HybridElectric',
    electric: 'Electric',
  }

  const vehicleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`,
    brand: { '@type': 'Brand', name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    ...(vehicle.mileage_km != null && {
      mileageFromOdometer: {
        '@type': 'QuantitativeValue',
        value: vehicle.mileage_km,
        unitCode: 'KMT',
      },
    }),
    ...(vehicle.fuel_type && { fuelType: fuelTypeSchema[vehicle.fuel_type] ?? vehicle.fuel_type }),
    ...(vehicle.transmission && { vehicleTransmission: vehicle.transmission }),
    ...(vehicle.power_kw && {
      vehicleEngine: {
        '@type': 'EngineSpecification',
        enginePower: {
          '@type': 'QuantitativeValue',
          value: vehicle.power_kw,
          unitCode: 'KWT',
        },
      },
    }),
    ...(primaryImage && { image: primaryImage.url }),
    ...(vehicle.price_eur && {
      offers: {
        '@type': 'Offer',
        price: vehicle.price_eur,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'AutoDealer', name: siteConfig.name, url: siteConfig.url },
      },
    }),
    description:
      locale === 'de'
        ? (description ?? `${vehicle.year} ${vehicle.make} ${vehicle.model} – Premium Import aus Asien bei Norvyn Motors.`)
        : (vehicle.description_en ?? `${vehicle.year} ${vehicle.make} ${vehicle.model} – Premium import from Asia at Norvyn Motors.`),
  }

  // Stat cards for key specs
  const statCards: { icon: ReactNode; label: string; value: string }[] = []

  statCards.push({
    icon: <Calendar className="h-5 w-5 text-gold" strokeWidth={1.5} />,
    label: t('specs.year'),
    value: String(vehicle.year),
  })

  if (vehicle.mileage_km != null) {
    statCards.push({
      icon: <Gauge className="h-5 w-5 text-gold" strokeWidth={1.5} />,
      label: t('specs.mileage'),
      value: formatMileage(vehicle.mileage_km, locale === 'de' ? 'de-DE' : 'en-GB'),
    })
  }

  if (vehicle.fuel_type) {
    statCards.push({
      icon: <Fuel className="h-5 w-5 text-gold" strokeWidth={1.5} />,
      label: t('specs.fuel'),
      value: fuelLabels[vehicle.fuel_type] ?? vehicle.fuel_type,
    })
  }

  if (vehicle.transmission) {
    statCards.push({
      icon: <Cog className="h-5 w-5 text-gold" strokeWidth={1.5} />,
      label: t('specs.transmission'),
      value: transmissionLabels[vehicle.transmission] ?? vehicle.transmission,
    })
  }

  if (vehicle.power_kw != null) {
    statCards.push({
      icon: <Zap className="h-5 w-5 text-gold" strokeWidth={1.5} />,
      label: t('specs.power'),
      value: formatPower(vehicle.power_kw),
    })
  }

  if (vehicle.engine_cc != null) {
    statCards.push({
      icon: <Settings2 className="h-5 w-5 text-gold" strokeWidth={1.5} />,
      label: t('specs.engine'),
      value: formatEngineDisplacement(vehicle.engine_cc),
    })
  }

  // Additional specs for sidebar table
  const additionalSpecs: { label: string; value: string }[] = []
  if (vehicle.exterior_color) {
    additionalSpecs.push({ label: t('specs.exterior'), value: vehicle.exterior_color })
  }
  if (vehicle.interior_color) {
    additionalSpecs.push({ label: t('specs.interior'), value: vehicle.interior_color })
  }
  if (vehicle.origin_country) {
    additionalSpecs.push({ label: t('specs.origin'), value: vehicle.origin_country })
  }
  if (vehicle.stock_id) {
    additionalSpecs.push({ label: t('specs.stock_id'), value: vehicle.stock_id })
  }

  return (
    <>
      <JsonLd data={vehicleSchema} />
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
        {/* Back link */}
        <Link
          href="/fahrzeuge"
          className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('detail.back')}
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
          {/* ─── Left column ─── */}
          <div className="flex flex-col gap-8">
            {/* Vehicle title (mobile — above gallery) */}
            <div className="lg:hidden">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge variant={vehicle.status as BadgeVariant}>
                  {statusLabels[vehicle.status] ?? vehicle.status}
                </Badge>
                <Badge variant={vehicle.category as BadgeVariant}>
                  {categoryLabels[vehicle.category] ?? vehicle.category}
                </Badge>
                {vehicle.import_ready && (
                  <Badge variant="default">{t('detail.import_ready')}</Badge>
                )}
              </div>
              <p className="font-sans text-xs text-subtle uppercase tracking-widest">
                {vehicle.year} · {vehicle.stock_id}
              </p>
              <h1 className="mt-1 font-display text-3xl text-foreground leading-tight">
                {vehicle.make} {vehicle.model}
                {vehicle.trim && <span className="text-muted"> {vehicle.trim}</span>}
              </h1>
              <div className="mt-4">
                {vehicle.price_visible && vehicle.price_eur != null ? (
                  <p className="font-display text-3xl text-foreground">
                    {formatPrice(vehicle.price_eur, locale === 'de' ? 'de-DE' : 'en-GB')}
                  </p>
                ) : (
                  <p className="font-display text-2xl text-gold">{t('price_on_request')}</p>
                )}
              </div>
            </div>

            {/* Hero image gallery */}
            <ImageGallery
              images={sortedImages}
              vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            />

            {/* Key stat cards */}
            {statCards.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {statCards.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col gap-2 border border-border bg-surface p-4"
                  >
                    <div className="flex items-center gap-2">
                      {stat.icon}
                      <span className="font-sans text-xs text-subtle uppercase tracking-wide">
                        {stat.label}
                      </span>
                    </div>
                    <p className="font-display text-base text-foreground leading-tight">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {description && (
              <div className="border-t border-border pt-8">
                <h2 className="mb-4 font-display text-2xl text-foreground">
                  {t('detail.description')}
                </h2>
                <p className="font-sans text-sm leading-relaxed text-muted whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            )}

            {/* Features grid */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="border-t border-border pt-8">
                <h2 className="mb-6 font-display text-2xl text-foreground">
                  {t('detail.features')}
                </h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {vehicle.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 rounded-none border border-border bg-surface p-3 font-sans text-sm text-muted"
                    >
                      <CheckCircle
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold"
                        strokeWidth={1.5}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ─── Right column — sticky sidebar ─── */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
            {/* Vehicle header card (desktop) */}
            <div className="hidden border border-border bg-surface p-6 lg:block">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant={vehicle.status as BadgeVariant}>
                  {statusLabels[vehicle.status] ?? vehicle.status}
                </Badge>
                <Badge variant={vehicle.category as BadgeVariant}>
                  {categoryLabels[vehicle.category] ?? vehicle.category}
                </Badge>
                {vehicle.import_ready && (
                  <Badge variant="default">{t('detail.import_ready')}</Badge>
                )}
              </div>

              <p className="font-sans text-xs text-subtle uppercase tracking-widest">
                {vehicle.year} · {vehicle.stock_id}
              </p>
              <h1 className="mt-1.5 font-display text-3xl text-foreground leading-tight">
                {vehicle.make} {vehicle.model}
                {vehicle.trim && <span className="text-muted"> {vehicle.trim}</span>}
              </h1>

              <div className="mt-6 border-t border-border pt-5">
                {vehicle.price_visible && vehicle.price_eur != null ? (
                  <p className="font-display text-4xl text-foreground">
                    {formatPrice(vehicle.price_eur, locale === 'de' ? 'de-DE' : 'en-GB')}
                  </p>
                ) : (
                  <p className="font-display text-3xl text-gold">
                    {t('price_on_request')}
                  </p>
                )}
              </div>
            </div>

            {/* Additional specs (color, origin, stock id) */}
            {additionalSpecs.length > 0 && (
              <div className="border border-border bg-surface p-6">
                <dl className="divide-y divide-border">
                  {additionalSpecs.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <dt className="font-sans text-xs text-muted uppercase tracking-wide">
                        {label}
                      </dt>
                      <dd className="font-sans text-sm text-foreground text-right">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Inquiry form */}
            <div className="border border-border bg-surface p-6">
              <h2 className="mb-6 font-display text-2xl text-foreground">
                {t('detail.inquiry_title')}
              </h2>
              <InquiryForm
                vehicleInfo={vehicleInfo}
                whatsappUrl={whatsappUrl}
                locale={locale as 'de' | 'en'}
                translations={inquiryTranslations}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
