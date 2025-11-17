-- Migration: Create webhook_events audit table
-- Date: 2025-11-16
-- Purpose: Persist PayHere webhook payloads and processing state for auditing

CREATE TABLE IF NOT EXISTS webhook_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  order_number TEXT,
  payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  payload JSONB NOT NULL,
  signature_valid BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  processing_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_order_number
  ON webhook_events(order_number);

CREATE INDEX IF NOT EXISTS idx_webhook_events_payment_id
  ON webhook_events(payment_id);

CREATE INDEX IF NOT EXISTS idx_webhook_events_status
  ON webhook_events(status);
