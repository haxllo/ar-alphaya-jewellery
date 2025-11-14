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

  // Verify the signature using MD5 (PayHere uses MD5)
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET
  if (!merchantSecret) {
    throw new Error('PayHere merchant secret not configured')
  }

  // Generate expected signature using MD5
  // Formula: MD5(merchant_id + order_id + payhere_amount + MD5(merchant_secret))
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()
  // IMPORTANT: Amount must be formatted with exactly 2 decimal places
  const amountFormatted = parseFloat(payhereAmount).toFixed(2)
  const expectedSignature = crypto.createHash('md5')
    .update(`${merchantId}${orderId}${amountFormatted}${hashedSecret}`)
    .digest('hex')
    .toUpperCase()

  // Verify signature
  if (receivedSignature !== expectedSignature) {
    console.error('Signature mismatch:', { received: receivedSignature, expected: expectedSignature })
    throw new Error('Invalid payment signature')
  }

  // Log only essential information (no sensitive data)
  console.log('PayHere Notification Received:', {
    orderId,
    paymentId,
    statusCode,
    timestamp: new Date().toISOString()
  })

  // Update order status in Supabase
  const { createServerClient } = await import('@/lib/supabase')
  const supabase = createServerClient()

  // Map PayHere status codes to our order statuses
  // PayHere status codes: 2 = success, 0 = pending, -1 = canceled, -2 = failed, -3 = chargedback
  let orderStatus = 'pending'
  let paymentStatus = 'pending'
  const now = new Date().toISOString()

  if (statusCode === '2') {
    orderStatus = 'paid'
    paymentStatus = 'paid'
  } else if (statusCode === '0') {
    orderStatus = 'processing'
    paymentStatus = 'processing'
  } else if (statusCode === '-1') {
    orderStatus = 'cancelled'
    paymentStatus = 'failed'
  } else if (statusCode === '-2') {
    orderStatus = 'cancelled'
    paymentStatus = 'failed'
  } else if (statusCode === '-3') {
    orderStatus = 'refunded'
    paymentStatus = 'refunded'
  }

  // Update order by order_number (orderId from PayHere)
  const updateData: any = {
    status: orderStatus,
    payment_status: paymentStatus,
    updated_at: now,
  }

  if (statusCode === '2' && paymentId) {
    updateData.payment_id = paymentId
    updateData.paid_at = now
  }

  if (statusCode === '-1' || statusCode === '-2') {
    updateData.cancelled_at = now
  }

  const { data: updatedOrder, error: updateError } = await supabase
    .from('orders')
    .update(updateData)
    .eq('order_number', orderId)
    .select()
    .single()

  if (updateError) {
    console.error('Error updating order status:', updateError)
    // Don't fail the webhook, but log the error
  } else {
    console.log('Order status updated:', { orderId, orderStatus, paymentStatus })
    
    // Send email notification when payment is successful
    if (statusCode === '2' && updatedOrder && !updatedOrder.email_sent) {
      try {
        const { sendOrderConfirmationEmail } = await import('@/lib/email/sender')
        
        // Get order items for email
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', updatedOrder.id)
        
        await sendOrderConfirmationEmail({
          orderId: orderId,
          customerEmail: updatedOrder.email,
          customerName: `${updatedOrder.customer_first_name} ${updatedOrder.customer_last_name}`,
          orderDate: new Date(updatedOrder.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          items: orderItems || [],
          subtotal: updatedOrder.subtotal,
          shipping: updatedOrder.shipping || 0,
          total: updatedOrder.total,
          paymentId: paymentId,
        })
        
        // Mark email as sent
        await supabase
          .from('orders')
          .update({ email_sent: true })
          .eq('order_number', orderId)
        
        console.log('Order confirmation email sent:', orderId)
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
        // Don't fail the webhook if email fails
      }
    }
  }

  // TODO: In production, also implement:
  // 1. Update inventory
  // 2. Trigger fulfillment process

  const response = NextResponse.json({ status: 'ok' })
  return applySecurityHeaders(response);
});
