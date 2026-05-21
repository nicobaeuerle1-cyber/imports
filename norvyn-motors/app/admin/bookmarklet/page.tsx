'use client'

import Link from 'next/link'
import { ArrowLeft, BookmarkIcon } from 'lucide-react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://norvyn-motors.de'

const bookmarkletCode = `javascript:(function(){
  var d=window.__NEXT_DATA__&&window.__NEXT_DATA__.props&&window.__NEXT_DATA__.props.pageProps;
  var car=d&&(d.car||d.carDetail||d.vehicle||d.detail);
  if(!car){
    var scripts=document.querySelectorAll('script[id="__NEXT_DATA__"]');
    if(scripts.length){try{var nd=JSON.parse(scripts[0].textContent);car=nd.props&&nd.props.pageProps&&(nd.props.pageProps.car||nd.props.pageProps.carDetail||nd.props.pageProps.vehicle);}catch(e){}}
  }
  function fuel(f){if(!f)return'petrol';f=String(f);if(f.indexOf('경유')>-1)return'diesel';if(f.indexOf('전기')>-1)return'electric';if(f.indexOf('하이브리드')>-1)return'hybrid';return'petrol';}
  function trans(t){if(!t)return'automatic';return String(t).indexOf('수동')>-1?'manual':'automatic';}
  var make='',model='',trim_='',year='',mileage='',fuelT='petrol',transT='automatic',color='',cc='',power='',carid='';
  var urlMatch=location.href.match(/[?&]carid=(\d+)/)||location.href.match(/\/(\d{7,})/);
  if(urlMatch)carid=urlMatch[1];
  if(car){
    make=car.Manufacturer||car.Make||car.Brand||car.maker||'';
    model=car.ModelGroup||car.Model||car.model||'';
    trim_=car.BadgeName||car.Badge||car.Trim||car.trim||car.Grade||'';
    year=String(car.FormYear||car.Year||car.year||'');
    mileage=String(car.Mileage||'').replace(/,/g,'');
    fuelT=fuel(car.FuelType||car.Fuel||car.fuelType);
    transT=trans(car.Transmission||car.GearBox||car.gearbox);
    color=car.Color||car.ExteriorColor||'';
    cc=String(car.Displacement||'').replace(/,/g,'');
    power=String(car.Power||'').replace(/,/g,'');
    if(!carid&&car.Id)carid=String(car.Id);
  }
  if(!make){
    var og=document.querySelector('meta[property="og:title"]');
    if(og){var t2=og.content.split(' ');if(t2.length>=2){make=t2[0];model=t2.slice(1,3).join(' ');}}
  }
  var p=new URLSearchParams();
  if(carid)p.set('carid',carid);
  if(make)p.set('make',make);
  if(model)p.set('model',model);
  if(trim_)p.set('trim',trim_);
  if(year)p.set('year',year);
  if(mileage)p.set('mileage',mileage);
  p.set('fuel',fuelT);
  p.set('transmission',transT);
  if(color)p.set('color',color);
  if(cc)p.set('cc',cc);
  if(power)p.set('power',power);
  p.set('source_url',location.href);
  window.open('${SITE_URL}/admin/import?'+p.toString(),'_blank');
})();`

export default function BookmarkletPage() {
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

        <h1 className="font-display text-3xl text-foreground mb-2">Encar Bookmarklet</h1>
        <p className="font-sans text-sm text-muted mb-10">
          Damit kannst du Fahrzeugdaten direkt von einer Encar-Seite in das Admin-Panel übernehmen.
        </p>

        {/* Step 1 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center border border-gold/40 bg-gold/10 font-sans text-sm font-medium text-gold">
              1
            </span>
            <h2 className="font-sans text-base font-medium text-foreground">
              Bookmarklet in die Lesezeichenleiste ziehen
            </h2>
          </div>
          <p className="font-sans text-sm text-muted mb-4 pl-10">
            Ziehe den folgenden Link in deine Browser-Lesezeichenleiste (oder rechtsklick → Lesezeichen hinzufügen):
          </p>
          <div className="pl-10">
            <a
              href={bookmarkletCode}
              className="inline-flex items-center gap-2 border border-gold/50 bg-gold/10 px-4 py-2 font-sans text-sm text-gold hover:bg-gold/20 transition-colors cursor-grab active:cursor-grabbing"
              onClick={(e) => e.preventDefault()}
              draggable
            >
              <BookmarkIcon className="h-4 w-4" />
              Encar → Norvyn
            </a>
            <p className="mt-2 font-sans text-xs text-muted">
              ↑ Diesen Link in die Lesezeichenleiste ziehen
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center border border-gold/40 bg-gold/10 font-sans text-sm font-medium text-gold">
              2
            </span>
            <h2 className="font-sans text-base font-medium text-foreground">
              Encar-Seite öffnen
            </h2>
          </div>
          <p className="font-sans text-sm text-muted pl-10">
            Gehe auf <span className="text-foreground">fem.encar.com</span> und öffne die Detailseite des Fahrzeugs,
            das du importieren möchtest (z.&nbsp;B.{' '}
            <code className="text-xs bg-surface-elevated px-1 py-0.5">
              fem.encar.com/cars/detail/42046286
            </code>
            ).
          </p>
        </div>

        {/* Step 3 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center border border-gold/40 bg-gold/10 font-sans text-sm font-medium text-gold">
              3
            </span>
            <h2 className="font-sans text-base font-medium text-foreground">
              Bookmarklet klicken
            </h2>
          </div>
          <p className="font-sans text-sm text-muted pl-10">
            Klicke auf das Lesezeichen <strong className="text-foreground">Encar → Norvyn</strong> in deiner
            Lesezeichenleiste. Ein neues Tab mit dem Import-Formular öffnet sich — alle verfügbaren Daten werden
            automatisch eingetragen.
          </p>
        </div>

        {/* Step 4 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center border border-gold/40 bg-gold/10 font-sans text-sm font-medium text-gold">
              4
            </span>
            <h2 className="font-sans text-base font-medium text-foreground">
              Formular prüfen &amp; speichern
            </h2>
          </div>
          <p className="font-sans text-sm text-muted pl-10">
            Überprüfe die vorausgefüllten Daten, ergänze Preis und Beschreibung nach Bedarf, und klicke auf
            <strong className="text-foreground"> Fahrzeug speichern</strong>. Anschließend kannst du Fotos hochladen.
          </p>
        </div>

        <div className="border border-border bg-surface-elevated p-4">
          <p className="font-sans text-xs text-muted">
            <strong className="text-foreground">Hinweis:</strong> Das Bookmarklet liest die Daten direkt aus der
            Encar-Seite in deinem Browser aus — es werden keine Daten an externe Server übertragen.
            Falls ein Fahrzeug keine Daten liefert, fülle das Formular bitte manuell aus.
          </p>
        </div>
      </div>
    </div>
  )
}
