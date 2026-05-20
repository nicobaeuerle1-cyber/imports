#!/usr/bin/env node
/**
 * Norvyn Motors — Vehicle Seed Script
 *
 * Inserts 30 placeholder vehicles with Unsplash photos into Supabase.
 * Photos are stored as Unsplash CDN URLs — no downloading required.
 * Next.js serves them through its built-in image optimisation proxy.
 *
 * Usage:
 *   cd norvyn-motors
 *   SUPABASE_SERVICE_KEY=your_service_key node scripts/seed-vehicles.mjs
 *
 * Idempotent: already-existing slugs are skipped.
 */

import { createClient } from '@supabase/supabase-js'

// ─── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://gbbpnhitpqfoujfcsdty.supabase.co'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY

if (!SERVICE_KEY) {
  console.error('\n❌  Missing SUPABASE_SERVICE_KEY\n')
  console.error('    Run: SUPABASE_SERVICE_KEY=your_key node scripts/seed-vehicles.mjs\n')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY)

// ─── Unsplash photo helpers ───────────────────────────────────────────────────
// Verified photo IDs from unsplash.com page URLs (short alphanumeric format)
// CDN: https://images.unsplash.com/{ID}?w=1920&q=85&auto=format&fit=crop

const u = (id) => `https://images.unsplash.com/${id}?w=1920&q=85&auto=format&fit=crop`

const PHOTOS = {
  merc_sedan:  [u('dgxhPxqXceg'), u('qSSnon49t0I'), u('SO5Gi9RXJkw')],
  merc_suv:    [u('YO636mdftR4'), u('QRJndZfN-4M'), u('uNib1mrJPlY')],
  bmw_sedan:   [u('dS0wCPjeBwM'), u('KiTalJFRkcg'), u('THjrSDdI60Q')],
  bmw_m:       [u('dveDkZQJVjQ'), u('aSMsI1V7BDU'), u('xT4O-XYp-a0')],
  bmw_suv:     [u('tShF65IfzHg'), u('q6Oj9ladM7Y')],
  audi:        [u('rUK__n0kx2o'), u('a0SRjVsk7Jg'), u('NLE9LEI16r4')],
  porsche:     [u('GjKmrL2QgSM'), u('eqZxve5bPuo')],
  luxury_suv:  [u('tShF65IfzHg'), u('q6Oj9ladM7Y'), u('GjKmrL2QgSM')],
  luxury_sed:  [u('dS0wCPjeBwM'), u('KiTalJFRkcg'), u('dgxhPxqXceg')],
  ioniq:       [u('lL4SGrwBBw8'), u('KpsavDr0nmo'), u('g0dBVbXOs_s')],
  kia_ev:      [u('JCR7YW2S7us'), u('lL4SGrwBBw8')],
  lexus:       [u('RKVEmmaJqGc'), u('kxUVvCUVVH4'), u('sjljbO_3P00')],
  stinger:     [u('oMSzrw48q4M'), u('JCR7YW2S7us')],
}

// ─── Vehicle data ─────────────────────────────────────────────────────────────

