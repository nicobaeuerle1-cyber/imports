import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
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
import { ArrowLeft, CheckCircle } from 'lucide-react'
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

  const description =
    locale === 'de' ? vehicle.description_de : vehicle.description_en

  const sortedImages = [...vehicle.vehicle_images].sort(
    (a, b) => a.position - b.position,
  )

  const specs: { label: string; value: string | null }[] = [
    { label: t('specs.year'), value: String(vehicle.year) },
    {
      label: t('specs.mileage'),
      value:
        vehicle.mileage_km != null
          ? formatMileage(vehicle.mileage_km, locale === 'de' ? 'de-DE' : 'en-GB')
          : null,
    },
    {
      label: t('specs.fuel'),
      value: vehicle.fuel_type
        ? (fuelLabels[vehicle.fuel_type] ?? vehicle.fuel_type)
        : null,
    },
    {
      label: t('specs.transmission'),
      value: vehicle.transmission
        ? (transmissionLabels[vehicle.transmission] ?? vehicle.transmission)
        : null,
    },
    {
      label: t('specs.power'),
      value: vehicle.power_kw != null ? formatPower(vehicle.power_kw) : null,
    },
    {
      label: t('specs.engine'),
      value:
        vehicle.engine_cc != null
          ? formatEngineDisplacement(vehicle.engine_cc)
          : null,
    },
    { label: t('specs.exterior'), value: vehicle.exterior_color },
    { label: t('specs.interior'), value: vehicle.interior_color },
    { label: t('specs.origin'), value: vehicle.origin_country },
    { label: t('specs.stock_id'), value: vehicle.stock_id },
  ].filter((s) => s.value != null)

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
        ? (vehicle.description_de ?? `${vehicle.year} ${vehicle.make} ${vehicle.model} – Premium Import aus Asien bei Norvyn Motors.`)
        : (vehicle.description_en ?? `${vehicle.year} ${vehicle.make} ${vehicle.model} – Premium import from Asia at Norvyn Motors.`),
  }

  return (
    <>
      <JsonLd data={vehicleSchema} />
    <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
      {/* Back link */}
      <Link
        href="/fahrzeuge"
        className="mb-10 inline-flex items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('detail.back')}
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px]">
        {/* Left column */}
        <div className="flex flex-col gap-10">
          {/* Gallery */}
          <ImageGallery
            images={sortedImages}
            vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />

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

          {/* Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="border-t border-border pt-8">
              <h2 className="mb-6 font-display text-2xl text-foreground">
                {t('detail.features')}
              </h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {vehicle.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 font-sans text-sm text-muted"
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

        {/* Right column — sticky sidebar */}
        <div className="flex flex-col gap-8 lg:sticky lg:top-8 lg:self-start">
          {/* Vehicle header */}
          <div className="border border-border bg-surface p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-2">
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
            </div>

            <p className="font-sans text-xs text-subtle uppercase tracking-widest">
              {vehicle.year} · {vehicle.stock_id}
            </p>
            <h1 className="mt-1.5 font-display text-3xl text-foreground leading-tight">
              {vehicle.make} {vehicle.model}
              {vehicle.trim && (
                <span className="text-muted"> {vehicle.trim}</span>
              )}
            </h1>

            <div className="mt-6 border-t border-border pt-5">
              {vehicle.price_visible && vehicle.price_eur != null ? (
                <p className="font-display text-4xl text-foreground">
                  {formatPrice(
                    vehicle.price_eur,
                    locale === 'de' ? 'de-DE' : 'en-GB',
                  )}
                </p>
              ) : (
                <p className="font-sans text-base text-muted">
                  {t('price_on_request')}
                </p>
              )}
            </div>
          </div>

          {/* Specs */}
          <div className="border border-border bg-surface p-6">
            <dl className="divide-y divide-border">
              {specs.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4 py-3">
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
