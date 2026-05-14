import type { InquiryInsert } from '@/types/inquiry'

export async function createInquiry(
  supabase: ReturnType<typeof import('@supabase/ssr').createBrowserClient>,
  data: InquiryInsert,
) {
  const { error } = await supabase.from('inquiries').insert(data)
  if (error) throw new Error(`Failed to submit inquiry: ${error.message}`)
}
