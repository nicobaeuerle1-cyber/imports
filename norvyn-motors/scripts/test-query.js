#!/usr/bin/env node
// Testet eine einzelne Encar-Suchanfrage und zeigt die rohe Antwort
const { chromium } = require('playwright')

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    locale: 'ko-KR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await ctx.newPage()

  await page.goto('https://www.encar.com', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2000)

  // Test verschiedene Query-Formate
  const tests = [
    // Ohne Manufacturer-Filter (sollte alle Autos zeigen)
    '(And.Hidden.N._.CarType.Y.)',
    // Mit Manufacturer.제네시스 (Genesis G80)
    '(And.(And.Hidden.N._.CarType.Y.)_.Manufacturer.제네시스._.ModelGroup.G80.)',
    // Ohne äußere Klammer
    'And.Hidden.N._.CarType.Y._.Manufacturer.제네시스._.ModelGroup.G80.',
    // Mit Maker statt Manufacturer
    '(And.(And.Hidden.N._.CarType.Y.)_.Maker.제네시스._.ModelGroup.G80.)',
  ]

  for (const q of tests) {
    const qEncoded = q.replace(/[^\x00-\x7F]/g, c => encodeURIComponent(c))
    const url = `https://api.encar.com/search/car/list/general?count=true&q=${qEncoded}&sr=%7CModifiedDate%7C0%7C3`
    console.log(`\n📋 Query: ${q.slice(0, 70)}`)
    console.log(`🔗 URL:   ${url.slice(0, 120)}`)

    const { status, body } = await page.evaluate(async (apiUrl) => {
      try {
        const r = await fetch(apiUrl, {
          headers: { 'Referer': 'https://www.encar.com/', 'Accept': 'application/json', 'Accept-Language': 'ko-KR,ko;q=0.9' }
        })
        return { status: r.status, body: (await r.text()).slice(0, 400) }
      } catch (e) { return { status: 0, body: e.message } }
    }, url)

    console.log(`📊 Status: ${status}`)
    console.log(`📦 Response: ${body}`)
  }

  await browser.close()
}

main().catch(console.error)
