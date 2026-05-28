#!/usr/bin/env node
// Schreibt die korrekte encar-import.js in ~/Downloads/
// node generate-import.js
const fs = require('fs'), path = require('path'), rl = require('readline').createInterface({input:process.stdin,output:process.stdout})
rl.question('Supabase service_role Key: ', key => { rl.close(); write(key.trim()) })

function write(KEY) {
const SUPABASE_URL = 'https://gbbpnhitpqfoujfcsdty.supabase.co'
const out = path.join(process.env.HOME, 'Downloads', 'encar-import.js')

// Alle koreanischen Strings direkt definiert
const T = [
  ["'기아'","'스팅어'","'performance'",2,"'Y'"],
  ["'제네시스'","'G70'","'performance'",2,"'Y'"],
  ["'기아'","'EV6'","'performance'",2,"'Y'"],
  ["'제네시스'","'GV70'","'performance'",2,"'Y'"],
  ["'현대'","'아이오닉6'","'performance'",2,"'Y'"],
  ["'제네시스'","'G80'","'luxury'",3,"'Y'"],
  ["'제네시스'","'G90'","'luxury'",2,"'Y'"],
  ["'제네시스'","'GV80'","'luxury'",2,"'Y'"],
  ["'현대'","'팰리세이드'","'luxury'",2,"'Y'"],
  ["'기아'","'카니발'","'luxury'",2,"'Y'"],
  ["'기아'","'EV9'","'luxury'",2,"'Y'"],
  ["'현대'","'아이오닉5'","'luxury'",2,"'Y'"],
  ["'BMW'","'5시리즈'","'german_from_korea'",3,"'A'"],
  ["'BMW'","'3시리즈'","'german_from_korea'",3,"'A'"],
  ["'BMW'","'X5'","'german_from_korea'",2,"'A'"],
  ["'BMW'","'X3'","'german_from_korea'",2,"'A'"],
  ["'BMW'","'7시리즈'","'german_from_korea'",2,"'A'"],
  ["'메르세데스-벤츠'","'E클래스'","'german_from_korea'",3,"'A'"],
  ["'메르세데스-벤츠'","'S클래스'","'german_from_korea'",2,"'A'"],
  ["'메르세데스-벤츠'","'GLE'","'german_from_korea'",2,"'A'"],
  ["'메르세데스-벤츠'","'GLS'","'german_from_korea'",1,"'A'"],
  ["'아우디'","'A6'","'german_from_korea'",2,"'A'"],
  ["'아우디'","'A7'","'german_from_korea'",2,"'A'"],
  ["'아우디'","'Q5'","'german_from_korea'",2,"'A'"],
  ["'아우디'","'Q8'","'german_from_korea'",1,"'A'"],
  ["'아우디'","'A8'","'german_from_korea'",1,"'A'"],
]

const targets = T.map(r => `  { maker: ${r[0]}, model: ${r[1]}, category: ${r[2]}, limit: ${r[3]}, carType: ${r[4]} }`).join(',\n')

const code = `#!/usr/bin/env node
const SUPABASE_URL = '${SUPABASE_URL}'
const SUPABASE_KEY = '${KEY}'
const START_NR = 18

const TARGETS = [
${targets}
]

const MAKER_DE = { '제네시스':'Genesis','현대':'Hyundai','기아':'Kia','KIA':'Kia','BMW':'BMW','메르세데스-벤츠':'Mercedes-Benz','아우디':'Audi' }
const MODEL_DE = { 'G80':'G80','G90':'G90','G70':'G70','GV80':'GV80','GV70':'GV70','스팅어':'Stinger','팰리세이드':'Palisade','아이오닉5':'IONIQ 5','아이오닉6':'IONIQ 6','카니발':'Carnival','EV6':'EV6','EV9':'EV9','5시리즈':'5 Series','3시리즈':'3 Series','7시리즈':'7 Series','X5':'X5','X3':'X3','E클래스':'E-Class','S클래스':'S-Class','GLE':'GLE','GLS':'GLS','A6':'A6','A7':'A7','A8':'A8','Q5':'Q5','Q8':'Q8' }
const FUEL_DE = { '가솔린':'petrol','디젤':'diesel','하이브리드':'hybrid','전기':'electric','가솔린+전기':'hybrid','LPG':'petrol' }
const TRANS_DE = { '오토':'automatic','수동':'manual','CVT':'automatic','DCT':'automatic' }
const COLOR_DE = { '검정색':'Schwarz','흰색':'Weiß','회색':'Grau','은색':'Silber','파란색':'Blau','빨간색':'Rot','갈색':'Braun','베이지':'Beige' }

const toEur = w => Math.round(w * 10000 / 1450)
function toSlug(a,b,y){ return (y+'-'+a+'-'+b).toLowerCase().replace(/\\s+/g,'-').replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-') }

async function uploadImage(sb, url, vid, pos) {
  try {
    const r = await fetch(url); if (!r.ok) return null
    const buf = await r.arrayBuffer()
    const ext = url.split('.').pop()?.split('?')[0] ?? 'jpg'
    const p = vid+'/'+Date.now()+'-'+pos+'.'+ext
    const { error } = await sb.storage.from('vehicle-images').upload(p, buf, { contentType:'image/jpeg', upsert:false })
    if (error) return null
    const { data: { publicUrl } } = sb.storage.from('vehicle-images').getPublicUrl(p)
    return { publicUrl, path: p }
  } catch { return null }
}

async function getPhotos(page, carId) {
  try {
    const { data } = await page.evaluate(async u => {
      try {
        const r = await fetch(u, { headers: { 'Referer':'https://www.encar.com/', 'Accept':'application/json' } })
        if (!r.ok) return { data: null }
        let p = null; try { p = JSON.parse(await r.text()) } catch {}
        return { data: p }
      } catch { return { data: null } }
    }, 'https://api.encar.com/cars/'+carId)
    if (!data) return []
    const raw = data?.Photos ?? data?.Photo ?? []
    return (Array.isArray(raw) ? raw : [raw]).map(p => typeof p==='string' ? p : (p?.location ?? p?.path ?? '')).filter(Boolean)
  } catch { return [] }
}

async function insertVehicle(sb, page, car, target, num) {
  const makerKr = car.Manufacturer ?? target.maker
  const modelKr = car.ModelGroup ?? car.Model ?? target.model
  const year = car.FormYear ?? car.Year ?? new Date().getFullYear()
  const mileage = car.Mileage ?? null
  const trim = car.Badge ?? car.BadgeDetail ?? null
  const carId = car.Id ?? null
  const make = MAKER_DE[makerKr] ?? makerKr
  const model = MODEL_DE[modelKr] ?? modelKr
  const stock = 'NM'+String(num).padStart(3,'0')
  const slug = toSlug(make, model, year)
  const km = mileage != null ? mileage.toLocaleString('de-DE') : '-'
  const descDE = \`Der \${year} \${make} \${model}\${trim?' '+trim:''} aus Südkorea überzeugt mit \${km} km Laufleistung. Geprüft von Norvyn Motors.\`
  const descEN = \`The \${year} \${make} \${model}\${trim?' '+trim:''} from South Korea. Verified by Norvyn Motors.\`
  const { data: vehicle, error } = await sb.from('vehicles').insert({
    stock_id:stock, slug, status:'available', category:target.category,
    make, model, trim, year, mileage_km:mileage,
    fuel_type: FUEL_DE[car.FuelType??''] ?? 'petrol',
    transmission: TRANS_DE[car.GearType??''] ?? 'automatic',
    exterior_color: COLOR_DE[car.Color??''] ?? (car.Color||null),
    origin_country:'Südkorea',
    price_eur: car.Price ? toEur(car.Price) : null,
    price_visible:false, description_de:descDE, description_en:descEN, features:[],
  }).select().single()
  if (error) {
    if (error.code==='23505') console.log('  skip: '+slug)
    else console.log('  err: '+error.message)
    return false
  }
  let photos = []
  if (Array.isArray(car.Photos)) photos.push(...car.Photos)
  if (carId) photos.push(...await getPhotos(page, carId))
  photos = [...new Set(photos)].filter(Boolean).slice(0,8)
  let uploaded = 0
  for (let i=0; i<photos.length; i++) {
    const raw = photos[i]
    const p = typeof raw==='object' ? (raw.location ?? raw.path ?? '') : raw
    if (!p) continue
    const imgUrl = p.startsWith('http') ? p : 'https://ci.encar.com'+p
    const res = await uploadImage(sb, imgUrl, vehicle.id, i)
    if (res) {
      await sb.from('vehicle_images').insert({ vehicle_id:vehicle.id, url:res.publicUrl, storage_path:res.path, position:i, alt_text:null })
      uploaded++; process.stdout.write('📷')
    }
  }
  console.log('  ✅ '+stock+': '+year+' '+make+' '+model+' — '+uploaded+' Fotos')
  return true
}

async function main() {
  const { chromium } = require('playwright')
  const { createClient } = require('@supabase/supabase-js')
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY)
  console.log('🚗 Norvyn Encar Import')
  const browser = await chromium.launch({ headless:false, slowMo:200 })
  const page = await (await browser.newContext({
    locale:'ko-KR',
    userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  })).newPage()
  await page.goto('https://www.encar.com', { waitUntil:'domcontentloaded', timeout:30000 })
  await page.waitForTimeout(2000)
  let num = START_NR, total = 0
  for (const target of TARGETS) {
    console.log('\\n🔍 '+target.maker+' '+target.model)
    try {
      const ct = target.carType ?? 'Y'
      const q = '(And.(And.Hidden.N._.CarType.'+ct+'.)_.Manufacturer.'+target.maker+'._.ModelGroup.'+target.model+'.)'
      const qe = q.replace(/[^\\x00-\\x7F]/g, c => encodeURIComponent(c))
      const url = 'https://api.encar.com/search/car/list/general?count=true&q='+qe+'&sr=%7CModifiedDate%7C0%7C'+(target.limit*3)
      const { data, status } = await page.evaluate(async u => {
        try {
          const r = await fetch(u, { headers: { 'Referer':'https://www.encar.com/', 'Accept':'application/json', 'Accept-Language':'ko-KR,ko;q=0.9' } })
          let d = null; try { d = JSON.parse(await r.text()) } catch {}
          return { status:r.status, data:d }
        } catch(e) { return { status:0, data:null } }
      }, url)
      if (status!==200||!data) { console.log('  ⚠️ API '+status); continue }
      const results = data.SearchResults ?? []
      if (!results.length) { console.log('  ⚠️ Keine Ergebnisse'); continue }
      for (const car of results.slice(0, target.limit)) {
        const ok = await insertVehicle(sb, page, car, target, num)
        if (ok) { num++; total++ }
        await page.waitForTimeout(600)
      }
    } catch(e) { console.log('  ❌ '+e.message) }
  }
  await browser.close()
  console.log('\\n✅ Fertig! '+total+' Fahrzeuge importiert.')
}
main().catch(console.error)
`

fs.writeFileSync(out, code, 'utf8')
console.log('✅ Datei geschrieben: ' + out)
console.log('▶️  Jetzt starten: node ~/Downloads/encar-import.js')
}
