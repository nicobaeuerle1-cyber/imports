export function formatPrice(
  amount: number,
  locale: string = 'de-DE',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatMileage(km: number, locale: string = 'de-DE'): string {
  return `${new Intl.NumberFormat(locale).format(km)} km`
}

export function formatPower(kw: number): string {
  const ps = Math.round(kw * 1.36)
  return `${kw} kW / ${ps} PS`
}

export function formatEngineDisplacement(cc: number): string {
  const liters = (cc / 1000).toFixed(1)
  return `${liters}L`
}
