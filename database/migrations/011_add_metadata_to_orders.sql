-- Add metadata column to orders table to store extra checkout fields like zip, state, company
ALTER TABLE orders ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
