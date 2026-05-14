import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { siteConfig } from '@/lib/seo/site-config'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  const year = new Date().getFullYear()

  const vehiclesPath = locale === 'de' ? '/fahrzeuge' : '/vehicles'
  const aboutPath = locale === 'de' ? '/ueber-uns' : '/about'

  const navLinks = [
    { href: vehiclesPath as '/fahrzeuge', label: 'Fahrzeuge' },
    { href: aboutPath as '/ueber-uns', label: 'Über uns' },
    { href: '/kontakt' as '/kontakt', label: 'Kontakt' },
  ]

  const legalLinks = [
    { href: '/impressum' as '/impressum', label: t('impressum') },
    { href: '/datenschutz' as '/datenschutz', label: t('datenschutz') },
  ]

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-display text-2xl tracking-wider text-foreground">
              NORVYN
            </span>
            <p className="font-sans text-sm leading-relaxed text-muted">
              {t('tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-subtle">
              {t('nav_title')}
            </p>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-subtle">
              {t('legal_title')}
            </p>
            <nav className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="font-sans text-xs text-subtle">
            {t('copyright', { year })}
          </p>
          <p className="font-sans text-xs text-subtle">
            {siteConfig.name} · {siteConfig.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
