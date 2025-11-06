import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendAbandonedCartEmail } from '@/lib/email/sender'

type AbandonedCartItem = {
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
    const cartId = body.cartId

    if (!cartId) {
      return NextResponse.json({ error: 'Cart ID required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Fetch abandoned cart from Supabase
    const { data: cart, error: fetchError } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('id', cartId)
      .single()

    if (fetchError || !cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    if (cart.status !== 'pending') {
      return NextResponse.json({ error: 'Cart already processed' }, { status: 400 })
    }

    // Parse items from JSONB
    const items = (cart.items as any) as AbandonedCartItem[]

    // Format items for email
    const emailItems = items.map((item: AbandonedCartItem) => ({
      name: item.name,
      price: `LKR ${item.price.toLocaleString()}`,
      quantity: item.quantity,
      image: item.image,
    }))

    // Send email
    const result = await sendAbandonedCartEmail(cart.email, emailItems)

    if (result.success) {
      // Update cart status in Supabase
      const { error: updateError } = await supabase
        .from('abandoned_carts')
        .update({
          status: 'emailed',
          emailed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', cartId)

      if (updateError) {
        console.error('Error updating abandoned cart status:', updateError)
        // Still return success since email was sent
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: result.id 
      })
    } else {
      return NextResponse.json({ 
        error: 'Failed to send email',
        details: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Abandoned cart email error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
