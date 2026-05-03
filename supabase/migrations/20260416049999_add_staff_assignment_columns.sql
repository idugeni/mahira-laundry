-- ═══════════════════════════════════════════════════════════════
-- Migration: Add staff assignment columns to orders
-- These columns exist on remote but were previously untracked
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS washer_id uuid,
  ADD COLUMN IF NOT EXISTS ironer_id uuid,
  ADD COLUMN IF NOT EXISTS qc_id uuid,
  ADD COLUMN IF NOT EXISTS kasir_id uuid,
  ADD COLUMN IF NOT EXISTS tax_amount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS service_fee numeric DEFAULT 0;
