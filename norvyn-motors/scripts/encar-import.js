#!/usr/bin/env node
/**
 * Norvyn Motors — Encar Auto-Import
 *
 * Öffnet einen echten Browser, sucht Fahrzeuge auf Encar,
 * lädt Bilder herunter und speichert alles in Supabase.
 *
 * Setup (einmalig):
 *   cd scripts
 *   npm install
 *   npx playwright install chromium
 *
 * Starten:
 *   node encar-import.js
 */

// ─── KONFIGURATION — HIER AUSFÜLLEN ──────────────────────────────────────────

const SUPABASE_URL = 'DEINE_SUPABASE_URL'          // z.B. https://xxx.supabase.co
const SUPABASE_KEY = 'DEIN_SERVICE_ROLE_KEY'        // Supabase → Settings → API → service_role

const START_NR = 3   // Nächste freie NM-Nummer (NM001 + NM002 bereits vergeben)

// ─── FAHRZEUGE DIE IMPORTIERT WERDEN ─────────────────────────────────────────

const TARGETS = [
  // Performance
  { maker: 'KIA',           model: '스팅어',    category: 'performance',        limit: 2 },
  { maker: '제네시스',       model: 'G70',       category: 'performance',        limit: 2 },
  { maker: 'KIA',           model: 'EV6',       category: 'performance',        limit: 2 },
  { maker: '제네시스',       model: 'GV70',      category: 'performance',        limit: 2 },
  { maker: '현대',           model: '아이오닉6',  category: 'performance',        limit: 2 },

  // Luxury
  { maker: '제네시스',       model: 'G80',       category: 'luxury',             limit: 3 },
  { maker: '제네시스',       model: 'G90',       category: 'luxury',             limit: 2 },
  { maker: '제네시스',       model: 'GV80',      category: 'luxury',             limit: 2 },
  { maker: '현대',           model: '팰리세이드',  category: 'luxury',             limit: 2 },
  { maker: 'KIA',           model: '카니발',     category: 'luxury',             limit: 2 },
  { maker: 'KIA',           model: 'EV9',       category: 'luxury',             limit: 2 },
  { maker: '현대',           model: '아이오닉5',  category: 'luxury',             limit: 2 },

  // Deutsche Marken aus Korea
  { maker: 'BMW',           model: '5시리즈',    category: 'german_from_korea',  limit: 3 },
  { maker: 'BMW',           model: '3시리즈',    category: 'german_from_korea',  limit: 3 },
  { maker: 'BMW',           model: 'X5',        category: 'german_from_korea',  limit: 2 },
  { maker: 'BMW',           model: 'X3',        category: 'german_from_korea',  limit: 2 },
  { maker: 'BMW',           model: '7시리즈',    category: 'german_from_korea',  limit: 2 },
  { maker: '메르세데스-벤츠', model: 'E클래스',   category: 'german_from_korea',  limit: 3 },
  { maker: '메르세데스-벤츠', model: 'S클래스',   category: 'german_from_korea',  limit: 2 },
  { maker: '메르세데스-벤츠', model: 'GLE',      category: 'german_from_korea',  limit: 2 },
  { maker: '메르세데스-벤츠', model: 'GLS',      category: 'german_from_korea',  limit: 1 },
  { maker: '아우디',         model: 'A6',        category: 'german_from_korea',  limit: 2 },
  { maker: '아우디',         model: 'A7',        category: 'german_from_korea',  limit: 2 },
  { maker: '아우디',         model: 'Q5',        category: 'german_from_korea',  limit: 2 },
  { maker: '아우디',         model: 'Q8',        category: 'german_from_korea',  limit: 1 },
  { maker: '아우디',         model: 'A8',        category: 'german_from_korea',  limit: 1 },
]

// ─── ÜBERSETZUNGEN ────────────────────────────────────────────────────────────

