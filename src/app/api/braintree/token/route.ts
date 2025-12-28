import { NextResponse } from 'next/server'
import { generateClientToken } from '@/lib/braintree'

export async function GET() {
  try {
    // Check if Braintree credentials are configured
    if (!process.env.BRAINTREE_MERCHANT_ID || 
        !process.env.BRAINTREE_PUBLIC_KEY || 
        !process.env.BRAINTREE_PRIVATE_KEY) {
      console.error('[Braintree] Missing credentials')
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 503 }
      )
    }

    const clientToken = await generateClientToken()
    
    return NextResponse.json({ clientToken })
  } catch (error: any) {
    console.error('[Braintree] Token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment system' },
      { status: 500 }
    )
  }
}
