-- Migration: Order Milestone Timestamps
-- Description: Adds granular timestamp tracking for each stage of the order lifecycle.

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS pickup_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS received_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS washing_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ironing_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS qc_passed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ready_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivery_at TIMESTAMPTZ;

-- Add comment for clarity
COMMENT ON COLUMN public.orders.qc_passed_at IS 'Timestamp when the order passed quality control inspection';
