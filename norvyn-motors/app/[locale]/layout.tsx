import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { routing } from '@/lib/i18n/config'
import { siteConfig } from '@/lib/seo/site-config'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsAppFloat } from '@/components/whatsapp/whatsapp-float'
import { CookieBanner } from '@/components/ui/cookie-banner'
import { ClarityLoader } from '@/components/analytics/clarity-loader'
import '@/app/globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description:
      locale === 'de'
        ? 'Premium Fahrzeugimport aus Asien nach Deutschland.'
        : 'Premium vehicle import from Asia to Germany.',
    openGraph: {
      siteName: siteConfig.name,
      locale,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'de' | 'en')) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${GeistSans.variable}`}
    >
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat locale={locale as 'de' | 'en'} />
          <CookieBanner />
        </NextIntlClientProvider>
        <Analytics />
        <ClarityLoader />
      </body>
    </html>
  )
}
