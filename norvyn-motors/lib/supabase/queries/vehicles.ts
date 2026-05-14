import { createClient } from '@/lib/supabase/server'
import type { Vehicle, VehicleWithImages } from '@/types/vehicle'
import { INVENTORY_PAGE_SIZE } from '@/lib/constants'

interface VehicleFilters {
  category?: string
  fuelType?: string
  minPrice?: number
  maxPrice?: number
  status?: string
  page?: number
}

export async function getAvailableVehicles(
  filters: VehicleFilters = {},
): Promise<{ vehicles: VehicleWithImages[]; total: number }> {
  const supabase = await createClient()
  const page = filters.page ?? 1
  const from = (page - 1) * INVENTORY_PAGE_SIZE
  const to = from + INVENTORY_PAGE_SIZE - 1

  let query = supabase
    .from('vehicles')
    .select('*, vehicle_images(*)', { count: 'exact' })
    .eq('status', 'available')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (filters.category) query = query.eq('category', filters.category)
  if (filters.fuelType) query = query.eq('fuel_type', filters.fuelType)
  if (filters.minPrice) query = query.gte('price_eur', filters.minPrice)
  if (filters.maxPrice) query = query.lte('price_eur', filters.maxPrice)

  const { data, error, count } = await query

  if (error) throw new Error(`Failed to fetch vehicles: ${error.message}`)

  return {
    vehicles: (data as VehicleWithImages[]) ?? [],
    total: count ?? 0,
  }
}

export async function getFeaturedVehicles(): Promise<VehicleWithImages[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('vehicles')
    .select('*, vehicle_images(*)')
    .eq('status', 'available')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(6)

  if (error) throw new Error(`Failed to fetch featured vehicles: ${error.message}`)

  return (data as VehicleWithImages[]) ?? []
}

export async function getVehicleBySlug(
  slug: string,
): Promise<VehicleWithImages | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('vehicles')
    .select('*, vehicle_images(*)')
    .eq('slug', slug)
    .eq('status', 'available')
    .single()

  if (error) return null

  return data as VehicleWithImages
}

export async function getAllVehicleSlugs(): Promise<string[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('vehicles')
    .select('slug')
    .eq('status', 'available')

  return data?.map((v) => v.slug) ?? []
}

// Admin — uses service role through route handlers
export async function getAllVehiclesAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<VehicleWithImages[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*, vehicle_images(*)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data as VehicleWithImages[]) ?? []
}
