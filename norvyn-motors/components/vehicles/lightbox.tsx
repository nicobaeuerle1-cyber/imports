'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface LightboxProps {
  images: { url: string; alt_text?: string | null }[]
  active: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function Lightbox({ images, active, onClose, onPrev, onNext }: LightboxProps) {
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center border border-border bg-surface text-muted hover:text-foreground transition-colors z-10"
        aria-label="Schließen"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <p className="absolute top-4 left-1/2 -translate-x-1/2 font-sans text-xs text-muted">
          {active + 1} / {images.length}
        </p>
      )}

      {/* Image */}
      <div
        className="relative mx-16 w-full max-h-[85vh]"
        style={{ aspectRatio: '16/9' }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return
          const delta = touchStartX.current - e.changedTouches[0].clientX
          if (delta > 50) onNext()
          else if (delta < -50) onPrev()
          touchStartX.current = null
        }}
      >
        <Image
          src={images[active].url}
          alt={images[active].alt_text ?? ''}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-3 flex h-10 w-10 items-center justify-center border border-border bg-surface text-muted hover:text-foreground transition-colors"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-3 flex h-10 w-10 items-center justify-center border border-border bg-surface text-muted hover:text-foreground transition-colors"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  )
}
