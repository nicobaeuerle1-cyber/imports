'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'

const consoleScript = `(function(){var m1=location.href.match(/[?&]carid=(\\d+)/);var m2=location.href.match(/\\/(\\d{7,})/);var carid=m1?m1[1]:(m2?m2[1]:'');var title=document.title||'';var titleMain=title.split('중고차')[0].trim();var parts=titleMain.split(' ').filter(function(p){return p.length>0;});if(parts.length>1&&/^[가-힣]+$/.test(parts[parts.length-1]))parts.pop();var rawModel=parts[0]||'';var make='',model='',trim='';var modelMap={'S-클래스':'S-Class','E-클래스':'E-Class','C-클래스':'C-Class','A-클래스':'A-Class','CLA':'CLA','GLE':'GLE','GLC':'GLC','GLS':'GLS','EQS':'EQS','EQE':'EQE','AMG GT':'AMG GT','5시리즈':'5 Series','3시리즈':'3 Series','7시리즈':'7 Series','1시리즈':'1 Series','2시리즈':'2 Series','X5':'X5','X3':'X3','X7':'X7','X6':'X6','X4':'X4','X2':'X2','M3':'M3','M5':'M5','M8':'M8','iX':'iX','i4':'i4','i7':'i7','A6':'A6','A4':'A4','A8':'A8','A5':'A5','A3':'A3','Q5':'Q5','Q7':'Q7','Q8':'Q8','Q3':'Q3','e-tron':'e-tron','카이엔':'Cayenne','파나메라':'Panamera','마칸':'Macan','타이칸':'Taycan','911':'911','그랜저':'Grandeur','소나타':'Sonata','아반떼':'Avante','투싼':'Tucson','싼타페':'Santa Fe','펠리세이드':'Palisade','G80':'G80','G90':'G90','GV80':'GV80','GV70':'GV70','GV60':'GV60','K5':'K5','K8':'K8','K9':'K9','스팅어':'Stinger','카니발':'Carnival','쏘렌토':'Sorento','스포티지':'Sportage'};if(/클래스/.test(rawModel))make='Mercedes-Benz';else if(/시리즈/.test(rawModel)||/^[XMi]\\d/.test(rawModel))make='BMW';else if(/^[AQ]\\d/.test(rawModel)||rawModel==='e-tron')make='Audi';else if(/카이엔|파나메라|마칸|타이칸|^911$/.test(rawModel))make='Porsche';else if(/제네시스|^G[679]0$|^GV/.test(rawModel))make='Genesis';else if(/렉서스|^L[CNSX]/.test(rawModel))make='Lexus';else if(/그랜저|소나타|아반떼|투싼|싼타페|펠리세이드/.test(rawModel))make='Hyundai';else if(/^K[3-9]$|스팅어|카니발|쏘렌토|스포티지/.test(rawModel))make='Kia';else make=rawModel;model=modelMap[rawModel]||rawModel;trim=parts.slice(1).join(' ');var desc=(document.querySelector('meta[name="description"]')||{content:''}).content;var yr=desc.match(/연식:(\\d{2})년/);var year=yr?String(2000+parseInt(yr[1],10)):'';var km=desc.match(/주행거리:([\\d,]+)km/);var mileage=km?km[1].replace(/,/g,''):'';var fu=desc.match(/연료:([^,\\s]+)/);var fuelMap={'가솔린':'petrol','휘발유':'petrol','경유':'diesel','전기':'electric','하이브리드':'hybrid','LPG':'petrol'};var fuel=(fu&&fuelMap[fu[1]])||'petrol';var co=desc.match(/색상:([^,\\s]+)/);var color=co?co[1]:'';var bodyText=document.body.innerText||'';var featureMap={'선루프':'Schiebedach','파노라마선루프':'Panoramadach','헤드램프':'LED-Scheinwerfer','주차감지센서':'Einparksensoren','후방카메라':'Rückfahrkamera','자동에어컨':'Klimaautomatik','스마트키':'Keyless Go','내비게이션':'Navigation','열선시트':'Sitzheizung','통풍시트':'Belüftete Sitze','가죽시트':'Lederausstattung','어댑티브크루즈':'Adaptiver Tempomat','차선유지':'Spurhalteassistent','헤드업디스플레이':'Head-up Display','서라운드뷰':'360°-Kamera','열선핸들':'Lenkradheizung','전동시트':'Elektrische Sitze','전동트렁크':'Elektrische Heckklappe','무선충전':'Kabelloses Laden','애플카플레이':'Apple CarPlay','후측방경보':'Totwinkelassistent','에어서스펜션':'Luftfederung','어라운드뷰':'360°-Kamera'};var features=[];if(bodyText.indexOf('무사고')>-1)features.push('Unfallfrei');Object.keys(featureMap).forEach(function(kr){var idx=bodyText.indexOf(kr);if(idx>-1){var snippet=bodyText.slice(idx,idx+60);if(snippet.indexOf('있음')>-1)features.push(featureMap[kr]);}});var descDe=year+' '+make+' '+model+(trim?' '+trim:'')+' aus Südkorea bei Norvyn Motors.'+(features.length?' Ausstattung: '+features.join(', ')+'.':'');var descEn=year+' '+make+' '+model+(trim?' '+trim:'')+' from South Korea at Norvyn Motors.'+(features.length?' Features: '+features.join(', ')+'.':'');var p=new URLSearchParams();if(carid)p.set('carid',carid);if(make)p.set('make',make);if(model)p.set('model',model);if(trim)p.set('trim',trim);if(year)p.set('year',year);if(mileage)p.set('mileage',mileage);p.set('fuel',fuel);p.set('transmission','automatic');if(color)p.set('color',color);if(features.length)p.set('features',features.join(','));if(descDe)p.set('desc_de',descDe);if(descEn)p.set('desc_en',descEn);p.set('source_url',location.href);location.href='https://norvyn-motors.de/admin/import?'+p.toString();})();`

