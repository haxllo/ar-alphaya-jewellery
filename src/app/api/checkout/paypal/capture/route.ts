import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder, getPayPalOrderDetails } from '@/lib/paypal'
import { createServerClient } from '@/lib/supabase'
import { withErrorHandler } from '@/lib/error-handler'
import { logPayPalEvent } from '@/lib/paypal-logger'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const { orderID, localOrderID } = await req.json()
  
  // Validate required fields
  if (!orderID || !localOrderID) {
    logPayPalEvent({
      event: 'Capture.Validation.Failed',
      level: 'warn',
      metadata: { orderID, localOrderID }
    })
    return NextResponse.json(
      { success: false, error: 'Missing required fields' },
      { status: 400 }
    )
  }
  
  try {
    // STEP 1: Get order details from PayPal to verify
    const orderDetails = await getPayPalOrderDetails(orderID)
    
    // STEP 2: Verify order belongs to this merchant and matches local order
    const referenceId = orderDetails.purchase_units?.[0]?.reference_id
    if (referenceId !== localOrderID) {
      logPayPalEvent({
        event: 'Capture.Validation.Mismatch',
        level: 'error',
        orderId: localOrderID,
        metadata: { 
          paypalOrderId: orderID,
          expectedReferenceId: localOrderID,
          actualReferenceId: referenceId
        }
      })
      return NextResponse.json(
        { success: false, error: 'Order mismatch' },
        { status: 400 }
      )
    }
    
    // STEP 3: Verify order is in APPROVED state
    if (orderDetails.status !== 'APPROVED') {
      logPayPalEvent({
        event: 'Capture.Validation.NotApproved',
        level: 'warn',
        orderId: localOrderID,
        metadata: { 
          paypalOrderId: orderID,
          status: orderDetails.status
        }
      })
      return NextResponse.json(
        { success: false, error: `Order not approved (status: ${orderDetails.status})` },
        { status: 400 }
      )
    }
    
    // STEP 4: Now capture the payment
    const captureData = await capturePayPalOrder(orderID)
    
    // STEP 5: Verify capture was successful
    if (captureData.status === 'COMPLETED') {
      const supabase = createServerClient()
      
      const captureId = captureData.purchase_units[0].payments.captures[0].id
      const captureAmount = captureData.purchase_units[0].payments.captures[0].amount.value
      
      // Update order status in database
      const { error: dbError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'processing',
          metadata: {
            paypal_order_id: orderID,
            paypal_capture_id: captureId,
            paypal_captured_amount: captureAmount,
            paypal_captured_at: new Date().toISOString()
          }
        })
        .eq('order_number', localOrderID)
      
      if (dbError) {
        logPayPalEvent({
          event: 'Capture.Database.UpdateFailed',
          level: 'error',
          orderId: localOrderID,
          error: dbError,
          metadata: { paypalOrderId: orderID, captureId }
        })
        // Payment was captured but DB update failed - this needs manual review
        return NextResponse.json(
          { 
            success: false, 
            error: 'Payment captured but order update failed. Please contact support.',
            captureId 
          },
          { status: 500 }
        )
      }
      
      logPayPalEvent({
        event: 'Capture.Success',
        orderId: localOrderID,
        amount: captureAmount,
        metadata: { paypalOrderId: orderID, captureId }
      })
      
      return NextResponse.json({ 
        success: true,
        captureId,
        amount: captureAmount
      })
    }
    
    // Capture completed but status is not COMPLETED
    logPayPalEvent({
      event: 'Capture.UnexpectedStatus',
      level: 'warn',
      orderId: localOrderID,
      metadata: { 
        paypalOrderId: orderID,
        status: captureData.status
      }
    })
    
    return NextResponse.json(
      { success: false, error: 'Payment not completed' },
      { status: 400 }
    )
    
  } catch (error: any) {
    logPayPalEvent({
      event: 'Capture.Error',
      level: 'error',
      orderId: localOrderID,
      error,
      metadata: { paypalOrderId: orderID }
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to capture payment'
      },
      { status: 500 }
    )
  }
})
