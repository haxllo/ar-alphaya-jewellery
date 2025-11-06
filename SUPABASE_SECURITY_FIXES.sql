-- ============================================
-- Supabase Security Fixes
-- ============================================
-- Run this script to fix RLS and security warnings
-- After running SUPABASE_SETUP_SIMPLE.sql and SUPABASE_COMMERCE_SCHEMA.sql

-- ============================================
-- FIX 1: Enable RLS on NextAuth Tables
-- ============================================
-- These tables are used by NextAuth and should have RLS enabled
-- Even though we use service role key, RLS provides an extra security layer

-- Enable RLS on users table
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on accounts table
ALTER TABLE IF EXISTS public.accounts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on sessions table
ALTER TABLE IF EXISTS public.sessions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on verificationTokens table
ALTER TABLE IF EXISTS public."verificationTokens" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FIX 2: Add RLS Policies for NextAuth Tables
-- ============================================
-- Since we're using service role key, these policies allow service role access
-- Users can only access their own data

-- Users table policies
DROP POLICY IF EXISTS "Service role can access users" ON public.users;
CREATE POLICY "Service role can access users" ON public.users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Accounts table policies
DROP POLICY IF EXISTS "Service role can access accounts" ON public.accounts;
CREATE POLICY "Service role can access accounts" ON public.accounts
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Users can view own accounts" ON public.accounts;
CREATE POLICY "Users can view own accounts" ON public.accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = accounts."userId" 
      AND users.id = auth.uid()
    )
  );

-- Sessions table policies
DROP POLICY IF EXISTS "Service role can access sessions" ON public.sessions;
CREATE POLICY "Service role can access sessions" ON public.sessions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Users can view own sessions" ON public.sessions;
CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = sessions."userId" 
      AND users.id = auth.uid()
    )
  );

-- VerificationTokens table policies
DROP POLICY IF EXISTS "Service role can access verificationTokens" ON public."verificationTokens";
CREATE POLICY "Service role can access verificationTokens" ON public."verificationTokens"
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- FIX 3: Fix Function Search Path Security
-- ============================================
-- Set search_path for functions to prevent security issues

-- Fix update_updated_at_column function
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  SET LOCAL search_path = public;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate triggers that use this function
DROP TRIGGER IF EXISTS update_carts_updated_at ON public.carts;
CREATE TRIGGER update_carts_updated_at 
  BEFORE UPDATE ON public.carts
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at 
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_abandoned_carts_updated_at ON public.abandoned_carts;
CREATE TRIGGER update_abandoned_carts_updated_at 
  BEFORE UPDATE ON public.abandoned_carts
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fix get_or_create_cart function
DROP FUNCTION IF EXISTS public.get_or_create_cart(UUID, TEXT, TEXT) CASCADE;

CREATE OR REPLACE FUNCTION public.get_or_create_cart(
  p_user_id UUID DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL
)
RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_cart_id UUID;
BEGIN
  -- Set search_path at the start of function body
  SET LOCAL search_path = public;
  
  -- Try to find existing active cart
  IF p_user_id IS NOT NULL THEN
    SELECT id INTO v_cart_id
    FROM public.carts
    WHERE user_id = p_user_id AND status = 'active'
    ORDER BY updated_at DESC
    LIMIT 1;
  ELSIF p_session_id IS NOT NULL THEN
    SELECT id INTO v_cart_id
    FROM public.carts
    WHERE session_id = p_session_id AND status = 'active'
    ORDER BY updated_at DESC
    LIMIT 1;
  END IF;

  -- Create new cart if not found
  IF v_cart_id IS NULL THEN
    INSERT INTO public.carts (user_id, session_id, email, status, expires_at)
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
    UPDATE public.carts
    SET updated_at = NOW(),
        email = COALESCE(p_email, email),
        expires_at = NOW() + INTERVAL '30 days'
    WHERE id = v_cart_id;
  END IF;

  RETURN v_cart_id;
END;
$$;

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these queries to verify RLS is enabled:

-- Check RLS status on NextAuth tables
-- Using pg_tables view (works for most tables)
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'accounts', 'sessions')
ORDER BY tablename;

-- Check verificationTokens (camelCase) using pg_class
SELECT 
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' 
  AND c.relname = 'verificationTokens'
  AND c.relkind = 'r';

-- Alternative: Check all NextAuth tables using pg_class (most reliable)
SELECT 
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  CASE WHEN c.relrowsecurity THEN '✅ Enabled' ELSE '❌ Disabled' END as status
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' 
  AND c.relname IN ('users', 'accounts', 'sessions', 'verificationTokens')
  AND c.relkind = 'r'
ORDER BY c.relname;

-- Check function search_path
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proconfig as search_path_config
FROM pg_proc 
WHERE proname IN ('update_updated_at_column', 'get_or_create_cart')
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

