-- ============================================
-- Contact Forms & Newsletter Schema
-- ============================================
-- This schema migrates contact forms and newsletter subscriptions
-- from Netlify Forms to Supabase

-- ============================================
-- Contact Forms Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  budget TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for contact submissions
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- ============================================
-- Newsletter Subscriptions Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  source TEXT, -- e.g., 'homepage', 'cart', 'footer', 'modal'
  preferences JSONB DEFAULT '{
    "newProducts": true,
    "sales": true,
    "styleGuides": true,
    "exclusiveEvents": true
  }'::jsonb,
  verification_token TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for newsletter subscriptions
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON public.newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_is_active ON public.newsletter_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_subscribed_at ON public.newsletter_subscriptions(subscribed_at DESC);

-- ============================================
-- Waitlist Table (Product Back-in-Stock)
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  product_slug TEXT,
  email TEXT NOT NULL,
  notified_at TIMESTAMPTZ,
  is_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, email)
);

-- Indexes for waitlist
CREATE INDEX IF NOT EXISTS idx_product_waitlist_product_id ON public.product_waitlist(product_id);
CREATE INDEX IF NOT EXISTS idx_product_waitlist_email ON public.product_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_product_waitlist_is_notified ON public.product_waitlist(is_notified);

-- ============================================
-- Updated At Trigger Function
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_newsletter_subscriptions_updated_at ON public.newsletter_subscriptions;
CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON public.newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_waitlist_updated_at ON public.product_waitlist;
CREATE TRIGGER update_product_waitlist_updated_at
  BEFORE UPDATE ON public.product_waitlist
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_waitlist ENABLE ROW LEVEL SECURITY;

-- Contact Submissions Policies
-- Service role can do everything (for API routes)
CREATE POLICY "Service role can manage contact submissions"
  ON public.contact_submissions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Users can only view their own submissions (if authenticated)
CREATE POLICY "Users can view own contact submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Anyone can insert (for public contact form)
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Newsletter Subscriptions Policies
-- Service role can do everything
CREATE POLICY "Service role can manage newsletter subscriptions"
  ON public.newsletter_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- Anyone can check if email exists (for duplicate prevention)
CREATE POLICY "Anyone can check newsletter subscription"
  ON public.newsletter_subscriptions
  FOR SELECT
  USING (true);

-- Users can update their own subscription
CREATE POLICY "Users can update own newsletter subscription"
  ON public.newsletter_subscriptions
  FOR UPDATE
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Product Waitlist Policies
-- Service role can do everything
CREATE POLICY "Service role can manage waitlist"
  ON public.product_waitlist
  FOR ALL
  USING (auth.role() = 'service_role');

-- Anyone can join waitlist
CREATE POLICY "Anyone can join waitlist"
  ON public.product_waitlist
  FOR INSERT
  WITH CHECK (true);

-- Users can view their own waitlist entries
CREATE POLICY "Users can view own waitlist"
  ON public.product_waitlist
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- ============================================
-- Helper Functions
-- ============================================

-- Function to get contact submission stats (for admin)
CREATE OR REPLACE FUNCTION public.get_contact_stats()
RETURNS TABLE (
  total INTEGER,
  new_count INTEGER,
  read_count INTEGER,
  replied_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total,
    COUNT(*) FILTER (WHERE status = 'new')::INTEGER as new_count,
    COUNT(*) FILTER (WHERE status = 'read')::INTEGER as read_count,
    COUNT(*) FILTER (WHERE status = 'replied')::INTEGER as replied_count
  FROM public.contact_submissions;
END;
$$;

-- Function to get newsletter stats
CREATE OR REPLACE FUNCTION public.get_newsletter_stats()
RETURNS TABLE (
  total_subscribers INTEGER,
  active_subscribers INTEGER,
  recent_subscriptions INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_subscribers,
    COUNT(*) FILTER (WHERE is_active = true)::INTEGER as active_subscribers,
    COUNT(*) FILTER (WHERE subscribed_at > NOW() - INTERVAL '7 days')::INTEGER as recent_subscriptions
  FROM public.newsletter_subscriptions;
END;
$$;

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify the schema was created correctly:

-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
--   AND table_name IN ('contact_submissions', 'newsletter_subscriptions', 'product_waitlist')
-- ORDER BY table_name, ordinal_position;

-- SELECT schemaname, tablename, rowsecurity as rls_enabled
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
--   AND tablename IN ('contact_submissions', 'newsletter_subscriptions', 'product_waitlist');

