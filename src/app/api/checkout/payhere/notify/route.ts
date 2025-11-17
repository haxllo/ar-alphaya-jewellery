import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { securityMiddleware, applySecurityHeaders } from '@/lib/rate-limit'
import {
  AppError,
  ErrorType,
  createNotFoundError,
  createValidationError,
  withErrorHandler,
} from '@/lib/error-handler'
import {
  LogLevel,
  logInvalidInput,
  logPaymentSecurityIssue,
  securityLogger,
} from '@/lib/logger'

type PayHerePayload = {
  merchantId: string
  orderId: string
  paymentId?: string | null
  payhereAmount: number
  statusCode: string
  signature: string
}

type OrderStatusMapping = {
  orderStatus: string
  paymentStatus: string
}

const STATUS_MAP: Record<string, OrderStatusMapping> = {
  '2': { orderStatus: 'paid', paymentStatus: 'paid' },
  '0': { orderStatus: 'processing', paymentStatus: 'processing' },
  '-1': { orderStatus: 'cancelled', paymentStatus: 'failed' },
  '-2': { orderStatus: 'cancelled', paymentStatus: 'failed' },
  '-3': { orderStatus: 'refunded', paymentStatus: 'refunded' },
}

export const POST = withErrorHandler(async (request: NextRequest) => {
  const securityResponse = securityMiddleware(request, {
    rateLimitType: 'payment',
    endpointType: 'api',
  })

  if (securityResponse) {
    return applySecurityHeaders(securityResponse)
  }

  const formData = await request.formData()
  const rawPayload = formDataToObject(formData)

  const { createServerClient } = await import('@/lib/supabase')
  const supabase = createServerClient()

  const webhookEventId = await createWebhookEventRecord(supabase, rawPayload)

  let payload: PayHerePayload
  try {
    payload = validatePayHerePayload(rawPayload)
  } catch (error) {
    logInvalidInput('payhere_webhook_payload', {
      orderId: rawPayload.order_id,
      paymentId: rawPayload.payment_id,
    }, request)
    await markWebhookEventStatus(supabase, webhookEventId, {
      status: 'rejected',
      error_message: extractErrorMessage(error),
    })
    throw error
  }

  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET
  if (!merchantSecret) {
    await markWebhookEventStatus(supabase, webhookEventId, {
      status: 'failed',
      error_message: 'PayHere merchant secret not configured',
    })
    throw new AppError('PayHere merchant secret not configured', ErrorType.INTERNAL_ERROR, 500)
  }

  try {
    verifySignature(payload, merchantSecret)
    await markWebhookEventStatus(supabase, webhookEventId, {
      status: 'validated',
      signature_valid: true,
    })
  } catch (error) {
    logPaymentSecurityIssue('Invalid PayHere signature', {
      orderId: payload.orderId,
      paymentId: payload.paymentId,
    }, request)
    await markWebhookEventStatus(supabase, webhookEventId, {
      status: 'rejected',
      error_message: extractErrorMessage(error),
    })
    throw error
  }

  const now = new Date().toISOString()

  try {
    const existingOrder = await fetchOrder(supabase, payload.orderId)

    if (existingOrder.payment_status === 'paid') {
      await markWebhookEventStatus(supabase, webhookEventId, {
        status: 'duplicate',
        processed_at: now,
        processing_notes: 'Order already marked as paid',
      })

      return applySecurityHeaders(NextResponse.json({
        status: 'duplicate',
        message: 'Order already processed',
      }))
    }

    if (payload.paymentId) {
      await ensureUniquePaymentId(supabase, payload.paymentId, payload.orderId)
    }

    const updateData = buildOrderUpdate(payload.statusCode, now, payload.paymentId)

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('order_number', payload.orderId)
      .select()
      .single()

    if (updateError || !updatedOrder) {
      throw new AppError('Failed to update order status', ErrorType.INTERNAL_ERROR, 500)
    }

    if (payload.statusCode === '2' && !updatedOrder.email_sent) {
      try {
        const { sendOrderConfirmationEmail } = await import('@/lib/email/sender')
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', updatedOrder.id)

        await sendOrderConfirmationEmail({
          orderId: payload.orderId,
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
          paymentId: payload.paymentId || undefined,
        })

        await supabase
          .from('orders')
          .update({ email_sent: true })
          .eq('order_number', payload.orderId)
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
      }
    }

    await markWebhookEventStatus(supabase, webhookEventId, {
      status: 'processed',
      processed_at: now,
    })

    securityLogger.log(LogLevel.INFO, 'PayHere order processed', {
      orderId: payload.orderId,
      paymentId: payload.paymentId,
      statusCode: payload.statusCode,
    })

    return applySecurityHeaders(NextResponse.json({ status: 'ok' }))
  } catch (error) {
    await markWebhookEventStatus(supabase, webhookEventId, {
      status: error instanceof AppError && error.statusCode < 500 ? 'rejected' : 'failed',
      error_message: extractErrorMessage(error),
    })
    throw error
  }
})

