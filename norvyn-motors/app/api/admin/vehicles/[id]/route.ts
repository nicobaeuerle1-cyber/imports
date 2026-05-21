import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// PUT — update vehicle fields
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  // Strip read-only / relational fields
  const {
    id: _id,
    created_at: _ca,
    updated_at: _ua,
    vehicle_images: _vi,
    ...updateData
  } = body

  const serviceClient = await createServiceClient()
  const { data, error } = await serviceClient
    .from('vehicles')
    .update(updateData)
    .eq('id', id)
    .select('id, slug')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, slug: data.slug })
}

// DELETE — delete vehicle and its images
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const serviceClient = await createServiceClient()

  // Delete images from storage first
  const { data: images } = await serviceClient
    .from('vehicle_images')
    .select('storage_path')
    .eq('vehicle_id', id)

  if (images && images.length > 0) {
    const paths = images.map((img) => img.storage_path).filter(Boolean)
    if (paths.length > 0) {
      await serviceClient.storage.from('vehicle-images').remove(paths)
    }
  }

  // Delete image rows
  await serviceClient.from('vehicle_images').delete().eq('vehicle_id', id)

  // Delete vehicle
  const { error } = await serviceClient.from('vehicles').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
