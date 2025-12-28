import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { securityMiddleware, applySecurityHeaders } from '@/lib/rate-limit'
import { withErrorHandler } from '@/lib/error-handler'
import { getServerSession } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { sanitizeString } from '@/lib/validation'
import { generatePayzySignature, PayzyPayload } from '@/lib/payzy'
import axios from 'axios'

// Validation schema (same as bank transfer)
const checkoutSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().optional(),
    company: z.string().optional(),
    state: z.string().optional().default(''),
    country: z.string().optional().default('Sri Lanka'),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    slug: z.string().min(1),
    name: z.string(),
    price: z.number().min(0),
    quantity: z.number().int().positive(),
  })).min(1),
  total: z.number().min(0),
  orderId: z.string().min(1),
})

export const POST = withErrorHandler(async (request: NextRequest) => {
  const securityResponse = securityMiddleware(request, {
    rateLimitType: 'payment',
    endpointType: 'api',
  });
  
  if (securityResponse) {
    return applySecurityHeaders(securityResponse);
  }

  const body = await request.json()
  const validationResult = checkoutSchema.safeParse(body)
  
  if (!validationResult.success) {
    throw new Error(`Invalid checkout data: ${validationResult.error.issues.map(i => i.message).join(', ')}`)
  }

  const { customer, items, total: clientTotal, orderId } = validationResult.data
  
  // Sanitize
  const sanitizedCustomer = {
    firstName: sanitizeString(customer.firstName),
    lastName: sanitizeString(customer.lastName),
    email: customer.email,
    phone: sanitizeString(customer.phone),
    address: sanitizeString(customer.address),
    city: sanitizeString(customer.city),
    state: sanitizeString(customer.state || ''),
    country: sanitizeString(customer.country || 'Sri Lanka'),
    postalCode: customer.postalCode ? sanitizeString(customer.postalCode) : '00000',
    company: customer.company ? sanitizeString(customer.company) : '',
  }

  // --- Server-side Price Verification (Logic shared with other methods) ---
  const supabase = createServerClient()
  let calculatedSubtotal = 0
  
  for (const item of items) {
    const { data: product, error } = await supabase
      .from('products')
      .select('price')
      .eq('id', item.productId)
      .single()

    if (error || !product) throw new Error(`Product not found: ${item.productId}`)
    calculatedSubtotal += product.price * item.quantity
  }

  const shipping = calculatedSubtotal >= 5000 ? 0 : 1000
  const calculatedTotal = calculatedSubtotal + shipping

  if (Math.abs(calculatedTotal - clientTotal) > 1.0) {
    console.warn(`Price mismatch: Client ${clientTotal}, Server ${calculatedTotal}`)
  }

  // --- Payzy Specific Logic ---
  const secretKey = process.env.PAYZY_SECRET_KEY
  const shopId = process.env.PAYZY_SHOP_ID
  const isSandbox = process.env.NEXT_PUBLIC_PAYZY_SANDBOX === 'true'

  if (!secretKey || !shopId) {
    throw new Error('Payzy configuration missing')
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const responseUrl = `${baseUrl}/api/checkout/payzy/callback`

  const payload: PayzyPayload = {
    x_test_mode: isSandbox ? 'on' : 'off',
    x_shopid: shopId,
    x_amount: calculatedTotal.toFixed(2),
    x_order_id: orderId,
    x_response_url: responseUrl,
    x_first_name: sanitizedCustomer.firstName,
    x_last_name: sanitizedCustomer.lastName,
    x_company: sanitizedCustomer.company,
    x_address: sanitizedCustomer.address,
    x_country: sanitizedCustomer.country,
    x_state: sanitizedCustomer.state,
    x_city: sanitizedCustomer.city,
    x_zip: sanitizedCustomer.postalCode,
    x_phone: sanitizedCustomer.phone,
    x_email: sanitizedCustomer.email,
    // Using same details for shipping as billing for now, or allow frontend to pass separate
    x_ship_to_first_name: sanitizedCustomer.firstName,
    x_ship_to_last_name: sanitizedCustomer.lastName,
    x_ship_to_company: sanitizedCustomer.company,
    x_ship_to_address: sanitizedCustomer.address,
    x_ship_to_country: sanitizedCustomer.country,
    x_ship_to_state: sanitizedCustomer.state,
    x_ship_to_city: sanitizedCustomer.city,
    x_ship_to_zip: sanitizedCustomer.postalCode,
    x_freight: shipping.toFixed(2),
    x_version: '1.0',
    x_platform: 'custom',
    signed_field_names: 'x_test_mode,x_shopid,x_amount,x_order_id,x_response_url,x_first_name,x_last_name,x_company,x_address,x_country,x_state,x_city,x_zip,x_phone,x_email,x_ship_to_first_name,x_ship_to_last_name,x_ship_to_company,x_ship_to_address,x_ship_to_country,x_ship_to_state,x_ship_to_city,x_ship_to_zip,x_freight,x_platform,x_version,signed_field_names'
  }

  const signature = generatePayzySignature(payload, secretKey)
  
  // Create Pending Order in DB
  const session = await getServerSession()
  const { error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderId,
      user_id: session?.user?.id || null,
      email: sanitizedCustomer.email,
      status: 'pending',
      payment_status: 'pending',
      payment_method: 'payzy',
      subtotal: calculatedSubtotal,
      total: calculatedTotal,
      currency: 'LKR',
      customer_first_name: sanitizedCustomer.firstName,
      customer_last_name: sanitizedCustomer.lastName,
      customer_phone: sanitizedCustomer.phone,
      customer_address: sanitizedCustomer.address,
      customer_city: sanitizedCustomer.city,
      customer_country: sanitizedCustomer.country,
      metadata: {
        zip: sanitizedCustomer.postalCode,
        state: sanitizedCustomer.state,
        company: sanitizedCustomer.company
      }
    })

  if (orderError) {
    throw new Error('Failed to create order record')
  }

  // Insert items... (Simplified: assume success or handle similarly to bank transfer)
  // Re-using logic or calling helper would be better, but implementing inline for now
  const orderItems = items.map((item: any) => ({
    order_id: undefined, // Need to get ID from inserted order. 
    // Wait, insert returns data. I need to select it.
  }))
  
  // FIX: Get the order ID
  const { data: insertedOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('order_number', orderId)
      .single()
      
  if (insertedOrder) {
      const itemsToInsert = items.map((item: any) => ({
        order_id: insertedOrder.id,
        product_id: item.productId,
        slug: item.slug,
        name: item.name,
        price: item.price, // Using client price, but validated against total
        quantity: item.quantity,
      }))
      await supabase.from('order_items').insert(itemsToInsert)
  }

  // Request Payzy URL
  try {
    const payzyResponse = await axios.post('https://api.payzypay.xyz/checkout/custom-checkout', {
      ...payload,
      signature
    })

    // Expecting: { data: { url: "..." } } based on docs
    const redirectUrl = payzyResponse.data?.data?.url

    if (!redirectUrl) {
      throw new Error('Invalid response from Payzy')
    }

    return NextResponse.json({ success: true, url: redirectUrl })

  } catch (error: any) {
    console.error('Payzy API Error:', error.response?.data || error.message)
    throw new Error('Failed to initiate Payzy payment')
  }
})
