'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'

const consoleScript = `(function(){var m1=location.href.match(/[?&]carid=(\\d+)/);var m2=location.href.match(/\\/(\\d{7,})/);var carid=m1?m1[1]:(m2?m2[1]:'');var title=document.title||'';var titleMain=title.split('중고차')[0].trim();var parts=titleMain.split(' ').filter(function(p){return p.length>0;});if(parts.length>1&&/^[가-힣]+$/.test(parts[parts.length-1]))parts.pop();var rawModel=parts[0]||'';var make='',model='',trim='';var modelMap={'S-클래스':'S-Class','E-클래스':'E-Class','C-클래스':'C-Class','A-클래스':'A-Class','CLA':'CLA','GLE':'GLE','GLC':'GLC','GLS':'GLS','EQS':'EQS','EQE':'EQE','5시리즈':'5 Series','3시리즈':'3 Series','7시리즈':'7 Series','1시리즈':'1 Series','X5':'X5','X3':'X3','X7':'X7','X6':'X6','M3':'M3','M5':'M5','iX':'iX','i4':'i4','A6':'A6','A4':'A4','A8':'A8','Q5':'Q5','Q7':'Q7','Q8':'Q8','그랜저':'Grandeur','소나타':'Sonata','아반떼':'Avante','투싼':'Tucson','싼타페':'Santa Fe','G80':'G80','G90':'G90','GV80':'GV80','GV70':'GV70','GV60':'GV60'};if(/클래스/.test(rawModel))make='Mercedes-Benz';else if(/시리즈/.test(rawModel)||/^[XMiZ]\\d/.test(rawModel))make='BMW';else if(/^[AQ]\\d/.test(rawModel))make='Audi';else if(/카이엔|911|파나메라|마칸|타이칸/.test(rawModel))make='Porsche';else if(/제네시스|^G[679]0$|^GV/.test(rawModel))make='Genesis';else if(/렉서스|^L[CNSX]/.test(rawModel))make='Lexus';else if(/그랜저|소나타|아반떼|투싼|싼타페|펠리세이드/.test(rawModel))make='Hyundai';else if(/^K[3-9]$|스팅어|카니발|쏘렌토|스포티지/.test(rawModel))make='Kia';else make=rawModel;model=modelMap[rawModel]||rawModel;trim=parts.slice(1).join(' ');var desc=(document.querySelector('meta[name="description"]')||{content:''}).content;var yr=desc.match(/연식:(\\d{2})년/);var year=yr?String(2000+parseInt(yr[1],10)):'';var km=desc.match(/주행거리:([\\d,]+)km/);var mileage=km?km[1].replace(/,/g,''):'';var fu=desc.match(/연료:([^,\\s]+)/);var fuelMap={'가솔린':'petrol','휘발유':'petrol','경유':'diesel','전기':'electric','하이브리드':'hybrid','LPG':'petrol'};var fuel=(fu&&fuelMap[fu[1]])||'petrol';var co=desc.match(/색상:([^,\\s]+)/);var color=co?co[1]:'';var p=new URLSearchParams();if(carid)p.set('carid',carid);if(make)p.set('make',make);if(model)p.set('model',model);if(trim)p.set('trim',trim);if(year)p.set('year',year);if(mileage)p.set('mileage',mileage);p.set('fuel',fuel);p.set('transmission','automatic');if(color)p.set('color',color);p.set('source_url',location.href);location.href='https://norvyn-motors.de/admin/import?'+p.toString();})();`

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
