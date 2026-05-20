import { Suspense } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { getAvailableVehicles } from '@/lib/supabase/queries/vehicles'
import { INVENTORY_PAGE_SIZE } from '@/lib/constants'
import { VehicleCard } from '@/components/vehicles/vehicle-card'
import { VehicleFilters } from '@/components/vehicles/vehicle-filters'
import { VehicleCardSkeleton } from '@/components/ui/skeleton'
import { Link } from '@/lib/i18n/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    category?: string
    fuelType?: string
    sort?: string
    page?: string
    search?: string
  }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'vehicles' })

  return generatePageMetadata({
    title: t('page_title'),
    description: t('page_description'),
    path: '/fahrzeuge',
    locale,
  })
}

export default async function VehiclesPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { category, fuelType, sort, page: pageStr, search } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations('vehicles')

  const page = Math.max(1, parseInt(pageStr ?? '1', 10))
  const validSort =
    sort === 'price_asc' || sort === 'price_desc' ? sort : 'newest'

  const { vehicles, total } = await getAvailableVehicles({
    category,
    fuelType,
    sort: validSort,
    page,
    search,
  })

  const totalPages = Math.ceil(total / INVENTORY_PAGE_SIZE)

  const filterTranslations = {
    allCategories: t('filters.all_categories'),
    allFuel: t('filters.all_fuel'),
    sortNewest: t('filters.sort_newest'),
    sortPriceAsc: t('filters.sort_price_asc'),
    sortPriceDesc: t('filters.sort_price_desc'),
    reset: t('filters.reset'),
    searchPlaceholder: t('filters.search_placeholder'),
    categories: {
      performance: t('categories.performance'),
      luxury: t('categories.luxury'),
      german_from_korea: t('categories.german_from_korea'),
    },
    fuel: {
      petrol: t('fuel.petrol'),
      diesel: t('fuel.diesel'),
      hybrid: t('fuel.hybrid'),
      electric: t('fuel.electric'),
    },
  }

  const statusLabels: Record<string, string> = {
    available: t('status.available'),
    reserved: t('status.reserved'),
    sold: t('status.sold'),
    draft: t('status.draft'),
  }

  const categoryLabels: Record<string, string> = {
    performance: t('categories.performance'),
    luxury: t('categories.luxury'),
    german_from_korea: t('categories.german_from_korea'),
  }

  function buildPageHref(p: number) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (fuelType) params.set('fuelType', fuelType)
    if (sort) params.set('sort', sort)
    if (search) params.set('search', search)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/fahrzeuge?${qs}` : '/fahrzeuge'
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
      {/* Header */}
      <div className="mb-12">
        <p className="eyebrow mb-3">{t('page_title')}</p>
        <h1 className="font-display text-4xl text-foreground sm:text-5xl">
          {t('page_description')}
        </h1>
      </div>

      {/* Filters */}
      <div className="mb-10 flex items-center justify-between gap-4 border-b border-border pb-6">
        <Suspense
          fallback={
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-36 bg-surface-elevated animate-pulse" />
              ))}
            </div>
          }
        >
          <VehicleFilters
            translations={filterTranslations}
            currentCategory={category}
            currentFuel={fuelType}
            currentSort={sort}
            currentSearch={search}
          />
        </Suspense>
        <p className="hidden font-sans text-xs text-subtle sm:block">
          {total} {total === 1 ? 'Fahrzeug' : 'Fahrzeuge'}
        </p>
      </div>

      {/* Grid */}
      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-32 text-center">
          <p className="font-display text-2xl text-foreground">{t('no_results')}</p>
          <p className="font-sans text-sm text-muted">{t('no_results_hint')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              priceOnRequest={t('price_on_request')}
              statusLabels={statusLabels}
              categoryLabels={categoryLabels}
              locale={locale}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildPageHref(page - 1) as '/fahrzeuge'}
              className="flex h-10 w-10 items-center justify-center border border-border text-muted transition-colors hover:border-subtle hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildPageHref(p) as '/fahrzeuge'}
              className={`flex h-10 w-10 items-center justify-center border font-sans text-sm transition-colors ${
                p === page
                  ? 'border-gold text-gold'
                  : 'border-border text-muted hover:border-subtle hover:text-foreground'
              }`}
            >
              {p}
            </Link>
          ))}

          {page < totalPages && (
            <Link
              href={buildPageHref(page + 1) as '/fahrzeuge'}
              className="flex h-10 w-10 items-center justify-center border border-border text-muted transition-colors hover:border-subtle hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
