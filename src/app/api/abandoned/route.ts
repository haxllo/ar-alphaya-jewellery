import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

interface AbandonedCartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ENABLE_ABANDONED_CART || process.env.ENABLE_ABANDONED_CART === 'false') {
      return NextResponse.json({ error: 'Abandoned cart disabled' }, { status: 503 })
    }
    const body = await req.json()
    const email = String(body?.email || '').trim().toLowerCase()
    const items = Array.isArray(body?.items) ? body.items as AbandonedCartItem[] : []

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (items.length === 0) {
      return NextResponse.json({ error: 'No items' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Find existing pending abandoned cart for this email
    const { data: existingCart } = await supabase
      .from('abandoned_carts')
      .select('id')
      .eq('email', email)
      .eq('status', 'pending')
      .single()

    if (existingCart) {
      // Update existing cart
      const { error: updateError } = await supabase
        .from('abandoned_carts')
        .update({
          items: items as any, // JSONB column
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingCart.id)

      if (updateError) {
        console.error('Error updating abandoned cart:', updateError)
        return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
      }
    } else {
      // Create new abandoned cart
      // First, try to find the cart_id from the carts table
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('email', email)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      const { error: insertError } = await supabase
        .from('abandoned_carts')
        .insert({
          cart_id: cart?.id || null,
          email,
          items: items as any, // JSONB column
          status: 'pending',
        })

      if (insertError) {
        console.error('Error creating abandoned cart:', insertError)
        return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 })
      }
    }

    const res = NextResponse.json({ success: true })
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch (e) {
    console.error('Abandoned cart POST error:', e)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}

export async function GET() {
  if (!process.env.ENABLE_ABANDONED_CART || process.env.ENABLE_ABANDONED_CART === 'false') {
    return NextResponse.json({ error: 'Abandoned cart disabled' }, { status: 503 })
  }
  // For debugging only; do not expose in production
  const supabase = createServerClient()
  const { data: carts, error } = await supabase
    .from('abandoned_carts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching abandoned carts:', error)
    return NextResponse.json({ error: 'Failed to fetch carts' }, { status: 500 })
  }

  return NextResponse.json({ carts: carts || [] })
}