const MAKER_DE = {
  '제네시스': 'Genesis', '현대': 'Hyundai', 'KIA': 'Kia', 'BMW': 'BMW',
  '메르세데스-벤츠': 'Mercedes-Benz', '아우디': 'Audi', '폭스바겐': 'Volkswagen',
}
const MODEL_DE = {
  'G80': 'G80', 'G90': 'G90', 'G70': 'G70', 'GV80': 'GV80', 'GV70': 'GV70',
  '스팅어': 'Stinger', '팰리세이드': 'Palisade', '아이오닉5': 'IONIQ 5',
  '아이오닉6': 'IONIQ 6', '카니발': 'Carnival', 'EV6': 'EV6', 'EV9': 'EV9',
  '5시리즈': '5 Series', '3시리즈': '3 Series', '7시리즈': '7 Series',
  'X5': 'X5', 'X3': 'X3', 'X7': 'X7', 'E클래스': 'E-Class', 'S클래스': 'S-Class',
  'C클래스': 'C-Class', 'GLE': 'GLE', 'GLS': 'GLS',
  'A6': 'A6', 'A7': 'A7', 'A8': 'A8', 'Q5': 'Q5', 'Q7': 'Q7', 'Q8': 'Q8',
}
const FUEL_DE = {
  '가솔린': 'petrol', '디젤': 'diesel', '하이브리드': 'hybrid',
  '전기': 'electric', '가솔린+전기': 'hybrid', 'LPG': 'petrol',
}
const TRANS_DE = {
  '오토': 'automatic', '수동': 'manual', 'CVT': 'automatic', 'DCT': 'automatic',
}
const COLOR_DE = {
  '검정색': 'Schwarz', '흰색': 'Weiß', '회색': 'Grau', '은색': 'Silber',
  '파란색': 'Blau', '빨간색': 'Rot', '갈색': 'Braun', '베이지': 'Beige', '녹색': 'Grün',
}

// 만원 (10.000 KRW) → EUR (1 EUR ≈ 1.450 KRW)
const toEur = (manwon) => Math.round((manwon * 10000) / 1450)

function toSlug(make, model, year) {
  return `${year}-${make}-${model}`
    .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}

// ─── BILD-UPLOAD ──────────────────────────────────────────────────────────────

async function uploadImage(supabase, url, vehicleId, pos) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const ext = url.split('.').pop()?.split('?')[0] ?? 'jpg'
    const path = `${vehicleId}/${Date.now()}-${pos}.${ext}`
    const { error } = await supabase.storage
      .from('vehicle-images')
      .upload(path, buf, { contentType: `image/jpeg`, upsert: false })
    if (error) return null
    const { data: { publicUrl } } = supabase.storage.from('vehicle-images').getPublicUrl(path)
    return { publicUrl, path }
  } catch { return null }
}

// ─── FAHRZEUG EINFÜGEN ────────────────────────────────────────────────────────

