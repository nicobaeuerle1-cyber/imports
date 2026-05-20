'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { VehicleImage } from '@/types/vehicle'

interface ImageGalleryProps {
  images: VehicleImage[]
  vehicleName: string
}

export function ImageGallery({ images, vehicleName }: ImageGalleryProps) {
  const [active, setActive] = useState(0)

  if (!images.length) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center bg-surface">
        <span className="font-sans text-xs text-subtle uppercase tracking-widest">
          No images available
        </span>
      </div>
    )
  }

  function prev() {
    setActive((i) => (i === 0 ? images.length - 1 : i - 1))
  }

  function next() {
    setActive((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="group relative aspect-[16/9] overflow-hidden bg-surface">
        <Image
          key={images[active].id}
          src={images[active].url}
          alt={images[active].alt_text ?? vehicleName}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-background/80 text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-background/80 text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1 transition-all ${i === active ? 'w-6 bg-gold' : 'w-1.5 bg-white/40'}`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden border transition-colors ${
                i === active ? 'border-gold' : 'border-border hover:border-subtle'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt_text ?? `${vehicleName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
