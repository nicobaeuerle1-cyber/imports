import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const ENCAR_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json, text/html, */*',
  Referer: 'https://www.encar.com/',
  'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
}

function extractCarId(url: string): string | null {
  // Format: ?carid=42046286
  const paramMatch = url.match(/[?&]carid=(\d+)/)
  if (paramMatch) return paramMatch[1]
  // Format: /cars/detail/42046286 or /dc/dc_cardetailview.do?carid=42046286
  const pathMatch = url.match(/\/(\d{7,})/)
  if (pathMatch) return pathMatch[1]
  // Plain number
  if (/^\d{7,}$/.test(url.trim())) return url.trim()
  return null
}

function mapFuelType(raw: string | undefined): string {
  if (!raw) return 'petrol'
  if (raw.includes('경유')) return 'diesel'
  if (raw.includes('전기')) return 'electric'
  if (raw.includes('하이브리드')) return 'hybrid'
  // 휘발유, LPG, default
  return 'petrol'
}

function mapTransmission(raw: string | undefined): string {
  if (!raw) return 'automatic'
  if (raw.includes('수동')) return 'manual'
  return 'automatic'
}

function guessCategory(make: string, powerKw: number | null): string {
  const m = make?.toLowerCase() ?? ''
  if (['bmw', 'mercedes-benz', 'mercedes', 'audi', 'porsche', 'volkswagen', 'vw'].some((b) => m.includes(b))) {
    return 'german_from_korea'
  }
  if (['genesis', 'lexus'].some((b) => m.includes(b))) return 'luxury'
  if (powerKw && powerKw > 200) return 'performance'
  return 'luxury'
}

function generateSlug(make: string, model: string, year: number, carid: string): string {
  const base = `${year} ${make} ${model}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  return `${base}-${carid}`
}

async function getNextStockId(serviceClient: ReturnType<typeof createServiceClient> extends Promise<infer T> ? T : never): Promise<string> {
  const { data } = await serviceClient
    .from('vehicles')
    .select('stock_id')
    .like('stock_id', 'NM%')
    .order('stock_id', { ascending: false })
    .limit(1)

  if (!data || data.length === 0) return 'NM001'

  const last = data[0].stock_id ?? 'NM000'
  const num = parseInt(last.replace(/\D/g, ''), 10) || 0
  return `NM${String(num + 1).padStart(3, '0')}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseVehicleData(data: any, carid: string) {
  // Normalise across API response shapes:
  // Shape 1: search endpoint  → { SearchResults: [{ Manufacturer, ModelGroup, BadgeName, FormYear, Mileage, ... }] }
  // Shape 2: v1 detail        → { Make, Model, Year, Mileage, FuelType, ... }
  let car = data

  if (Array.isArray(data?.SearchResults) && data.SearchResults.length > 0) {
    car = data.SearchResults[0]
  } else if (data?.TotalCount === 0) {
    return null
  }

  const make: string =
    car.Manufacturer ?? car.Make ?? car.Brand ?? car.maker ?? ''
  const model: string =
    car.ModelGroup ?? car.Model ?? car.model ?? ''
  const trim: string =
    car.BadgeName ?? car.Badge ?? car.Trim ?? car.trim ?? car.Grade ?? ''
  const year: number =
    parseInt(String(car.FormYear ?? car.Year ?? car.year ?? '0'), 10) || 0
  const mileageKm: number | null =
    car.Mileage != null ? parseInt(String(car.Mileage).replace(/,/g, ''), 10) : null
  const fuelType = mapFuelType(car.FuelType ?? car.Fuel ?? car.fuelType)
  const transmission = mapTransmission(car.Transmission ?? car.GearBox ?? car.gearbox)
  const engineCc: number | null =
    car.Displacement != null ? parseInt(String(car.Displacement).replace(/,/g, ''), 10) : null
  const powerKw: number | null =
    car.Power != null ? Math.round(parseFloat(String(car.Power).replace(/,/g, ''))) : null
  const exteriorColor: string | null = car.Color ?? car.ExteriorColor ?? null
  const interiorColor: string | null = car.InteriorColor ?? null

  const features: string[] = []
  if (car.Options) {
    if (typeof car.Options === 'string') {
      features.push(...car.Options.split(/[,/|]/).map((s: string) => s.trim()).filter(Boolean))
    } else if (Array.isArray(car.Options)) {
      features.push(...car.Options.map((o: { name?: string }) => o?.name ?? String(o)).filter(Boolean))
    }
  }

  if (!make || year === 0) return null

  const category = guessCategory(make, powerKw)
  const slug = generateSlug(make, model, year, carid)

  const descDe = `${year} ${make} ${model}${trim ? ' ' + trim : ''} aus Asien bei Norvyn Motors.`
  const descEn = `${year} ${make} ${model}${trim ? ' ' + trim : ''} from Asia at Norvyn Motors.`

  return {
    slug,
    status: 'available',
    category,
    make,
    model,
    year,
    trim: trim || null,
    mileage_km: mileageKm,
    price_eur: null,
    price_visible: false,
    exterior_color: exteriorColor,
    interior_color: interiorColor,
    fuel_type: fuelType,
    transmission,
    engine_cc: engineCc,
    power_kw: powerKw,
    features: features.length > 0 ? features : null,
    description_de: descDe,
    description_en: descEn,
    origin_country: 'KR',
    import_ready: true,
    featured: false,
    sort_order: 999,
    seo_title_de: null,
    seo_title_en: null,
    seo_description_de: null,
    seo_description_en: null,
    // stock_id filled in after querying DB
  }
}

async function fetchViaProxy(url: string): Promise<unknown> {
  // allorigins.win proxies the request from a neutral server not blocked by Encar
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
  const res = await fetch(proxyUrl, { next: { revalidate: 0 } })
  if (!res.ok) return null
  const wrapper = await res.json() as { contents?: string; status?: { http_code: number } }
  if (!wrapper.contents || (wrapper.status?.http_code ?? 0) >= 400) return null
  try {
    return JSON.parse(wrapper.contents)
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { url } = body as { url: string }

  const carid = extractCarId(url ?? '')
  if (!carid) {
    return NextResponse.json(
      { success: false, error: 'invalid_url', carid: null },
      { status: 400 },
    )
  }

  // Try multiple Encar API endpoints via proxy
  const endpoints = [
    `https://api.encar.com/search/car/list/premium?count=1&q=(And.Hidden.N._.CarType.N._.Id.${carid}.)&inav=%7CMetadata%7CSort`,
    `https://api.encar.com/search/car/list/premium?count=1&q=(And.Hidden.N._.Id.${carid}.)`,
    `https://api.encar.com/v1/car/${carid}`,
    `https://api.encar.com/v1/cars/${carid}`,
  ]

  let vehicleRaw: unknown = null
  for (const endpoint of endpoints) {
    try {
      vehicleRaw = await fetchViaProxy(endpoint)
      if (vehicleRaw) break
    } catch {
      continue
    }
  }

  if (!vehicleRaw) {
    return NextResponse.json({ success: false, error: 'fetch_failed', carid })
  }

  const parsed = parseVehicleData(vehicleRaw, carid)
  if (!parsed) {
    return NextResponse.json({ success: false, error: 'fetch_failed', carid })
  }

  // Generate stock_id
  const serviceClient = await createServiceClient()
  const stockId = await getNextStockId(serviceClient)

  return NextResponse.json({
    success: true,
    vehicle: { ...parsed, stock_id: stockId },
  })
}
