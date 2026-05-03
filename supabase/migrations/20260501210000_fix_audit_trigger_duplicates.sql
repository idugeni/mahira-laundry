-- ═══════════════════════════════════════════════════════════════
-- Fix audit trigger duplicates & expand audit coverage to ALL tables
-- ═══════════════════════════════════════════════════════════════
--
-- Problem: trg_audit_orders fires on EVERY update to orders,
-- creating repetitive entries like "update pada orders" × 5.
-- Also: only 3 tables had audit triggers (orders, payments, services),
-- missing: outlets, profiles, vouchers, inventory, gallery, testimonials,
-- business_packages, business_package_inquiries, delivery, machines.
--
-- Solution:
-- 1. Expand audit_action enum with more descriptive actions
-- 2. Create order-specific audit function (status changes only)
-- 3. Add audit triggers to ALL important tables
-- 4. Update all triggers to reference internal schema
-- 5. Clean up existing duplicate audit_logs

-- ─────────────────────────────────────────────
-- 1. Expand audit_action enum
-- ─────────────────────────────────────────────
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'payment_confirmed';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'voucher_redeemed';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'inventory_restock';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'inquiry_received';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'profile_update';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'gallery_upload';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'testimonial_submit';

-- ─────────────────────────────────────────────
-- 2. Create order-specific audit function (status changes only)
-- ─────────────────────────────────────────────
-- TG_OP cannot be used in WHEN clause, so we handle it in the function
CREATE OR REPLACE FUNCTION internal.log_audit_order_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only log: INSERT (new order) or UPDATE where status actually changed
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'create', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), 'status_change', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$;

DROP TRIGGER IF EXISTS trg_audit_orders ON public.orders;

-- Only fire on INSERT or UPDATE OF status (reduces trigger invocations)
CREATE TRIGGER trg_audit_orders
  AFTER INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION internal.log_audit_order_status();

-- ─────────────────────────────────────────────
-- 3. Fix existing triggers to reference internal schema
-- ─────────────────────────────────────────────
DROP TRIGGER IF EXISTS trg_audit_payments ON public.payments;
CREATE TRIGGER trg_audit_payments
  AFTER INSERT OR UPDATE OR DELETE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION internal.log_audit();

DROP TRIGGER IF EXISTS trg_audit_services ON public.services;
CREATE TRIGGER trg_audit_services
  AFTER INSERT OR UPDATE OR DELETE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION internal.log_audit();

-- ─────────────────────────────────────────────
-- 4. Add audit triggers to ALL remaining important tables
-- ─────────────────────────────────────────────

-- Outlets (cabang)
CREATE TRIGGER trg_audit_outlets
  AFTER INSERT OR UPDATE OR DELETE ON public.outlets
  FOR EACH ROW EXECUTE FUNCTION internal.log_audit();

-- Profiles (pegawai & pelanggan)
CREATE TRIGGER trg_audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION internal.log_audit();

-- Vouchers (kupon diskon)
CREATE TRIGGER trg_audit_vouchers
  AFTER INSERT OR UPDATE OR DELETE ON public.vouchers
  FOR EACH ROW EXECUTE FUNCTION internal.log_audit();

-- Inventory (stok bahan)
CREATE TRIGGER trg_audit_inventory
  AFTER INSERT OR UPDATE OR DELETE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION internal.log_audit();

-- Gallery (galeri)
CREATE TRIGGER trg_audit_gallery
  AFTER INSERT OR UPDATE OR DELETE ON public.gallery
  FOR EACH ROW EXECUTE FUNCTION internal.log_audit();

-- Testimonials (testimoni)
CREATE TRIGGER trg_audit_testimonials
  AFTER INSERT OR UPDATE OR DELETE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION internal.log_audit();

-- Business Packages (paket usaha)
CREATE TRIGGER trg_audit_business_packages
  AFTER INSERT OR UPDATE OR DELETE ON public.business_packages
  FOR EACH ROW EXECUTE FUNCTION internal.log_audit();

-- Business Package Inquiries (leads)
CREATE TRIGGER trg_audit_business_package_inquiries
  AFTER INSERT OR UPDATE OR DELETE ON public.business_package_inquiries
  FOR EACH ROW EXECUTE FUNCTION internal.log_audit();

-- Delivery (pengiriman)
CREATE TRIGGER trg_audit_delivery
  AFTER INSERT OR UPDATE OR DELETE ON public.delivery
  FOR EACH ROW EXECUTE FUNCTION internal.log_audit();

-- Machines (mesin)
CREATE TRIGGER trg_audit_machines
  AFTER INSERT OR UPDATE OR DELETE ON public.machines
  FOR EACH ROW EXECUTE FUNCTION internal.log_audit();

-- ─────────────────────────────────────────────
-- 5. Clean up duplicate audit_logs
-- ─────────────────────────────────────────────
-- Remove consecutive duplicates (same user, action, table, record within 5 min)
DELETE FROM audit_logs a
USING audit_logs b
WHERE a.id > b.id
  AND a.user_id = b.user_id
  AND a.action = b.action
  AND a.table_name = b.table_name
  AND a.record_id = b.record_id
  AND a.created_at < b.created_at + INTERVAL '5 minutes'
  AND a.created_at > b.created_at - INTERVAL '5 minutes';
