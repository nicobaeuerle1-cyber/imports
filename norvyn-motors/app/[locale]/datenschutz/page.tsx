import { setRequestLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { siteConfig } from '@/lib/seo/site-config'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return generatePageMetadata({
    title: locale === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy',
    description: `Datenschutzerklärung von ${siteConfig.name}`,
    path: '/datenschutz',
    locale,
    noIndex: true,
  })
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <h1 className="font-display text-4xl text-foreground mb-12">
        Datenschutzerklärung
      </h1>

      <div className="space-y-10 font-sans text-sm leading-relaxed text-muted">

        <section>
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-subtle mb-4">
            1. Verantwortliche Stelle
          </h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
            <span className="text-foreground">{siteConfig.company.name}</span>
            {siteConfig.company.address && <>, {siteConfig.company.address}</>}
            {siteConfig.company.city && <>, {siteConfig.company.city}</>}
            {siteConfig.company.email && <><br />E-Mail: {siteConfig.company.email}</>}
          </p>
        </section>

        <section>
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-subtle mb-4">
            2. Kontaktformular
          </h2>
          <p>
            Wenn Sie uns über das Kontaktformular kontaktieren, werden Ihre Angaben (Name, E-Mail-Adresse, Telefonnummer, Nachricht) zur Bearbeitung Ihrer Anfrage gespeichert. Diese Daten werden nicht ohne Ihre Einwilligung an Dritte weitergegeben. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden gelöscht, sobald sie für die Zweckerreichung nicht mehr erforderlich sind.
          </p>
        </section>

        <section>
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-subtle mb-4">
            3. Vercel Analytics
          </h2>
          <p>
            Diese Website nutzt Vercel Analytics, einen Analysedienst der Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, USA. Vercel Analytics erfasst anonymisierte Nutzungsdaten (aufgerufene Seiten, Herkunftsland, verwendeter Browser) ohne Cookies und ohne persönlich identifizierbare Informationen. Es werden keine IP-Adressen gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Websiteoptimierung). Weitere Informationen: <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-2">vercel.com/docs/analytics/privacy-policy</a>
          </p>
        </section>

        <section>
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-subtle mb-4">
            4. Microsoft Clarity
          </h2>
          <p>
            Mit Ihrer Einwilligung nutzen wir Microsoft Clarity, einen Analysedienst der Microsoft Corporation, One Microsoft Way, Redmond, WA 98052, USA. Clarity zeichnet anonymisierte Sitzungsaufzeichnungen auf und erstellt Heatmaps, um das Nutzerverhalten zu verstehen und die Website zu verbessern. Dabei können Mausbewegungen, Klicks und Scrollverhalten erfasst werden. Sensible Inhalte werden von Clarity automatisch maskiert.
          </p>
          <p className="mt-3">
            Clarity wird nur nach Ihrer ausdrücklichen Einwilligung (Cookie-Banner) aktiviert. Ihre Einwilligung können Sie jederzeit widerrufen, indem Sie Ihren Browser-Speicher löschen (localStorage: <code className="text-xs bg-surface px-1 py-0.5">cookie_consent</code>). Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO. Weitere Informationen: <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-2">privacy.microsoft.com</a>
          </p>
        </section>

        <section>
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-subtle mb-4">
            5. Hosting & Infrastruktur
          </h2>
          <p>
            Diese Website wird auf der Infrastruktur von Vercel Inc. gehostet. Beim Aufruf der Website werden automatisch technische Daten (IP-Adresse, Zeitpunkt, Browser) in Server-Logs erfasst. Diese Daten werden ausschließlich zur Sicherstellung des Betriebs genutzt und nach spätestens 7 Tagen gelöscht. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </section>

        <section>
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-subtle mb-4">
            6. Ihre Rechte
          </h2>
          <p>
            Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit Ihrer personenbezogenen Daten. Sie haben außerdem das Recht, eine erteilte Einwilligung jederzeit zu widerrufen sowie Beschwerde bei einer Datenschutzbehörde einzulegen (zuständig: Landesbeauftragte/r für Datenschutz in Ihrem Bundesland).
          </p>
          {siteConfig.company.email && (
            <p className="mt-3">
              Wenden Sie sich für Anfragen an: <a href={`mailto:${siteConfig.company.email}`} className="text-gold underline underline-offset-2">{siteConfig.company.email}</a>
            </p>
          )}
        </section>

      </div>
    </div>
  )
}
