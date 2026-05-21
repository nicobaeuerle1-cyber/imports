'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'

const consoleScript = `(function(){var d=window.__NEXT_DATA__&&window.__NEXT_DATA__.props&&window.__NEXT_DATA__.props.pageProps;var car=d&&(d.car||d.carDetail||d.vehicle||d.detail);if(!car){var scripts=document.querySelectorAll('script[id="__NEXT_DATA__"]');if(scripts.length){try{var nd=JSON.parse(scripts[0].textContent);car=nd.props&&nd.props.pageProps&&(nd.props.pageProps.car||nd.props.pageProps.carDetail||nd.props.pageProps.vehicle);}catch(e){}}}function fuel(f){if(!f)return'petrol';f=String(f);if(f.indexOf('경유')>-1)return'diesel';if(f.indexOf('전기')>-1)return'electric';if(f.indexOf('하이브리드')>-1)return'hybrid';return'petrol';}function trans(t){if(!t)return'automatic';return String(t).indexOf('수동')>-1?'manual':'automatic';}var make='',model='',trim='',year='',mileage='',fuelT='petrol',transT='automatic',color='',cc='',power='',carid='';var m1=location.href.match(/[?&]carid=(\d+)/);var m2=location.href.match(/\/(\d{7,})/);if(m1)carid=m1[1];else if(m2)carid=m2[1];if(car){make=car.Manufacturer||car.Make||car.Brand||car.maker||'';model=car.ModelGroup||car.Model||car.model||'';trim=car.BadgeName||car.Badge||car.Trim||car.trim||car.Grade||'';year=String(car.FormYear||car.Year||car.year||'');mileage=String(car.Mileage||'').replace(/,/g,'');fuelT=fuel(car.FuelType||car.Fuel||car.fuelType);transT=trans(car.Transmission||car.GearBox||car.gearbox);color=car.Color||car.ExteriorColor||'';cc=String(car.Displacement||'').replace(/,/g,'');power=String(car.Power||'').replace(/,/g,'');if(!carid&&car.Id)carid=String(car.Id);}if(!make){var og=document.querySelector('meta[property="og:title"]');if(og){var t2=og.content.split(' ');if(t2.length>=2){make=t2[0];model=t2.slice(1,3).join(' ');}}}var p=new URLSearchParams();if(carid)p.set('carid',carid);if(make)p.set('make',make);if(model)p.set('model',model);if(trim)p.set('trim',trim);if(year)p.set('year',year);if(mileage)p.set('mileage',mileage);p.set('fuel',fuelT);p.set('transmission',transT);if(color)p.set('color',color);if(cc)p.set('cc',cc);if(power)p.set('power',power);p.set('source_url',location.href);location.href='https://norvyn-motors.de/admin/import?'+p.toString();})();`

