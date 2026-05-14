import { siteConfig } from '@/lib/seo/site-config'
import type { Vehicle } from '@/types/vehicle'

const BASE_URL = 'https://wa.me'

export function buildVehicleWhatsAppUrl(
  vehicle: Vehicle,
  locale: 'de' | 'en' = 'de',
): string {
  const number = siteConfig.whatsappNumber
  if (!number) return '#'

  const message =
    locale === 'de'
      ? `Hallo, ich interessiere mich für: ${vehicle.make} ${vehicle.model} (${vehicle.year}) — Fahrzeugnummer: ${vehicle.stock_id}`
      : `Hello, I am interested in: ${vehicle.make} ${vehicle.model} (${vehicle.year}) — Stock ID: ${vehicle.stock_id}`

  return `${BASE_URL}/${number}?text=${encodeURIComponent(message)}`
}

export function buildGeneralWhatsAppUrl(locale: 'de' | 'en' = 'de'): string {
  const number = siteConfig.whatsappNumber
  if (!number) return '#'

  const message =
    locale === 'de'
      ? 'Hallo, ich interessiere mich für Ihr Fahrzeugangebot.'
      : 'Hello, I am interested in your vehicle inventory.'

  return `${BASE_URL}/${number}?text=${encodeURIComponent(message)}`
}
