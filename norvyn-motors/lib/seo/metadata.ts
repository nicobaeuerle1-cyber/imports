import type { Metadata } from 'next'
import { siteConfig } from './site-config'
import type { Vehicle } from '@/types/vehicle'

interface PageMetadataOptions {
  title: string
  description: string
  path?: string
  locale?: string
  image?: string
  noIndex?: boolean
}

export function generatePageMetadata({
  title,
  description,
  path = '/',
  locale = 'de',
  image,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${siteConfig.url}/${locale}${path}`
  const ogImage = image ?? siteConfig.ogImage

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        de: `${siteConfig.url}/de${path}`,
        en: `${siteConfig.url}/en${path}`,
      },
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogImage],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  }
}

export function generateVehicleMetadata(
  vehicle: Vehicle,
  locale: 'de' | 'en',
): Metadata {
  const titleDe =
    vehicle.seo_title_de ??
    `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`
  const titleEn =
    vehicle.seo_title_en ?? titleDe

  const descDe =
    vehicle.seo_description_de ??
    `${vehicle.year} ${vehicle.make} ${vehicle.model} – Premium Import aus Asien. ${vehicle.mileage_km?.toLocaleString('de-DE')} km, ${vehicle.fuel_type}. Jetzt anfragen bei Norvyn Motors.`
  const descEn =
    vehicle.seo_description_en ??
    `${vehicle.year} ${vehicle.make} ${vehicle.model} – Premium import from Asia. ${vehicle.mileage_km?.toLocaleString('en-GB')} km, ${vehicle.fuel_type}. Inquire now at Norvyn Motors.`

  const title = locale === 'de' ? titleDe : titleEn
  const description = locale === 'de' ? descDe : descEn
  const path =
    locale === 'de'
      ? `/fahrzeuge/${vehicle.slug}`
      : `/vehicles/${vehicle.slug}`

  return generatePageMetadata({ title, description, path, locale })
}
