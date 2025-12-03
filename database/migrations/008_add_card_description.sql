-- Migration: Add card_description field to products table
-- Purpose: Support short card-specific descriptions separate from full product description
-- Date: 2025-12-03

-- Add card_description as TEXT column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS card_description TEXT;

-- Add comment for documentation
COMMENT ON COLUMN products.card_description IS 'Short description for product cards only (not shown on detail page). Max ~100 characters recommended.';

-- Example usage:
-- Card description: "Handcrafted sapphire ring with 925 silver band"
-- Full description: Contains full story, specifications, care instructions, etc.
