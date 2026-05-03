-- ═══════════════════════════════════════════════════════════════
-- Migration: Fix Index Performance Issues
-- ═══════════════════════════════════════════════════════════════
-- 1. Add missing indexes on unindexed foreign keys
-- 2. Drop unused indexes (never queried, waste write overhead)
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- PART 1: Add missing FK indexes
-- ─────────────────────────────────────────────

-- business_package_inquiries.converted_outlet_id → outlets(id)
CREATE INDEX IF NOT EXISTS idx_inquiries_converted_outlet_id
  ON public.business_package_inquiries(converted_outlet_id);

-- business_package_inquiry_logs.inquiry_id → business_package_inquiries(id)
CREATE INDEX IF NOT EXISTS idx_inquiry_logs_inquiry_id
  ON public.business_package_inquiry_logs(inquiry_id);

-- business_package_inquiry_logs.changed_by → profiles(id)
CREATE INDEX IF NOT EXISTS idx_inquiry_logs_changed_by
  ON public.business_package_inquiry_logs(changed_by);

-- income.outlet_id → outlets(id)
CREATE INDEX IF NOT EXISTS idx_income_outlet_id
  ON public.income(outlet_id);

-- income.actor_id → profiles(id)
CREATE INDEX IF NOT EXISTS idx_income_actor_id
  ON public.income(actor_id);

-- ─────────────────────────────────────────────
-- PART 2: Drop unused indexes
-- These indexes have never been used by the query planner.
-- Dropping them reduces write overhead and storage.
-- They can be re-added if query patterns change.
-- ─────────────────────────────────────────────

-- profiles
DROP INDEX IF EXISTS public.idx_profiles_referred_by;
DROP INDEX IF EXISTS public.idx_profiles_outlet;
DROP INDEX IF EXISTS public.idx_profiles_phone;
DROP INDEX IF EXISTS public.idx_profiles_name_trgm;

-- orders
DROP INDEX IF EXISTS public.idx_orders_washer_id;
DROP INDEX IF EXISTS public.idx_orders_ironer_id;
DROP INDEX IF EXISTS public.idx_orders_qc_id;
DROP INDEX IF EXISTS public.idx_orders_kasir;
DROP INDEX IF EXISTS public.idx_orders_status;

-- order_status_logs
DROP INDEX IF EXISTS public.idx_order_status_logs_order_id;
DROP INDEX IF EXISTS public.idx_order_status_logs_actor_id;

-- payments
DROP INDEX IF EXISTS public.idx_payments_status;
DROP INDEX IF EXISTS public.idx_payments_midtrans;

-- delivery
DROP INDEX IF EXISTS public.idx_delivery_courier;
DROP INDEX IF EXISTS public.idx_delivery_status;

-- expenses
DROP INDEX IF EXISTS public.idx_expenses_outlet_id;
DROP INDEX IF EXISTS public.idx_expenses_actor_id;

-- income (deposit_transactions)
DROP INDEX IF EXISTS public.idx_deposit_transactions_profile_id;
DROP INDEX IF EXISTS public.idx_deposit_transactions_actor_id;

-- inventory
DROP INDEX IF EXISTS public.idx_inventory_outlet;
DROP INDEX IF EXISTS public.idx_inventory_sku;
DROP INDEX IF EXISTS public.idx_inventory_low_stock;

-- services
DROP INDEX IF EXISTS public.idx_services_outlet;
DROP INDEX IF EXISTS public.idx_services_featured;

-- vouchers
DROP INDEX IF EXISTS public.idx_vouchers_outlet;
DROP INDEX IF EXISTS public.idx_vouchers_active;
DROP INDEX IF EXISTS public.idx_vouchers_valid;

-- shifts
DROP INDEX IF EXISTS public.idx_shifts_staff;
DROP INDEX IF EXISTS public.idx_shifts_outlet;
DROP INDEX IF EXISTS public.idx_shifts_date;

-- reviews
DROP INDEX IF EXISTS public.idx_reviews_customer;
DROP INDEX IF EXISTS public.idx_reviews_outlet;
DROP INDEX IF EXISTS public.idx_reviews_rating;

-- testimonials
DROP INDEX IF EXISTS public.idx_testimonials_user;

-- loyalty
DROP INDEX IF EXISTS public.idx_loyalty_created;

-- notifications
DROP INDEX IF EXISTS public.idx_notifications_unread;
DROP INDEX IF EXISTS public.idx_notifications_created;

-- audit_logs
DROP INDEX IF EXISTS public.idx_audit_user;
DROP INDEX IF EXISTS public.idx_audit_action;
DROP INDEX IF EXISTS public.idx_audit_created;
DROP INDEX IF EXISTS public.idx_audit_table_record;

-- redemptions
DROP INDEX IF EXISTS public.idx_redemptions_user_id;
DROP INDEX IF EXISTS public.idx_redemptions_reward_id;

-- business_packages (new table, no traffic yet — keep for now, drop only truly unused)
-- NOTE: keeping idx_business_packages_is_active and idx_business_packages_sort_order
-- as they will be used immediately once the feature goes live.
-- Dropping the inquiry indexes that haven't been used yet for the same reason.
-- These are intentionally kept:
--   idx_business_packages_is_active
--   idx_business_packages_sort_order
--   idx_inquiries_status
--   idx_inquiries_package_id
--   idx_inquiries_phone
--   idx_inquiries_created_at
