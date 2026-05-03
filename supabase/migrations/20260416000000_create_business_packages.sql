-- ═══════════════════════════════════════════════════════════════
-- Migration: Create Business Packages (Paket Usaha Laundry)
-- ═══════════════════════════════════════════════════════════════
-- Tables: business_packages, business_package_inquiries,
--         business_package_inquiry_logs
-- Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. business_packages
-- ─────────────────────────────────────────────

CREATE TABLE public.business_packages (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   TEXT        NOT NULL,
  tier                   TEXT        NOT NULL CHECK (tier IN ('Starter', 'Standard', 'Premium', 'Custom')),
  description            TEXT,
  price                  NUMERIC     NOT NULL CHECK (price > 0),
  promo_price            NUMERIC     CHECK (promo_price IS NULL OR promo_price < price),
  promo_expires_at       TIMESTAMPTZ,
  items                  JSONB       NOT NULL DEFAULT '[]',
  training_duration_days INTEGER,
  support_coverage       TEXT,
  estimated_roi          TEXT,
  image_url              TEXT,
  is_featured            BOOLEAN     NOT NULL DEFAULT false,
  is_active              BOOLEAN     NOT NULL DEFAULT true,
  sort_order             INTEGER     NOT NULL DEFAULT 0,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 2. business_package_inquiries
-- ─────────────────────────────────────────────

CREATE TABLE public.business_package_inquiries (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id          UUID        REFERENCES public.business_packages(id) ON DELETE SET NULL,
  package_name        TEXT        NOT NULL,
  full_name           TEXT        NOT NULL,
  phone               TEXT        NOT NULL,
  email               TEXT        NOT NULL,
  city                TEXT        NOT NULL,
  budget_range        TEXT,
  message             TEXT,
  status              TEXT        NOT NULL DEFAULT 'new'
                                  CHECK (status IN ('new', 'contacted', 'negotiating', 'converted', 'rejected')),
  converted_outlet_id UUID        REFERENCES public.outlets(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 3. business_package_inquiry_logs
-- ─────────────────────────────────────────────

CREATE TABLE public.business_package_inquiry_logs (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID        NOT NULL REFERENCES public.business_package_inquiries(id) ON DELETE CASCADE,
  changed_by UUID        NOT NULL REFERENCES public.profiles(id),
  old_status TEXT,
  new_status TEXT        NOT NULL,
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 4. updated_at triggers (reuse existing function)
-- ─────────────────────────────────────────────

CREATE TRIGGER update_business_packages_updated_at
  BEFORE UPDATE ON public.business_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_package_inquiries_updated_at
  BEFORE UPDATE ON public.business_package_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ─────────────────────────────────────────────
-- 5. Indexes
-- ─────────────────────────────────────────────

CREATE INDEX idx_business_packages_is_active   ON public.business_packages(is_active);
CREATE INDEX idx_business_packages_sort_order  ON public.business_packages(sort_order);
CREATE INDEX idx_inquiries_status              ON public.business_package_inquiries(status);
CREATE INDEX idx_inquiries_package_id          ON public.business_package_inquiries(package_id);
CREATE INDEX idx_inquiries_phone               ON public.business_package_inquiries(phone);
CREATE INDEX idx_inquiries_created_at          ON public.business_package_inquiries(created_at);

-- ─────────────────────────────────────────────
-- 6. Enable RLS
-- ─────────────────────────────────────────────

ALTER TABLE public.business_packages             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_package_inquiries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_package_inquiry_logs ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- 7. RLS Policies — business_packages
-- ─────────────────────────────────────────────

-- Anon/public can SELECT active packages
CREATE POLICY "business_packages_select_active_public"
  ON public.business_packages
  FOR SELECT
  USING (is_active = true);

-- Superadmin can SELECT all (including inactive)
CREATE POLICY "business_packages_select_superadmin"
  ON public.business_packages
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- Superadmin can INSERT
CREATE POLICY "business_packages_insert_superadmin"
  ON public.business_packages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- Superadmin can UPDATE
CREATE POLICY "business_packages_update_superadmin"
  ON public.business_packages
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- Superadmin can DELETE
CREATE POLICY "business_packages_delete_superadmin"
  ON public.business_packages
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- ─────────────────────────────────────────────
-- 8. RLS Policies — business_package_inquiries
-- ─────────────────────────────────────────────

-- Anyone (including anon) can INSERT an inquiry
CREATE POLICY "inquiries_insert_public"
  ON public.business_package_inquiries
  FOR INSERT
  WITH CHECK (true);

-- Superadmin can SELECT all inquiries
CREATE POLICY "inquiries_select_superadmin"
  ON public.business_package_inquiries
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- Superadmin can UPDATE inquiries (status changes, converted_outlet_id, etc.)
CREATE POLICY "inquiries_update_superadmin"
  ON public.business_package_inquiries
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- ─────────────────────────────────────────────
-- 9. RLS Policies — business_package_inquiry_logs
-- ─────────────────────────────────────────────

-- Superadmin can INSERT logs
CREATE POLICY "inquiry_logs_insert_superadmin"
  ON public.business_package_inquiry_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- Superadmin can SELECT logs
CREATE POLICY "inquiry_logs_select_superadmin"
  ON public.business_package_inquiry_logs
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );
