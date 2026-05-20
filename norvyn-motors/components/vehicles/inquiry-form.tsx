'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface InquiryFormProps {
  vehicleInfo: string
  whatsappUrl: string
  locale?: 'de' | 'en'
  translations: {
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    phone: string
    phonePlaceholder: string
    message: string
    messagePlaceholder: string
    submit: string
    submitting: string
    successTitle: string
    successMessage: string
    error: string
    whatsapp: string
  }
}

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

export function InquiryForm({
  vehicleInfo,
  whatsappUrl,
  translations: t,
}: InquiryFormProps) {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { message: vehicleInfo },
  })

  async function onSubmit(data: FormData) {
    setServerError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: vehicleInfo,
          message: data.message,
        }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
    } catch {
      setServerError(t.error)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center border border-gold/30 bg-gold/10">
          <CheckCircle className="h-6 w-6 text-gold" strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-2xl text-foreground">{t.successTitle}</h3>
        <p className="font-sans text-sm text-muted max-w-xs">{t.successMessage}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="inq-name"
          label={t.name}
          placeholder={t.namePlaceholder}
          error={errors.name?.message}
          {...register('name', { required: true })}
        />
        <Input
          id="inq-email"
          type="email"
          label={t.email}
          placeholder={t.emailPlaceholder}
          error={errors.email?.message}
          {...register('email', { required: true })}
        />
      </div>

      <Input
        id="inq-phone"
        type="tel"
        label={t.phone}
        placeholder={t.phonePlaceholder}
        {...register('phone')}
      />

      <Textarea
        id="inq-message"
        label={t.message}
        placeholder={t.messagePlaceholder}
        className="min-h-[120px]"
        {...register('message')}
      />

      {serverError && (
        <p className="font-sans text-xs text-destructive">{serverError}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          size="lg"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? t.submitting : t.submit}
        </Button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-1 items-center justify-center gap-2 border border-border bg-background font-sans text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          {t.whatsapp}
        </a>
      </div>
    </form>
  )
}
