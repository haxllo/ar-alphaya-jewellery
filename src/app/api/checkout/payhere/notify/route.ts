import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // PayHere notification handler
    const formData = await request.formData()
    const merchantId = formData.get('merchant_id')
    const orderId = formData.get('order_id')
    const paymentId = formData.get('payment_id')
    const payhereAmount = formData.get('payhere_amount')
    const payhereAmountFormatted = formData.get('payhere_amount_formatted')
    const statusCode = formData.get('status_code')
    const md5sig = formData.get('md5sig')

    // Verify the signature
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET
    if (!merchantSecret) {
      console.error('PayHere merchant secret not configured')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    // In a real implementation, you would:
    // 1. Verify the MD5 signature
    // 2. Update the order status in your database
    // 3. Send confirmation emails
    // 4. Update inventory
    
    console.log('PayHere Notification:', {
      merchantId,
      orderId,
      paymentId,
      payhereAmount,
      statusCode
    })

    // Respond with 200 to acknowledge receipt
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('PayHere notification error:', error)
    return NextResponse.json({ error: 'Notification processing failed' }, { status: 500 })
  }
}
