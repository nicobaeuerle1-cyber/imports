'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const vehiclesPath = locale === 'de' ? '/fahrzeuge' : '/vehicles'
  const aboutPath = locale === 'de' ? '/ueber-uns' : '/about'
  const contactPath = '/kontakt'
  const isHomePage = pathname === `/${locale}` || pathname === '/'

  const navLinks = [
    { href: vehiclesPath, label: t('vehicles') },
    { href: aboutPath, label: t('about') },
    { href: contactPath, label: t('contact') },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-border bg-background/95 backdrop-blur-sm'
            : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-normal tracking-wider text-foreground transition-opacity hover:opacity-80"
          >
            NORVYN
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as '/fahrzeuge'}
                className="font-sans text-sm text-muted transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            {!isHomePage && (
              <Button asChild variant="outline" size="sm">
                <Link href={contactPath}>{t('cta')}</Link>
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-foreground md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t('menu_close') : t('menu_open')}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col bg-background transition-all duration-300 ease-luxury md:hidden',
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <span className="font-display text-xl tracking-wider text-foreground">
            NORVYN
          </span>
          <button
            className="flex h-10 w-10 items-center justify-center text-muted"
            onClick={() => setMenuOpen(false)}
            aria-label={t('menu_close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href as '/fahrzeuge'}
              className={cn(
                'border-b border-border py-5 font-display text-3xl text-foreground transition-all duration-300',
                menuOpen
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-4 opacity-0',
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {!isHomePage && (
          <div className="px-6 pb-12">
            <Button asChild className="w-full" size="lg">
              <Link href={contactPath}>{t('cta')}</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
