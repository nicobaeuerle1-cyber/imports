import { setRequestLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { ContactForm } from '@/components/contact/contact-form'
import { buildGeneralWhatsAppUrl } from '@/lib/utils/whatsapp'
import { MapPin, Clock, Mail, MessageCircle } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return generatePageMetadata({
    title: locale === 'de' ? 'Kontakt — Norvyn Motors' : 'Contact — Norvyn Motors',
    description:
      locale === 'de'
        ? 'Kontaktieren Sie uns per Formular oder WhatsApp. Wir antworten innerhalb von 24 Stunden.'
        : 'Contact us via form or WhatsApp. We respond within 24 hours.',
    locale,
  })
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const whatsappUrl = buildGeneralWhatsAppUrl(locale as 'de' | 'en')

  return (
    <>
      {/* Page header */}
      <section className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow mb-4">
            {locale === 'de' ? 'Schreiben Sie uns' : 'Get in touch'}
          </p>
          <h1 className="font-display text-5xl text-foreground sm:text-6xl">
            {locale === 'de' ? 'Kontakt' : 'Contact'}
          </h1>
          <p className="mt-4 font-sans text-sm text-muted max-w-xl">
            {locale === 'de'
              ? 'Fragen zum Bestand, Wunschauto-Anfragen oder allgemeine Informationen — wir sind für Sie da.'
              : 'Questions about stock, custom car orders or general info — we are here for you.'}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">

          {/* Form */}
          <div>
            <h2 className="mb-8 font-sans text-xs font-medium tracking-widest text-gold uppercase">
              {locale === 'de' ? 'Nachricht senden' : 'Send a message'}
            </h2>
            <ContactForm locale={locale as 'de' | 'en'} whatsappUrl={whatsappUrl} />
          </div>

          {/* Sidebar info */}
          <div className="flex flex-col gap-6">
            <div className="sticky top-24 flex flex-col gap-4">

              {/* WhatsApp highlight */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 border border-gold/30 bg-gold/5 p-5 transition-colors hover:bg-gold/10"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-gold/30 bg-gold/10">
                  <MessageCircle className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-foreground">WhatsApp</p>
                  <p className="font-sans text-xs text-muted">
                    {locale === 'de' ? 'Direkt & unkompliziert' : 'Direct & easy'}
                  </p>
                </div>
              </a>

              {/* Info cards */}
              <div className="border border-border bg-surface p-5">
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-subtle" />
                    <div>
                      <p className="font-sans text-xs font-medium text-foreground">
                        {locale === 'de' ? 'Antwortzeit' : 'Response time'}
                      </p>
                      <p className="mt-0.5 font-sans text-xs text-muted">
                        {locale === 'de' ? 'Innerhalb von 24 Stunden' : 'Within 24 hours'}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-subtle" />
                    <div>
                      <p className="font-sans text-xs font-medium text-foreground">
                        {locale === 'de' ? 'Import aus' : 'Importing from'}
                      </p>
                      <p className="mt-0.5 font-sans text-xs text-muted">
                        {locale === 'de' ? 'Asien → Deutschland' : 'Asia → Germany'}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-subtle" />
                    <div>
                      <p className="font-sans text-xs font-medium text-foreground">
                        {locale === 'de' ? 'Sprachen' : 'Languages'}
                      </p>
                      <p className="mt-0.5 font-sans text-xs text-muted">
                        Deutsch · English
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              <p className="font-sans text-xs text-subtle">
                {locale === 'de'
                  ? 'Für Wunschauto-Anfragen bitte Marke, Modell, Baujahr und Budget in der Nachricht angeben.'
                  : 'For custom car orders, please include make, model, year and budget in your message.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
