-- Migration: Add plating field to products table
-- Purpose: Support plating finish options for jewelry products
-- Date: 2025-11-27

-- Add plating as JSONB array to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS plating JSONB DEFAULT '[]';

-- Add index for plating searches (GIN index for JSONB)
CREATE INDEX IF NOT EXISTS idx_products_plating ON products USING GIN (plating);

-- Update existing products with default empty array
UPDATE products 
SET plating = '[]' 
WHERE plating IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN products.plating IS 'Array of plating options with format: [{"type": "Gold", "priceAdjustment": 0, "available": true}]';

-- Example plating data structure:
-- [
--   {"type": "Gold", "priceAdjustment": 0, "available": true},
--   {"type": "Rose Gold", "priceAdjustment": 500, "available": true},
--   {"type": "Silver", "priceAdjustment": -200, "available": true}
-- ]
