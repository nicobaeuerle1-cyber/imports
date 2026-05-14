import { siteConfig } from './site-config'
import type { Vehicle } from '@/types/vehicle'

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.tagline,
    areaServed: 'DE',
    ...(siteConfig.company.email && { email: siteConfig.company.email }),
    ...(siteConfig.company.phone && { telephone: siteConfig.company.phone }),
    ...(siteConfig.company.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.company.address,
        addressLocality: siteConfig.company.city,
        addressCountry: 'DE',
      },
    }),
  }
}

export function buildCarSchema(vehicle: Vehicle, locale: 'de' | 'en') {
  const vehicleUrl =
    locale === 'de'
      ? `${siteConfig.url}/de/fahrzeuge/${vehicle.slug}`
      : `${siteConfig.url}/en/vehicles/${vehicle.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    brand: { '@type': 'Brand', name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: vehicle.year.toString(),
    mileageFromOdometer: vehicle.mileage_km
      ? { '@type': 'QuantitativeValue', value: vehicle.mileage_km, unitCode: 'KMT' }
      : undefined,
    fuelType: vehicle.fuel_type ?? undefined,
    vehicleTransmission: vehicle.transmission ?? undefined,
    color: vehicle.exterior_color ?? undefined,
    url: vehicleUrl,
    ...(vehicle.price_visible &&
      vehicle.price_eur && {
        offers: {
          '@type': 'Offer',
          price: vehicle.price_eur,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'AutoDealer', name: siteConfig.name },
        },
      }),
  }
}
