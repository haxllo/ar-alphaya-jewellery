# PayHere Debug Guide

## Error: "Unauthorized payment request"

This error means PayHere is rejecting the payment request. Here are the possible causes and solutions:

---

## ✅ Checklist

### 1. Domain Registration in PayHere Sandbox

**CRITICAL**: You must register your domain in PayHere Merchant Portal

1. Go to: https://sandbox.payhere.lk/merchant/
2. Login with your merchant account
3. Go to **"Domains & Credentials"** section
4. Click **"Add Domain"**
5. Add these domains:

   **For Development**:
   ```
   localhost
   ```
   
   **Important Notes**:
   - Do NOT include `http://` or port number
   - Just type: `localhost`
   - NOT: `http://localhost:3000`
   - NOT: `localhost:3000`

6. Click Save
7. Wait 1-2 minutes for propagation

---

### 2. Check Your Merchant Credentials

**Check your `.env.local` file**:
```
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-merchant-secret
NEXT_PUBLIC_PAYHERE_SANDBOX=true
```

**Verify in PayHere Portal**:
1. Go to: https://sandbox.payhere.lk/merchant/
2. Go to "Integrations" → "Merchant Keys"
3. Compare:
   - **Merchant ID** should match your .env value
   - **Merchant Secret** should match the one in your .env (exact match)

---

### 3. Check Hash Generation

The current code uses MD5 hashing (correct for PayHere):

```typescript
// Step 1: Hash the merchant secret
const hashedSecret = MD5(merchantSecret).toUpperCase()

// Step 2: Create the hash
const hash = MD5(merchantId + orderId + amount + currency + hashedSecret).toUpperCase()
```

**For your test payment**:
- Merchant ID: Your merchant ID from .env
- Order ID: `ORDER-xxxxx` (auto-generated)
- Amount: `74899.00` (formatted to 2 decimals)
- Currency: `LKR`

---

### 4. Common Issues & Solutions

#### Issue A: Domain Not Registered
**Symptom**: "Unauthorized payment request"
**Solution**: 
- Register domain in PayHere portal (see step 1)
- Wait 1-2 minutes after adding
- Try payment again

#### Issue B: Wrong Merchant Credentials
**Symptom**: "Unauthorized payment request"
**Solution**:
- Double-check merchant ID and secret in PayHere portal
- Copy exact values to `.env.local`
- Restart dev server: `npm run dev`

#### Issue C: Amount Format Wrong
**Symptom**: "Unauthorized payment request"
**Solution**:
- Amount should be formatted as: `74899.00` (2 decimal places)
- NOT: `74,899.00` (no commas)
- NOT: `74899` (must have decimals)

Current code formats correctly: `parseFloat(total.toFixed(2))`

#### Issue D: Sandbox Mode Not Enabled
**Symptom**: Payment rejected
**Solution**:
- Ensure `.env.local` has: `NEXT_PUBLIC_PAYHERE_SANDBOX=true`
- Restart dev server

---

## 🔍 Debug Payment Request

To see exactly what's being sent to PayHere, check your browser console (F12):

Look for the log:
```
PayHere Payment Details: {
  merchantId: "YOUR_MERCHANT_ID",
  orderId: "ORDER-xxxxx",
  amount: "74899.00",
  amountType: "string",
  currency: "LKR",
  hash: "FULL_HASH_HERE",
  hashPreview: "a1b2c3d4e5...",
}
```

**Verify**:
1. Merchant ID matches your account ✓
2. Amount is correct: `"74899.00"` (string with 2 decimals) ✓
3. amountType is: `"string"` ✓
4. Currency is: `LKR` ✓
5. Hash is generated (not empty) ✓

---

## 🧪 Testing Steps

### Test 1: Verify Domain Registration

1. Open PayHere Merchant Portal: https://sandbox.payhere.lk/merchant/
2. Go to "Domains & Credentials"
3. Check if `localhost` is listed
4. If not, add it and wait 2 minutes

### Test 2: Test Payment

1. Go to your site: http://localhost:3000
2. Add the "Infinity CZ Ring" to cart
3. Go to checkout
4. Fill in billing details
5. Click "Place Order"
6. PayHere modal should open (not error popup)

### Test 3: Use PayHere Test Card

When PayHere modal opens, use:
```
Card Number: 4111 1111 1111 1111
Expiry: 12/25
CVV: 123
Name: Test User
```

---

## 🚨 If Still Getting Error

### Step-by-Step Verification

1. **Check Browser Console (F12)**:
   - Look for any errors
   - Copy the "PayHere Payment Details" log
   - Share if you need help debugging

2. **Check Network Tab**:
   - Open DevTools (F12) → Network tab
   - Click "Place Order"
   - Look for `/api/checkout/payhere` request
   - Check the response
   - Copy any error messages

3. **Verify PayHere Portal Settings**:
   - Screenshot your "Domains & Credentials" page
   - Screenshot your "Merchant Keys" page
   - Verify domain is `localhost` (not `http://localhost:3000`)

4. **Try These Fixes**:

   **Fix A: Clear browser cache and restart**
   ```bash
   # Stop dev server (Ctrl+C)
   # Clear .next folder
   rm -rf .next
   # Restart
   npm run dev
   ```

   **Fix B: Double-check .env.local**
   ```bash
   # Make sure values match PayHere portal exactly
   NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your-merchant-id
   PAYHERE_MERCHANT_SECRET=your-exact-secret-from-portal
   NEXT_PUBLIC_PAYHERE_SANDBOX=true
   ```

   **Fix C: Test with minimal amount**
   - Try with Rs. 100.00 item
   - Rule out amount-specific issues

---

## 📞 Need More Help?

1. **Share these details**:
   - Browser console logs
   - Network tab errors
   - Screenshot of PayHere "Domains" page
   - Screenshot of error popup

2. **Try PayHere Support**:
   - Email: support@payhere.lk
   - They can verify your merchant account settings

3. **Common Working Configuration**:
   ```
   Domain registered: localhost
   Merchant ID: <your merchant ID>
   Sandbox mode: true
   Amount format: "74899.00" (string with 2 decimals)
   Currency: LKR
   Hash: MD5 (uppercase)
   ```

---

## ✅ Success Indicators

When everything is configured correctly:
1. ✅ No "Unauthorized" error
2. ✅ PayHere modal opens with payment form
3. ✅ Can enter card details
4. ✅ Test payment processes successfully

---

**Most Common Fix**: Register domain as `localhost` (NOT `http://localhost:3000`) and wait 2 minutes.
