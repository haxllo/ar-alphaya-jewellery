# PayPal Implementation Review & Recommendations

## Current Implementation Status

### ✅ What's Working Well

1. **Basic Integration Complete**
   - PayPal button component properly implemented
   - Server-side order creation and capture
   - Sandbox/Production mode switching
   - Currency conversion from LKR to USD

2. **Good Architecture**
   - Separation of concerns (UI, API routes, library functions)
   - Access token generation
   - Error boundaries in place

### ⚠️ Critical Issues to Fix

#### 1. **Missing Idempotency Protection**
**Risk:** Duplicate charges if network issues cause retry
**Fix:** Add `PayPal-Request-Id` header to order creation

```typescript
// In lib/paypal.ts - createPayPalOrder function
const response = await fetch(url, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "PayPal-Request-Id": crypto.randomUUID(), // Add this
  },
  method: "POST",
  body: JSON.stringify(payload),
});
```

#### 2. **No Order Verification Before Capture**
**Risk:** User could manipulate orderID and capture someone else's payment
**Fix:** Verify order details before capture

```typescript
// In /api/checkout/paypal/capture/route.ts
export const POST = withErrorHandler(async (req: NextRequest) => {
  const { orderID, localOrderID } = await req.json()
  
  // STEP 1: Get order details from PayPal first
  const orderDetails = await getPayPalOrderDetails(orderID)
  
  // STEP 2: Verify order belongs to this merchant and matches local order
  if (orderDetails.purchase_units[0].reference_id !== localOrderID) {
    return NextResponse.json({ error: 'Order mismatch' }, { status: 400 })
  }
  
  // STEP 3: Verify order is in APPROVED state
  if (orderDetails.status !== 'APPROVED') {
    return NextResponse.json({ error: 'Order not approved' }, { status: 400 })
  }
  
  // STEP 4: Now capture
  const captureData = await capturePayPalOrder(orderID)
  
  // ... rest of code
})
```

#### 3. **Missing Webhook Handler**
**Risk:** Payment status updates might be missed if user closes browser
**Fix:** Implement webhook endpoint

Create `/api/checkout/paypal/webhook/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headers = req.headers
  
  // Verify webhook signature
  const verified = await verifyPayPalWebhook(body, headers)
  
  if (!verified) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  const event = JSON.parse(body)
  
  // Handle different event types
  switch (event.event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      await handlePaymentCaptured(event)
      break
    case 'PAYMENT.CAPTURE.DENIED':
      await handlePaymentDenied(event)
      break
    // ... other events
  }
  
  return NextResponse.json({ received: true })
}
```

#### 4. **Insufficient Error Handling**
**Fix:** Handle specific PayPal error codes

```typescript
// In lib/paypal.ts
export async function createPayPalOrder(amount: string, orderNumber: string) {
  try {
    const response = await fetch(url, {
      // ... config
    });
    
    if (!response.ok) {
      const error = await response.json()
      
      // Handle specific error codes
      if (error.name === 'INVALID_REQUEST') {
        throw new Error('Invalid order data')
      }
      if (error.name === 'AUTHORIZATION_ERROR') {
        throw new Error('PayPal authentication failed')
      }
      
      throw new Error(error.message || 'PayPal order creation failed')
    }
    
    return await response.json()
  } catch (error) {
    // Log to monitoring service
    console.error('PayPal order creation error:', error)
    throw error
  }
}
```

#### 5. **Missing Order Metadata**
**Fix:** Add proper descriptions and metadata

```typescript
// In lib/paypal.ts - createPayPalOrder
const payload = {
  intent: "CAPTURE",
  purchase_units: [
    {
      reference_id: orderNumber,
      description: `Order ${orderNumber} - AR ALPHAYA Jewellery`, // Add this
      custom_id: orderNumber, // Add this for easier tracking
      amount: {
        currency_code: "USD",
        value: amount,
        breakdown: { // Optional but recommended
          item_total: {
            currency_code: "USD",
            value: amount
          }
        }
      },
    },
  ],
  application_context: {
    brand_name: "AR ALPHAYA",
    shipping_preference: "NO_SHIPPING",
    user_action: "PAY_NOW",
    return_url: `${NEXT_PUBLIC_APP_URL}/checkout/success?order=${orderNumber}`, // Add order param
    cancel_url: `${NEXT_PUBLIC_APP_URL}/checkout?cancelled=true` // Add param
  }
};
```

### 📋 Recommended Improvements

#### 1. **Add Environment Variables**
Update `.env.example`:
```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_PAYPAL_SANDBOX=true  # false in production
PAYPAL_WEBHOOK_ID=your-webhook-id

# Optional: Configure currency
NEXT_PUBLIC_PAYPAL_CURRENCY=USD
```

