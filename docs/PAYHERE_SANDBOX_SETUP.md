# PayHere Sandbox Setup - Troubleshooting "Unauthorized Payment Request"

## Error: "Unauthorized payment request"

This error occurs when PayHere rejects your payment request. This is **NOT normal** in sandbox mode when properly configured.

## Root Causes

1. ❌ **Domain not registered** in PayHere Merchant Portal
2. ❌ **Merchant ID mismatch** between code and portal
3. ❌ **Hash verification failure** on PayHere's side

## Solution: Register Your Domain

### Step 1: Login to PayHere Sandbox

1. Go to: https://sandbox.payhere.lk/merchant/sign-in
2. Login with your sandbox credentials
3. If you don't have an account: https://sandbox.payhere.lk/merchant/sign-up

### Step 2: Add Your Domain

1. After logging in, navigate to:
   - **Settings** → **Integrations** 
   - OR **Domains** section (sidebar)

2. Click **"Add Domain/App"** button

3. Add the following domains:
   - `localhost` (for local development)
   - `localhost:3000` (with port)
   - Your production domain (when deploying)

4. After adding, you'll see:
   - ✅ Domain approved/registered
   - Your **Merchant ID** displayed
   - Your **Merchant Secret** (copy this)

### Step 3: Verify Your Credentials

Check your `.env.local` file matches the portal:

```bash
# From PayHere Sandbox Portal
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=1232859  # ← Must match portal
PAYHERE_MERCHANT_SECRET=MjcyMDUzNDE5MjE2MDU0NDA3OTE2ODI4NDU2NDMxMTE3ODI3MTk1  # ← Must match portal
NEXT_PUBLIC_PAYHERE_SANDBOX=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 4: Restart Dev Server

After making changes:
```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

## Verification Checklist

Before testing payment:

- [ ] Logged into PayHere sandbox portal
- [ ] Domain `localhost` is registered
- [ ] Merchant ID in `.env.local` matches portal
- [ ] Merchant Secret in `.env.local` matches portal
- [ ] `NEXT_PUBLIC_PAYHERE_SANDBOX=true` is set
- [ ] Dev server restarted after .env changes

## Testing the Fix

1. **Clear browser cache** (or use incognito)
2. Navigate to `/checkout`
3. Fill customer information
4. Click "Place Order"
5. **Expected**: PayHere payment modal opens with card input form
6. **Not Expected**: "Unauthorized payment request" error

## Debugging Steps

### Check Browser Console

Look for: `Initializing PayHere with data:`

Should see something like:
```javascript
{
  merchant_id: "1232859",
  order_id: "ORDER-1234567890",
  amount: 7240.07,
  currency: "LKR",
  hash: "ABC123DEF...",
  // ... other fields
}
```

### Check Backend Logs

Terminal should show:
```
PayHere Payment Details: {
  merchantId: '1232859',
  orderId: 'ORDER-1234567890',
  amount: 7240.07,
  currency: 'LKR',
  hashPreview: '...',
  totalRaw: 724007,
  itemCount: 1
}
```

### Verify Hash Generation

The hash formula must be:
```
MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret))
```

Example:
```javascript
// Step 1: Hash the secret
const hashedSecret = MD5("YOUR_MERCHANT_SECRET")  // uppercase hex

// Step 2: Concatenate values
const hashString = "1232859" + "ORDER-123" + "100.00" + "LKR" + hashedSecret

// Step 3: Hash the result
const hash = MD5(hashString)  // uppercase hex
```

## Common Mistakes

### ❌ Wrong Domain Format
```
✗ http://localhost:3000  (includes protocol)
✗ localhost/           (includes slash)
✓ localhost            (correct)
✓ localhost:3000       (with port, if needed)
```

### ❌ Environment Variables Not Loaded
```bash
# Solution: Restart server after .env changes
npm run dev
```

### ❌ Using Production Credentials in Sandbox
```bash
# Make sure you're using SANDBOX credentials
NEXT_PUBLIC_PAYHERE_SANDBOX=true  # ← Must be true for testing
```

### ❌ Hash Formula Incorrect
```javascript
// WRONG: Using SHA-256
const hash = SHA256(...)

// CORRECT: Using MD5
const hash = MD5(...)
```

## Still Not Working?

### 1. Double-Check Merchant Portal

- Login: https://sandbox.payhere.lk/merchant/
- Go to: **Settings** → **Integrations**
- Verify `localhost` is in the list
- Copy Merchant ID and Secret again
- Update `.env.local`
- Restart server

### 2. Check PayHere Status

- PayHere sandbox might be down
- Check: https://www.payhere.lk/
- Try again in a few minutes

### 3. Test with Minimal Data

Try with a small amount:
```javascript
amount: 10.00  // Rs. 10.00
```

### 4. Enable All Debug Logs

Check both:
- **Browser Console**: Developer Tools (F12) → Console
- **Terminal**: Where `npm run dev` is running

### 5. Contact PayHere Support

If still failing:
- Email: support@payhere.lk
- Provide: Merchant ID, Order ID, Error message
- Mention: "Sandbox testing - Unauthorized payment request"

## Success Indicators

✅ **Payment modal opens** with:
- PayHere logo
- Your store name
- Amount in Rs.
- Card input fields
- "Pay Now" button

❌ **Error modal shows**:
- "Unauthorized payment request"
- "This is a merchant's error"
- "Go Back" button

## Next Steps After Fix

Once domain is registered and payment modal opens:

1. **Test with success cards**:
   - Visa: `4916217501611292`
   - MasterCard: `5307732125531191`

2. **Test failure scenarios**:
   - Insufficient funds: `4024007194349121`
   - Network error: `4024007120869333`

3. **Verify webhook**:
   - Check order status updates
   - Check database records

## Production Deployment

When going live:

1. Register production domain in PayHere **PRODUCTION** portal
2. Get production Merchant ID and Secret
3. Update `.env.production`:
   ```bash
   NEXT_PUBLIC_PAYHERE_SANDBOX=false
   ```
4. Test with real small amount (refundable)
5. Verify webhook works with public URL

## Resources

- **PayHere Sandbox Portal**: https://sandbox.payhere.lk/merchant/
- **PayHere Documentation**: https://support.payhere.lk/
- **PayHere Test Cards**: https://support.payhere.lk/sandbox-and-testing
- **PayHere Support**: support@payhere.lk

## Summary

**The "Unauthorized payment request" error is caused by missing domain registration in PayHere Merchant Portal.**

**Fix**: Add `localhost` to your sandbox account integrations, verify credentials match, restart dev server.
