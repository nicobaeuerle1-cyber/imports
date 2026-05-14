import { z } from 'zod'

export const vehicleSchema = z.object({
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Nur Kleinbuchstaben, Zahlen und Bindestriche'),
  status: z.enum(['draft', 'available', 'reserved', 'sold']),
  category: z.enum(['performance', 'luxury', 'german_from_korea']),
  make: z.string().min(1, 'Pflichtfeld'),
  model: z.string().min(1, 'Pflichtfeld'),
  year: z
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear() + 1),
  trim: z.string().optional().nullable(),
  stock_id: z.string().min(1),
  mileage_km: z.number().int().min(0).optional().nullable(),
  price_eur: z.number().positive().optional().nullable(),
  price_visible: z.boolean().default(true),
  exterior_color: z.string().optional().nullable(),
  interior_color: z.string().optional().nullable(),
  fuel_type: z
    .enum(['petrol', 'diesel', 'hybrid', 'electric'])
    .optional()
    .nullable(),
  transmission: z.enum(['automatic', 'manual']).optional().nullable(),
  engine_cc: z.number().int().positive().optional().nullable(),
  power_kw: z.number().int().positive().optional().nullable(),
  features: z.array(z.string()).optional().nullable(),
  description_de: z.string().optional().nullable(),
  description_en: z.string().optional().nullable(),
  origin_country: z.string().default('KR'),
  import_ready: z.boolean().default(false),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  seo_title_de: z.string().optional().nullable(),
  seo_title_en: z.string().optional().nullable(),
  seo_description_de: z.string().max(160).optional().nullable(),
  seo_description_en: z.string().max(160).optional().nullable(),
})

export type VehicleFormData = z.infer<typeof vehicleSchema>
