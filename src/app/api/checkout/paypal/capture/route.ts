import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder } from '@/lib/paypal'
import { createServerClient } from '@/lib/supabase'
import { withErrorHandler } from '@/lib/error-handler'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const { orderID, localOrderID } = await req.json()
  
  const captureData = await capturePayPalOrder(orderID)
  
  if (captureData.status === 'COMPLETED') {
    const supabase = createServerClient()
    
    // Update order status in database
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'processing',
        metadata: {
           paypal_order_id: orderID,
           paypal_capture_id: captureData.purchase_units[0].payments.captures[0].id
        }
      })
      .eq('order_number', localOrderID)
      
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 })
})
