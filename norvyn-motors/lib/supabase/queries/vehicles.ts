// NOTE: Supabase RLS — run the following in the SQL editor to allow public reads:
// CREATE POLICY "Public can view available vehicles"
//   ON vehicles FOR SELECT
//   USING (status = 'available');
//
// CREATE POLICY "Public can view vehicle images"
//   ON vehicle_images FOR SELECT
//   USING (true);

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
  sort?: 'newest' | 'price_asc' | 'price_desc'
  search?: string
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
    .range(from, to)

  if (filters.sort === 'price_asc') {
    query = query.order('price_eur', { ascending: true, nullsFirst: false })
  } else if (filters.sort === 'price_desc') {
    query = query.order('price_eur', { ascending: false, nullsFirst: false })
  } else {
    query = query
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
  }

  if (filters.search) {
    const term = filters.search.trim()
    query = query.or(`make.ilike.%${term}%,model.ilike.%${term}%,trim.ilike.%${term}%`)
  }
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
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('vehicles')
      .select('*, vehicle_images(*)')
      .eq('slug', slug)
      .eq('status', 'available')
      .single()

    if (error) return null

    return data as VehicleWithImages
  } catch {
    return null
  }
}

export async function getAllVehicleSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient()

    const { data } = await supabase
      .from('vehicles')
      .select('slug')
      .eq('status', 'available')

    return data?.map((v) => v.slug) ?? []
  } catch {
    return []
  }
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
