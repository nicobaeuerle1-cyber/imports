import Image from 'next/image'
import { Link } from '@/lib/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import type { BadgeVariant } from '@/components/ui/badge'
import { formatPrice, formatMileage } from '@/lib/utils/format'
import { getCoverImage, type VehicleWithImages } from '@/types/vehicle'

interface VehicleCardProps {
  vehicle: VehicleWithImages
  priceOnRequest: string
  statusLabels: Record<string, string>
  categoryLabels: Record<string, string>
  fuelLabels?: Record<string, string>
  transmissionLabels?: Record<string, string>
  locale: string
}

export function VehicleCard({
  vehicle,
  priceOnRequest,
  statusLabels,
  categoryLabels,
  fuelLabels,
  transmissionLabels,
  locale,
}: VehicleCardProps) {
  const coverImage = getCoverImage(vehicle)

  return (
    <Link
      href={{ pathname: '/fahrzeuge/[slug]', params: { slug: vehicle.slug } }}
      className="group relative flex flex-col bg-background border border-transparent hover:border-border transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt_text ?? `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-contain transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface">
            <span className="font-sans text-xs text-subtle uppercase tracking-widest">
              No image
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <Badge variant={vehicle.status as BadgeVariant}>
            {statusLabels[vehicle.status] ?? vehicle.status}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge variant={vehicle.category as BadgeVariant}>
            {categoryLabels[vehicle.category] ?? vehicle.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        <div>
          <p className="font-sans text-xs text-subtle uppercase tracking-widest">
            {vehicle.year} · {vehicle.stock_id}
          </p>
          <h3 className="mt-1.5 font-display text-xl text-foreground leading-tight">
            {vehicle.make} {vehicle.model}
            {vehicle.trim && (
              <span className="ml-1 text-muted">{vehicle.trim}</span>
            )}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-muted">
          {vehicle.mileage_km != null && (
            <span>
              {formatMileage(vehicle.mileage_km, locale === 'de' ? 'de-DE' : 'en-GB')}
            </span>
          )}
          {vehicle.fuel_type && (
            <>
              <span className="h-3 w-px bg-border" />
              <span>{fuelLabels?.[vehicle.fuel_type] ?? vehicle.fuel_type}</span>
            </>
          )}
          {vehicle.transmission && (
            <>
              <span className="h-3 w-px bg-border" />
              <span>{transmissionLabels?.[vehicle.transmission] ?? vehicle.transmission}</span>
            </>
          )}
        </div>

        <div className="border-t border-border pt-4">
          {vehicle.price_visible && vehicle.price_eur != null ? (
            <p className="font-display text-2xl text-foreground">
              {formatPrice(vehicle.price_eur, locale === 'de' ? 'de-DE' : 'en-GB')}
            </p>
          ) : (
            <p className="font-sans text-sm text-muted">{priceOnRequest}</p>
          )}
        </div>
      </div>

      <div className="h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
    </Link>
  )
}