function formDataToObject(formData: FormData): Record<string, string> {
  const payload: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    payload[key] = typeof value === 'string' ? value : `[file:${value.name || 'blob'}]`
  }
  return payload
}

function validatePayHerePayload(payload: Record<string, string>): PayHerePayload {
  const missing = ['merchant_id', 'order_id', 'payhere_amount', 'status_code', 'md5sig']
    .filter(field => !payload[field] || !payload[field].toString().trim())

  if (missing.length) {
    throw createValidationError(`Missing required fields: ${missing.join(', ')}`)
  }

  const merchantId = payload.merchant_id.trim()
  const orderId = payload.order_id.trim()
  const rawAmount = payload.payhere_amount.trim()
  const statusCode = payload.status_code.trim()
  const signature = payload.md5sig.trim().toUpperCase()
  const paymentId = payload.payment_id?.trim() || null

  const amount = Number(rawAmount)
  if (!Number.isFinite(amount)) {
    throw createValidationError('Invalid payhere_amount value')
  }

  if (!/^[A-F0-9]{32}$/.test(signature)) {
    throw createValidationError('Invalid payment signature format')
  }

  if (!statusCode) {
    throw createValidationError('Missing status code')
  }

  return {
    merchantId,
    orderId,
    paymentId,
    payhereAmount: amount,
    statusCode,
    signature,
  }
}

function verifySignature(payload: PayHerePayload, merchantSecret: string) {
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()
  const amountFormatted = payload.payhereAmount.toFixed(2)
  const expectedSignature = crypto
    .createHash('md5')
    .update(`${payload.merchantId}${payload.orderId}${amountFormatted}${hashedSecret}`)
    .digest('hex')
    .toUpperCase()

  const expectedBuffer = Buffer.from(expectedSignature, 'hex')
  const receivedBuffer = Buffer.from(payload.signature, 'hex')

  if (expectedBuffer.length !== receivedBuffer.length) {
    throw createValidationError('Invalid payment signature')
  }

  try {
    if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
      throw createValidationError('Invalid payment signature')
    }
  } catch {
    throw createValidationError('Invalid payment signature')
  }
}

async function fetchOrder(supabase: any, orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderId)
    .single()

  if (error || !data) {
    throw createNotFoundError('Order not found for payment notification')
  }

  return data
}

async function ensureUniquePaymentId(supabase: any, paymentId: string, orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('order_number')
    .eq('payment_id', paymentId)
    .neq('order_number', orderId)
    .limit(1)

  if (error) {
    throw new AppError('Failed to validate payment uniqueness', ErrorType.INTERNAL_ERROR, 500)
  }

  if (data && data.length) {
    throw createValidationError('Payment already processed for another order')
  }
}

function buildOrderUpdate(statusCode: string, timestamp: string, paymentId?: string | null) {
  const mapping = STATUS_MAP[statusCode] || { orderStatus: 'pending', paymentStatus: 'pending' }
  const updateData: Record<string, any> = {
    status: mapping.orderStatus,
    payment_status: mapping.paymentStatus,
    updated_at: timestamp,
  }

  if (mapping.paymentStatus === 'paid' && paymentId) {
    updateData.payment_id = paymentId
    updateData.paid_at = timestamp
  }

  if (statusCode === '-1' || statusCode === '-2') {
    updateData.cancelled_at = timestamp
  }

  return updateData
}

async function createWebhookEventRecord(supabase: any, payload: Record<string, string>) {
  try {
    const { data } = await supabase
      .from('webhook_events')
      .insert({
        event_type: 'payhere.notify',
        status: 'received',
        order_number: payload.order_id || null,
        payment_id: payload.payment_id || null,
        signature_valid: false,
        payload,
      })
      .select('id')
      .single()

    return data?.id ?? null
  } catch (error) {
    console.error('Failed to record webhook event:', error)
    return null
  }
}

async function markWebhookEventStatus(
  supabase: any,
  eventId: number | null,
  updates: Record<string, any>
) {
  if (!eventId) return

  try {
    await supabase
      .from('webhook_events')
      .update(updates)
      .eq('id', eventId)
  } catch (error) {
    console.error('Failed to update webhook event:', error)
  }
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown error'
}
