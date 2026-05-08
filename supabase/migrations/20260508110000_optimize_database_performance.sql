-- Migration: Performance & Security Optimization Pack
-- Description: Add missing indexes for foreign keys, optimize audit logs, and add data integrity constraints.

-- 1. Indexing Missing Foreign Keys
-- These were missed in the initial migration
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_orders_washer_id ON public.orders(washer_id);
CREATE INDEX IF NOT EXISTS idx_orders_ironer_id ON public.orders(ironer_id);
CREATE INDEX IF NOT EXISTS idx_orders_qc_id ON public.orders(qc_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON public.redemptions(user_id);

-- 2. Audit Logs Optimization
-- Indexing record_id for faster lookup of specific entity history
-- Note: table_name and record_id are already indexed in initial migration under different names, 
-- but we ensure they exist here for robustness. Actually, to avoid conflicts in CI, 
-- we only add what is truly missing.

-- 3. Data Integrity Constraints
ALTER TABLE public.profiles 
  ADD CONSTRAINT check_positive_loyalty_points CHECK (loyalty_points >= 0);

ALTER TABLE public.inventory 
  ADD CONSTRAINT check_positive_quantity CHECK (quantity >= 0);

-- 4. Additional Performance: Search by Names (GIN index for trigram search)
-- Already handled in initial migration (idx_profiles_name_trgm)
