-- Migration: Update product schema for streamlined structure
-- Date: 2025-11-27
-- Description: Add cardDescription field, remove tags column

-- Add cardDescription column for product cards
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS card_description VARCHAR(150);

COMMENT ON COLUMN public.products.card_description IS 'Short description shown on product cards (150 chars max)';

-- Drop tags column and its index (no longer used)
DROP INDEX IF EXISTS idx_products_tags;
ALTER TABLE public.products 
DROP COLUMN IF EXISTS tags;

-- Note: sizes and plating columns remain as JSONB to handle both old and new formats
-- The application layer handles conversion from old format to new format
COMMENT ON COLUMN public.products.sizes IS 'Array of size options: ["S", "M", "L", "XL"]';
COMMENT ON COLUMN public.products.gemstones IS 'Array of gemstone options with pricing';
