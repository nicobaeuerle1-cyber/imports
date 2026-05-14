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
    title: locale === 'de' ? 'Impressum' : 'Legal Notice',
    description: `Impressum von ${siteConfig.name}`,
    path: '/impressum',
    locale,
    noIndex: true,
  })
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <h1 className="font-display text-4xl text-foreground mb-12">Impressum</h1>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 font-sans text-muted">
        <section>
          <h2 className="font-sans text-sm font-medium uppercase tracking-widest text-subtle mb-4">
            Angaben gemäß § 5 TMG
          </h2>
          <p>
            {siteConfig.company.name}
            {siteConfig.company.legalForm && ` ${siteConfig.company.legalForm}`}
          </p>
          {siteConfig.company.address && <p>{siteConfig.company.address}</p>}
          {siteConfig.company.city && <p>{siteConfig.company.city}</p>}
          <p>{siteConfig.company.country}</p>
        </section>

        <section>
          <h2 className="font-sans text-sm font-medium uppercase tracking-widest text-subtle mb-4">
            Kontakt
          </h2>
          {siteConfig.company.email && <p>E-Mail: {siteConfig.company.email}</p>}
          {siteConfig.company.phone && <p>Telefon: {siteConfig.company.phone}</p>}
        </section>

        {siteConfig.company.vatId && (
          <section>
            <h2 className="font-sans text-sm font-medium uppercase tracking-widest text-subtle mb-4">
              Umsatzsteuer-ID
            </h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
              {siteConfig.company.vatId}
            </p>
          </section>
        )}

        <section>
          <h2 className="font-sans text-sm font-medium uppercase tracking-widest text-subtle mb-4">
            Haftung für Inhalte
          </h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen.
          </p>
        </section>
      </div>
    </div>
  )
}
