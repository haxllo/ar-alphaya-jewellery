import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { securityMiddleware, applySecurityHeaders } from '@/lib/rate-limit'
import { createErrorResponse, withErrorHandler } from '@/lib/error-handler'

export const POST = withErrorHandler(async (request: NextRequest) => {
  // Apply security middleware
  const securityResponse = securityMiddleware(request, {
    rateLimitType: 'payment',
    endpointType: 'api',
  });
  
  if (securityResponse) {
    return applySecurityHeaders(securityResponse);
  }

  // PayHere notification handler
  const formData = await request.formData()
  const merchantId = formData.get('merchant_id') as string
  const orderId = formData.get('order_id') as string
  const paymentId = formData.get('payment_id') as string
  const payhereAmount = formData.get('payhere_amount') as string
  const payhereAmountFormatted = formData.get('payhere_amount_formatted') as string
  const statusCode = formData.get('status_code') as string
  const receivedSignature = formData.get('md5sig') as string

  // Verify the signature using SHA-256
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET
  if (!merchantSecret) {
    throw new Error('PayHere merchant secret not configured')
  }

  // Generate expected signature using SHA-256
  const hashedSecret = crypto.createHash('sha256').update(merchantSecret).digest('hex').toUpperCase()
  const expectedSignature = crypto.createHash('sha256')
    .update(`${merchantId}${orderId}${payhereAmount}${hashedSecret}`)
    .digest('hex')
    .toUpperCase()

  // Verify signature
  if (receivedSignature !== expectedSignature) {
    throw new Error('Invalid payment signature')
  }

  // Log only essential information (no sensitive data)
  console.log('PayHere Notification Received:', {
    orderId,
    paymentId,
    statusCode,
    timestamp: new Date().toISOString()
  })

  // TODO: In production, implement:
  // 1. Update order status in database
  // 2. Send confirmation emails
  // 3. Update inventory
  // 4. Trigger fulfillment process

  const response = NextResponse.json({ status: 'ok' })
  return applySecurityHeaders(response);
});
