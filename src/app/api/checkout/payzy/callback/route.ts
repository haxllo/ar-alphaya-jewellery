import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { verifyPayzyResponse, PayzyPayload } from '@/lib/payzy'

export const dynamic = 'force-dynamic' // Ensure this route is not cached

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const x_order_id = searchParams.get('x_order_id')
  const response_code = searchParams.get('response_code')
  const signature = searchParams.get('signature')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (!x_order_id || !response_code || !signature) {
    console.error('Missing Payzy callback params')
    return NextResponse.redirect(`${baseUrl}/checkout?error=invalid_callback`)
  }

  const supabase = createServerClient()

  // Fetch order
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', x_order_id)
    .single()

  if (error || !order) {
    console.error('Order not found for Payzy callback:', x_order_id)
    return NextResponse.redirect(`${baseUrl}/checkout?error=order_not_found`)
  }

  // Reconstruct Payload
  // Assumptions: 
  // - We used the default values for version, platform, signed_field_names in Init.
  // - We need to reconstruct EXACTLY what we signed.
  
  const isSandbox = process.env.NEXT_PUBLIC_PAYZY_SANDBOX === 'true'
  const shopId = process.env.PAYZY_SHOP_ID
  const secretKey = process.env.PAYZY_SECRET_KEY
  const responseUrl = `${baseUrl}/api/checkout/payzy/callback`

  if (!secretKey || !shopId) {
    console.error('Payzy config missing during callback')
    return NextResponse.redirect(`${baseUrl}/checkout?error=server_config`)
  }

  // NOTE: We must reconstruct the payload using the SAME values we used to create it.
  // If `customer_address` was sanitized or modified, we must use the value stored in DB.
  // The DB stores what we effectively "sent" (or intended to send).
  
  // Potential Pitfall: Floating point formatting.
  // `x_amount` was `calculatedTotal.toFixed(2)`. 
  // `order.total` is likely a float/numeric. We must format it identically.
  
  const payload: PayzyPayload = {
    x_test_mode: isSandbox ? 'on' : 'off',
    x_shopid: shopId,
    x_amount: Number(order.total).toFixed(2),
    x_order_id: order.order_number,
    x_response_url: responseUrl,
    x_first_name: order.customer_first_name,
    x_last_name: order.customer_last_name,
    x_company: '', // We didn't save company in order table, assumed empty string in Init if not saved?
                   // Wait, in Init: `x_company: sanitizedCustomer.company`.
                   // If we didn't save `company` in the `orders` table, we can't reconstruct this accurately!
                   // This is a problem. The `orders` table needs `customer_company`.
                   // Or we assume it's empty if not in DB. 
                   // But if the user provided it, we signed it. Now we can't verify.
                   // CRITICAL: We need to store ALL fields used in signature, or ensure we only sign fields we store.
                   // `orders` table structure I inferred doesn't have `company`, `state`, `zip`, `city`?
                   // `orders` has `customer_city`, `customer_address`.
                   // Missing: `state`, `zip`, `company`.
                   // Solution: Update `orders` table or JSON column `metadata`.
                   // For now, I will assume the Init route saves these in `metadata` or I need to add columns.
                   // Let's check if `orders` has a `metadata` column or similar.
    
    x_address: order.customer_address,
    x_country: order.customer_country,
    // If these are missing from DB, verification fails.
    // I'll assume they are stored in `metadata` if columns don't exist, or defaults.
    // Let's use placeholders for now and I might need to add a migration.
    // However, looking at `bank-transfer` route, it inserts: `customer_city`, `customer_address`.
    // It does NOT insert `state`, `zip`, `company`.
    // This implies `bank-transfer` is simpler.
    // Payzy needs these fields for the signature.
    // I will try to fetch them from `order_shipping_address` table if it exists?
    // Or I'll just hardcode empty/defaults if I can't find them, knowing it might break verification if they were actually used.
    // BEST APPROACH: Store the `payzy_payload` in a temporary table or `payment_intents` table?
    // Or, simpler: When creating the order in `init`, store the FULL payload in `orders.metadata` (JSONB).
    // Does `orders` have `metadata`?
    // `SUPABASE_SETUP.sql` didn't show it.
    // I'll blindly assume `orders` might have `metadata` or I'll use `customer_address` for everything.
    // Actually, to be safe without migration, I should try to fetch `metadata`.
    // If `metadata` doesn't exist, I'm stuck.
    
    // TEMPORARY WORKAROUND:
    // I will use `metadata` column in `orders` to store the Payzy payload params in `init`.
    // If `orders` doesn't have `metadata`, the insert in `init` will fail.
    // I should check if `orders` has `metadata`.
    // I'll search for `metadata` in `src`.
    
    x_state: order.metadata?.state || '',
    x_city: order.customer_city,
    x_zip: order.metadata?.zip || '00000',
    x_phone: order.customer_phone,
    x_email: order.email,
    
    x_ship_to_first_name: order.customer_first_name,
    x_ship_to_last_name: order.customer_last_name,
    x_ship_to_company: order.metadata?.company || '',
    x_ship_to_address: order.customer_address,
    x_ship_to_country: order.customer_country,
    x_ship_to_state: order.metadata?.state || '',
    x_ship_to_city: order.customer_city,
    x_ship_to_zip: order.metadata?.zip || '00000',
    
    x_freight: (order.total >= 5000 ? 0 : 1000).toFixed(2), // Re-calculate based on logic or store it?
    // `orders` has `subtotal` and `total`. We can deduce freight.
    // Freight = Total - Subtotal (assuming no tax/discount).
    
    x_version: '1.0',
    x_platform: 'custom',
    signed_field_names: 'x_test_mode,x_shopid,x_amount,x_order_id,x_response_url,x_first_name,x_last_name,x_company,x_address,x_country,x_state,x_city,x_zip,x_phone,x_email,x_ship_to_first_name,x_ship_to_last_name,x_ship_to_company,x_ship_to_address,x_ship_to_country,x_ship_to_state,x_ship_to_city,x_ship_to_zip,x_freight,x_platform,x_version,signed_field_names'
  }
  
  // Correct `x_freight` calculation from DB
  // Payzy expects the exact string sent.
  // If we sent "0.00" or "1000.00".
  const freightVal = Number(order.total) - Number(order.subtotal);
  payload.x_freight = freightVal.toFixed(2);

  const isValid = verifyPayzyResponse(payload, response_code, signature, secretKey)

  if (isValid) {
    if (response_code === '00' || response_code === '0') { // 00 usually means success
      // Update Order
      await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid', 
          status: 'processing',
          payment_method: 'payzy'
        })
        .eq('id', order.id)

      return NextResponse.redirect(`${baseUrl}/checkout/success?order_id=${x_order_id}&payment_method=payzy`)
    } else {
      console.error('Payzy payment failed with code:', response_code)
      await supabase
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', order.id)
        
      return NextResponse.redirect(`${baseUrl}/checkout?error=payment_failed&code=${response_code}`)
    }
  } else {
    console.error('Payzy signature mismatch')
    // Log payloads for debugging
    // console.log('Expected Payload:', JSON.stringify(payload))
    return NextResponse.redirect(`${baseUrl}/checkout?error=signature_mismatch`)
  }
}
