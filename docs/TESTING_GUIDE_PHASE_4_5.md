# Testing Guide: Phase 4 & 5

**Purpose**: Verify mobile optimization and email notifications are working correctly before production deployment.

---

## 🔴 Critical: Database Migration First

**MUST DO BEFORE TESTING**

Run this migration in your Supabase SQL Editor:

```bash
# Open: https://supabase.com/dashboard/project/YOUR_PROJECT/editor

# Run the migration file:
database/migrations/005_add_email_tracking.sql
```

Or run manually:

```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_orders_email_sent ON orders(email_sent);
```

**Verify**:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'email_sent';
```

---

## 📱 Phase 4: Mobile UI Testing

### Test Environment Setup

1. **Start Development Server**
```bash
npm run dev
```

2. **Access Checkout Page**
```
http://localhost:3000/checkout
```

3. **Add Items to Cart First**
   - Navigate to products page
   - Add 2-3 items to cart
   - Go to checkout

### Mobile Emulation in Browser

**Chrome DevTools**:
1. Press `F12` to open DevTools
2. Click device toggle icon (Ctrl+Shift+M)
3. Select device: iPhone 12 Pro or Pixel 5
4. Reload page

**Firefox DevTools**:
1. Press `F12` to open DevTools
2. Click responsive design mode (Ctrl+Shift+M)
3. Select device preset
4. Reload page

### Test Cases

#### Test 1: Mobile Order Summary ✅

**Expected Behavior**:
- [ ] Collapsible summary appears at top (below progress bar)
- [ ] Shows "Order Summary (X items)" with total price
- [ ] Shows "Tap to view details" text
- [ ] Desktop summary is hidden
- [ ] Chevron down icon visible

**Action**: Tap on summary header

**Expected**:
- [ ] Summary expands with smooth animation
- [ ] Shows all products with images
- [ ] Shows subtotal, shipping, total breakdown
- [ ] Chevron changes to up icon
- [ ] Text changes to "Tap to hide details"

**Action**: Tap header again

**Expected**:
- [ ] Summary collapses smoothly
- [ ] Returns to compact view

#### Test 2: Mobile Sticky Footer ✅

**Expected Behavior**:
- [ ] Footer fixed at bottom of screen
- [ ] Shows total price on left
- [ ] Shows "Place Order" button on right
- [ ] Has backdrop blur effect
- [ ] Stays visible when scrolling
- [ ] Desktop "Place Order" button is hidden

**Action**: Scroll down the page

**Expected**:
- [ ] Footer stays at bottom (doesn't scroll away)
- [ ] Price remains visible
- [ ] Button remains accessible

**Action**: Fill form and tap "Place Order"

**Expected**:
- [ ] Button shows "Processing..." with spinner
- [ ] Button is disabled during processing
- [ ] PayHere modal opens (if configured)

#### Test 3: Responsive Breakpoints ✅

**Mobile (< 1024px)**:
- [ ] Collapsible summary visible
- [ ] Sticky footer visible
- [ ] Desktop summary hidden
- [ ] Desktop button hidden
- [ ] Single column layout

**Desktop (>= 1024px)**:
- [ ] Collapsible summary hidden
- [ ] Sticky footer hidden
- [ ] Desktop summary visible (right column)
- [ ] Desktop button visible (in form)
- [ ] Two column layout

#### Test 4: Touch Targets ✅

**All Interactive Elements**:
- [ ] "Place Order" button: >= 48px tall ✅ (h-12)
- [ ] Summary expand button: Full width, good height
- [ ] Payment method cards: Large clickable area
- [ ] Input fields: Easy to tap

**How to Verify**:
- Use DevTools to inspect element height
- Should be at least 44px (Apple) or 48px (Google) for touch

#### Test 5: Safe Area Insets (iPhone) ✅

**Only on iPhone X and newer (with notch)**:

**Expected**:
- [ ] Footer respects bottom safe area
- [ ] No content hidden by notch
- [ ] Button fully accessible

**How to Test**:
- Use iPhone device simulator
- Or use Chrome DevTools with iPhone 12 Pro
- Check bottom of screen

#### Test 6: Keyboard Behavior ✅

**Action**: Tap on an input field

**Expected**:
- [ ] Keyboard appears
- [ ] Input field scrolls into view
- [ ] Sticky footer may slide up (normal behavior)
- [ ] Form remains usable

### Real Device Testing

#### iOS Testing (Recommended)

**Methods**:
1. **Ngrok** (Best):
```bash
npx ngrok http 3000
# Use https://xxxxx.ngrok.io URL on your iPhone
```

2. **Local Network**:
```bash
# Find your IP: ipconfig (Windows) or ifconfig (Mac)
# Access: http://YOUR_IP:3000 on iPhone
```

3. **BrowserStack** (Premium):
- Go to browserstack.com
- Test on real iPhone devices

**iOS Devices to Test**:
- iPhone SE (small screen)
- iPhone 12/13/14 Pro (standard)
- iPhone 14 Pro Max (large)

#### Android Testing (Recommended)

**Methods**:
- Same ngrok or local network setup
- Chrome Remote Debugging
- BrowserStack

**Android Devices to Test**:
- Pixel 5 (standard)
- Samsung Galaxy S21 (popular)

### Screenshot Checklist

Take screenshots of:
1. Mobile summary collapsed
2. Mobile summary expanded
3. Sticky footer at bottom
4. Form filled with footer visible
5. Desktop view (for comparison)

---

## 📧 Phase 5: Email Testing

### Prerequisites

1. **RESEND_API_KEY Configured**

Check your `.env.local`:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

If missing, get API key from:
```
https://resend.com/api-keys
```

2. **EMAIL_FROM Configured** (Optional)

```bash
EMAIL_FROM=noreply@alphayajewellery.com
```

Falls back to default if not set.

3. **Database Migration Ran**

Verify `email_sent` column exists (see above).

### Test Scenario 1: Complete Sandbox Payment

#### Step 1: Prepare Test Order

1. Start dev server
2. Sign in to your test account
3. Add products to cart (2-3 items)
4. Go to checkout
5. Fill billing information with **real email address you can access**

#### Step 2: Initiate Payment

1. Select "Pay with PayHere"
2. Click "Place Order"
3. PayHere sandbox modal should open

#### Step 3: Complete Test Payment

Use PayHere test card:
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/25)
CVV: 123
Name: Test User
```

