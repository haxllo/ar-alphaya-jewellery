import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { z } from 'zod'
import { securityMiddleware, applySecurityHeaders } from '@/lib/rate-limit'
import { createErrorResponse, withErrorHandler } from '@/lib/error-handler'
import { getServerSession } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { sanitizeString } from '@/lib/validation'

// Validation schema for checkout request
const checkoutSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().optional(),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    slug: z.string().min(1),
    name: z.string(),
    price: z.number().min(0),
    quantity: z.number().int().positive(),
    size: z.string().nullable().optional(),
    gemstone: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
  })).min(1),
  total: z.number().min(0),
  orderId: z.string().min(1),
})

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Apply security middleware with rate limiting for payment endpoints
  const securityResponse = securityMiddleware(request, {
    rateLimitType: 'payment',
    endpointType: 'api',
  });
  
  if (securityResponse) {
    return applySecurityHeaders(securityResponse);
  }

  const body = await request.json()
  
  // Validate request body
  const validationResult = checkoutSchema.safeParse(body)
  if (!validationResult.success) {
    throw new Error(`Invalid checkout data: ${validationResult.error.issues.map(i => i.message).join(', ')}`)
  }

  const { customer, items, total: clientTotal, orderId } = validationResult.data
  
  // Sanitize customer inputs
  const sanitizedCustomer = {
    firstName: sanitizeString(customer.firstName),
    lastName: sanitizeString(customer.lastName),
    email: customer.email, // Already validated as email
    phone: sanitizeString(customer.phone),
    address: sanitizeString(customer.address),
    city: sanitizeString(customer.city),
    postalCode: customer.postalCode ? sanitizeString(customer.postalCode) : undefined,
  }

  const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET
  const currency = 'LKR'
  
  if (!merchantId || !merchantSecret) {
    throw new Error('PayHere configuration missing')
  }

  // Get user session
  const session = await getServerSession()
  const supabase = createServerClient()

  // VERIFY PRICES & CALCULATE TOTAL SERVER-SIDE
  let calculatedSubtotal = 0
  const verifiedItems = []

  for (const item of items) {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('price, name')
      .eq('id', item.productId)
      .single()

    if (productError || !product) {
      throw new Error(`Product not found: ${item.productId}`)
    }

    // Use server price
    const itemTotal = product.price * item.quantity
    calculatedSubtotal += itemTotal
    
    verifiedItems.push({
      ...item,
      price: product.price, // Enforce server price
      name: product.name    // Enforce server name
    })
  }

  // Calculate Shipping (Logic duplicated from frontend, ideal to centralize)
  // Free delivery within Sri Lanka for orders above Rs.5,000
  const freeShippingThreshold = 5000
  const shipping = calculatedSubtotal >= freeShippingThreshold ? 0 : 1000
  
  // Discount logic would go here if promo codes were implemented securely (server-side verification)
  const discount = 0 
  
  const calculatedTotal = calculatedSubtotal - discount + shipping

  // Verify if client total matches server total (allowing small float diff)
  if (Math.abs(calculatedTotal - clientTotal) > 1.0) {
    console.warn(`Price mismatch detected! Client: ${clientTotal}, Server: ${calculatedTotal}`)
    // We proceed with the SERVER calculated total for security
  }

  // Create order in Supabase using SANITIZED data and VERIFIED totals
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderId,
      user_id: session?.user?.id || null,
      email: sanitizedCustomer.email,
      status: 'pending',
      payment_status: 'pending',
      payment_method: 'payhere',
      subtotal: calculatedSubtotal,
      total: calculatedTotal,
      currency: currency,
      customer_first_name: sanitizedCustomer.firstName,
      customer_last_name: sanitizedCustomer.lastName,
      customer_phone: sanitizedCustomer.phone,
      customer_address: sanitizedCustomer.address,
      customer_city: sanitizedCustomer.city,
      customer_country: 'Sri Lanka',
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error('Error creating order:', orderError)
    throw new Error('Failed to create order')
  }

  // Create order items using VERIFIED items
  const orderItems = verifiedItems.map((item: any) => ({
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
  const amountFormatted = calculatedTotal.toFixed(2)
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
    totalRaw: calculatedTotal,
    itemCount: items.length,
    hashInput: `${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret.substring(0, 10)}...`
  })
    
  // Prepare payment data for PayHere
  // Note: return_url and cancel_url must be provided (PayHere validation requirement)
  // However, JS SDK modal handles flow via callbacks, so these URLs won't be reached
  const paymentData = {
    sandbox: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === 'true',
    merchant_id: merchantId,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,  // Required but not used with modal
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,  // Required but not used with modal
    notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/payhere/notify`,
    order_id: orderId,
    items: verifiedItems.map((item: any) => item.name).join(', '),
    amount: parseFloat(amountFormatted),
    currency: currency,
    hash: hash,
    first_name: sanitizedCustomer.firstName,
    last_name: sanitizedCustomer.lastName,
    email: sanitizedCustomer.email,
    phone: sanitizedCustomer.phone,
    address: sanitizedCustomer.address,
    city: sanitizedCustomer.city,
    country: 'Sri Lanka',
    delivery_address: sanitizedCustomer.address,
    delivery_city: sanitizedCustomer.city,
    delivery_country: 'Sri Lanka'
  }
    
  const response = NextResponse.json({ paymentData, orderId: order.id })
  return applySecurityHeaders(response);
});
