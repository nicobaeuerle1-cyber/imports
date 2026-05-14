export const VEHICLE_CATEGORIES = [
  { value: 'performance', labelDe: 'Performance', labelEn: 'Performance' },
  { value: 'luxury', labelDe: 'Luxury / VIP', labelEn: 'Luxury / VIP' },
  {
    value: 'german_from_korea',
    labelDe: 'Deutsche Marken aus Korea',
    labelEn: 'German Brands from Korea',
  },
] as const

export const FUEL_TYPES = [
  { value: 'petrol', labelDe: 'Benzin', labelEn: 'Petrol' },
  { value: 'diesel', labelDe: 'Diesel', labelEn: 'Diesel' },
  { value: 'hybrid', labelDe: 'Hybrid', labelEn: 'Hybrid' },
  { value: 'electric', labelDe: 'Elektro', labelEn: 'Electric' },
] as const

export const TRANSMISSION_TYPES = [
  { value: 'automatic', labelDe: 'Automatik', labelEn: 'Automatic' },
  { value: 'manual', labelDe: 'Schaltgetriebe', labelEn: 'Manual' },
] as const

export const VEHICLE_STATUSES = [
  { value: 'draft', labelDe: 'Entwurf', labelEn: 'Draft' },
  { value: 'available', labelDe: 'Verfügbar', labelEn: 'Available' },
  { value: 'reserved', labelDe: 'Reserviert', labelEn: 'Reserved' },
  { value: 'sold', labelDe: 'Verkauft', labelEn: 'Sold' },
] as const

export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number]['value']
export type FuelType = (typeof FUEL_TYPES)[number]['value']
export type TransmissionType = (typeof TRANSMISSION_TYPES)[number]['value']
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number]['value']

export const INVENTORY_PAGE_SIZE = 12
export const FEATURED_VEHICLES_LIMIT = 6

export const SUPABASE_VEHICLE_IMAGES_BUCKET = 'vehicle-images'
