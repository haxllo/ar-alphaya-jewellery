import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createTransaction } from '@/lib/braintree'
import { CurrencyService } from '@/lib/currency'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const checkoutSchema = z.object({
  paymentMethodNonce: z.string().min(1, 'Payment method nonce is required'),
  amount: z.number().positive('Amount must be positive'),
  orderId: z.string().min(1, 'Order ID is required'),
  deviceData: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentMethodNonce, amount, orderId, deviceData } = checkoutSchema.parse(body)

    // Convert LKR to USD for Braintree
    const amountInUSD = CurrencyService.convertBetweenCurrencies(amount, 'LKR', 'USD')
    const formattedAmount = amountInUSD.toFixed(2)

    console.log(`[Braintree] Processing payment for order ${orderId}: LKR ${amount} → USD ${formattedAmount}`)

    // Create transaction
    const transaction = await createTransaction(
      formattedAmount,
      paymentMethodNonce,
      orderId,
      { deviceData }
    )

    console.log(`[Braintree] Transaction successful: ${transaction.id}, status: ${transaction.status}`)

    // Update order in database
    try {
      const { error: dbError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_method: 'card',
          payment_provider: 'braintree',
          payment_id: transaction.id,
          payment_metadata: {
            transactionId: transaction.id,
            status: transaction.status,
            processorResponseCode: transaction.processorResponseCode,
            processorResponseText: transaction.processorResponseText,
            cardType: transaction.creditCard?.cardType,
            last4: transaction.creditCard?.last4,
            amount: formattedAmount,
            currency: 'USD'
          },
          updated_at: new Date().toISOString()
        })
        .eq('order_number', orderId)

      if (dbError) {
        console.error('[Braintree] Database update error:', dbError)
        // Don't fail the payment if DB update fails - transaction is already complete
      }
    } catch (dbErr) {
      console.error('[Braintree] Database error:', dbErr)
    }

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      status: transaction.status
    })

  } catch (error: any) {
    console.error('[Braintree] Checkout error:', error)

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Handle Braintree specific errors
    const errorMessage = error.message || 'Payment processing failed'
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    )
  }
}
