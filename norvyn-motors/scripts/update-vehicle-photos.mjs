#!/usr/bin/env node
/**
 * Norvyn Motors — Vehicle Photo Update Script
 *
 * Replaces broken Unsplash URLs with working Pexels CDN URLs.
 * Deletes existing vehicle_images rows and re-inserts with correct URLs.
 *
 * Usage:
 *   cd norvyn-motors
 *   SUPABASE_SERVICE_KEY=your_service_key node scripts/update-vehicle-photos.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gbbpnhitpqfoujfcsdty.supabase.co'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY

if (!SERVICE_KEY) {
  console.error('\n❌  Missing SUPABASE_SERVICE_KEY\n')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY)

const p = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`

// Verified Pexels photo IDs — sourced from pexels.com search results
const PHOTOS = {
  merc_sedan_a:  [p(18369292), p(26691319), p(20123633)],
  merc_sedan_b:  [p(2611710),  p(15795224), p(120049)],
  merc_suv_a:    [p(14692371), p(14445435), p(3457780)],
  merc_suv_b:    [p(16714051), p(3457780),  p(14692371)],
  bmw_sedan_a:   [p(100653),   p(100650),   p(170811)],
  bmw_sedan_b:   [p(11139405), p(100653),   p(100650)],
  bmw_suv:       [p(19726548), p(12532745), p(100653)],
  bmw_m:         [p(5549660),  p(13857903), p(16938241)],
  bmw_m_b:       [p(20808123), p(5549660),  p(13857903)],
  audi_suv:      [p(12532745), p(19726548), p(100650)],
  audi_sedan:    [p(20123633), p(2611710),  p(15795224)],
  porsche:       [p(2612855),  p(1410177),  p(970896)],
  genesis_a:     [p(11936975), p(14782635), p(15012606)],
  genesis_b:     [p(15012606), p(13269173), p(11936975)],
  genesis_suv:   [p(14782635), p(13269173), p(15012606)],
  genesis_sport: [p(11936975), p(15012606)],
  kia_ev:        [p(13163937), p(14611055), p(19410949)],
  kia_sedan:     [p(13163937), p(14611055)],
  hyundai_ev:    [p(19410949), p(17920198), p(14611055)],
  hyundai_sedan: [p(14611055), p(2694389),  p(2834653)],
  ioniq6:        [p(14611055), p(19410949), p(17920198)],
  lexus_suv:     [p(12532745), p(19726548), p(2694389)],
  lexus_sedan:   [p(20123633), p(2611710),  p(2694389)],
  lexus_sport:   [p(970896),   p(2612855),  p(18003063)],
  amg:           [p(5549660),  p(20808123), p(26691319)],
  stinger:       [p(5549660),  p(13857903), p(20808123)],
}

// Map: slug → [photos, alt_suffix]
const VEHICLE_PHOTOS = [
  { slug: 'mercedes-e450-4matic-2024',         photos: PHOTOS.merc_sedan_a },
  { slug: 'mercedes-s580-4matic-2024',         photos: PHOTOS.merc_sedan_b },
  { slug: 'mercedes-gle450-4matic-2024',       photos: PHOTOS.merc_suv_a },
  { slug: 'mercedes-gls580-4matic-2024',       photos: PHOTOS.merc_suv_b },
  { slug: 'bmw-540i-xdrive-2024',              photos: PHOTOS.bmw_sedan_a },
  { slug: 'bmw-750e-xdrive-2024',              photos: PHOTOS.bmw_sedan_b },
  { slug: 'bmw-x5-xdrive40i-2024',            photos: PHOTOS.bmw_suv },
  { slug: 'audi-q7-55tfsi-quattro-2024',      photos: PHOTOS.audi_suv },
  { slug: 'audi-a8-l-55tfsi-2023',            photos: PHOTOS.audi_sedan },
  { slug: 'mercedes-c300-amg-line-2024',       photos: [p(18369292), p(2611710)] },
  { slug: 'porsche-cayenne-s-2023',            photos: PHOTOS.porsche },
  { slug: 'bmw-m4-competition-xdrive-2023',   photos: PHOTOS.bmw_m },
  { slug: 'genesis-gv80-35t-awd-2024',        photos: PHOTOS.genesis_a },
  { slug: 'genesis-g80-35t-sport-2024',       photos: PHOTOS.genesis_b },
  { slug: 'genesis-gv70-25t-awd-2024',        photos: PHOTOS.genesis_suv },
  { slug: 'kia-ev9-gt-line-awd-2024',         photos: PHOTOS.kia_ev },
  { slug: 'kia-k8-35-gdi-signature-2024',     photos: PHOTOS.kia_sedan },
  { slug: 'hyundai-grandeur-calligraphy-2023',photos: PHOTOS.hyundai_sedan },
  { slug: 'lexus-lx600-vip-2023',             photos: PHOTOS.lexus_suv },
  { slug: 'lexus-es300h-fsport-2024',         photos: PHOTOS.lexus_sedan },
  { slug: 'lexus-lc500-cabriolet-2023',       photos: PHOTOS.lexus_sport },
  { slug: 'kia-ev6-gt-awd-2024',              photos: PHOTOS.kia_ev },
  { slug: 'hyundai-ioniq5-n-awd-2024',        photos: PHOTOS.hyundai_ev },
  { slug: 'hyundai-ioniq6-awd-first-edition-2024', photos: PHOTOS.ioniq6 },
  { slug: 'genesis-gv60-performance-awd-2024',photos: PHOTOS.genesis_suv },
  { slug: 'genesis-g70-33t-sport-awd-2023',   photos: PHOTOS.genesis_sport },
  { slug: 'mercedes-amg-c43-4matic-2024',     photos: PHOTOS.amg },
  { slug: 'bmw-m340i-xdrive-2024',            photos: PHOTOS.bmw_m_b },
  { slug: 'kia-stinger-gt-awd-2023',          photos: PHOTOS.stinger },
  { slug: 'genesis-g80-electrified-sport-2024', photos: PHOTOS.genesis_b },
]

async function main() {
  console.log('\n🚗  Norvyn Motors — Photo Update Script')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📡  Connecting to Supabase...\n')

  let updated = 0, errors = 0

  for (const { slug, photos } of VEHICLE_PHOTOS) {
    // Get vehicle ID
    const { data: vehicle, error: vErr } = await sb
      .from('vehicles')
      .select('id, make, model')
      .eq('slug', slug)
      .maybeSingle()

    if (vErr || !vehicle) {
      console.error(`❌  Not found  ${slug}`)
      errors++
      continue
    }

    // Delete existing images
    const { error: delErr } = await sb
      .from('vehicle_images')
      .delete()
      .eq('vehicle_id', vehicle.id)

    if (delErr) {
      console.error(`❌  Del error  ${slug}: ${delErr.message}`)
      errors++
      continue
    }

    // Insert new Pexels images
    const images = photos.map((url, i) => ({
      vehicle_id:   vehicle.id,
      url,
      storage_path: url,
      position:     i,
      alt_text:     `${vehicle.make} ${vehicle.model}`,
    }))

    const { error: imgErr } = await sb.from('vehicle_images').insert(images)

    if (imgErr) {
      console.error(`❌  Img error  ${slug}: ${imgErr.message}`)
      errors++
      continue
    }

    console.log(`✅  Updated   ${vehicle.make} ${vehicle.model} — ${photos.length} photos`)
    updated++

    await new Promise(r => setTimeout(r, 60))
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅  Updated : ${updated} vehicles`)
  console.log(`❌  Errors  : ${errors}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main().catch(console.error)
