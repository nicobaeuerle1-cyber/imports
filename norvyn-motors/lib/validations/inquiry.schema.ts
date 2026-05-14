import { z } from 'zod'

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().optional().nullable(),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben'),
  vehicle_id: z.string().uuid().optional().nullable(),
  stock_id: z.string().optional().nullable(),
  locale: z.enum(['de', 'en']).default('de'),
  source: z.enum(['website', 'whatsapp', 'phone']).default('website'),
})

export type InquiryFormData = z.infer<typeof inquirySchema>
