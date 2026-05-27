# Encar Import Script

Importiert automatisch ~50 Fahrzeuge von Encar in die Norvyn-Datenbank.

## Einmalige Einrichtung

**1. Node.js installieren** (falls noch nicht vorhanden)  
→ https://nodejs.org → LTS-Version herunterladen und installieren

**2. Script konfigurieren**  
Öffne `encar-import.js` und trage ein:
```js
const SUPABASE_URL = 'https://xxx.supabase.co'   // Supabase → Settings → API
const SUPABASE_KEY = 'eyJ...'                     // service_role Key (NICHT anon!)
```

**3. Abhängigkeiten installieren**
```bash
cd scripts
npm install
npx playwright install chromium
```

## Script starten

```bash
node encar-import.js
```

Ein Chrome-Browser öffnet sich automatisch — das ist normal.  
Der Import dauert ca. **20–40 Minuten** für alle ~50 Fahrzeuge.

## Was passiert

- Öffnet Encar im Browser (umgeht IP-Sperren)
- Sucht 26 Fahrzeugmodelle (Performance, Luxury, Deutsche Marken)
- Lädt bis zu 8 Fotos pro Fahrzeug herunter
- Speichert alles direkt in deiner Supabase-Datenbank
- Fahrzeuge erscheinen sofort im Admin-Bereich

## Falls es nicht funktioniert

**„Keine Ergebnisse"** → Encar hat die Modellnamen geändert. Schreib Nico.

**„403 Forbidden"** → Encar blockiert die Anfrage. VPN auf Korea stellen und nochmal probieren.

**Bilder fehlen** → Encar-CDN blockiert. Fotos manuell im Admin hochladen.

## Fahrzeuge die importiert werden

| Kategorie | Modelle |
|-----------|---------|
| Performance | Kia Stinger, Genesis G70, Kia EV6, Genesis GV70, Hyundai IONIQ 6 |
| Luxury | Genesis G80/G90/GV80, Hyundai Palisade, Kia Carnival/EV9, IONIQ 5 |
| Deutsche Marken | BMW 3/5/7er, X3/X5, Mercedes E/S/GLE/GLS, Audi A6/A7/A8, Q5/Q8 |
