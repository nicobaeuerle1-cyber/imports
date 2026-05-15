'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inquirySchema, type InquiryFormData } from '@/lib/validations/inquiry.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

interface InquiryFormProps {
  vehicleId?: string
  stockId?: string
  vehicleLabel?: string
  locale?: 'de' | 'en'
}

export function InquiryForm({
  vehicleId,
  stockId,
  vehicleLabel,
  locale = 'de',
}: InquiryFormProps) {
  const [success, setSuccess] = useState(false)

  const defaultMessage =
    locale === 'de'
      ? vehicleLabel
        ? `Hallo, ich interessiere mich für das Fahrzeug: ${vehicleLabel}.\n\nBitte kontaktieren Sie mich mit weiteren Informationen.`
        : 'Hallo, ich interessiere mich für Ihr Fahrzeugangebot.\n\nBitte kontaktieren Sie mich.'
      : vehicleLabel
        ? `Hello, I am interested in: ${vehicleLabel}.\n\nPlease contact me with more information.`
        : 'Hello, I am interested in your vehicle inventory.\n\nPlease get in touch.'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      vehicle_id: vehicleId ?? null,
      stock_id: stockId ?? null,
      locale,
      source: 'website',
      message: defaultMessage,
    },
  })

  async function onSubmit(_data: InquiryFormData) {
    // Simulated submission — backend not connected yet
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <CheckCircle className="h-6 w-6 text-gold" strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-2xl text-foreground">
          {locale === 'de' ? 'Anfrage erhalten' : 'Inquiry received'}
        </h3>
        <p className="font-sans text-sm text-muted max-w-xs">
          {locale === 'de'
            ? 'Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen.'
            : 'Thank you! We will get back to you within 24 hours.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        id="name"
        label={locale === 'de' ? 'Name' : 'Name'}
        placeholder={locale === 'de' ? 'Ihr vollständiger Name' : 'Your full name'}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        id="email"
        type="email"
        label={locale === 'de' ? 'E-Mail' : 'Email'}
        placeholder={locale === 'de' ? 'ihre@email.de' : 'your@email.com'}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="phone"
        type="tel"
        label={locale === 'de' ? 'Telefon (optional)' : 'Phone (optional)'}
        placeholder="+49 XXX XXXXXXXX"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Textarea
        id="message"
        label={locale === 'de' ? 'Nachricht' : 'Message'}
        placeholder={locale === 'de' ? 'Ihre Fragen oder Anmerkungen...' : 'Your questions or comments...'}
        className="min-h-[140px]"
        error={errors.message?.message}
        {...register('message')}
      />

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? locale === 'de'
            ? 'Wird gesendet…'
            : 'Sending…'
          : locale === 'de'
            ? 'Anfrage senden'
            : 'Send inquiry'}
      </Button>

      <p className="text-center font-sans text-xs text-subtle">
        {locale === 'de'
          ? 'Ihre Daten werden vertraulich behandelt. Keine Weitergabe an Dritte.'
          : 'Your data is treated confidentially. Not shared with third parties.'}
      </p>
    </form>
  )
}
