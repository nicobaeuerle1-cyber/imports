'use client'

import { useTranslations } from 'next-intl'
import { buildGeneralWhatsAppUrl } from '@/lib/utils/whatsapp'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useState, useEffect } from 'react'

interface WhatsAppFloatProps {
  locale: 'de' | 'en'
}

export function WhatsAppFloat({ locale }: WhatsAppFloatProps) {
  const t = useTranslations('whatsapp')
  const [visible, setVisible] = useState(false)
  const url = buildGeneralWhatsAppUrl(locale)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('aria_label')}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-sm',
        'bg-[#25D366] px-4 py-3 text-white shadow-lg shadow-black/40',
        'transition-all duration-500 ease-luxury hover:bg-[#1ebe5d] hover:shadow-xl hover:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0 pointer-events-none',
      )}
    >
      <MessageCircle className="h-5 w-5 flex-shrink-0" fill="currentColor" strokeWidth={0} />
      <span className="font-sans text-sm font-medium">{t('label')}</span>
    </a>
  )
}
