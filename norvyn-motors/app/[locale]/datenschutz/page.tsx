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

      <div className="space-y-8 font-sans text-sm leading-relaxed text-muted">
        <section>
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-subtle mb-4">
            1. Datenschutz auf einen Blick
          </h2>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was
            mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
            besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
            persönlich identifiziert werden können.
          </p>
        </section>

        <section>
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-subtle mb-4">
            2. Verantwortliche Stelle
          </h2>
          <p>
            {siteConfig.company.name}
            {siteConfig.company.address && <>, {siteConfig.company.address}</>}
            {siteConfig.company.city && <>, {siteConfig.company.city}</>}
            {siteConfig.company.email && (
              <>, E-Mail: {siteConfig.company.email}</>
            )}
          </p>
        </section>

        <section>
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-subtle mb-4">
            3. Datenerfassung auf dieser Website
          </h2>
          <p>
            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden
            Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort
            angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den
            Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir
            nicht ohne Ihre Einwilligung weiter. Rechtsgrundlage: Art. 6 Abs. 1
            lit. b DSGVO.
          </p>
        </section>

        <section>
          <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-subtle mb-4">
            4. Ihre Rechte
          </h2>
          <p>
            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
            Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu
            erhalten. Sie haben außerdem ein Recht, die Berichtigung oder
            Löschung dieser Daten zu verlangen. Wenden Sie sich dazu an uns
            unter der oben genannten E-Mail-Adresse.
          </p>
        </section>
      </div>
    </div>
  )
}