Click "Pay Now"

#### Step 4: Verify Email Sent

**Check Server Logs**:
```bash
# In terminal running dev server, look for:
Order status updated: { orderId: 'ORDER-xxxxx', ... }
Order confirmation email sent: ORDER-xxxxx
```

**Check Your Email Inbox**:
- [ ] Email received within 1-2 minutes
- [ ] Subject: "Order Confirmation #ORDER-xxxxx - AR Alphaya Jewellery"
- [ ] From: Your configured sender
- [ ] To: Your test email

**If Email Not Received**:
1. Check spam/junk folder
2. Check server logs for errors
3. Verify RESEND_API_KEY is valid
4. Check Resend dashboard for email status

#### Step 5: Verify Email Content

**Email Should Include**:
- [ ] AR Alphaya Jewellery header (black background)
- [ ] Green success badge with checkmark
- [ ] Order number (ORDER-xxxxx)
- [ ] Order date
- [ ] Payment method (PayHere)
- [ ] Product list with images
- [ ] Each product shows: name, size, quantity, price
- [ ] Subtotal, shipping, total (formatted as "Rs. 8,240.00")
- [ ] "What's Next?" section with timeline
- [ ] "Track Your Order" button
- [ ] Support email contact
- [ ] AR Alphaya footer

#### Step 6: Test Email Links

**Click "Track Your Order" Button**:
- [ ] Should go to `/account/orders` (may show 404 if not built yet)
- [ ] Link should work (not broken)

**Click Support Email**:
- [ ] Should open email client
- [ ] Should have correct email address

#### Step 7: Check Database

```sql
-- In Supabase SQL Editor
SELECT 
  order_number, 
  status, 
  payment_status, 
  email_sent,
  email,
  total
FROM orders 
WHERE order_number = 'ORDER-xxxxx'  -- Your order number
ORDER BY created_at DESC 
LIMIT 1;
```

