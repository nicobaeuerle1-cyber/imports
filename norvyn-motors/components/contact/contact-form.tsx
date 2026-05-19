'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CheckCircle, MessageCircle } from 'lucide-react'

interface ContactFormProps {
  locale?: 'de' | 'en'
  whatsappUrl: string
}

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const subjects = {
  de: [
    'Fahrzeuganfrage (Bestand)',
    'Wunschauto bestellen',
    'Allgemeine Frage',
    'Preisanfrage',
    'Sonstiges',
  ],
  en: [
    'Vehicle inquiry (stock)',
    'Order a custom car',
    'General question',
    'Price inquiry',
    'Other',
  ],
}

export function ContactForm({ locale = 'de', whatsappUrl }: ContactFormProps) {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  async function onSubmit(data: FormData) {
    setServerError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
    } catch {
      setServerError(
        locale === 'de'
          ? 'Fehler beim Senden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt per WhatsApp.'
          : 'Error sending message. Please try again or contact us via WhatsApp.'
      )
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <CheckCircle className="h-7 w-7 text-gold" strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-3xl text-foreground">
          {locale === 'de' ? 'Nachricht erhalten' : 'Message received'}
        </h3>
        <p className="font-sans text-sm text-muted max-w-sm">
          {locale === 'de'
            ? 'Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen.'
            : 'Thank you! We will get back to you within 24 hours.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          id="name"
          label={locale === 'de' ? 'Name *' : 'Name *'}
          placeholder={locale === 'de' ? 'Ihr vollständiger Name' : 'Your full name'}
          error={errors.name?.message}
          {...register('name', { required: locale === 'de' ? 'Pflichtfeld' : 'Required' })}
        />
        <Input
          id="email"
          type="email"
          label={locale === 'de' ? 'E-Mail *' : 'Email *'}
          placeholder={locale === 'de' ? 'ihre@email.de' : 'your@email.com'}
          error={errors.email?.message}
          {...register('email', { required: locale === 'de' ? 'Pflichtfeld' : 'Required' })}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          id="phone"
          type="tel"
          label={locale === 'de' ? 'Telefon (optional)' : 'Phone (optional)'}
          placeholder="+49 XXX XXXXXXXX"
          {...register('phone')}
        />
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-medium tracking-wide text-muted uppercase">
            {locale === 'de' ? 'Betreff' : 'Subject'}
          </label>
          <select
            className="h-10 w-full border border-border bg-surface px-3 font-sans text-sm text-foreground focus:border-gold focus:outline-none"
            {...register('subject')}
          >
            <option value="">{locale === 'de' ? 'Bitte wählen…' : 'Please select…'}</option>
            {subjects[locale].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <Textarea
        id="message"
        label={locale === 'de' ? 'Nachricht *' : 'Message *'}
        placeholder={
          locale === 'de'
            ? 'Wie können wir Ihnen helfen? Bei Fahrzeuganfragen: Marke, Modell, Baujahr, Budget…'
            : 'How can we help? For vehicle inquiries: make, model, year, budget…'
        }
        className="min-h-[160px]"
        error={errors.message?.message}
        {...register('message', { required: locale === 'de' ? 'Pflichtfeld' : 'Required' })}
      />

      {serverError && (
        <p className="font-sans text-xs text-status-reserved">{serverError}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
          {isSubmitting
            ? locale === 'de' ? 'Wird gesendet…' : 'Sending…'
            : locale === 'de' ? 'Nachricht senden' : 'Send message'}
        </Button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-1 items-center justify-center gap-2 border border-border bg-background font-sans text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>

      <p className="text-center font-sans text-xs text-subtle">
        {locale === 'de'
          ? 'Ihre Daten werden vertraulich behandelt und nicht weitergegeben.'
          : 'Your data is kept confidential and not shared with third parties.'}
      </p>
    </form>
  )
}
