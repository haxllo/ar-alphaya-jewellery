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
  
  // Generate hash using MD5 (required by PayHere)
  // Formula: MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret))
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()
  // IMPORTANT: Amount must be string with exactly 2 decimal places for hash
  const amountFormatted = total.toFixed(2)
  const hash = crypto.createHash('md5')
    .update(`${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`)
    .digest('hex')
    .toUpperCase()
  
  // Debug logging (remove in production)
  console.log('PayHere Payment Details:', {
    merchantId,
    orderId,
    amount: amountFormatted,
    amountType: typeof amountFormatted,
    currency,
    hash: hash,
    hashPreview: hash.substring(0, 10) + '...',
    totalRaw: total,
    itemCount: items.length,
    hashInput: `${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret.substring(0, 10)}...`
  })
    
  // Prepare payment data for PayHere
  // Note: return_url and cancel_url are undefined for JS SDK modal
  // Payment flow is handled via callbacks (onCompleted, onDismissed)
  const paymentData = {
    sandbox: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === 'true',
    merchant_id: merchantId,
    return_url: undefined,  // Not needed with JS SDK modal
    cancel_url: undefined,  // Not needed with JS SDK modal
    notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/payhere/notify`,
    order_id: orderId,
    items: items.map((item: any) => item.name).join(', '),
    amount: parseFloat(amountFormatted),
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
