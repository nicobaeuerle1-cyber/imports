/**
 * Supabase database types.
 * Run `supabase gen types typescript` to regenerate after schema changes.
 * This file is hand-written until the Supabase CLI is wired up.
 */
export type Database = {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string
          slug: string
          status: string
          category: string
          make: string
          model: string
          year: number
          trim: string | null
          stock_id: string
          mileage_km: number | null
          price_eur: number | null
          price_visible: boolean
          exterior_color: string | null
          interior_color: string | null
          fuel_type: string | null
          transmission: string | null
          engine_cc: number | null
          power_kw: number | null
          features: string[] | null
          description_de: string | null
          description_en: string | null
          origin_country: string
          import_ready: boolean
          featured: boolean
          sort_order: number
          seo_title_de: string | null
          seo_title_en: string | null
          seo_description_de: string | null
          seo_description_en: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['vehicles']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['vehicles']['Insert']>
      }
      vehicle_images: {
        Row: {
          id: string
          vehicle_id: string
          url: string
          storage_path: string
          position: number
          alt_text: string | null
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['vehicle_images']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<Database['public']['Tables']['vehicle_images']['Insert']>
      }
      inquiries: {
        Row: {
          id: string
          vehicle_id: string | null
          stock_id: string | null
          name: string
          email: string
          phone: string | null
          message: string | null
          locale: string
          source: string
          status: string
          admin_notes: string | null
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['inquiries']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
      }
    }
  }
}
