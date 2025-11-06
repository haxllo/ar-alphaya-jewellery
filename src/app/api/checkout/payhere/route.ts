import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { securityMiddleware, applySecurityHeaders } from '@/lib/rate-limit'
import { createErrorResponse, withErrorHandler } from '@/lib/error-handler'
import { getServerSession } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Apply security middleware with rate limiting for payment endpoints
  const securityResponse = securityMiddleware(request, {
    rateLimitType: 'payment',
    endpointType: 'api',
  });
  
  if (securityResponse) {
    return applySecurityHeaders(securityResponse);
  }

  const { customer, items, total, orderId } = await request.json()
  
  const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET
  const currency = 'LKR'
  
  if (!merchantId || !merchantSecret) {
    throw new Error('PayHere configuration missing')
  }

  // Get user session
  const session = await getServerSession()
  const supabase = createServerClient()

  // Create order in Supabase
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderId,
      user_id: session?.user?.id || null,
      email: customer.email,
      status: 'pending',
      payment_status: 'pending',
      payment_method: 'payhere',
      subtotal: total,
      total: total,
      currency: currency,
      customer_first_name: customer.firstName,
      customer_last_name: customer.lastName,
      customer_phone: customer.phone,
      customer_address: customer.address,
      customer_city: customer.city,
      customer_country: 'Sri Lanka',
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error('Error creating order:', orderError)
    throw new Error('Failed to create order')
  }

  // Create order items
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.productId,
    slug: item.slug,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    size: item.size || null,
    gemstone: item.gemstone || null,
    image: item.image || null,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Error creating order items:', itemsError)
    // Don't fail the request, but log the error
  }
  
  // Generate secure hash using SHA-256 instead of MD5
  const hashedSecret = crypto.createHash('sha256').update(merchantSecret).digest('hex').toUpperCase()
  const amountFormatted = parseFloat((total / 100).toFixed(2)) // Convert cents to LKR
  const hash = crypto.createHash('sha256')
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
    
  const response = NextResponse.json({ paymentData, orderId: order.id })
  return applySecurityHeaders(response);
});