export default function BookmarkletPage() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(consoleScript).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 font-sans text-sm text-muted hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zum Dashboard
        </Link>

        <h1 className="font-display text-3xl text-foreground mb-2">Encar Import-Script</h1>
        <p className="font-sans text-sm text-muted mb-10">
          Mit diesem Script kannst du Fahrzeugdaten direkt von Encar ins Admin-Panel übernehmen — kein Plugin, keine Installation.
        </p>

        {/* Step 1 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center border border-gold/40 bg-gold/10 font-sans text-sm font-medium text-gold">
              1
            </span>
            <h2 className="font-sans text-base font-medium text-foreground">
              Script kopieren
            </h2>
          </div>
          <div className="pl-10">
            <div className="flex items-center justify-between border border-border bg-surface-elevated px-4 py-3 mb-2">
              <code className="font-mono text-xs text-muted truncate pr-4">
                (function()&#123;var d=window.__NEXT_DATA__&amp;&amp;…&#125;)();
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-2 border border-border bg-background px-3 py-1.5 font-sans text-xs text-foreground hover:bg-surface-elevated transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-gold" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Kopiert!' : 'Kopieren'}
              </button>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center border border-gold/40 bg-gold/10 font-sans text-sm font-medium text-gold">
              2
            </span>
            <h2 className="font-sans text-base font-medium text-foreground">
              Auf fem.encar.com ein Fahrzeug öffnen
            </h2>
          </div>
          <p className="font-sans text-sm text-muted pl-10">
            Gehe auf <span className="text-foreground font-medium">fem.encar.com</span> und öffne die Detailseite des Fahrzeugs das du importieren möchtest.
          </p>
        </div>

        {/* Step 3 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center border border-gold/40 bg-gold/10 font-sans text-sm font-medium text-gold">
              3
            </span>
            <h2 className="font-sans text-base font-medium text-foreground">
              Entwicklerkonsole öffnen
            </h2>
          </div>
          <div className="pl-10 space-y-2">
            <p className="font-sans text-sm text-muted">
              Drücke auf der Encar-Seite:
            </p>
            <div className="flex flex-col gap-2 font-sans text-sm">
              <div className="flex items-center gap-3">
                <span className="text-muted w-28 shrink-0">Windows / Linux</span>
                <kbd className="border border-border bg-surface-elevated px-2 py-1 text-xs text-foreground">F12</kbd>
                <span className="text-muted text-xs">oder</span>
                <kbd className="border border-border bg-surface-elevated px-2 py-1 text-xs text-foreground">Strg + Shift + I</kbd>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted w-28 shrink-0">Mac</span>
                <kbd className="border border-border bg-surface-elevated px-2 py-1 text-xs text-foreground">Cmd + Option + I</kbd>
              </div>
            </div>
            <p className="font-sans text-sm text-muted pt-1">
              Dann oben im Fenster auf den Tab <strong className="text-foreground">Console</strong> klicken.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center border border-gold/40 bg-gold/10 font-sans text-sm font-medium text-gold">
              4
            </span>
            <h2 className="font-sans text-base font-medium text-foreground">
              Script einfügen und Enter drücken
            </h2>
          </div>
          <div className="pl-10 space-y-2">
            <p className="font-sans text-sm text-muted">
              Klicke in das untere Eingabefeld der Konsole, füge das kopierte Script ein (<kbd className="border border-border bg-surface-elevated px-1.5 py-0.5 text-xs text-foreground">Strg+V</kbd>) und drücke <kbd className="border border-border bg-surface-elevated px-1.5 py-0.5 text-xs text-foreground">Enter</kbd>.
            </p>
            <p className="font-sans text-sm text-muted">
              Ein neues Tab öffnet sich — das Import-Formular ist mit allen verfügbaren Daten ausgefüllt.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center border border-gold/40 bg-gold/10 font-sans text-sm font-medium text-gold">
              5
            </span>
            <h2 className="font-sans text-base font-medium text-foreground">
              Prüfen &amp; speichern
            </h2>
          </div>
          <p className="font-sans text-sm text-muted pl-10">
            Daten prüfen, Beschreibung anpassen, auf <strong className="text-foreground">Fahrzeug speichern</strong> klicken.
            Danach Fotos hochladen — fertig.
          </p>
        </div>

        {/* Chrome paste warning */}
        <div className="border border-amber-500/20 bg-amber-500/5 p-4 mb-6">
          <p className="font-sans text-xs text-amber-400/80">
            <strong className="text-amber-400">Chrome-Hinweis:</strong> Beim ersten Einfügen in die Konsole erscheint möglicherweise eine Warnung.
            Tippe dann <code className="bg-surface-elevated px-1">allow pasting</code> ein, drücke Enter, und füge danach das Script erneut ein.
          </p>
        </div>

        <div className="border border-border bg-surface-elevated p-4">
          <p className="font-sans text-xs text-muted">
            Das Script läuft nur in deinem Browser und überträgt keine Daten an Dritte.
            Falls das Fahrzeug keine Daten liefert, öffnet sich trotzdem das Formular — dann bitte manuell ausfüllen.
          </p>
        </div>
      </div>
    </div>
  )
}