export default function BookmarkletPage() {
  const [copiedBookmark, setCopiedBookmark] = useState(false)
  const [copiedConsole, setCopiedConsole] = useState(false)

  function handleCopyBookmark() {
    navigator.clipboard.writeText('javascript:' + consoleScript).then(() => {
      setCopiedBookmark(true)
      setTimeout(() => setCopiedBookmark(false), 2500)
    })
  }

  function handleCopyConsole() {
    navigator.clipboard.writeText(consoleScript).then(() => {
      setCopiedConsole(true)
      setTimeout(() => setCopiedConsole(false), 2500)
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
          Zwei Möglichkeiten — Lesezeichen (einmalig einrichten, dann 1 Klick) oder Console (immer verfügbar).
        </p>

        {/* Option A: Bookmark */}
        <div className="mb-10 border border-gold/30 bg-gold/5 p-6">
          <p className="font-sans text-xs tracking-widest text-gold uppercase mb-4">Option A — Lesezeichen (empfohlen)</p>
          <ol className="space-y-3 font-sans text-sm text-muted list-none">
            <li className="flex gap-3"><span className="text-gold font-medium w-4 shrink-0">1.</span><span>Klicke auf <strong className="text-foreground">Lesezeichen kopieren</strong> unten</span></li>
            <li className="flex gap-3"><span className="text-gold font-medium w-4 shrink-0">2.</span><span>Rechtsklick auf die Lesezeichenleiste → <strong className="text-foreground">Lesezeichen hinzufügen</strong></span></li>
            <li className="flex gap-3"><span className="text-gold font-medium w-4 shrink-0">3.</span><span>Name: <code className="bg-background px-1 border border-border text-xs">Encar → Norvyn</code> · das URL-Feld leeren · <strong className="text-foreground">Strg+V</strong> · Speichern</span></li>
            <li className="flex gap-3"><span className="text-gold font-medium w-4 shrink-0">4.</span><span>Auf fem.encar.com ein Fahrzeug öffnen → Lesezeichen klicken → fertig</span></li>
          </ol>
          <button
            onClick={handleCopyBookmark}
            className="mt-5 flex items-center gap-2 border border-gold/50 bg-gold/10 px-4 py-2 font-sans text-sm text-gold hover:bg-gold/20 transition-colors"
          >
            {copiedBookmark ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedBookmark ? 'Kopiert! Jetzt ins Lesezeichen einfügen' : 'Lesezeichen kopieren'}
          </button>
        </div>

        {/* Option B: Console */}
        <div className="mb-10 border border-border bg-surface p-6">
          <p className="font-sans text-xs tracking-widest text-muted uppercase mb-4">Option B — Console (kein Setup nötig)</p>
          <ol className="space-y-3 font-sans text-sm text-muted list-none">
            <li className="flex gap-3"><span className="text-foreground font-medium w-4 shrink-0">1.</span><span>Auf fem.encar.com ein Fahrzeug öffnen</span></li>
            <li className="flex gap-3"><span className="text-foreground font-medium w-4 shrink-0">2.</span><span><kbd className="border border-border bg-background px-1.5 py-0.5 text-xs">F12</kbd> → Tab <strong className="text-foreground">Console</strong></span></li>
            <li className="flex gap-3"><span className="text-foreground font-medium w-4 shrink-0">3.</span><span>Script einfügen → <kbd className="border border-border bg-background px-1.5 py-0.5 text-xs">Enter</kbd></span></li>
          </ol>
          <button
            onClick={handleCopyConsole}
            className="mt-5 flex items-center gap-2 border border-border px-4 py-2 font-sans text-sm text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            {copiedConsole ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
            {copiedConsole ? 'Kopiert!' : 'Console-Script kopieren'}
          </button>
        </div>

        {/* Step 1 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center border border-gold/40 bg-gold/10 font-sans text-sm font-medium text-gold">
              1
            </span>
            <h2 className="font-sans text-base font-medium text-foreground">
              Chrome-Hinweis
            </h2>
          </div>
          <p className="font-sans text-sm text-muted pl-10">
            Beim ersten Einfügen in die Console erscheint möglicherweise eine Warnung. Tippe dann <code className="bg-surface-elevated px-1 border border-border text-xs">allow pasting</code> ein + Enter, dann nochmal einfügen.
          </p>
        </div>

        <div className="border border-border bg-surface-elevated p-4">
          <p className="font-sans text-xs text-muted">
            Das Script läuft nur in deinem Browser und überträgt keine Daten an Dritte.
            Falls ein Fahrzeug keine Daten liefert, öffnet sich trotzdem das Formular — dann bitte manuell ausfüllen.
          </p>
        </div>
      </div>
    </div>
  )
}