const VEHICLES = [

  // ══ Deutsche Marken aus Asien ══════════════════════════════════════════════

  {
    slug: 'mercedes-e450-4matic-2024',
    stock_id: 'NM001', sort_order: 1,
    category: 'german_from_korea', featured: true,
    make: 'Mercedes-Benz', model: 'E 450', trim: '4MATIC AMG-Line Premium', year: 2024,
    mileage_km: 12000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 2999, power_kw: 270,
    exterior_color: 'Obsidianschwarz Metallic', interior_color: 'Nappa-Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['Panorama-Schiebedach','Sitzheizung & -kühlung vorne','Massage-Sitze','Head-Up-Display','Burmester® Sound','Ambient-Beleuchtung 64 Farben','360°-Kamera','MBUX Navigation Premium','Lenkradheizung','Keyless-Go','LED High Performance Scheinwerfer'],
    description_de: 'Der Mercedes E 450 4MATIC aus Korea kommt in der maximalen AMG-Line Premium Ausstattung — Burmester Sound, Massagesitze und 64-Farben-Ambientelicht sind hier Serienausstattung, keine Aufpreisoptionen.',
    description_en: 'The Mercedes E 450 4MATIC from Korea arrives in top AMG-Line Premium specification. Burmester sound, massage seats and 64-colour ambient lighting come as standard — not as costly options.',
    photos: PHOTOS.merc_sedan,
  },

  {
    slug: 'mercedes-s580-4matic-2024',
    stock_id: 'NM002', sort_order: 2,
    category: 'german_from_korea', featured: true,
    make: 'Mercedes-Benz', model: 'S 580', trim: '4MATIC L Maybach-Line', year: 2024,
    mileage_km: 8000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 3982, power_kw: 350,
    exterior_color: 'Manufaktur Brilliantweiß', interior_color: 'Nappa-Leder Porzellan/Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['Massagesitze vorne & hinten','Fondentertainment 11,6" Displays','Burmester® 3D-High-End Sound','Panorama-Schiebedach','Head-Up-Display','Nightvision-Assistent','360°-Kamera','AIRMATIC Luftfederung','Rear-Axle-Steering','Energizing-Paket','5-Zonen-Klimaanlage'],
    description_de: 'Die Krönung der S-Klasse: Der S 580 4MATIC L Maybach-Line mit langem Radstand bietet Fondkomfort auf Niveau einer Privatjacht — in Korea mit kompromissloser Vollausstattung auf Bestellung gefertigt.',
    description_en: 'The pinnacle of the S-Class: the long-wheelbase S 580 4MATIC L Maybach-Line offers rear-seat comfort rivalling a private jet — built to order in Korea with the most comprehensive specification.',
    photos: [u('dgxhPxqXceg'), u('qSSnon49t0I'), u('QRJndZfN-4M')],
  },

  {
    slug: 'mercedes-gle450-4matic-2024',
    stock_id: 'NM003', sort_order: 3,
    category: 'german_from_korea', featured: false,
    make: 'Mercedes-Benz', model: 'GLE 450', trim: '4MATIC AMG-Line Premium Plus', year: 2024,
    mileage_km: 18000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 2999, power_kw: 270,
    exterior_color: 'Graphitgrau Metallic', interior_color: 'Nappa-Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['Panorama-Schiebedach','Sitzheizung & -kühlung 4-fach','AIRMATIC Luftfederung','Head-Up-Display','Burmester® Sound','360°-Kamera','22-Zoll AMG Leichtmetallräder','Anhängevorrichtung','Keyless-Go','Active Brake Assist'],
    description_de: 'Der GLE 450 AMG-Line Premium Plus — geräumig, luxuriös und mit Technologie auf höchstem Niveau. Die koreanische Werksausstattung übertrifft selbst die teuersten deutschen Konfigurationen.',
    description_en: 'The GLE 450 AMG-Line Premium Plus — spacious, luxurious and technologically unmatched. The Korean factory specification surpasses even the most expensive German configurations.',
    photos: PHOTOS.merc_suv,
  },

  {
    slug: 'mercedes-gls580-4matic-2024',
    stock_id: 'NM004', sort_order: 4,
    category: 'german_from_korea', featured: true,
    make: 'Mercedes-Benz', model: 'GLS 580', trim: '4MATIC AMG-Line 7-Sitzer', year: 2024,
    mileage_km: 22000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 2999, power_kw: 320,
    exterior_color: 'Diamantweiß Metallic', interior_color: 'Nappa-Leder Macchiato/Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['7-Sitzer Konfiguration','Massagesitze 1. & 2. Reihe','AIRMATIC Luftfederung','Panorama-Schiebedach','Burmester® Sound','360°-Kamera','Head-Up-Display','Rear-Axle-Steering','3-Zonen-Fondklima','Fondentertainment','22-Zoll AMG Räder'],
    description_de: 'Der GLS 580 — das Flaggschiff unter den Mercedes-SUVs. Sieben Sitze, massiver Komfort und Technologie auf Staatskarosserieniveau. In Korea mit kompromissloser Vollausstattung.',
    description_en: 'The GLS 580 — the flagship of the Mercedes SUV range. Seven seats, supreme comfort and state-car technology. Built in Korea with uncompromising full specification.',
    photos: [u('YO636mdftR4'), u('uNib1mrJPlY')],
  },

  {
    slug: 'bmw-540i-xdrive-2024',
    stock_id: 'NM005', sort_order: 5,
    category: 'german_from_korea', featured: true,
    make: 'BMW', model: '5er', trim: '540i xDrive M-Sportpaket Pro', year: 2024,
    mileage_km: 15000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 2998, power_kw: 290,
    exterior_color: 'Carbonschwarz Metallic', interior_color: 'Merino-Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['BMW Curved Display','Panorama-Glasdach Sky Lounge','Harman Kardon Sound','Sitzheizung & -kühlung','M-Sportsitze','Head-Up-Display','Parking Assistant Plus','Driving Assistant Professional','Laserlight','Adaptives Fahrwerk','20-Zoll M-Leichtmetallräder'],
    description_de: 'Der neue BMW 5er G60 in der 540i xDrive Konfiguration — in Korea als Vollausstattungsfahrzeug gefertigt. Sky Lounge Panoramadach, Laserlight und Merino-Leder sind hier keine Aufpreisoptionen.',
    description_en: 'The new BMW 5 Series G60 in 540i xDrive configuration — manufactured in Korea as a fully-loaded vehicle. Sky Lounge panoramic roof, Laserlight and Merino leather come as standard.',
    photos: PHOTOS.bmw_sedan,
  },

  {
    slug: 'bmw-750e-xdrive-2024',
    stock_id: 'NM006', sort_order: 6,
    category: 'german_from_korea', featured: false,
    make: 'BMW', model: '7er', trim: '750e xDrive Executive Lounge', year: 2024,
    mileage_km: 10000, fuel_type: 'hybrid', transmission: 'automatic',
    engine_cc: 2998, power_kw: 360,
    exterior_color: 'Frozen Deep Grey Metallic', interior_color: 'Merino-Leder Cashmere/Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['BMW Theatre Screen 31,3"','Massagesitze 4-fach','Bowers & Wilkins Diamond Sound','Sky Lounge Panorama','Executive Drive Pro','Head-Up-Display Augmented Reality','BMW Personal CoPilot','Fond-Komfortsitze Lounge','80 km elektrische Reichweite','Keyless'],
    description_de: 'Der BMW 7er 750e xDrive — Executive Lounge Ausstattung mit dem spektakulären 31-Zoll Theatre Screen im Fond und 80 km elektrischer Reichweite. In Korea die bevorzugte Wahl für Geschäftsreisende der Extraklasse.',
    description_en: 'The BMW 7 Series 750e xDrive — Executive Lounge specification with the spectacular 31-inch rear Theatre Screen and 80 km electric range. In Korea the preferred choice for the most discerning business travellers.',
    photos: [u('dS0wCPjeBwM'), u('KiTalJFRkcg')],
  },

  {
    slug: 'bmw-x5-xdrive40i-2024',
    stock_id: 'NM007', sort_order: 7,
    category: 'german_from_korea', featured: false,
    make: 'BMW', model: 'X5', trim: 'xDrive40i M-Sportpaket', year: 2024,
    mileage_km: 20000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 2998, power_kw: 250,
    exterior_color: 'Sophisto Grau Metallic', interior_color: 'Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['Panorama-Glasdach','Harman Kardon Sound','Sitzheizung vorne & hinten','Head-Up-Display','Driving Assistant Professional','Parking Assistant Plus','20-Zoll M-Leichtmetallräder','Adaptives M Fahrwerk','Anhängerkupplung','360°-Kamera','Keyless-Drive'],
    description_de: 'Das meistverkaufte Luxus-SUV der Welt — der BMW X5 xDrive40i mit M-Sportpaket in vollständiger koreanischer Serienausstattung. Was in Deutschland teurer Aufpreis kostet, ist hier selbstverständlich.',
    description_en: 'The world\'s best-selling luxury SUV — the BMW X5 xDrive40i with M Sport Package in complete Korean standard specification. What costs extra in Germany comes as standard here.',
    photos: PHOTOS.bmw_suv,
  },

  {
    slug: 'audi-q7-55tfsi-quattro-2024',
    stock_id: 'NM008', sort_order: 8,
    category: 'german_from_korea', featured: false,
    make: 'Audi', model: 'Q7', trim: '55 TFSI quattro S-Line', year: 2024,
    mileage_km: 16000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 2995, power_kw: 250,
    exterior_color: 'Mythosschwarz Metallic', interior_color: 'Feinnappa Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['7-Sitzer','Panorama-Glasdach','Audi Virtual Cockpit Plus','B&O 3D Premium Sound','Sitzheizung & -belüftung','Head-Up-Display','Allradlenkung','Luftfederung','360°-Kamera','Matrix-LED Scheinwerfer','21-Zoll Alufelgen','Keyless'],
    description_de: 'Der Audi Q7 55 TFSI quattro S-Line als Sieben-Sitzer — mit B&O Premium Sound und Luftfederung als Standardausstattung in Korea. Ein SUV der jeden Anspruch erfüllt.',
    description_en: 'The Audi Q7 55 TFSI quattro S-Line as a seven-seater — with B&O Premium Sound and air suspension as standard in Korea. An SUV that meets every expectation.',
    photos: PHOTOS.audi,
  },

  {
    slug: 'audi-a8-l-55tfsi-2023',
    stock_id: 'NM009', sort_order: 9,
    category: 'luxury', featured: false,
    make: 'Audi', model: 'A8 L', trim: '55 TFSI quattro Langversion', year: 2023,
    mileage_km: 32000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 2995, power_kw: 250,
    exterior_color: 'Firmamentblau Metallic', interior_color: 'Valcona-Leder Elfenbein',
    origin_country: 'KR', import_ready: true,
    features: ['Fondentertainment 10,1" Displays','Massagesitze 4-fach','B&O Advanced Sound 23 Lautsprecher','Audi AI Aktives Fahrwerk','Head-Up-Display','Sitzheizung & -kühlung','Panorama-Glasdach','Allradlenkung','Night-Vision','20-Zoll Räder'],
    description_de: 'Die Audi A8 L — Repräsentation in ihrer reinsten Form. Lang, leise, luxuriös. In Korea mit vollständigem Fondentertainment-Paket und 23-Lautsprecher B&O Sound als Standardausstattung.',
    description_en: 'The Audi A8 L — representation in its purest form. Long, quiet, luxurious. In Korea with the complete rear entertainment package and 23-speaker B&O sound as standard.',
    photos: [u('rUK__n0kx2o'), u('a0SRjVsk7Jg')],
  },

  {
    slug: 'mercedes-c300-amg-line-2024',
    stock_id: 'NM010', sort_order: 10,
    category: 'german_from_korea', featured: false,
    make: 'Mercedes-Benz', model: 'C 300', trim: '4MATIC AMG-Line Night Edition', year: 2024,
    mileage_km: 14000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 1999, power_kw: 190,
    exterior_color: 'Spektralblau Metallic', interior_color: 'Nappa-Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['MBUX Hyperscreen','Panorama-Schiebedach','Burmester® Sound','Sitzheizung & -kühlung','Head-Up-Display','Ambient-Beleuchtung','360°-Kamera','Night Edition Paket','AMG-Lederlenkrad','19-Zoll AMG Räder','Keyless-Go'],
    description_de: 'Der Mercedes C 300 4MATIC AMG-Line Night Edition — sportlichster Einstieg in die C-Klasse, mit MBUX Hyperscreen und Burmester Sound als Serienausstattung in Korea.',
    description_en: 'The Mercedes C 300 4MATIC AMG-Line Night Edition — the sportiest entry into the C-Class, with MBUX Hyperscreen and Burmester sound as standard in Korea.',
    photos: [u('SO5Gi9RXJkw'), u('qSSnon49t0I')],
  },

  {
    slug: 'porsche-cayenne-s-2023',
    stock_id: 'NM011', sort_order: 11,
    category: 'luxury', featured: true,
    make: 'Porsche', model: 'Cayenne', trim: 'S Sport Turismo', year: 2023,
    mileage_km: 35000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 2894, power_kw: 324,
    exterior_color: 'Jetblack Metallic', interior_color: 'Leder Schwarz/Kieselgrau',
    origin_country: 'KR', import_ready: true,
    features: ['Porsche Active Suspension','BOSE Surround Sound','Panorama-Dach','Sitzheizung & -kühlung','Head-Up-Display','Night Vision Assistent','Porsche InnoDrive','360°-Kamera','21-Zoll Cayenne Räder','Sport Chrono Paket','PCM Navigation'],
    description_de: 'Der Porsche Cayenne S Sport Turismo — die kombinatorische Meisterleistung aus SUV und Kombi. In Korea mit Sport Chrono Paket und Panoramaglasdach als Werksausstattung.',
    description_en: 'The Porsche Cayenne S Sport Turismo — the masterful combination of SUV and estate. In Korea with the Sport Chrono Package and panoramic glass roof as standard.',
    photos: PHOTOS.porsche,
  },

  {
    slug: 'bmw-m4-competition-xdrive-2023',
    stock_id: 'NM012', sort_order: 12,
    category: 'performance', featured: true,
    make: 'BMW', model: 'M4', trim: 'Competition xDrive', year: 2023,
    mileage_km: 28000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 2993, power_kw: 375,
    exterior_color: 'Isle of Man Grün Metallic', interior_color: 'M-Leder Sakhir Orange/Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['510 PS','0–100 in 3,5 Sekunden','M xDrive Allradantrieb','M Carbon Ceramic Bremsen','Carbon-Dach','Harman Kardon','Head-Up-Display','M Drive Professional','Launch Control','Drift Analyzer','M Competition Lederlenkrad'],
    description_de: 'Der BMW M4 Competition xDrive — 510 PS, 0–100 in 3,5 Sekunden. Aus Korea im seltenen Isle of Man Grün mit M Carbon Ausstattung. Der Sportwagen der sich wie ein Alltagsauto fährt.',
    description_en: 'The BMW M4 Competition xDrive — 510 hp, 0-100 in 3.5 seconds. From Korea in rare Isle of Man Green with M Carbon specification. The sports car that drives like an everyday car.',
    photos: PHOTOS.bmw_m,
  },

  // ══ Asiatische Luxury ══════════════════════════════════════════════════════

  {
    slug: 'genesis-gv80-35t-awd-2024',
    stock_id: 'NM013', sort_order: 13,
    category: 'luxury', featured: true,
    make: 'Genesis', model: 'GV80', trim: '3.5T AWD Prestige', year: 2024,
    mileage_km: 12000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 3470, power_kw: 279,
    exterior_color: 'Himalayan Gray', interior_color: 'Leder Schwarz/Terrakotta',
    origin_country: 'KR', import_ready: true,
    features: ['Massagesitze vorne & hinten','Head-Up-Display','Lexicon® Premium Sound 22 Lautsprecher','Panorama-Glasdach','Sitzheizung & -kühlung 4-Sitzer','27" Curved Dual Display','360°-Kamera','Remote Smart Parking','Highway Driving Assist 2','Genesis Connected Services','22-Zoll Felgen'],
    description_de: 'Der Genesis GV80 3.5T ist Koreas Antwort auf Bentley Bentayga und Range Rover — ein Luxus-SUV der in Deutschland nicht erhältlich ist. Das 22-Lautsprecher Lexicon-System und Massagesitze hinten machen jeden Kilometer zur Lounge-Erfahrung.',
    description_en: 'The Genesis GV80 3.5T is Korea\'s answer to the Bentley Bentayga and Range Rover — a luxury SUV not available in Germany. The 22-speaker Lexicon system and rear massage seats make every kilometre a lounge experience.',
    photos: PHOTOS.luxury_suv,
  },

  {
    slug: 'genesis-g80-35t-sport-2024',
    stock_id: 'NM014', sort_order: 14,
    category: 'luxury', featured: true,
    make: 'Genesis', model: 'G80', trim: '3.5T AWD Sport', year: 2024,
    mileage_km: 18000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 3470, power_kw: 279,
    exterior_color: 'Uyuni White', interior_color: 'Leder Obsidian Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['Massagesitze vorne','Head-Up-Display','Lexicon® Sound System','Panorama-Dach','Sitzheizung & -kühlung','27" Curved Dual Display','360°-Kamera','Sport-Paket','Aktives Geräuschmanagement','Intelligenter Tempomat Level 2','19-Zoll Sport-Felgen'],
    description_de: 'Der Genesis G80 3.5T Sport — direkter Rivale der Mercedes E-Klasse und des BMW 5er. Gleiches Niveau bei Verarbeitung und Technologie, mit einem einzigartigen Design das man auf deutschen Straßen kaum sieht.',
    description_en: 'The Genesis G80 3.5T Sport — a direct rival to the Mercedes E-Class and BMW 5 Series, matching them in build quality and technology, with a distinctive design you rarely see on German roads.',
    photos: PHOTOS.luxury_sed,
  },

  {
    slug: 'genesis-gv70-25t-awd-2024',
    stock_id: 'NM015', sort_order: 15,
    category: 'luxury', featured: false,
    make: 'Genesis', model: 'GV70', trim: '2.5T AWD Sport', year: 2024,
    mileage_km: 22000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 2497, power_kw: 224,
    exterior_color: 'Mauna Red', interior_color: 'Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['Panorama-Glasdach','Sitzheizung & -kühlung','Krell® Sound System','Head-Up-Display','Sportauspuff','20-Zoll Sport-Felgen','360°-Kamera','Genesis Connected Services','Highway Assist','Remote Smart Parking Assist','Ambientebeleuchtung'],
    description_de: 'Der Genesis GV70 2.5T — das meistverkaufte Genesis-Modell weltweit. Herausforderer von BMW X3 und Audi Q5, mit dem Krell Premium Sound und sportlichem Paket.',
    description_en: 'The Genesis GV70 2.5T — the best-selling Genesis model worldwide. A direct challenger to the BMW X3 and Audi Q5, with Krell premium sound and the sport package.',
    photos: [u('tShF65IfzHg'), u('GjKmrL2QgSM')],
  },

  {
    slug: 'kia-ev9-gt-line-awd-2024',
    stock_id: 'NM016', sort_order: 16,
    category: 'luxury', featured: false,
    make: 'Kia', model: 'EV9', trim: 'GT-Line AWD 6-Sitzer', year: 2024,
    mileage_km: 10000, fuel_type: 'electric', transmission: 'automatic',
    engine_cc: null, power_kw: 283,
    exterior_color: 'Ivory Silver', interior_color: 'Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['6-Sitzer Premium','Reichweite 505 km (WLTP)','Schnellladen 800V / 240 kW','Panorama-Glasdach','Massagesitze vorne','Head-Up-Display','Meridian® Sound','360°-Kamera','V2L Vehicle-to-Load 3,6 kW','GT-Line Aerodynamikpaket','21-Zoll GT-Line Felgen'],
    description_de: 'Der Kia EV9 GT-Line AWD — Koreas Antwort auf den Audi Q8 e-tron, mit 800V-Technologie, 505 km Reichweite und V2L-Funktion. Ein 6-Sitzer für die nächste Generation.',
    description_en: 'The Kia EV9 GT-Line AWD — Korea\'s answer to the Audi Q8 e-tron, with 800V technology, 505 km range and V2L capability. A 6-seater built for the next generation.',
    photos: [u('tShF65IfzHg'), u('q6Oj9ladM7Y')],
  },

  {
    slug: 'kia-k8-35-gdi-signature-2024',
    stock_id: 'NM017', sort_order: 17,
    category: 'luxury', featured: false,
    make: 'Kia', model: 'K8', trim: '3.5 GDi Signature', year: 2024,
    mileage_km: 20000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 3470, power_kw: 220,
    exterior_color: 'Pebble Gray', interior_color: 'Nappa-Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['Panorama-Glasdach','Massagesitze vorne','Meridian® Sound 14 Lautsprecher','Head-Up-Display','Sitzheizung & -kühlung 4-fach','360°-Kamera','Relaxsitz Beifahrer','Ambientebeleuchtung','Highway Driving Assist 2','Remote Smart Parking','19-Zoll Leichtmetallräder'],
    description_de: 'Der Kia K8 3.5 GDi Signature — Koreas Flaggschiff-Limousine, in Deutschland kaum bekannt. Meridian Sound, Massagesitze und Panoramadach machen ihn zum besten Preis-Leistungs-Angebot im Luxussegment.',
    description_en: 'The Kia K8 3.5 GDi Signature — Korea\'s flagship sedan, barely known in Germany. Meridian sound, massage seats and panoramic roof make it the best value proposition in the luxury segment.',
    photos: [u('dS0wCPjeBwM'), u('KiTalJFRkcg')],
  },

  {
    slug: 'hyundai-grandeur-calligraphy-2023',
    stock_id: 'NM018', sort_order: 18,
    category: 'luxury', featured: false,
    make: 'Hyundai', model: 'Grandeur', trim: 'Calligraphy 3.5 GDi', year: 2023,
    mileage_km: 28000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 3470, power_kw: 214,
    exterior_color: 'Abyss Black Pearl', interior_color: 'Leder Olivgrau',
    origin_country: 'KR', import_ready: true,
    features: ['Relaxsitz Fahrer & Beifahrer','Bose® Premium Sound','Panoramadach','Massagesitze','Head-Up-Display','Sitzheizung & -kühlung 4-fach','360°-Kamera','Remote Smart Parking','Highway Assist 2','Digitale Rückspiegel','19-Zoll Calligraphy Felgen'],
    description_de: 'Der Hyundai Grandeur Calligraphy — Koreas ikonischste Limousine, eine Institution im Heimatmarkt. In Deutschland nicht erhältlich. Digitale Rückspiegel, Bose Premium Sound und Relaxsitze — purer, unaufdringlicher Luxus.',
    description_en: 'The Hyundai Grandeur Calligraphy — Korea\'s most iconic sedan, an institution in its home market. Not available in Germany. Digital rear mirrors, Bose premium sound and relaxation seats — pure, understated luxury.',
    photos: [u('dgxhPxqXceg'), u('qSSnon49t0I')],
  },

  {
    slug: 'lexus-lx600-vip-2023',
    stock_id: 'NM019', sort_order: 19,
    category: 'luxury', featured: true,
    make: 'Lexus', model: 'LX 600', trim: 'VIP 4-Sitzer', year: 2023,
    mileage_km: 30000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 3444, power_kw: 305,
    exterior_color: 'Sonic Quartz', interior_color: 'Semi-Anilin Leder Weiß',
    origin_country: 'KR', import_ready: true,
    features: ['VIP 4-Sitzer Konfiguration','Massagesitze hinten Ottoman','Mark Levinson® 25 Lautsprecher','Panoramadach','Sitzheizung & -kühlung 4-fach','Lexus Safety System+','Luftfederung','360°-Kamera','Kühlbox hinten','22-Zoll VIP Felgen'],
    description_de: 'Der Lexus LX 600 VIP in der exklusiven 4-Sitzer Konfiguration — Japans Antwort auf den Rolls-Royce Cullinan. Ottoman-Massagesitze hinten, Mark Levinson 25-Lautsprecher und Kühlbox im Fond.',
    description_en: 'The Lexus LX 600 VIP in exclusive 4-seater configuration — Japan\'s answer to the Rolls-Royce Cullinan. Ottoman massage seats in the rear, 25-speaker Mark Levinson system and rear refrigerator.',
    photos: PHOTOS.lexus,
  },

  {
    slug: 'lexus-es300h-fsport-2024',
    stock_id: 'NM020', sort_order: 20,
    category: 'luxury', featured: false,
    make: 'Lexus', model: 'ES 300h', trim: 'F Sport Premium', year: 2024,
    mileage_km: 18000, fuel_type: 'hybrid', transmission: 'automatic',
    engine_cc: 2487, power_kw: 160,
    exterior_color: 'Atomic Silver', interior_color: 'Leder Schwarz F Sport',
    origin_country: 'KR', import_ready: true,
    features: ['Hybridantrieb','Mark Levinson® Reference Sound','Panoramadach','F Sport Fahrwerksabstimmung','Head-Up-Display','Sitzheizung & -kühlung','360°-Kamera','F Sport Lederlenkrad','18-Zoll F Sport Felgen','Pre-Collision System','Lexus Park Assist'],
    description_de: 'Der Lexus ES 300h F Sport — japanische Hybridperfektion mit dem legendären Mark Levinson Reference Sound System. Flüsterleise, komfortabel, zuverlässig.',
    description_en: 'The Lexus ES 300h F Sport — Japanese hybrid perfection with the legendary Mark Levinson Reference Sound System. Whisper-quiet, comfortable, reliable.',
    photos: [u('RKVEmmaJqGc'), u('kxUVvCUVVH4')],
  },

  {
    slug: 'lexus-lc500-cabriolet-2023',
    stock_id: 'NM021', sort_order: 21,
    category: 'luxury', featured: true,
    make: 'Lexus', model: 'LC 500', trim: 'Cabriolet', year: 2023,
    mileage_km: 22000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 4969, power_kw: 351,
    exterior_color: 'Structural Blue', interior_color: 'Leder Schwarz/Kirschrot',
    origin_country: 'KR', import_ready: true,
    features: ['V8 5,0-Liter Saugmotor 477 PS','Soft-Top Cabriolet','Mark Levinson® 13 Speaker','Head-Up-Display','Sitzheizung & -kühlung','LFA-Netzwerk Fahrwerk','Performance Bremsen','Aktive Stabilitätskontrolle','20-Zoll Felgen','Sport+ Modus'],
    description_de: 'Der Lexus LC 500 Cabriolet — eines der schönsten Autos der Welt, angetrieben von einem 5,0-Liter V8 Saugmotor mit 477 PS. Ein Gran Turismo aus Japan im seltenen Structural Blue.',
    description_en: 'The Lexus LC 500 Convertible — one of the most beautiful cars in the world, powered by a naturally aspirated 5.0-litre V8 with 477 hp. A Japanese grand tourer in rare Structural Blue.',
    photos: [u('RKVEmmaJqGc'), u('kxUVvCUVVH4')],
  },

  // ══ Performance ════════════════════════════════════════════════════════════

  {
    slug: 'kia-ev6-gt-awd-2024',
    stock_id: 'NM022', sort_order: 22,
    category: 'performance', featured: true,
    make: 'Kia', model: 'EV6', trim: 'GT AWD', year: 2024,
    mileage_km: 12000, fuel_type: 'electric', transmission: 'automatic',
    engine_cc: null, power_kw: 430,
    exterior_color: 'Yacht Blue', interior_color: 'Leder Schwarz/Grau GT',
    origin_country: 'KR', import_ready: true,
    features: ['585 PS','0–100 in 3,5 Sekunden','800V Architektur','Reichweite 424 km (WLTP)','Schnellladen 240 kW','Elektronische Differenzialsperre','GT-Bremsen','Head-Up-Display','Meridian® Sound','GT-Sportfahrwerk','Launch Control','V2L Vehicle-to-Load'],
    description_de: 'Der Kia EV6 GT — 585 PS, 0–100 in 3,5 Sekunden. Ein Porsche Taycan S kostet das Doppelte für vergleichbare Leistung. Das stärkste Argument für den koreanischen Elektrosportwagen.',
    description_en: 'The Kia EV6 GT — 585 hp, 0-100 in 3.5 seconds. A Porsche Taycan S costs twice as much for comparable performance. The strongest argument for the Korean electric sports car.',
    photos: PHOTOS.kia_ev,
  },

  {
    slug: 'hyundai-ioniq5-n-awd-2024',
    stock_id: 'NM023', sort_order: 23,
    category: 'performance', featured: true,
    make: 'Hyundai', model: 'IONIQ 5 N', trim: 'AWD Performance', year: 2024,
    mileage_km: 8000, fuel_type: 'electric', transmission: 'automatic',
    engine_cc: null, power_kw: 478,
    exterior_color: 'Soultronic Orange', interior_color: 'N-Leder Schwarz/Orange',
    origin_country: 'KR', import_ready: true,
    features: ['650 PS (N Grin Boost)','0–100 in 3,4 Sekunden','N e-Shift Simulation','N Drift Optimizer','N Active Sound+','Reichweite 448 km (WLTP)','Schnellladen 800V','N Recaro Sitze','Launch Control','N Race Modus','Brembo Hochleistungsbremsen'],
    description_de: 'Der Hyundai IONIQ 5 N — am Nürburgring entwickelt, 650 PS im Boost-Modus, mit simuliertem Gangschaltsystem für die Emotionen eines Verbrenners. Der schnellste serienmäßige Hyundai aller Zeiten.',
    description_en: 'The Hyundai IONIQ 5 N — developed at the Nürburgring, 650 hp in boost mode, with a simulated gear-shift system for combustion engine emotions. The fastest production Hyundai of all time.',
    photos: PHOTOS.ioniq,
  },

  {
    slug: 'hyundai-ioniq6-awd-first-edition-2024',
    stock_id: 'NM024', sort_order: 24,
    category: 'performance', featured: false,
    make: 'Hyundai', model: 'IONIQ 6', trim: 'AWD First Edition', year: 2024,
    mileage_km: 16000, fuel_type: 'electric', transmission: 'automatic',
    engine_cc: null, power_kw: 239,
    exterior_color: 'Digital Teal', interior_color: 'Recycled PET Grau',
    origin_country: 'KR', import_ready: true,
    features: ['Reichweite 614 km (WLTP)','800V Architektur','Schnellladen 350 kW','cW-Wert 0,21','Sitzheizung & -kühlung','Head-Up-Display','Bose® Sound','360°-Kamera','V2L Vehicle-to-Load','Over-the-Air Updates','20-Zoll Felgen'],
    description_de: 'Der Hyundai IONIQ 6 AWD — 614 km WLTP-Reichweite, die längste seiner Klasse. Ein cW-Wert von 0,21 macht ihn aerodynamisch besser als einen Porsche Taycan.',
    description_en: 'The Hyundai IONIQ 6 AWD — 614 km WLTP range, the longest in its class. A drag coefficient of 0.21 makes it more aerodynamic than a Porsche Taycan.',
    photos: [u('KpsavDr0nmo'), u('g0dBVbXOs_s')],
  },

  {
    slug: 'genesis-gv60-performance-awd-2024',
    stock_id: 'NM025', sort_order: 25,
    category: 'performance', featured: false,
    make: 'Genesis', model: 'GV60', trim: 'Performance AWD', year: 2024,
    mileage_km: 15000, fuel_type: 'electric', transmission: 'automatic',
    engine_cc: null, power_kw: 360,
    exterior_color: 'Interstellar Gray', interior_color: 'Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['483 PS','0–100 in 4,0 Sekunden','Boost-Modus +15 PS','Reichweite 470 km (WLTP)','Schnellladen 350 kW','Sitzheizung & -kühlung','360°-Kamera','Augmented Reality HUD','V2L Vehicle-to-Load','Ball of Crystal Schaltknauf','Panorama-Glasdach'],
    description_de: 'Der Genesis GV60 Performance — 483 PS, Boost-Modus der für 10 Sekunden zusätzliche 15 PS freigibt. Elektrisch, schnell und designtechnisch kompromisslos.',
    description_en: 'The Genesis GV60 Performance — 483 hp, with a Boost Mode that unlocks an additional 15 hp for 10 seconds. Electric, fast and uncompromising in design.',
    photos: [u('lL4SGrwBBw8'), u('JCR7YW2S7us')],
  },

  {
    slug: 'genesis-g70-33t-sport-awd-2023',
    stock_id: 'NM026', sort_order: 26,
    category: 'performance', featured: false,
    make: 'Genesis', model: 'G70', trim: '3.3T AWD Sport', year: 2023,
    mileage_km: 35000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 3342, power_kw: 272,
    exterior_color: 'Adriatic Blue', interior_color: 'Leder Rot/Schwarz Sport',
    origin_country: 'KR', import_ready: true,
    features: ['370 PS Biturbo V6','0–100 in 4,7 Sekunden','AWD','Brembo 4-Kolben Bremsen','Adaptives Sport-Fahrwerk','Head-Up-Display','Lexicon® Sound','Sitzheizung & -kühlung','Sportauspuff','19-Zoll Brembo Felgen','Launch Control','Drift Modus'],
    description_de: 'Der Genesis G70 3.3T Sport AWD — direkter Konkurrent von BMW M340i und Mercedes-AMG C43, für deutlich weniger Geld. 370 PS Biturbo, Brembo Bremsen, Nürburgring-Fahrwerk.',
    description_en: 'The Genesis G70 3.3T Sport AWD — a direct competitor to the BMW M340i and Mercedes-AMG C43, for significantly less money. 370 hp twin-turbo, Brembo brakes, Nürburgring chassis.',
    photos: [u('dS0wCPjeBwM'), u('dveDkZQJVjQ')],
  },

  {
    slug: 'mercedes-amg-c43-4matic-2024',
    stock_id: 'NM027', sort_order: 27,
    category: 'performance', featured: false,
    make: 'Mercedes-AMG', model: 'C 43', trim: '4MATIC', year: 2024,
    mileage_km: 18000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 1991, power_kw: 300,
    exterior_color: 'Spectral Blue Metallic', interior_color: 'AMG Nappa-Leder Schwarz/Gelb',
    origin_country: 'KR', import_ready: true,
    features: ['408 PS','0–100 in 3,9 Sekunden','AMG Ride Control+ Fahrwerk','AMG Ceramic Bremsen','Burmester® Sound','AMG Digital Pro Cockpit','Head-Up-Display','AMG Sportsitze','Panorama-Schiebedach','AMG Performance Lenkrad','Drift Modus','Launch Control'],
    description_de: 'Der Mercedes-AMG C 43 4MATIC — 408 PS aus einem Vierzylinder-Biturbo, entwickelt von AMG. In Korea mit AMG Ceramic Bremsen und vollem Performance-Paket als Serienausstattung.',
    description_en: 'The Mercedes-AMG C 43 4MATIC — 408 hp from a four-cylinder twin-turbo, engineered by AMG. In Korea with AMG ceramic brakes and the complete performance package as standard.',
    photos: [u('SO5Gi9RXJkw'), u('uNib1mrJPlY')],
  },

  {
    slug: 'bmw-m340i-xdrive-2024',
    stock_id: 'NM028', sort_order: 28,
    category: 'performance', featured: false,
    make: 'BMW', model: 'M340i', trim: 'xDrive', year: 2024,
    mileage_km: 20000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 2998, power_kw: 285,
    exterior_color: 'Portimao Blau Metallic', interior_color: 'M-Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['387 PS Biturbo Reihen-6','0–100 in 4,4 Sekunden','M xDrive','M Sportfahrwerk','Harman Kardon Sound','BMW Curved Display','Head-Up-Display','M-Sportsitze','M-Lenkrad','Adaptivfahrwerk','Launch Control','19-Zoll M-Räder'],
    description_de: 'Der BMW M340i xDrive — der süßeste Spot in der 3er-Reihe. 387 PS Reihensechszylinder, gleicher Motor wie im M3, im alltagstauglicheren Paket. In Korea mit vollem M Performance Paket.',
    description_en: 'The BMW M340i xDrive — the sweet spot of the 3 Series. 387 hp straight-six, same engine as the M3, in a more everyday-friendly package. In Korea with the complete M Performance package.',
    photos: [u('KiTalJFRkcg'), u('dveDkZQJVjQ')],
  },

  {
    slug: 'kia-stinger-gt-awd-2023',
    stock_id: 'NM029', sort_order: 29,
    category: 'performance', featured: true,
    make: 'Kia', model: 'Stinger', trim: 'GT AWD', year: 2023,
    mileage_km: 32000, fuel_type: 'petrol', transmission: 'automatic',
    engine_cc: 3342, power_kw: 272,
    exterior_color: 'Aurora Black Pearl', interior_color: 'Leder Schwarz/Rot GT',
    origin_country: 'KR', import_ready: true,
    features: ['369 PS V6 Biturbo','0–100 in 4,9 Sekunden','AWD','Brembo Hochleistungsbremsen','Aktives Sportfahrwerk','Harman Kardon Sound','Head-Up-Display','GT Sport Sitze','Sportauspuff','19-Zoll GT Felgen','Launch Control'],
    description_de: 'Der Kia Stinger GT AWD — 2023 eingestellt, was ihn zum gesuchten Sammlerfahrzeug macht. 369 PS V6 Biturbo, Fastback-Silhouette, Brembo Bremsen. Ein Fahrzeug, das die Autowelt überrascht hat.',
    description_en: 'The Kia Stinger GT AWD — discontinued in 2023, making it a sought-after collector\'s item. 369 hp V6 twin-turbo, fastback silhouette, Brembo brakes. A car that surprised the automotive world.',
    photos: PHOTOS.stinger,
  },

  {
    slug: 'genesis-g80-electrified-sport-2024',
    stock_id: 'NM030', sort_order: 30,
    category: 'performance', featured: false,
    make: 'Genesis', model: 'G80', trim: 'Electrified Sport AWD', year: 2024,
    mileage_km: 14000, fuel_type: 'electric', transmission: 'automatic',
    engine_cc: null, power_kw: 272,
    exterior_color: 'Uyuni White', interior_color: 'Leder Schwarz',
    origin_country: 'KR', import_ready: true,
    features: ['365 PS','0–100 in 4,9 Sekunden','Reichweite 520 km (WLTP)','Ultra-Fast Charging 350 kW','Sportsitze','Panorama-Glasdach','Lexicon® Sound','Head-Up-Display','V2L Vehicle-to-Load','360°-Kamera','Genesis Connected Services'],
    description_de: 'Der Genesis G80 Electrified Sport — 365 PS elektrische Sportlimousine mit 520 km Reichweite. Genesis-Luxus trifft elektrischen Antrieb: leise, schnell, elegant.',
    description_en: 'The Genesis G80 Electrified Sport — 365 hp electric sport saloon with 520 km range. Genesis luxury meets electric drive: quiet, fast, elegant.',
    photos: [u('dgxhPxqXceg'), u('dS0wCPjeBwM')],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚗  Norvyn Motors — Vehicle Seed Script')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📡  Connecting to Supabase...\n`)

  let inserted = 0
  let skipped  = 0
  let errors   = 0

  for (const v of VEHICLES) {
    const { photos, ...vehicleData } = v

    // Skip if already exists
    const { data: existing } = await sb
      .from('vehicles')
      .select('id')
      .eq('slug', vehicleData.slug)
      .maybeSingle()

    if (existing) {
      console.log(`⏭️   Skip     ${vehicleData.make} ${vehicleData.model} (already exists)`)
      skipped++
      continue
    }

    // Insert vehicle record
    const { data: vehicle, error: vErr } = await sb
      .from('vehicles')
      .insert({
        ...vehicleData,
        status: 'available',
        price_eur: null,
        price_visible: false,
        seo_title_de: null,
        seo_title_en: null,
        seo_description_de: null,
        seo_description_en: null,
      })
      .select('id')
      .single()

    if (vErr || !vehicle) {
      console.error(`❌  Error     ${vehicleData.slug}: ${vErr?.message}`)
      errors++
      continue
    }

    // Insert images
    const images = photos.map((url, i) => ({
      vehicle_id:   vehicle.id,
      url,
      storage_path: url,
      position:     i,
      alt_text:     `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim ?? ''}`.trim(),
    }))

    const { error: imgErr } = await sb.from('vehicle_images').insert(images)

    if (imgErr) {
      console.warn(`⚠️   Images    ${vehicleData.slug}: ${imgErr.message}`)
    }

    console.log(`✅  Inserted  ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim} (${vehicleData.year}) — ${photos.length} photos`)
    inserted++

    await new Promise(r => setTimeout(r, 80)) // gentle rate limiting
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅  Inserted : ${inserted} vehicles`)
  console.log(`⏭️   Skipped  : ${skipped} (already existed)`)
  console.log(`❌  Errors   : ${errors}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (inserted > 0) {
    console.log(`🎉  Done! Open https://norvyn-motors.de/fahrzeuge to see your inventory.\n`)
  }
}

main().catch(console.error)
