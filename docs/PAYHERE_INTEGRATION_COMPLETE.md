# PayHere Integration - Implementation Complete

## Overview

The PayHere payment gateway integration is now fully implemented with client-side SDK, webhook handling, and complete user flows for the AR Alphaya Jewellery e-commerce platform.

## Architecture

### Backend (API Routes)

#### `/api/checkout/payhere/route.ts`
- Creates order in Supabase database
- Generates secure SHA-256 hash for payment verification
- Returns payment data to frontend
- Environment variables required:
  - `NEXT_PUBLIC_PAYHERE_MERCHANT_ID` - Your PayHere merchant ID
  - `PAYHERE_MERCHANT_SECRET` - Your PayHere merchant secret (server-only)
  - `NEXT_PUBLIC_PAYHERE_SANDBOX` - Set to `true` for testing

#### `/api/checkout/payhere/notify/route.ts`
- Webhook endpoint for PayHere payment notifications
- Verifies payment signature using SHA-256
- Updates order status in database
- Status mapping:
  - `2` = Success (paid)
  - `0` = Pending (processing)
  - `-1` = Cancelled (failed)
  - `-2` = Failed
  - `-3` = Chargedback (refunded)

### Frontend

#### Core Components

**`src/components/checkout/PayHereCheckout.tsx`**
- Client-side PayHere SDK handler
- Manages payment lifecycle
- Handles callbacks (success, cancel, error)
- Automatically redirects to appropriate pages

**`src/app/checkout/page.tsx`**
- Main checkout form
- Customer information collection
- Payment method selection
- Integrates PayHereCheckout component

**`src/app/checkout/success/page.tsx`**
- Payment success confirmation
- Order details display
- Next steps information
- Links to order tracking

**`src/app/checkout/cancel/page.tsx`**
- Payment cancellation handling
- Helpful error messages
- Options to retry or return to cart

#### Library Functions

**`src/lib/checkout/payhere-sdk.ts`**
- Dynamic SDK loading
- Payment initialization
- Callback management
- Cleanup utilities

**`src/lib/checkout/payment-validation.ts`**
- Customer info validation
- Sri Lankan phone number validation
- Email format checking
- Form error handling

**`src/lib/checkout/order-utils.ts`**
- Order ID generation
- Status formatting
- Currency conversion
- Order calculations

#### TypeScript Definitions

**`src/types/payhere.d.ts`**
- PayHere SDK type definitions
- Payment data interfaces
- Window object extensions

## Payment Flow

### 1. Customer Checkout
```
User adds items to cart → Navigates to /checkout → Fills customer info → Selects payment method
```

### 2. Payment Initiation
```
User clicks "Place Order" → Frontend calls /api/checkout/payhere
→ Backend creates order in database
→ Backend generates secure hash
→ Backend returns payment data
```

### 3. PayHere Processing
```
PayHereCheckout component receives payment data
→ Loads PayHere SDK dynamically
→ Calls window.payhere.startPayment()
→ User completes payment on PayHere
```

### 4. Payment Completion
```
PayHere notifies our webhook (/api/checkout/payhere/notify)
→ Backend verifies signature
→ Backend updates order status
→ User sees success/cancel page
→ Email confirmation sent (TODO)
```

## Environment Setup

### Development (Sandbox)

```bash
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your-sandbox-merchant-id
PAYHERE_MERCHANT_SECRET=your-sandbox-merchant-secret
NEXT_PUBLIC_PAYHERE_SANDBOX=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production

```bash
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your-production-merchant-id
PAYHERE_MERCHANT_SECRET=your-production-merchant-secret
NEXT_PUBLIC_PAYHERE_SANDBOX=false
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Important**: The `notify_url` must be publicly accessible. For local development, use ngrok or similar tools to expose your webhook.

## Testing with Sandbox

### Test Card Numbers

**Success:**
- Visa: `4916217501611292`
- MasterCard: `5307732125531191`
- AMEX: `346781005510225`

**Failure Scenarios:**
- Insufficient Funds:
  - Visa: `4024007194349121`
  - MasterCard: `5459051433777487`
- Limit Exceeded:
  - Visa: `4929119799365646`
  - MasterCard: `5491182243178283`
- Network Error:
  - Visa: `4024007120869333`
  - MasterCard: `5237980565185003`

### Testing Workflow

1. **Setup Sandbox Environment**
   - Register at https://sandbox.payhere.lk/merchant/sign-up
   - Get sandbox merchant ID and secret
   - Set `NEXT_PUBLIC_PAYHERE_SANDBOX=true`

2. **Test Payment Flow**
   - Add items to cart
   - Go to checkout
   - Fill customer information
   - Select "PayHere" payment method
   - Click "Place Order"
   - Use test card numbers
   - Verify success/cancel pages
   - Check webhook logs in terminal
   - Verify order status in database

3. **Verify Webhook**
   ```bash
   # Check order status was updated
   SELECT order_number, status, payment_status, payment_id 
   FROM orders 
   WHERE order_number = 'ORDER-XXX';
   ```

## Security Features

### Hash Verification
- All payments use MD5 hashing (required by PayHere API)
- Hash formula: `MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret))`
- Merchant secret never exposed to client
- Webhook signatures verified on server using the same MD5 formula

### Rate Limiting
- Payment endpoints protected by rate limiting
- Prevents abuse and spam

### Input Validation
- All customer data validated on client and server
- SQL injection protection via Supabase prepared statements
- XSS protection via React's built-in sanitization

## Database Schema

