-- ═══════════════════════════════════════════════════════════════
-- Migration: Fix inquiry INSERT RLS — replace always-true WITH CHECK
-- ═══════════════════════════════════════════════════════════════
-- The linter flags WITH CHECK (true) on INSERT policies as a security
-- warning. Replace with a meaningful condition that validates required
-- fields are non-empty, preventing empty/spam submissions at the DB level.
-- ═══════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "inquiries_insert_anon"          ON public.business_package_inquiries;
DROP POLICY IF EXISTS "inquiries_insert_authenticated"  ON public.business_package_inquiries;

-- Anon users (public inquiry form): require non-empty required fields
CREATE POLICY "inquiries_insert_anon"
  ON public.business_package_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (
    full_name    IS NOT NULL AND length(trim(full_name))    > 0 AND
    phone        IS NOT NULL AND length(trim(phone))        >= 10 AND
    email        IS NOT NULL AND length(trim(email))        > 0 AND
    city         IS NOT NULL AND length(trim(city))         > 0 AND
    package_name IS NOT NULL AND length(trim(package_name)) > 0
  );

-- Authenticated users: same validation
CREATE POLICY "inquiries_insert_authenticated"
  ON public.business_package_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    full_name    IS NOT NULL AND length(trim(full_name))    > 0 AND
    phone        IS NOT NULL AND length(trim(phone))        >= 10 AND
    email        IS NOT NULL AND length(trim(email))        > 0 AND
    city         IS NOT NULL AND length(trim(city))         > 0 AND
    package_name IS NOT NULL AND length(trim(package_name)) > 0
  );
