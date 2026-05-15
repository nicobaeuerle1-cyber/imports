import { Link } from '@/lib/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatMileage, formatPower } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { VehicleWithImages } from '@/types/vehicle'
import { ArrowUpRight, Zap, Fuel, Gauge } from 'lucide-react'

interface VehicleCardProps {
  vehicle: VehicleWithImages
  locale: string
}

const categoryGradient: Record<string, string> = {
  luxury: 'from-[#1c1408] to-background',
  performance: 'from-[#08140a] to-background',
  german_from_korea: 'from-[#080c1a] to-background',
}

const statusConfig: Record<string, { label: string; className: string }> = {
  available: { label: 'Verfügbar', className: 'text-status-available border-status-available/30 bg-status-available/10' },
  reserved: { label: 'Reserviert', className: 'text-status-reserved border-status-reserved/30 bg-status-reserved/10' },
  sold: { label: 'Verkauft', className: 'text-status-sold border-status-sold/30 bg-status-sold/10' },
  draft: { label: 'Entwurf', className: 'text-status-draft border-status-draft/30 bg-status-draft/10' },
}

const fuelIcon = (fuel: string | null) => {
  if (fuel === 'electric') return <Zap className="h-3 w-3" />
  return <Fuel className="h-3 w-3" />
}

export function VehicleCard({ vehicle, locale }: VehicleCardProps) {
  const status = statusConfig[vehicle.status] ?? statusConfig.available
  const gradient = categoryGradient[vehicle.category] ?? 'from-surface to-background'
  const isSold = vehicle.status === 'sold'

  const href = `/fahrzeuge/${vehicle.slug}` as `/fahrzeuge/${string}`

  return (
    <Link
      href={href as '/fahrzeuge/[slug]'}
      className={cn(
        'group relative flex flex-col bg-background border border-border',
        'transition-colors duration-300 hover:border-subtle',
        isSold && 'opacity-60 pointer-events-none',
      )}
    >
      {/* Image / Placeholder */}
      <div className={cn('relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br', gradient)}>
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center select-none"
        >
          <span className="font-display text-[6rem] font-normal leading-none text-white/[0.04]">
            NM
          </span>
        </div>

        {/* Make + Model overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
          <p className="font-display text-xl text-white leading-tight">
            {vehicle.make} {vehicle.model}
          </p>
        </div>

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span
            className={cn(
              'inline-block rounded-sm border px-2 py-0.5 font-sans text-2xs font-medium tracking-wide uppercase',
              status.className,
            )}
          >
            {status.label}
          </span>
        </div>

        {/* Import ready badge */}
        {vehicle.import_ready && (
          <div className="absolute top-4 left-4">
            <span className="inline-block rounded-sm border border-gold/30 bg-gold/10 px-2 py-0.5 font-sans text-2xs font-medium tracking-wide text-gold uppercase">
              Importbereit
            </span>
          </div>
        )}

        {/* Arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <ArrowUpRight className="h-5 w-5 text-gold" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Year + Trim */}
        <div className="mb-3 flex items-center gap-2">
          <span className="font-sans text-xs text-muted">{vehicle.year}</span>
          {vehicle.trim && (
            <>
              <span className="text-subtle">·</span>
              <span className="font-sans text-xs text-muted truncate">{vehicle.trim}</span>
            </>
          )}
        </div>

        {/* Specs row */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {vehicle.mileage_km != null && (
            <div className="flex items-center gap-1.5 text-muted">
              <Gauge className="h-3 w-3" />
              <span className="font-sans text-xs">{formatMileage(vehicle.mileage_km, locale === 'en' ? 'en-DE' : 'de-DE')}</span>
            </div>
          )}
          {vehicle.fuel_type && (
            <div className="flex items-center gap-1.5 text-muted">
              {fuelIcon(vehicle.fuel_type)}
              <span className="font-sans text-xs capitalize">{vehicle.fuel_type === 'electric' ? 'Elektro' : vehicle.fuel_type === 'petrol' ? 'Benzin' : vehicle.fuel_type === 'diesel' ? 'Diesel' : 'Hybrid'}</span>
            </div>
          )}
          {vehicle.power_kw != null && (
            <div className="flex items-center gap-1.5 text-muted">
              <span className="font-sans text-xs">{formatPower(vehicle.power_kw)}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mb-5 h-px bg-border" />

        {/* Price + Stock ID */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            {vehicle.price_visible && vehicle.price_eur != null ? (
              <p className="font-display text-2xl text-foreground">
                {formatPrice(vehicle.price_eur, locale === 'en' ? 'en-DE' : 'de-DE')}
              </p>
            ) : (
              <p className="font-sans text-sm text-muted italic">Preis auf Anfrage</p>
            )}
          </div>
          <p className="font-sans text-2xs text-subtle">{vehicle.stock_id}</p>
        </div>
      </div>

      {/* Bottom gold line on hover */}
      <div className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
    </Link>
  )
}
