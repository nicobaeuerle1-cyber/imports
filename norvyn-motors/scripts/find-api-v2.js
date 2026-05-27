#!/usr/bin/env node
/**
 * find-api-v2.js — Findet den aktuellen Encar API-Endpunkt
 * Fängt alle Netzwerkanfragen ab, während Encar nach Autos sucht.
 *
 * Starten:
 *   node find-api-v2.js
 *
 * Was tun: Einfach warten — das Script sucht selbst nach Autos.
 * Am Ende siehst du die echten API-URLs.
 */

const { chromium } = require('playwright')

async function main() {
  console.log('🔍  Suche nach aktuellen Encar API-Endpunkten...\n')

  const browser = await chromium.launch({ headless: false, slowMo: 200 })
  const ctx = await browser.newContext({
    locale: 'ko-KR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await ctx.newPage()

  const captured = []

  // Intercept ALL responses and log API calls
  page.on('response', async (response) => {
    const url = response.url()
    const status = response.status()
    // Only log likely API calls (JSON responses, encar domains)
    if ((url.includes('encar.com') || url.includes('api.encar')) && !url.includes('.js') && !url.includes('.css') && !url.includes('.png') && !url.includes('.jpg') && !url.includes('.ico')) {
      const ct = response.headers()['content-type'] ?? ''
      if (ct.includes('json') || url.includes('json') || url.includes('/api/') || url.includes('/search/') || url.includes('/cars/')) {
        captured.push({ url, status })
        console.log(`  [${status}] ${url.slice(0, 120)}`)
      }
    }
  })

  // Step 1: Load Encar
  console.log('🌐  Öffne Encar...')
  await page.goto('https://www.encar.com', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(3000)

  // Step 2: Search for a Genesis G80
  console.log('🔍  Suche nach Genesis G80...')
  try {
    // Try to search via URL directly (common pattern)
    await page.goto('https://www.encar.com/dc/car/dcCarList.do?carType=Y&searchType=3&modelId=GENE&subModelId=G80', {
      waitUntil: 'domcontentloaded', timeout: 20000
    })
    await page.waitForTimeout(3000)
  } catch {}

  // Step 3: Try the used car search page
  console.log('🔍  Suche auf Gebrauchtwagenseite...')
  try {
    await page.goto('https://www.encar.com/dc/car/dcCarList.do?carType=Y', {
      waitUntil: 'domcontentloaded', timeout: 20000
    })
    await page.waitForTimeout(3000)
  } catch {}

  // Step 4: Try using the search field
  try {
    const searchInput = await page.$('input[type="search"], input[placeholder*="검색"], #searchText, .search-input')
    if (searchInput) {
      await searchInput.fill('제네시스 G80')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(3000)
    }
  } catch {}

  // Step 5: Try direct API test with different URL patterns
  console.log('\n🧪  Teste verschiedene API-Endpunkte direkt...\n')
  const testUrls = [
    'https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.CarType.Y.)&sr=%7CModifiedDate%7C0%7C5',
    'https://api.encar.com/search/car/list/general?count=true&q=(And.(And.Hidden.N._.CarType.Y.)_.Manufacturer.제네시스._.ModelGroup.G80.)&sr=%7CModifiedDate%7C0%7C5',
    'https://api.encar.com/v2/search/car/list/general?count=true&q=(And.Hidden.N._.CarType.Y.)&sr=%7CModifiedDate%7C0%7C5',
    'https://api.encar.com/search/car/list/premium?count=true&q=(And.Hidden.N._.CarType.Y.)&sr=%7CModifiedDate%7C0%7C5',
    'https://api.encar.com/search/car/list?count=true&q=(And.Hidden.N._.CarType.Y.)&sr=%7CModifiedDate%7C0%7C5',
    'https://www.encar.com/api/search/car/list/general?count=true&q=(And.Hidden.N._.CarType.Y.)&sr=%7CModifiedDate%7C0%7C5',
  ]

  const results = await page.evaluate(async (urls) => {
    const out = []
    for (const url of urls) {
      try {
        const r = await fetch(url, {
          headers: {
            'Referer': 'https://www.encar.com/',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
          }
        })
        const text = await r.text()
        out.push({ url, status: r.status, snippet: text.slice(0, 300) })
      } catch (e) {
        out.push({ url, status: 0, snippet: e.message })
      }
    }
    return out
  }, testUrls)

  console.log('📊  API-Test Ergebnisse:\n')
  for (const { url, status, snippet } of results) {
    const icon = status === 200 ? '✅' : status === 0 ? '🔌' : `❌ ${status}`
    console.log(`${icon}  ${url.slice(0, 80)}`)
    if (status === 200) {
      console.log(`     → ${snippet.slice(0, 200)}\n`)
    }
  }

  // Show summary of captured URLs
  console.log('\n📋  Alle abgefangenen Encar-API-Aufrufe:\n')
  if (captured.length === 0) {
    console.log('  ⚠️  Keine API-Aufrufe abgefangen. Encar lädt möglicherweise alles über die HTML-Seite.')
  } else {
    for (const { url, status } of captured) {
      console.log(`  [${status}] ${url}`)
    }
  }

  console.log('\n⏳  Browser bleibt 30s offen — schau dir die Netzwerk-Requests an...')
  await page.waitForTimeout(30000)

  await browser.close()
  console.log('\n✅  Fertig.')
}

main().catch(console.error)
