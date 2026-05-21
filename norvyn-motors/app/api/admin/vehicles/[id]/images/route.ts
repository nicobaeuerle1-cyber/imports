import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// POST — upload a new image
export async function POST(
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

  const { id: vehicleId } = await params
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const positionRaw = formData.get('position')
  const position = positionRaw != null ? parseInt(String(positionRaw), 10) : null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const storagePath = `${vehicleId}/${uniqueName}`

  const buffer = await file.arrayBuffer()

  const serviceClient = await createServiceClient()

  const { error: uploadError } = await serviceClient.storage
    .from('vehicle-images')
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const {
    data: { publicUrl },
  } = serviceClient.storage.from('vehicle-images').getPublicUrl(storagePath)

  // Determine next position if not provided
  let finalPosition = position
  if (finalPosition == null) {
    const { data: existing } = await serviceClient
      .from('vehicle_images')
      .select('position')
      .eq('vehicle_id', vehicleId)
      .order('position', { ascending: false })
      .limit(1)
    finalPosition = existing && existing.length > 0 ? (existing[0].position ?? 0) + 1 : 0
  }

  const { data: imageRow, error: insertError } = await serviceClient
    .from('vehicle_images')
    .insert({
      vehicle_id: vehicleId,
      url: publicUrl,
      storage_path: storagePath,
      position: finalPosition,
      alt_text: null,
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json(imageRow, { status: 201 })
}

// DELETE — delete an image
export async function DELETE(
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

  const { id: vehicleId } = await params
  const body = await request.json()
  const { imageId } = body as { imageId: string }

  if (!imageId) {
    return NextResponse.json({ error: 'imageId required' }, { status: 400 })
  }

  const serviceClient = await createServiceClient()

  // Fetch storage path
  const { data: img } = await serviceClient
    .from('vehicle_images')
    .select('storage_path')
    .eq('id', imageId)
    .eq('vehicle_id', vehicleId)
    .single()

  if (img?.storage_path) {
    await serviceClient.storage.from('vehicle-images').remove([img.storage_path])
  }

  const { error } = await serviceClient
    .from('vehicle_images')
    .delete()
    .eq('id', imageId)
    .eq('vehicle_id', vehicleId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
