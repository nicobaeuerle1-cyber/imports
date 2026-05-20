import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return generatePageMetadata({
    title: t('page_title'),
    description: t('page_description'),
    path: '/ueber-uns',
    locale,
  })
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('about')
  const vehiclesPath = locale === 'de' ? '/fahrzeuge' : '/vehicles'

  const reasons = [
    { title: t('reason_1_title'), desc: t('reason_1_desc') },
    { title: t('reason_2_title'), desc: t('reason_2_desc') },
    { title: t('reason_3_title'), desc: t('reason_3_desc') },
  ]

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-background px-6 py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[500px] w-[700px] rounded-full bg-gold/[0.04] blur-[120px]" />
        </div>
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-8 animate-fade-in">{t('hero_eyebrow')}</p>
          <h1 className="font-display text-5xl font-normal leading-none tracking-tight text-foreground sm:text-7xl animate-fade-up">
            {t('hero_title')}
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-relaxed text-muted sm:text-lg animate-fade-up [animation-delay:100ms]">
            {t('hero_subtitle')}
          </p>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────── */}
      <section className="border-t border-border bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="eyebrow mb-3">{t('team_eyebrow')}</p>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">
              {t('team_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
            {/* Team photo */}
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated lg:aspect-auto lg:min-h-[500px]">
              <Image
                src="/images/IMG_2466.png"
                alt="Khodyda Hassan und Nico Bäuerle — Norvyn Motors"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Bios */}
            <div className="flex flex-col justify-center gap-10 border-l border-border bg-surface p-10 lg:p-16">
              {/* Khodyda */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-px w-6 bg-gold" />
                  <span className="font-sans text-2xs font-medium tracking-widest text-gold uppercase">
                    {t('khodyda_role')}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-foreground">
                  {t('khodyda_name')}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-muted">
                  {t('khodyda_bio')}
                </p>
              </div>

              <div className="h-px bg-border" />

              {/* Nico */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-px w-6 bg-gold" />
                  <span className="font-sans text-2xs font-medium tracking-widest text-gold uppercase">
                    {t('nico_role')}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-foreground">
                  {t('nico_name')}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-muted">
                  {t('nico_bio')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission quote ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-border py-24 lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[300px] w-[600px] rounded-full bg-gold/[0.03] blur-[80px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="eyebrow mb-8">{t('mission_eyebrow')}</p>
          <blockquote className="font-display text-3xl leading-snug text-foreground sm:text-4xl lg:text-5xl">
            &ldquo;{t('mission_quote')}&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ── Why Asian cars ────────────────────────────────────── */}
      <section className="border-t border-border bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow mb-3">{t('why_eyebrow')}</p>
              <h2 className="font-display text-4xl text-foreground sm:text-5xl">
                {t('why_title')}
              </h2>
            </div>
            <p className="font-sans text-base leading-relaxed text-muted lg:text-lg">
              {t('why_text')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="flex flex-col gap-4 bg-background p-8"
              >
                <CheckCircle className="h-5 w-5 text-gold" strokeWidth={1.5} />
                <h3 className="font-sans text-base font-medium text-foreground">
                  {reason.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-muted">
                  {reason.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-border py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl text-foreground sm:text-5xl">
            {t('cta_title')}
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-sans text-base text-muted">
            {t('cta_subtitle')}
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href={vehiclesPath as '/fahrzeuge'}>
                {t('cta_vehicles')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/kontakt">{t('cta_contact')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
