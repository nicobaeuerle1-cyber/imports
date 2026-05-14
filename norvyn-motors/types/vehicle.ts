import type { Database } from './database'

export type Vehicle = Database['public']['Tables']['vehicles']['Row']
export type VehicleInsert = Database['public']['Tables']['vehicles']['Insert']
export type VehicleUpdate = Database['public']['Tables']['vehicles']['Update']

export type VehicleImage = Database['public']['Tables']['vehicle_images']['Row']

export interface VehicleWithImages extends Vehicle {
  vehicle_images: VehicleImage[]
}

export function getCoverImage(vehicle: VehicleWithImages): VehicleImage | null {
  if (!vehicle.vehicle_images?.length) return null
  return (
    vehicle.vehicle_images.find((img) => img.position === 0) ??
    vehicle.vehicle_images[0]
  )
}
