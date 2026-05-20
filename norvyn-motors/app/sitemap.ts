import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo/site-config'
import { getAllVehicleSlugs } from '@/lib/supabase/queries/vehicles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url
  const slugs = await getAllVehicleSlugs().catch(() => [])
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/de`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: { de: `${base}/de`, en: `${base}/en` } },
    },
    {
      url: `${base}/de/fahrzeuge`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: { languages: { de: `${base}/de/fahrzeuge`, en: `${base}/en/vehicles` } },
    },
    {
      url: `${base}/de/ueber-uns`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: { languages: { de: `${base}/de/ueber-uns`, en: `${base}/en/about` } },
    },
    {
      url: `${base}/de/kontakt`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: { de: `${base}/de/kontakt`, en: `${base}/en/contact` } },
    },
  ]

  const vehiclePages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/de/fahrzeuge/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
    alternates: {
      languages: {
        de: `${base}/de/fahrzeuge/${slug}`,
        en: `${base}/en/vehicles/${slug}`,
      },
    },
  }))

  return [...staticPages, ...vehiclePages]
}
