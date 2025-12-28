import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPayPalOrder } from '@/lib/paypal'
import { CurrencyService } from '@/lib/currency'
import { withErrorHandler } from '@/lib/error-handler'

const schema = z.object({
  amount: z.number(),
  orderId: z.string()
})

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json()
  const { amount, orderId } = schema.parse(body)
  
  // Convert LKR to USD for PayPal
  const amountInUSD = CurrencyService.convertBetweenCurrencies(amount, 'LKR', 'USD')
  const formattedAmount = amountInUSD.toFixed(2)
  
  const paypalOrder = await createPayPalOrder(formattedAmount, orderId)
  
  return NextResponse.json(paypalOrder)
})
