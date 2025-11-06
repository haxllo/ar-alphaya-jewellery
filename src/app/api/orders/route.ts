import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'

/**
 * GET /api/orders
 * Get user's orders from Supabase
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ orders: [] })
    }

    const supabase = createServerClient()

    // Build query based on user ID or email
    let ordersQuery = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (session.user.id) {
      ordersQuery = ordersQuery.eq('user_id', session.user.id)
    } else if (session.user.email) {
      ordersQuery = ordersQuery.eq('email', session.user.email)
    }

    const { data: orders, error } = await ordersQuery

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ orders: [] }, { status: 500 })
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json({ orders: [] }, { status: 500 })
  }
}

