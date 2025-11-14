-- Migration: Add Email Tracking to Orders
-- Date: 2025-11-14
-- Purpose: Track email notifications to prevent duplicates

-- Add email_sent column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;

-- Add index for better query performance when checking email status
CREATE INDEX IF NOT EXISTS idx_orders_email_sent 
ON orders(email_sent);

-- Add comment for documentation
COMMENT ON COLUMN orders.email_sent IS 'Tracks whether order confirmation email has been sent';

-- Optional: Add columns for future email tracking features
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS carrier TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP;

-- Add indexes for tracking features
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number 
ON orders(tracking_number);

-- Add comments
COMMENT ON COLUMN orders.tracking_number IS 'Shipping tracking number from carrier';
COMMENT ON COLUMN orders.carrier IS 'Shipping carrier name (e.g., DHL, FedEx)';
COMMENT ON COLUMN orders.shipped_at IS 'Timestamp when order was shipped';
COMMENT ON COLUMN orders.delivered_at IS 'Timestamp when order was delivered';
