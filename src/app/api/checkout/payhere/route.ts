import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { customer, items, total, orderId } = await request.json()
    
    const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET
    const currency = 'LKR'
    
    if (!merchantId || !merchantSecret) {
      return NextResponse.json({ error: 'PayHere configuration missing' }, { status: 500 })
    }
    
    // Generate hash
    const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()
    const amountFormatted = parseFloat((total / 100).toFixed(2)) // Convert cents to LKR
    const hash = crypto.createHash('md5')
      .update(`${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`)
      .digest('hex')
      .toUpperCase()
    
    // Prepare payment data for PayHere
    const paymentData = {
      sandbox: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === 'true',
      merchant_id: merchantId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/payhere/notify`,
      order_id: orderId,
      items: items.map((item: any) => item.name).join(', '),
      amount: amountFormatted,
      currency: currency,
      hash: hash,
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      country: 'Sri Lanka',
      delivery_address: customer.address,
      delivery_city: customer.city,
      delivery_country: 'Sri Lanka'
    }
    
    return NextResponse.json({ paymentData })
  } catch (error) {
    console.error('PayHere API error:', error)
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 })
  }
}
