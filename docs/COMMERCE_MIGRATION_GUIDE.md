# Commerce Migration Guide: Carts and Orders to Supabase

This guide documents the migration of carts and orders from local storage/file system to Supabase.

## Overview

The following components have been migrated to Supabase:
- **Shopping Carts**: Persistent cart storage with user/guest support
- **Orders**: Complete order management with payment tracking
- **Abandoned Carts**: Email recovery system for abandoned carts

## Database Setup

### Step 1: Run the Commerce Schema SQL

1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `SUPABASE_COMMERCE_SCHEMA.sql`
4. Run the SQL script

This will create:
- `carts` table - Shopping carts (linked to users or guest sessions)
- `cart_items` table - Items in each cart
- `orders` table - Order records with payment tracking
- `order_items` table - Items in each order
- `abandoned_carts` table - Abandoned cart tracking for email recovery

### Step 2: Verify Tables

After running the SQL, verify the tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('carts', 'cart_items', 'orders', 'order_items', 'abandoned_carts');
```

## Features

### Shopping Carts

**Client-side (Zustand store):**
- Cart persists in localStorage for offline access
- Automatically syncs to Supabase when user is logged in
- Debounced sync (1 second delay) to reduce API calls

**Server-side (Supabase):**
- Carts linked to user accounts (when logged in)
- Guest carts tracked via session cookies
- Automatic expiration after 30 days
- Cart items stored with product details, size, gemstone options

**API Routes:**
- `GET /api/cart` - Fetch user's cart from Supabase
- `POST /api/cart` - Sync cart to Supabase
- `DELETE /api/cart` - Clear cart

### Orders

**Order Creation:**
- Orders created in Supabase before payment initiation
- Order items stored as snapshot at time of purchase
- Supports both authenticated and guest orders

**Payment Tracking:**
- PayHere webhook updates order status automatically
- Status mapping:
  - `2` (success) → `paid`
  - `0` (pending) → `processing`
  - `-1` (canceled) → `cancelled`
  - `-2` (failed) → `cancelled`
  - `-3` (chargedback) → `refunded`

**Order Display:**
- `/orders` page shows user's order history
- Displays order items, status, payment info
- Requires authentication

### Abandoned Carts

**Tracking:**
- Abandoned carts stored in Supabase when user leaves checkout
- Linked to email addresses for recovery
- Status tracking: `pending`, `emailed`, `dismissed`, `recovered`

**Email Recovery:**
- Admin can trigger email sends via `/api/abandoned/send`
- Email status tracked in database
- Items stored as JSONB for flexible email templates

## Component Updates

### Cart Store (`src/lib/store/cart.ts`)
- Added `syncToServer()` and `loadFromServer()` methods
- Automatic debounced sync on cart changes
- Maintains backward compatibility with localStorage

### Cart Sync Component (`src/components/cart/CartSync.tsx`)
- Loads cart from Supabase when user logs in
- Merges local cart with server cart
- Added to root layout for automatic sync

### Orders Page (`src/app/orders/page.tsx`)
- Now displays real orders from Supabase
- Shows order items, status, payment info
- Requires authentication (redirects to sign-in)

## API Routes

### `/api/cart`
- **GET**: Fetch cart from Supabase
- **POST**: Sync cart to Supabase (upsert)
- **DELETE**: Clear cart

### `/api/orders`
- **GET**: Fetch user's orders (requires auth)

### `/api/abandoned`
- **POST**: Create/update abandoned cart
- **GET**: List abandoned carts (admin only)

### `/api/abandoned/send`
- **POST**: Send abandoned cart recovery email

### `/api/checkout/payhere`
- **POST**: Create order in Supabase before payment

### `/api/checkout/payhere/notify`
- **POST**: Update order status from PayHere webhook

## Environment Variables

No new environment variables required. Uses existing:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY` (for client-side if needed)

## Migration Notes

### From File System
- Abandoned carts previously stored in `.data/abandoned-carts.json`
- Old file-based storage is replaced by Supabase
- No data migration script needed (fresh start)

### From LocalStorage
- Cart store still uses localStorage for offline support
- Supabase acts as the source of truth when user is logged in
- Guest carts sync to Supabase via session cookies

## Testing Checklist

- [ ] Run SQL schema in Supabase
- [ ] Test cart sync when logged in
- [ ] Test guest cart persistence
- [ ] Test order creation during checkout
- [ ] Test PayHere webhook order status update
- [ ] Test orders page displays correctly
- [ ] Test abandoned cart tracking
- [ ] Test abandoned cart email sending

## Troubleshooting

### Cart not syncing
- Check browser console for errors
- Verify Supabase connection in `/api/cart`
- Check RLS policies allow service role access

### Orders not appearing
- Verify order was created in Supabase
- Check user_id or email matches session
- Verify RLS policies allow user to see own orders

### PayHere webhook not updating orders
- Check webhook signature verification
- Verify order_number matches PayHere order_id
- Check Supabase logs for update errors

## Next Steps

1. **Email Notifications**: Add order confirmation emails when payment succeeds
2. **Inventory Management**: Update product stock when orders are placed
3. **Order Fulfillment**: Add shipping status tracking
4. **Analytics**: Add order analytics dashboard
5. **Admin Panel**: Create admin interface for order management