**Expected**:
- [ ] status = 'paid'
- [ ] payment_status = 'paid'
- [ ] email_sent = true
- [ ] email = your test email
- [ ] total = correct amount

### Test Scenario 2: Duplicate Email Prevention

**Purpose**: Ensure email isn't sent twice

#### Step 1: Trigger Webhook Manually

If you have ngrok or public URL:

```bash
curl -X POST https://your-domain.com/api/checkout/payhere/notify \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "merchant_id=YOUR_MERCHANT_ID" \
  -d "order_id=ORDER-xxxxx" \
  -d "payhere_amount=8240.00" \
  -d "payhere_currency=LKR" \
  -d "status_code=2" \
  -d "md5sig=VALID_HASH"
```

**Or** in Supabase, manually update:

```sql
-- Reset email_sent to false
UPDATE orders 
SET email_sent = false 
WHERE order_number = 'ORDER-xxxxx';
```

Then trigger webhook again.

#### Step 2: Verify Only One Email Sent

- [ ] Check email inbox - should have only 1 email (not 2)
- [ ] Check server logs - should see "already sent" or skip logic
- [ ] Check database - email_sent should still be true

### Test Scenario 3: Email Formatting

**Test Email Clients**:
- [ ] Gmail (web)
- [ ] Gmail (mobile app)
- [ ] Outlook (web)
- [ ] Apple Mail (if available)

**Check in Each Client**:
- [ ] Images load correctly
- [ ] Layout is not broken
- [ ] Text is readable
- [ ] Colors display correctly
- [ ] Button is clickable
- [ ] Responsive on mobile

### Test Scenario 4: Failed Payment (No Email)

1. Start payment process
2. Click "Cancel" in PayHere modal
3. **Expected**: No email sent
4. Check database: email_sent should be false
5. Check order status should be 'cancelled'

### Email Testing Tools

**Litmus** (Premium):
- Test in 100+ email clients
- https://litmus.com

**Email on Acid** (Premium):
- Similar to Litmus
- https://emailonacid.com

**Mailtrap** (Free):
- Test emails in dev without sending to real addresses
- https://mailtrap.io

---

## 🔍 Debugging Common Issues

### Mobile UI Issues

#### Sticky Footer Not Showing
**Symptoms**: Footer missing on mobile

**Checks**:
1. Browser width < 1024px?
2. DevTools responsive mode enabled?
3. Cache cleared? (Ctrl+Shift+R)
4. Check console for errors

**Fix**:
- Verify `lg:hidden` class on footer
- Check z-index conflicts
- Inspect element in DevTools

#### Summary Not Collapsing
**Symptoms**: Summary doesn't expand/collapse

**Checks**:
1. JavaScript enabled?
2. Console errors?
3. State updating?

**Debug**:
```javascript
// Add to MobileOrderSummary.tsx temporarily
console.log('Expanded:', isExpanded)
```

#### Images Not Loading
**Symptoms**: Product images broken

**Checks**:
1. Images exist in public folder?
2. Image URLs correct in cart items?
3. Network tab shows 404?

**Fix**:
- Use placeholder for missing images
- Check image paths

### Email Issues

#### Email Not Received
**Symptoms**: No email after successful payment

**Checks**:
1. Database migration ran? (email_sent column exists)
2. RESEND_API_KEY set correctly?
3. Server logs show errors?
4. Webhook triggered?
5. Status code was '2' (success)?

**Debug Steps**:

1. **Check Webhook Logs**:
```bash
# Look for in dev server:
"Order status updated: ..."
"Order confirmation email sent: ..."
```

2. **Check Resend Dashboard**:
```
https://resend.com/emails
# View recent emails and their status
```

3. **Verify API Key**:
```bash
# Test Resend API directly
curl https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test Email",
    "html": "<p>Test</p>"
  }'
```

4. **Check Email Service Status**:
```
https://resend.com/status
```

#### Email Sent But Not Formatted
**Symptoms**: Email received but looks broken

**Possible Causes**:
- Missing inline CSS
- Email client stripping styles
- Image URLs incorrect

