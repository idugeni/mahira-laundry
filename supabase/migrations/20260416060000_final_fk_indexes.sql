-- ═══════════════════════════════════════════════════════════════
-- Migration: Final FK index fix — add missing, stop dropping
-- ═══════════════════════════════════════════════════════════════
-- These 6 FKs are still unindexed after previous migrations.
-- All FK indexes must be kept even if "unused" on a fresh DB —
-- the linter cannot flag both issues simultaneously once traffic
-- starts using them.
-- ═══════════════════════════════════════════════════════════════

-- business_package_inquiries.package_id → business_packages(id)
CREATE INDEX IF NOT EXISTS idx_inquiries_package_id
  ON public.business_package_inquiries(package_id);

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
