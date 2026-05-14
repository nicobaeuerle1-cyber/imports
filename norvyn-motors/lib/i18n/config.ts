import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/fahrzeuge': {
      de: '/fahrzeuge',
      en: '/vehicles',
    },
    '/fahrzeuge/[slug]': {
      de: '/fahrzeuge/[slug]',
      en: '/vehicles/[slug]',
    },
    '/ueber-uns': {
      de: '/ueber-uns',
      en: '/about',
    },
    '/kontakt': {
      de: '/kontakt',
      en: '/contact',
    },
    '/impressum': {
      de: '/impressum',
      en: '/legal-notice',
    },
    '/datenschutz': {
      de: '/datenschutz',
      en: '/privacy-policy',
    },
  },
})

export type Locale = (typeof routing.locales)[number]
export type Pathnames = keyof typeof routing.pathnames
