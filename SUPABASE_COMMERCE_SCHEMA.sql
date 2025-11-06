-- Commerce Schema for Supabase
-- Run this in your Supabase SQL Editor after NextAuth tables are created

-- ============================================
-- CARTS TABLE
-- ============================================
-- Stores persistent shopping carts
-- user_id is nullable to support guest carts (identified by session_id)
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest carts (browser session)
  email TEXT, -- For abandoned cart tracking
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'completed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Auto-expire abandoned carts after 30 days
  CONSTRAINT carts_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Indexes for carts
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_carts_email ON carts(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_carts_status ON carts(status);
CREATE INDEX IF NOT EXISTS idx_carts_updated_at ON carts(updated_at);

-- ============================================
-- CART ITEMS TABLE
-- ============================================
-- Stores items in each cart
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- Product ID from CMS
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in LKR cents
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  size TEXT,
  gemstone TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id, size, gemstone) -- Prevent duplicate items
);

-- Indexes for cart_items
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- ============================================
-- ORDERS TABLE
-- ============================================
-- Stores order records
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- Human-readable order number (e.g., ORDER-1234567890)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for guest orders
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
  payment_id TEXT, -- PayHere payment ID
  payment_method TEXT DEFAULT 'payhere',
  subtotal INTEGER NOT NULL, -- Subtotal in LKR cents
  total INTEGER NOT NULL, -- Total in LKR cents
  currency TEXT DEFAULT 'LKR',
  -- Customer information
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_country TEXT DEFAULT 'Sri Lanka',
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
-- Stores items in each order
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL, -- Product ID from CMS
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in LKR cents (snapshot at time of order)
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  size TEXT,
  gemstone TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================
-- ABANDONED CARTS TABLE (Optional - can use carts table with status)
-- ============================================
-- This is optional since we can use carts table with status='abandoned'
-- But keeping it separate for cleaner separation of concerns
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'emailed', 'dismissed', 'recovered')),
  items JSONB NOT NULL, -- Store cart items as JSON for email templates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  emailed_at TIMESTAMPTZ,
  recovered_at TIMESTAMPTZ
);

-- Indexes for abandoned_carts
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts(email);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_status ON abandoned_carts(status);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_created_at ON abandoned_carts(created_at);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_abandoned_carts_updated_at BEFORE UPDATE ON abandoned_carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Carts: Users can only see their own carts
DROP POLICY IF EXISTS "Users can view own carts" ON carts;
CREATE POLICY "Users can view own carts" ON carts
  FOR SELECT USING (
    auth.uid() = user_id OR 
    session_id = current_setting('app.session_id', true)
  );

DROP POLICY IF EXISTS "Users can insert own carts" ON carts;
CREATE POLICY "Users can insert own carts" ON carts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    session_id = current_setting('app.session_id', true)
  );

DROP POLICY IF EXISTS "Users can update own carts" ON carts;
CREATE POLICY "Users can update own carts" ON carts
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    session_id = current_setting('app.session_id', true)
  );

DROP POLICY IF EXISTS "Users can delete own carts" ON carts;
CREATE POLICY "Users can delete own carts" ON carts
  FOR DELETE USING (
    auth.uid() = user_id OR 
    session_id = current_setting('app.session_id', true)
  );

-- Service role can do everything (for server-side operations)
DROP POLICY IF EXISTS "Service role full access carts" ON carts;
CREATE POLICY "Service role full access carts" ON carts
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Cart Items: Users can only see items in their own carts
DROP POLICY IF EXISTS "Users can view own cart items" ON cart_items;
CREATE POLICY "Users can view own cart items" ON cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (carts.user_id = auth.uid() OR carts.session_id = current_setting('app.session_id', true))
    )
  );

DROP POLICY IF EXISTS "Users can manage own cart items" ON cart_items;
CREATE POLICY "Users can manage own cart items" ON cart_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (carts.user_id = auth.uid() OR carts.session_id = current_setting('app.session_id', true))
    )
  );

DROP POLICY IF EXISTS "Service role full access cart_items" ON cart_items;
CREATE POLICY "Service role full access cart_items" ON cart_items
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Orders: Users can only see their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Service role full access orders" ON orders;
CREATE POLICY "Service role full access orders" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Order Items: Users can only see items in their own orders
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Service role full access order_items" ON order_items;
CREATE POLICY "Service role full access order_items" ON order_items
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Abandoned Carts: Service role only (admin operations)
DROP POLICY IF EXISTS "Service role full access abandoned_carts" ON abandoned_carts;
CREATE POLICY "Service role full access abandoned_carts" ON abandoned_carts
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================
-- Function to get or create cart for user/session
CREATE OR REPLACE FUNCTION get_or_create_cart(
  p_user_id UUID DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_cart_id UUID;
BEGIN
  -- Try to find existing active cart
  IF p_user_id IS NOT NULL THEN
    SELECT id INTO v_cart_id
    FROM carts
    WHERE user_id = p_user_id AND status = 'active'
    ORDER BY updated_at DESC
    LIMIT 1;
  ELSIF p_session_id IS NOT NULL THEN
    SELECT id INTO v_cart_id
    FROM carts
    WHERE session_id = p_session_id AND status = 'active'
    ORDER BY updated_at DESC
    LIMIT 1;
  END IF;

  -- Create new cart if not found
  IF v_cart_id IS NULL THEN
    INSERT INTO carts (user_id, session_id, email, status, expires_at)
    VALUES (
      p_user_id,
      p_session_id,
      p_email,
      'active',
      NOW() + INTERVAL '30 days'
    )
    RETURNING id INTO v_cart_id;
  ELSE
    -- Update existing cart
    UPDATE carts
    SET updated_at = NOW(),
        email = COALESCE(p_email, email),
        expires_at = NOW() + INTERVAL '30 days'
    WHERE id = v_cart_id;
  END IF;

  RETURN v_cart_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