### Orders Table
```sql
- id: uuid (primary key)
- order_number: text (unique)
- user_id: uuid (nullable)
- email: text
- status: text (pending, processing, paid, shipped, delivered, cancelled, refunded)
- payment_status: text (pending, processing, paid, failed, refunded)
- payment_method: text (payhere, bank_transfer)
- payment_id: text (nullable, from PayHere)
- subtotal: numeric
- shipping: numeric
- total: numeric
- currency: text
- customer_first_name: text
- customer_last_name: text
- customer_phone: text
- customer_address: text
- customer_city: text
- customer_country: text
- paid_at: timestamp (nullable)
- cancelled_at: timestamp (nullable)
- created_at: timestamp
- updated_at: timestamp
```

### Order Items Table
```sql
- id: uuid (primary key)
- order_id: uuid (foreign key)
- product_id: uuid
- slug: text
- name: text
- price: numeric
- quantity: integer
- size: text (nullable)
- gemstone: text (nullable)
- image: text (nullable)
- created_at: timestamp
```

## Implementation Status

### ✅ Phase 1: Core Integration (COMPLETE)
- [x] PayHere SDK loader
- [x] TypeScript type definitions
- [x] PayHereCheckout component
- [x] Backend API endpoints
- [x] Webhook handler
- [x] Database integration

### ✅ Phase 3: Success/Cancel Pages (COMPLETE)
- [x] Success page with order confirmation
- [x] Cancel page with retry options
- [x] Error handling

### 🚧 Phase 2: Modern UI (PARTIALLY COMPLETE)
- [x] Basic checkout form
- [ ] Enhanced billing info card
- [ ] Visual payment method selector
- [ ] Improved order summary card
- [ ] Payment method icons (Visa, Mastercard, etc.)

### 🚧 Phase 4: Mobile Responsive (PARTIALLY COMPLETE)
- [x] Basic mobile layout
- [ ] Sticky order summary on desktop
- [ ] Collapsible sections on mobile
- [ ] Touch-optimized buttons

### 📋 Phase 5: Enhanced Features (TODO)
- [ ] Save billing information
- [ ] Quick checkout for returning users
- [ ] Order tracking page
- [ ] Email notifications
- [ ] Payment retry logic
- [ ] Loading skeletons

## Next Steps for Phase 2: Modern UI

### 1. Create Enhanced Components

**BillingInfoCard.tsx** - Inspired by Creative Tim
```typescript
// Clean card layout with grouped fields
// Pre-fill from user profile
// Edit/save states
```

**PaymentMethodSelector.tsx** - Visual payment selection
```typescript
// Card-based selection UI
// Payment logos (Visa, Mastercard, AMEX)
// Highlight selected method
```

**OrderSummaryCard.tsx** - Professional cart summary
```typescript
// Item cards with images
// Subtotal/shipping/total breakdown
// Apply coupon section
// Sticky on desktop
```

### 2. Add Payment Logos

Download payment method logos:
- Visa logo
- Mastercard logo
- AMEX logo
- PayHere logo

Place in `public/payment-logos/`

### 3. Enhance Progress Indicator

Current: Basic 3-step indicator
Enhanced: Better visual design with icons

## Troubleshooting

### PayHere SDK Not Loading
- Check internet connection
- Verify script URL: https://www.payhere.lk/lib/payhere.js
- Check browser console for errors

### Webhook Not Receiving Notifications
- Ensure `notify_url` is publicly accessible
- Check if using ngrok for local development
- Verify webhook endpoint is not rate-limited
- Check server logs for incoming requests

### Payment Signature Mismatch
- Verify merchant secret is correct
- Check hash generation algorithm (must be SHA-256)
- Ensure amount formatting matches (2 decimal places)
- Check merchant ID matches

### Order Not Updating After Payment
- Check webhook logs in terminal
- Verify order_number matches between PayHere and database
- Check Supabase logs for errors
- Ensure webhook can access database

## API Reference

### POST /api/checkout/payhere

**Request Body:**
```json
{
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+94771234567",
    "address": "123 Main Street",
    "city": "Colombo",
    "postalCode": "00100"
  },
  "items": [
    {
      "productId": "uuid",
      "name": "Product Name",
      "price": 50000,
      "quantity": 1,
      "size": "M",
      "image": "url"
    }
  ],
  "total": 51000,
  "orderId": "ORDER-1234567890"
}
```

**Response:**
```json
{
  "paymentData": {
    "sandbox": true,
    "merchant_id": "xxx",
    "order_id": "ORDER-1234567890",
    "amount": 510.00,
    "currency": "LKR",
    "hash": "...",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+94771234567",
    "address": "123 Main Street",
    "city": "Colombo",
    "country": "Sri Lanka",
    "return_url": "https://yourdomain.com/checkout/success",
    "cancel_url": "https://yourdomain.com/checkout/cancel",
    "notify_url": "https://yourdomain.com/api/checkout/payhere/notify"
  },
  "orderId": "uuid"
}
```

### POST /api/checkout/payhere/notify (Webhook)

**Request Body (form-data):**
```
merchant_id=xxx
order_id=ORDER-1234567890
payment_id=320012345
payhere_amount=510.00
payhere_currency=LKR
status_code=2
md5sig=...
method=VISA
card_holder_name=JOHN DOE
card_no=************1234
```

**Response:**
```json
{
  "status": "ok"
}
```

## Resources

- [PayHere Documentation](https://support.payhere.lk/api-&-mobile-sdk/payhere-checkout)
- [PayHere Sandbox](https://sandbox.payhere.lk/)
- [Creative Tim Billing Blocks](https://creative-tim.com/ui/blocks/billing)
- [Supabase Documentation](https://supabase.com/docs)

## Support

For issues or questions:
1. Check this documentation
2. Review PayHere API documentation
3. Check browser console for errors
4. Review server logs
5. Contact PayHere support for payment-specific issues
