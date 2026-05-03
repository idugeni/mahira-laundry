-- ═══════════════════════════════════════════════════════════════
-- Migration: Add indexes for ALL unindexed foreign keys
-- + Drop unused indexes on new tables (no traffic yet)
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- audit_logs
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id
  ON public.audit_logs(user_id);

-- ─────────────────────────────────────────────
-- delivery
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_delivery_courier_id
  ON public.delivery(courier_id);

-- ─────────────────────────────────────────────
-- deposit_transactions
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_deposit_transactions_profile_id
  ON public.deposit_transactions(profile_id);

CREATE INDEX IF NOT EXISTS idx_deposit_transactions_actor_id
  ON public.deposit_transactions(actor_id);

-- ─────────────────────────────────────────────
-- expenses
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_expenses_outlet_id
  ON public.expenses(outlet_id);

CREATE INDEX IF NOT EXISTS idx_expenses_actor_id
  ON public.expenses(actor_id);

-- ─────────────────────────────────────────────
-- inventory
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_inventory_outlet_id
  ON public.inventory(outlet_id);

-- ─────────────────────────────────────────────
-- order_status_logs
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_order_status_logs_order_id
  ON public.order_status_logs(order_id);

CREATE INDEX IF NOT EXISTS idx_order_status_logs_actor_id
  ON public.order_status_logs(actor_id);

-- ─────────────────────────────────────────────
-- orders (staff assignment FKs)
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_washer_id
  ON public.orders(washer_id);

CREATE INDEX IF NOT EXISTS idx_orders_ironer_id
  ON public.orders(ironer_id);

CREATE INDEX IF NOT EXISTS idx_orders_qc_id
  ON public.orders(qc_id);

CREATE INDEX IF NOT EXISTS idx_orders_kasir_id
  ON public.orders(kasir_id);

-- ─────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_outlet_id
  ON public.profiles(outlet_id);

CREATE INDEX IF NOT EXISTS idx_profiles_referred_by
  ON public.profiles(referred_by);

-- ─────────────────────────────────────────────
-- redemptions
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id
  ON public.redemptions(user_id);

CREATE INDEX IF NOT EXISTS idx_redemptions_reward_id
  ON public.redemptions(reward_id);

-- ─────────────────────────────────────────────
-- reviews
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id
  ON public.reviews(customer_id);

CREATE INDEX IF NOT EXISTS idx_reviews_outlet_id
  ON public.reviews(outlet_id);

-- ─────────────────────────────────────────────
-- shifts
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_shifts_outlet_id
  ON public.shifts(outlet_id);

-- ─────────────────────────────────────────────
-- testimonials
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id
  ON public.testimonials(user_id);

-- ─────────────────────────────────────────────
-- vouchers
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_vouchers_outlet_id
  ON public.vouchers(outlet_id);

-- ─────────────────────────────────────────────
-- Drop unused indexes on new/empty tables
-- (business_packages, business_package_inquiries,
--  business_package_inquiry_logs, income)
-- These will be re-evaluated once the feature has traffic.
-- ─────────────────────────────────────────────
DROP INDEX IF EXISTS public.idx_business_packages_is_active;
DROP INDEX IF EXISTS public.idx_business_packages_sort_order;
DROP INDEX IF EXISTS public.idx_inquiries_status;
DROP INDEX IF EXISTS public.idx_inquiries_package_id;
DROP INDEX IF EXISTS public.idx_inquiries_phone;
DROP INDEX IF EXISTS public.idx_inquiries_created_at;
DROP INDEX IF EXISTS public.idx_inquiries_converted_outlet_id;
DROP INDEX IF EXISTS public.idx_inquiry_logs_inquiry_id;
DROP INDEX IF EXISTS public.idx_inquiry_logs_changed_by;
DROP INDEX IF EXISTS public.idx_income_outlet_id;
DROP INDEX IF EXISTS public.idx_income_actor_id;