**Fix**:
- All CSS should be inline (already done)
- Use full URLs for images
- Test in multiple email clients

#### Duplicate Emails Sent
**Symptoms**: Same order confirmation sent multiple times

**Cause**: 
- Database migration not run (email_sent column missing)
- Logic bug in webhook

**Fix**:
1. Run migration
2. Check webhook logic
3. Verify email_sent flag updates

---

## ✅ Testing Checklist

### Before Production

#### Mobile UI
- [ ] Tested on iPhone (any model)
- [ ] Tested on Android (any model)
- [ ] Tested on tablet (iPad, Android tablet)
- [ ] Verified sticky footer works
- [ ] Verified collapsible summary works
- [ ] Verified animations are smooth
- [ ] Verified no layout shifts
- [ ] Verified touch targets are adequate
- [ ] Screenshots taken for documentation

#### Email Notifications
- [ ] Database migration run successfully
- [ ] RESEND_API_KEY configured in production
- [ ] Test order completed in sandbox
- [ ] Confirmation email received
- [ ] Email content correct (all details)
- [ ] Product images display correctly
- [ ] Prices formatted correctly (LKR)
- [ ] "Track Order" link works
- [ ] Support email is correct
- [ ] Tested in multiple email clients
- [ ] Verified no duplicate emails
- [ ] Verified failed payments don't send email

#### Integration Testing
- [ ] Complete checkout flow on mobile
- [ ] Complete checkout flow on desktop
- [ ] Payment success triggers email
- [ ] Payment failure doesn't trigger email
- [ ] Database updated correctly
- [ ] No console errors
- [ ] No server errors in logs

---

## 📊 Test Results Template

Use this to document your testing:

```markdown
## Test Results - Phase 4 & 5

**Date**: [DATE]
**Tester**: [YOUR NAME]
**Environment**: Development / Staging

### Mobile UI Testing

#### iPhone 12 Pro (Safari)
- Sticky Footer: ✅ Pass / ❌ Fail
- Collapsible Summary: ✅ Pass / ❌ Fail
- Touch Targets: ✅ Pass / ❌ Fail
- Animations: ✅ Pass / ❌ Fail
- Notes: [Any issues found]

#### Android Pixel 5 (Chrome)
- Sticky Footer: ✅ Pass / ❌ Fail
- Collapsible Summary: ✅ Pass / ❌ Fail
- Touch Targets: ✅ Pass / ❌ Fail
- Animations: ✅ Pass / ❌ Fail
- Notes: [Any issues found]

### Email Testing

#### Order Confirmation Email
- Email Received: ✅ Yes / ❌ No
- Time to Receive: [X] minutes
- Content Correct: ✅ Yes / ❌ No
- Images Load: ✅ Yes / ❌ No
- Links Work: ✅ Yes / ❌ No
- Notes: [Any issues found]

#### Email Clients Tested
- Gmail (Web): ✅ Pass / ❌ Fail
- Gmail (Mobile): ✅ Pass / ❌ Fail
- Outlook (Web): ✅ Pass / ❌ Fail
- Apple Mail: ✅ Pass / ❌ Fail

### Issues Found
1. [Issue description and severity]
2. [Issue description and severity]

### Overall Result
- Mobile UI: ✅ Ready / ⚠️ Minor Issues / ❌ Major Issues
- Email Notifications: ✅ Ready / ⚠️ Minor Issues / ❌ Major Issues
```

---

## 🚀 After Testing

Once all tests pass:

1. **Commit Test Results**:
```bash
# Add test results to docs
git add docs/test-results-phase-4-5.md
git commit -m "Add Phase 4 & 5 test results"
```

2. **Deploy to Staging** (if available):
```bash
git push origin staging
```

3. **Prepare for Production**:
- Get production PayHere credentials
- Configure production RESEND_API_KEY
- Set EMAIL_FROM to production email
- Update NEXT_PUBLIC_SITE_URL
- Run database migrations on production
- Test with small real transaction

---

**Happy Testing!** 🎉

If you encounter any issues, check the debugging section above or refer to the main implementation summary document.
