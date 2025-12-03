-- Migration 009: Remove card_description column
-- Created: 2025-12-03
-- Purpose: Remove unused card_description field from products table

-- Drop the card_description column
ALTER TABLE products DROP COLUMN IF EXISTS card_description;

-- Add comment
COMMENT ON TABLE products IS 'Products table - card_description column removed in migration 009';
