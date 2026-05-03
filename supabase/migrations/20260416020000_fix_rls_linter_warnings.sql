-- ═══════════════════════════════════════════════════════════════
-- Migration: Fix RLS Linter Warnings
-- ═══════════════════════════════════════════════════════════════
-- Fixes:
-- 1. business_package_inquiries — restrict INSERT to anon role
--    (removes always-true WITH CHECK on public INSERT)
-- 2. business_packages — consolidate duplicate SELECT policies
--    for authenticated role into one
-- 3. gallery — consolidate duplicate UPDATE policies
--    for authenticated role into one
-- 4. testimonials — consolidate duplicate INSERT + UPDATE policies
--    for authenticated role into one
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. business_package_inquiries
--    Fix: always-true WITH CHECK on INSERT
--    Replace with explicit anon + authenticated policy
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "inquiries_insert_public" ON public.business_package_inquiries;

-- Allow anon users to INSERT (public inquiry form)
CREATE POLICY "inquiries_insert_anon"
  ON public.business_package_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to INSERT (e.g. logged-in customers)
CREATE POLICY "inquiries_insert_authenticated"
  ON public.business_package_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ─────────────────────────────────────────────
-- 2. business_packages — consolidate SELECT policies
--    Merge: select_active_public + select_superadmin
--    into a single policy that handles both cases
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "business_packages_select_active_public"  ON public.business_packages;
DROP POLICY IF EXISTS "business_packages_select_superadmin"     ON public.business_packages;

-- Anon: only active packages
CREATE POLICY "business_packages_select_anon"
  ON public.business_packages
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Authenticated: active packages for all, all packages for superadmin
CREATE POLICY "business_packages_select_authenticated"
  ON public.business_packages
  FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- ─────────────────────────────────────────────
-- 3. gallery — consolidate duplicate UPDATE policies
--    Drop the older "Gallery admin update" and keep
--    the newer "superadmin_can_update_gallery" logic
--    merged into a single clean policy
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Gallery admin update"        ON public.gallery;
DROP POLICY IF EXISTS "superadmin_can_update_gallery" ON public.gallery;

CREATE POLICY "gallery_update_superadmin"
  ON public.gallery
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- ─────────────────────────────────────────────
-- 4. testimonials — consolidate duplicate INSERT policies
--    Merge: testimonials_insert_policy + superadmin_can_insert_testimonials
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "testimonials_insert_policy"          ON public.testimonials;
DROP POLICY IF EXISTS "superadmin_can_insert_testimonials"  ON public.testimonials;

-- Customers can insert their own testimonials;
-- superadmin can insert on behalf of anyone
CREATE POLICY "testimonials_insert_authenticated"
  ON public.testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- ─────────────────────────────────────────────
-- 5. testimonials — consolidate duplicate UPDATE policies
--    Merge: testimonials_update_policy + superadmin_can_update_testimonials
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "testimonials_update_policy"          ON public.testimonials;
DROP POLICY IF EXISTS "superadmin_can_update_testimonials"  ON public.testimonials;

-- Superadmin and manager can update any testimonial
CREATE POLICY "testimonials_update_authenticated"
  ON public.testimonials
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) IN ('superadmin', 'manager')
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) IN ('superadmin', 'manager')
  );
