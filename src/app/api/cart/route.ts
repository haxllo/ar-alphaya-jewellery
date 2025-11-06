import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import type { CartItem } from '@/types/product'

/**
 * GET /api/cart
 * Get user's cart from Supabase
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    const supabase = createServerClient()

    // Get session ID from cookie for guest carts
    const sessionId = request.cookies.get('cart_session_id')?.value || null

    if (!session?.user?.id && !sessionId) {
      return NextResponse.json({ items: [] })
    }

    // Find active cart
    let cartQuery = supabase
      .from('carts')
      .select('id, status, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (session?.user?.id) {
      cartQuery = cartQuery.eq('user_id', session.user.id)
    } else if (sessionId) {
      cartQuery = cartQuery.eq('session_id', sessionId)
    }

    const { data: cart, error: cartError } = await cartQuery.single()

    if (cartError && cartError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      console.error('Error fetching cart:', cartError)
      return NextResponse.json({ items: [] })
    }

    if (!cart) {
      return NextResponse.json({ items: [] })
    }

    // Get cart items
    const { data: cartItems, error: itemsError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: true })

    if (itemsError) {
      console.error('Error fetching cart items:', itemsError)
      return NextResponse.json({ items: [] })
    }

    // Transform to CartItem format
    const items: CartItem[] = (cartItems || []).map((item) => ({
      productId: item.product_id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || undefined,
      gemstone: item.gemstone || undefined,
      image: item.image || undefined,
    }))

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json({ items: [] }, { status: 500 })
  }
}

/**
 * POST /api/cart
 * Sync cart to Supabase (upsert items)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    const supabase = createServerClient()
    const body = await request.json()
    const items: CartItem[] = body.items || []

    // Get or create session ID for guest carts
    let sessionId = request.cookies.get('cart_session_id')?.value
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`
    }

    // Get or create cart
    const userId = session?.user?.id || null
    const email = session?.user?.email || body.email || null

    // Find existing active cart
    let cartQuery = supabase
      .from('carts')
      .select('id')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (userId) {
      cartQuery = cartQuery.eq('user_id', userId)
    } else if (sessionId) {
      cartQuery = cartQuery.eq('session_id', sessionId)
    }

    const { data: existingCart } = await cartQuery.single()

    let cartId: string

    if (existingCart) {
      cartId = existingCart.id
      // Update cart timestamp
      await supabase
        .from('carts')
        .update({
          updated_at: new Date().toISOString(),
          email: email || undefined,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', cartId)
    } else {
      // Create new cart
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({
          user_id: userId,
          session_id: sessionId,
          email: email,
          status: 'active',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select('id')
        .single()

      if (createError || !newCart) {
        console.error('Error creating cart:', createError)
        return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 })
      }

      cartId = newCart.id
    }

    // Delete existing items
    await supabase.from('cart_items').delete().eq('cart_id', cartId)

    // Insert new items
    if (items.length > 0) {
      const cartItems = items.map((item) => ({
        cart_id: cartId,
        product_id: item.productId,
        slug: item.slug,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || null,
        gemstone: item.gemstone || null,
        image: item.image || null,
      }))

      const { error: insertError } = await supabase.from('cart_items').insert(cartItems)

      if (insertError) {
        console.error('Error inserting cart items:', insertError)
        return NextResponse.json({ error: 'Failed to sync cart items' }, { status: 500 })
      }
    }

    // Update cart timestamp
    await supabase
      .from('carts')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', cartId)

    const response = NextResponse.json({ success: true, cartId })
    
    // Set session ID cookie for guest carts
    if (!session?.user?.id) {
      response.cookies.set('cart_session_id', sessionId, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }

    return response
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/cart
 * Clear cart
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    const supabase = createServerClient()
    const sessionId = request.cookies.get('cart_session_id')?.value || null

    if (!session?.user?.id && !sessionId) {
      return NextResponse.json({ success: true })
    }

    // Find active cart
    let cartQuery = supabase
      .from('carts')
      .select('id')
      .eq('status', 'active')

    if (session?.user?.id) {
      cartQuery = cartQuery.eq('user_id', session.user.id)
    } else if (sessionId) {
      cartQuery = cartQuery.eq('session_id', sessionId)
    }

    const { data: cart } = await cartQuery.single()

    if (cart) {
      // Delete cart items
      await supabase.from('cart_items').delete().eq('cart_id', cart.id)
      
      // Mark cart as completed
      await supabase
        .from('carts')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', cart.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


