'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { VEHICLE_CATEGORIES, FUEL_TYPES } from '@/lib/constants'
import { Search } from 'lucide-react'

interface VehicleFiltersProps {
  translations: {
    allCategories: string
    allFuel: string
    sortNewest: string
    sortPriceAsc: string
    sortPriceDesc: string
    reset: string
    searchPlaceholder: string
    categories: Record<string, string>
    fuel: Record<string, string>
  }
  currentCategory?: string
  currentFuel?: string
  currentSort?: string
  currentSearch?: string
}

export function VehicleFilters({
  translations: t,
  currentCategory,
  currentFuel,
  currentSort,
  currentSearch,
}: VehicleFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(currentSearch ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      }
      return params.toString()
    },
    [searchParams],
  )

  function setFilter(key: string, value: string | undefined) {
    const qs = createQueryString({ [key]: value, page: undefined })
    router.push(`${pathname}?${qs}`)
  }

  function handleSearchChange(value: string) {
    setSearchValue(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFilter('search', value || undefined)
    }, 350)
  }

  function resetFilters() {
    setSearchValue('')
    router.push(pathname)
  }

  const hasFilters = !!(currentCategory || currentFuel || currentSort || currentSearch)

  const selectClass =
    'h-10 border border-border bg-background px-3 font-sans text-sm text-foreground focus:border-gold focus:outline-none transition-colors'

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="h-10 w-48 border border-border bg-background pl-9 pr-3 font-sans text-sm text-foreground placeholder:text-subtle focus:border-gold focus:outline-none transition-colors sm:w-56"
        />
      </div>

      <select
        value={currentCategory ?? ''}
        onChange={(e) => setFilter('category', e.target.value || undefined)}
        className={selectClass}
      >
        <option value="">{t.allCategories}</option>
        {VEHICLE_CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {t.categories[cat.value] ?? cat.value}
          </option>
        ))}
      </select>

      <select
        value={currentFuel ?? ''}
        onChange={(e) => setFilter('fuelType', e.target.value || undefined)}
        className={selectClass}
      >
        <option value="">{t.allFuel}</option>
        {FUEL_TYPES.map((f) => (
          <option key={f.value} value={f.value}>
            {t.fuel[f.value] ?? f.value}
          </option>
        ))}
      </select>

      <select
        value={currentSort ?? ''}
        onChange={(e) => setFilter('sort', e.target.value || undefined)}
        className={selectClass}
      >
        <option value="">{t.sortNewest}</option>
        <option value="price_asc">{t.sortPriceAsc}</option>
        <option value="price_desc">{t.sortPriceDesc}</option>
      </select>

      {hasFilters && (
        <button
          onClick={resetFilters}
          className="font-sans text-xs text-muted underline-offset-2 hover:text-foreground hover:underline transition-colors"
        >
          {t.reset}
        </button>
      )}
    </div>
  )
}
