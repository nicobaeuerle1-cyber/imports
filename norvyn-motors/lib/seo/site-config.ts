/**
 * Single source of truth for all site-wide SEO and brand configuration.
 * Update NEXT_PUBLIC_SITE_URL at launch — everything else derives from here.
 */
export const siteConfig = {
  name: 'Norvyn Motors',
  tagline: 'Premium Fahrzeugimport · Asien → Deutschland',
  taglineEn: 'Premium Vehicle Import · Asia → Germany',

  // Set via env at launch — safe default for local dev
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  // WhatsApp contact number — international format without +
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',

  defaultLocale: 'de' as const,

  ogImage: '/og-default.jpg',

  social: {
    instagram: '',
    // Extend with other platforms as needed
  },

  // Legal — required for German market
  company: {
    name: 'Norvyn Motors',
    legalForm: '',      // e.g. GmbH
    address: '',
    city: '',
    country: 'Deutschland',
    email: '',
    phone: '',
    hrNumber: '',       // Handelsregisternummer
    vatId: '',          // Umsatzsteuer-ID
  },
} as const

export type SiteConfig = typeof siteConfig
