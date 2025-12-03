-- Migration 010: Fix function search_path security warnings
-- Created: 2025-12-03
-- Purpose: Set explicit search_path on functions to prevent security vulnerabilities

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = is_admin.user_id
      AND admin_users.is_active = true
  );
END;
$$;

-- Fix handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Fix generate_slug function
CREATE OR REPLACE FUNCTION public.generate_slug(name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$;

-- Add comment
COMMENT ON FUNCTION public.is_admin IS 'Check if user is admin - search_path secured in migration 010';
COMMENT ON FUNCTION public.handle_updated_at IS 'Auto-update updated_at timestamp - search_path secured in migration 010';
COMMENT ON FUNCTION public.generate_slug IS 'Generate URL-safe slug from name - search_path secured in migration 010';
