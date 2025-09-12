import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { securityMiddleware, applySecurityHeaders } from '@/lib/rate-limit'
import { createErrorResponse, withErrorHandler } from '@/lib/error-handler'

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
    
  const response = NextResponse.json({ paymentData })
  return applySecurityHeaders(response);
});
