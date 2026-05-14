import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo/site-config'
import { getAllVehicleSlugs } from '@/lib/supabase/queries/vehicles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url
  const slugs = await getAllVehicleSlugs().catch(() => [])

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/de`, lastModified: new Date(), alternates: { languages: { de: `${base}/de`, en: `${base}/en` } } },
    { url: `${base}/de/fahrzeuge`, lastModified: new Date(), alternates: { languages: { de: `${base}/de/fahrzeuge`, en: `${base}/en/vehicles` } } },
    { url: `${base}/de/ueber-uns`, lastModified: new Date(), alternates: { languages: { de: `${base}/de/ueber-uns`, en: `${base}/en/about` } } },
    { url: `${base}/de/kontakt`, lastModified: new Date(), alternates: { languages: { de: `${base}/de/kontakt`, en: `${base}/en/contact` } } },
  ]

  const vehiclePages: MetadataRoute.Sitemap = slugs.flatMap((slug) => [
    {
      url: `${base}/de/fahrzeuge/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          de: `${base}/de/fahrzeuge/${slug}`,
          en: `${base}/en/vehicles/${slug}`,
        },
      },
    },
  ])

  return [...staticPages, ...vehiclePages]
}