async function insertVehicle(supabase, car, target, num) {
  const make  = MAKER_DE[car.Maker] ?? car.Maker
  const model = MODEL_DE[car.Model] ?? car.Model
  const trim  = car.Badge ?? null
  const stock = `NM${String(num).padStart(3, '0')}`
  const slug  = toSlug(make, model, car.Year)

  const descDE = `Der ${car.Year} ${make} ${model}${trim ? ' ' + trim : ''} aus Südkorea überzeugt mit ${car.Mileage?.toLocaleString('de-DE')} km Laufleistung und einer Serienausstattung, die in Deutschland nur gegen erhebliche Aufpreise erhältlich wäre. Geprüft und für den deutschen Markt aufbereitet von Norvyn Motors.`
  const descEN = `The ${car.Year} ${make} ${model}${trim ? ' ' + trim : ''} from South Korea impresses with ${car.Mileage?.toLocaleString('en-GB')} km and a standard equipment level that would cost significantly more at a German dealer. Verified and prepared for the German market by Norvyn Motors.`

  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .insert({
      stock_id: stock, slug, status: 'available', category: target.category,
      make, model, trim, year: car.Year,
      mileage_km: car.Mileage ?? null,
      fuel_type: FUEL_DE[car.Fuel] ?? 'petrol',
      transmission: TRANS_DE[car.Gearbox] ?? 'automatic',
      exterior_color: COLOR_DE[car.Color] ?? car.Color ?? null,
      origin_country: 'Südkorea',
      price_eur: car.Price ? toEur(car.Price) : null,
      price_visible: false,
      description_de: descDE,
      description_en: descEN,
      features: [],
    })
    .select().single()

  if (error) {
    if (error.code === '23505') {
      console.log(`  ⚠️  Übersprungen (bereits vorhanden): ${slug}`)
    } else {
      console.log(`  ❌  Fehler: ${error.message}`)
    }
    return false
  }

  // Bilder hochladen (max. 8 pro Fahrzeug)
  const photos = (car.Photos ?? []).slice(0, 8)
  let uploaded = 0
  for (let i = 0; i < photos.length; i++) {
    const imgUrl = `https://ci.encar.com/${photos[i].path ?? photos[i]}`
    const result = await uploadImage(supabase, imgUrl, vehicle.id, i)
    if (result) {
      await supabase.from('vehicle_images').insert({
        vehicle_id: vehicle.id, url: result.publicUrl,
        storage_path: result.path, position: i, alt_text: null,
      })
      uploaded++
      process.stdout.write('📷')
    }
  }

  console.log(`  ✅  ${stock}: ${car.Year} ${make} ${model}${trim ? ' ' + trim : ''} — ${uploaded} Fotos`)
  return true
}

// ─── HAUPTPROGRAMM ────────────────────────────────────────────────────────────

async function main() {
  if (SUPABASE_URL === 'DEINE_SUPABASE_URL') {
    console.error('❌  Bitte zuerst SUPABASE_URL und SUPABASE_KEY im Script eintragen!')
    process.exit(1)
  }

  const { chromium }    = require('playwright')
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  console.log('🚗  Norvyn Motors — Encar Import\n' + '─'.repeat(50))

  const browser = await chromium.launch({ headless: false, slowMo: 300 })
  const ctx     = await browser.newContext({
    locale: 'ko-KR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await ctx.newPage()

  // Encar-Session aufbauen
  console.log('🌐  Verbinde mit Encar...')
  await page.goto('https://www.encar.com', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2000)

  let num = START_NR, total = 0

  for (const target of TARGETS) {
    console.log(`\n🔍  ${target.maker} ${target.model}`)
    try {
      const q = `(And.Hidden.N._.SaleStatus.Y._.Maker.${encodeURIComponent(target.maker)}._.ModelGroup.${encodeURIComponent(target.model)}.)`
      const url = `https://api.encar.com/search/car/list/premium?count=true&q=${q}&sr=%7CRegDate%7C0%7C${target.limit * 3}`

      const data = await page.evaluate(async (apiUrl) => {
        const r = await fetch(apiUrl, { headers: { Referer: 'https://www.encar.com/' } })
        if (!r.ok) return null
        return r.json()
      }, url)

      if (!data?.SearchResults?.length) {
        console.log('  ⚠️  Keine Ergebnisse')
        continue
      }

      for (const car of data.SearchResults.slice(0, target.limit)) {
        const ok = await insertVehicle(supabase, car, target, num)
        if (ok) { num++; total++ }
        await page.waitForTimeout(800)
      }
    } catch (e) {
      console.log(`  ❌  ${e.message}`)
    }
  }

  await browser.close()
  console.log('\n' + '─'.repeat(50))
  console.log(`✅  Fertig! ${total} Fahrzeuge importiert.`)
  console.log('   Jetzt im Admin-Bereich prüfen: /admin/vehicles')
}

main().catch(console.error)
