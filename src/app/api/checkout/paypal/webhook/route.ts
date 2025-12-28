import { NextRequest, NextResponse } from 'next/server'
import { verifyPayPalWebhook, type PayPalWebhookEvent } from '@/lib/paypal-webhook'
import { createServerClient } from '@/lib/supabase'
import { logPayPalEvent } from '@/lib/paypal-logger'

/**
 * PayPal Webhook Handler
 * 
 * Handles webhook notifications from PayPal for payment events
 * https://developer.paypal.com/api/rest/webhooks/
 * 
 * Setup:
 * 1. Go to https://developer.paypal.com/dashboard/webhooks
 * 2. Create webhook with URL: https://your-domain.com/api/checkout/paypal/webhook
 * 3. Subscribe to events: PAYMENT.CAPTURE.*, CHECKOUT.ORDER.*
 * 4. Copy Webhook ID to PAYPAL_WEBHOOK_ID env variable
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headers = req.headers

    logPayPalEvent({
      event: 'Webhook.Received',
      level: 'info',
      metadata: {
        transmissionId: headers.get('paypal-transmission-id')
      }
    })

    // Verify webhook signature
    const isValid = await verifyPayPalWebhook(body, headers)
    
    if (!isValid) {
      logPayPalEvent({
        event: 'Webhook.VerificationFailed',
        level: 'error',
        metadata: {
          transmissionId: headers.get('paypal-transmission-id')
        }
      })
      
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    const event: PayPalWebhookEvent = JSON.parse(body)
    const supabase = createServerClient()

    logPayPalEvent({
      event: 'Webhook.Verified',
      level: 'info',
      metadata: {
        webhookId: event.id,
        eventType: event.event_type
      }
    })

    // Store webhook event for audit trail
    await supabase.from('webhook_events').insert({
      event_type: event.event_type,
      order_number: event.resource?.custom_id || null,
      payment_id: event.resource?.id || null,
      status: 'received',
      payload: event,
      signature_valid: true,
    })

    // Handle different event types
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptured(event, supabase)
        break
        
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentDenied(event, supabase)
        break
        
      case 'PAYMENT.CAPTURE.PENDING':
        await handlePaymentPending(event, supabase)
        break
        
      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePaymentRefunded(event, supabase)
        break
        
      case 'PAYMENT.CAPTURE.REVERSED':
        await handlePaymentReversed(event, supabase)
        break
        
      case 'CHECKOUT.ORDER.APPROVED':
        await handleOrderApproved(event, supabase)
        break
        
      case 'CHECKOUT.ORDER.COMPLETED':
        await handleOrderCompleted(event, supabase)
        break
        
      default:
        logPayPalEvent({
          event: 'Webhook.UnhandledEventType',
          level: 'info',
          metadata: {
            eventType: event.event_type
          }
        })
    }

    return NextResponse.json({ received: true })
    
  } catch (error: any) {
    logPayPalEvent({
      event: 'Webhook.ProcessingError',
      level: 'error',
      error
    })
    
    // Return 200 to prevent PayPal from retrying
    return NextResponse.json(
      { received: true, error: 'Processing error' },
      { status: 200 }
    )
  }
}

/**
 * Handle Payment Capture Completed
 */
async function handlePaymentCaptured(event: PayPalWebhookEvent, supabase: any) {
  const resource = event.resource
  const orderId = resource.supplementary_data?.related_ids?.order_id
  const customId = resource.custom_id
  const captureId = resource.id
  const amount = resource.amount?.value

  if (!customId) {
    logPayPalEvent({
      event: 'Webhook.PaymentCaptured.NoOrderReference',
      level: 'warn',
      metadata: { captureId }
    })
    return
  }

  logPayPalEvent({
    event: 'Webhook.PaymentCaptured',
    orderId: customId,
    amount,
    metadata: { captureId, paypalOrderId: orderId }
  })

  // Update order status
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      status: 'processing',
      metadata: {
        paypal_order_id: orderId,
        paypal_capture_id: captureId,
        paypal_captured_amount: amount,
        paypal_captured_at: resource.create_time,
        paypal_webhook_received: true
      }
    })
    .eq('order_number', customId)

  if (error) {
    logPayPalEvent({
      event: 'Webhook.PaymentCaptured.UpdateFailed',
      level: 'error',
      orderId: customId,
      error,
      metadata: { captureId }
    })
  }
}

/**
 * Handle Payment Denied
 */
async function handlePaymentDenied(event: PayPalWebhookEvent, supabase: any) {
  const resource = event.resource
  const customId = resource.custom_id
  const captureId = resource.id

  if (!customId) return

  logPayPalEvent({
    event: 'Webhook.PaymentDenied',
    orderId: customId,
    level: 'warn',
    metadata: { captureId }
  })

  await supabase
    .from('orders')
    .update({
      payment_status: 'failed',
      status: 'cancelled',
    })
    .eq('order_number', customId)
}

/**
 * Handle Payment Pending
 */
async function handlePaymentPending(event: PayPalWebhookEvent, supabase: any) {
  const resource = event.resource
  const customId = resource.custom_id

  if (!customId) return

  logPayPalEvent({
    event: 'Webhook.PaymentPending',
    orderId: customId,
    metadata: { captureId: resource.id }
  })

  await supabase
    .from('orders')
    .update({
      payment_status: 'pending',
    })
    .eq('order_number', customId)
}

/**
 * Handle Payment Refunded
 */
async function handlePaymentRefunded(event: PayPalWebhookEvent, supabase: any) {
  const resource = event.resource
  const captureId = resource.id
  const refundAmount = resource.amount?.value

  logPayPalEvent({
    event: 'Webhook.PaymentRefunded',
    amount: refundAmount,
    level: 'info',
    metadata: { captureId, refundId: resource.id }
  })

  // Find order by capture ID and update
  // This requires storing capture_id in a searchable field
  // For now, log the event
}

/**
 * Handle Payment Reversed (chargeback/dispute)
 */
async function handlePaymentReversed(event: PayPalWebhookEvent, supabase: any) {
  const resource = event.resource
  const captureId = resource.id

  logPayPalEvent({
    event: 'Webhook.PaymentReversed',
    level: 'warn',
    metadata: { captureId }
  })

  // Handle chargeback - requires manual review
}

/**
 * Handle Order Approved
 */
async function handleOrderApproved(event: PayPalWebhookEvent, supabase: any) {
  const resource = event.resource
  const orderId = resource.id
  const customId = resource.purchase_units?.[0]?.reference_id

  logPayPalEvent({
    event: 'Webhook.OrderApproved',
    orderId: customId,
    metadata: { paypalOrderId: orderId }
  })
}

/**
 * Handle Order Completed
 */
async function handleOrderCompleted(event: PayPalWebhookEvent, supabase: any) {
  const resource = event.resource
  const orderId = resource.id
  const customId = resource.purchase_units?.[0]?.reference_id

  logPayPalEvent({
    event: 'Webhook.OrderCompleted',
    orderId: customId,
    metadata: { paypalOrderId: orderId }
  })
}
