import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { securityMiddleware, applySecurityHeaders } from '@/lib/rate-limit'
import { withErrorHandler } from '@/lib/error-handler'
import { getServerSession } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase'
import { sanitizeString } from '@/lib/validation'
import { sendBankTransferInstructions } from '@/lib/email/sender'

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
  // Apply security middleware with rate limiting
  const securityResponse = securityMiddleware(request, {
    rateLimitType: 'payment', // Shared limit with other checkout methods
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
    email: customer.email,
    phone: sanitizeString(customer.phone),
    address: sanitizeString(customer.address),
    city: sanitizeString(customer.city),
    postalCode: customer.postalCode ? sanitizeString(customer.postalCode) : undefined,
  }

  const currency = 'LKR'

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

  // Calculate Shipping
  const freeShippingThreshold = 5000
  const shipping = calculatedSubtotal >= freeShippingThreshold ? 0 : 1000
  
  const discount = 0 
  const calculatedTotal = calculatedSubtotal - discount + shipping

  // Verify if client total matches server total
  if (Math.abs(calculatedTotal - clientTotal) > 1.0) {
    console.warn(`Price mismatch detected! Client: ${clientTotal}, Server: ${calculatedTotal}`)
    // Proceed with SERVER calculated total
  }

  // Create order in Supabase
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderId,
      user_id: session?.user?.id || null,
      email: sanitizedCustomer.email,
      status: 'pending',
      payment_status: 'pending', // Pending manual payment
      payment_method: 'bank_transfer',
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

  // Create order items
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
  }

  // Send Email Instructions
  const emailResult = await sendBankTransferInstructions({
    orderId: orderId,
    customerEmail: sanitizedCustomer.email,
    customerName: `${sanitizedCustomer.firstName} ${sanitizedCustomer.lastName}`,
    orderDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    items: verifiedItems.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || undefined,
      gemstone: item.gemstone || undefined,
      image: item.image || undefined,
    })),
    subtotal: calculatedSubtotal,
    shipping: shipping,
    total: calculatedTotal,
  })

  if (!emailResult.success) {
    console.error('Failed to send bank transfer instructions:', emailResult.error)
    // We don't fail the request, but we should log it. 
    // The user will see a success page but might not get the email.
  }
    
  const response = NextResponse.json({ 
    success: true, 
    orderId: order.id,
    message: 'Order created and instructions sent' 
  })
  return applySecurityHeaders(response);
});
