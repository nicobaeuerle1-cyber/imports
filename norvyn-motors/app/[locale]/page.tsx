import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { buildGeneralWhatsAppUrl } from '@/lib/utils/whatsapp'
import { ArrowRight, CheckCircle } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return generatePageMetadata({
    title: t('home_title'),
    description: t('home_description'),
    locale,
  })
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const tVehicles = await getTranslations('vehicles')

  const whatsappUrl = buildGeneralWhatsAppUrl(locale as 'de' | 'en')
  const vehiclesPath = locale === 'de' ? '/fahrzeuge' : '/vehicles'

  const categories = [
    {
      key: 'performance',
      label: t('categories.performance.label'),
      description: t('categories.performance.description'),
      badge: tVehicles('categories.performance'),
    },
    {
      key: 'luxury',
      label: t('categories.luxury.label'),
      description: t('categories.luxury.description'),
      badge: tVehicles('categories.luxury'),
    },
    {
      key: 'german_from_korea',
      label: t('categories.german_from_korea.label'),
      description: t('categories.german_from_korea.description'),
      badge: tVehicles('categories.german_from_korea'),
    },
  ]

  const whyItems = [
    {
      title: t('why.curated_title'),
      desc: t('why.curated_desc'),
    },
    {
      title: t('why.transparent_title'),
      desc: t('why.transparent_desc'),
    },
    {
      title: t('why.fullservice_title'),
      desc: t('why.fullservice_desc'),
    },
  ]

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#080808] px-6">
        {/* Cinematic video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlays for depth */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-[#080808]/20" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#080808]/60 via-transparent to-[#080808]/60" />

        {/* Subtle gold ambient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[500px] w-[700px] rounded-full bg-gold/[0.04] blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="eyebrow mb-8 animate-fade-in">
            {t('hero.eyebrow')}
          </p>

          <h1 className="font-display text-5xl font-normal leading-none tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[9rem] animate-fade-up">
            {t('hero.title')}
          </h1>

          <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-relaxed text-white/60 sm:text-lg animate-fade-up [animation-delay:100ms]">
            {t('hero.subtitle')}
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-up [animation-delay:200ms]">
            <Button asChild size="lg">
              <Link href={vehiclesPath as '/fahrzeuge'}>
                {t('hero.cta_primary')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/kontakt">{t('hero.cta_secondary')}</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in [animation-delay:600ms]">
          <div className="h-10 w-px bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { value: t('stats.imports_value'), label: t('stats.imports') },
              { value: t('stats.tuv_value'), label: t('stats.tuv') },
              { value: t('stats.delivery_value'), label: t('stats.delivery') },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-8 text-center">
                <span className="font-display text-4xl text-foreground sm:text-5xl">
                  {value}
                </span>
                <span className="font-sans text-xs tracking-wide text-muted uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="mb-16 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3">{t('categories.eyebrow')}</p>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">
              {t('categories.title')}
            </h2>
          </div>
          <Button asChild variant="ghost">
            <Link href={vehiclesPath as '/fahrzeuge'}>
              {t('categories.browse')} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`${vehiclesPath}?category=${cat.key}` as '/fahrzeuge'}
              className="group relative flex flex-col justify-between bg-background p-8 transition-colors duration-300 hover:bg-surface"
            >
              <div>
                <span className="eyebrow mb-6 block">{cat.badge}</span>
                <h3 className="font-display text-2xl text-foreground sm:text-3xl">
                  {cat.label}
                </h3>
                <p className="mt-4 font-sans text-sm leading-relaxed text-muted">
                  {cat.description}
                </p>
              </div>
              <div className="mt-10 flex items-center gap-2 font-sans text-xs text-subtle transition-colors duration-300 group-hover:text-gold">
                {t('categories.browse')}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

              {/* Corner accent on hover */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why Norvyn ────────────────────────────────────────── */}
      <section className="border-t border-border bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <p className="eyebrow mb-3">{t('why.eyebrow')}</p>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">
              {t('why.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {whyItems.map((item) => (
              <div key={item.title} className="flex flex-col gap-4">
                <CheckCircle className="h-5 w-5 text-gold" strokeWidth={1.5} />
                <h3 className="font-sans text-base font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[400px] w-[800px] rounded-full bg-gold/[0.035] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl text-foreground sm:text-6xl">
            {t('cta_section.title')}
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-sans text-base text-muted">
            {t('cta_section.subtitle')}
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/kontakt">{t('cta_section.primary')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                {t('cta_section.secondary')}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