#### 2. **Implement getPayPalOrderDetails Function**
```typescript
// In lib/paypal.ts
export async function getPayPalOrderDetails(orderID: string) {
  const accessToken = await generatePayPalAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get order details')
  }
  
  return await response.json();
}
```

#### 3. **Add Logging & Monitoring**
```typescript
// Create lib/paypal-logger.ts
export function logPayPalEvent(event: string, data: any) {
  console.log(`[PayPal] ${event}:`, {
    timestamp: new Date().toISOString(),
    ...data
  })
  
  // Send to monitoring service (Sentry, DataDog, etc.)
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureMessage(`PayPal: ${event}`, { level: 'info', extra: data })
  }
}
```

#### 4. **Improve Button Component**
```typescript
// In components/checkout/PayPalButton.tsx
export default function PayPalButton({ amount, orderId, onSuccess, onError }: PayPalButtonProps) {
  const [loaded, setLoaded] = useState(false)
  const [processing, setProcessing] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loaded && window.paypal && buttonRef.current) {
      buttonRef.current.innerHTML = ''
      
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold', // PayPal recommended
          shape: 'rect',
          label: 'paypal',
          height: 45
        },
        createOrder: async () => {
          setProcessing(true)
          try {
            const response = await fetch('/api/checkout/paypal/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount, orderId })
            })
            
            if (!response.ok) {
              throw new Error('Failed to create order')
            }
            
            const order = await response.json()
            return order.id
          } catch (err) {
            console.error('Create Order Error:', err)
            onError('Failed to initiate PayPal transaction')
            setProcessing(false)
            throw err
          }
        },
        onApprove: async (data: any) => {
          try {
            const response = await fetch('/api/checkout/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                orderID: data.orderID,
                localOrderID: orderId
              })
            })
            const result = await response.json()
            
            if (result.success) {
              onSuccess()
            } else {
              onError(result.error || 'Payment capture failed')
            }
          } catch (err) {
            console.error('Capture Order Error:', err)
            onError('Failed to verify payment')
          } finally {
            setProcessing(false)
          }
        },
        onCancel: () => {
          setProcessing(false)
          onError('Payment cancelled')
        },
        onError: (err: any) => {
          console.error('PayPal JS SDK Error:', err)
          setProcessing(false)
          onError('An error occurred with PayPal')
        }
      }).render(buttonRef.current)
    }
  }, [loaded, amount, orderId, onSuccess, onError])

  return (
    <div className="w-full min-h-[150px] flex flex-col items-center justify-center">
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
        onLoad={() => setLoaded(true)}
        onError={() => onError('Failed to load PayPal')}
      />
      {!loaded && <div className="animate-pulse bg-gray-200 h-10 w-full rounded" />}
      {processing && <div className="absolute inset-0 bg-white/50 flex items-center justify-center">Processing...</div>}
      <div ref={buttonRef} className="w-full" />
    </div>
  )
}
```

### 🔐 Security Checklist

- [ ] Implement PayPal-Request-Id for idempotency
- [ ] Verify order ownership before capture
- [ ] Validate order status is APPROVED before capture
- [ ] Set up webhook signature verification
- [ ] Never expose PAYPAL_CLIENT_SECRET to client
- [ ] Implement rate limiting on payment endpoints
- [ ] Add CSRF protection
- [ ] Log all payment events for audit trail
- [ ] Implement proper error messages (don't expose internal details)

### 📚 PayPal Documentation Links

1. **Orders API v2**: https://developer.paypal.com/docs/api/orders/v2/
2. **JavaScript SDK**: https://developer.paypal.com/sdk/js/reference/
3. **Webhooks**: https://developer.paypal.com/api/rest/webhooks/
4. **Sandbox Testing**: https://developer.paypal.com/tools/sandbox/
5. **Best Practices**: https://developer.paypal.com/sdk/js/best-practices/

### 🎯 Implementation Priority

**High Priority (Security Critical):**
1. Add order verification before capture
2. Implement PayPal-Request-Id
3. Add webhook handler
4. Improve error handling

**Medium Priority:**
5. Add order metadata and descriptions
6. Implement logging/monitoring
7. Add getOrderDetails function

**Low Priority:**
8. Improve button styling
9. Add more configuration options
10. Better user feedback messages

### 🧪 Testing Checklist

- [ ] Test with PayPal sandbox account
- [ ] Test payment success flow
- [ ] Test payment cancellation
- [ ] Test payment failure scenarios
- [ ] Test webhook notifications
- [ ] Test with different currencies
- [ ] Test error handling
- [ ] Test duplicate order prevention

## Next Steps

1. Review this document
2. Prioritize fixes based on your timeline
3. Test in sandbox thoroughly
4. Set up webhook endpoint in PayPal dashboard
5. Configure production credentials
6. Monitor payments in production
