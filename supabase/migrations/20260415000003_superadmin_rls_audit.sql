-- Migration: Superadmin RLS Audit
-- Bug Fix: Supabase Sync — RLS Policy Coverage (Bug 16, Task 18.2)
-- Requirements: 2.16, 3.1
--
-- AUDIT FINDINGS:
--
-- 1. gallery table (UPDATE):
--    ✅ COVERED — Added in 20260415000001_gallery_rls_update_policy.sql
--    Policy: "superadmin_can_update_gallery" (FOR UPDATE, authenticated)
--
-- 2. testimonials table (INSERT):
--    ✅ COVERED — Added in 20260415000002_testimonials_rls_admin_policies.sql
--    Policy: "superadmin_can_insert_testimonials" (FOR INSERT, authenticated)
--
-- 3. testimonials table (UPDATE):
--    ✅ COVERED — Added in 20260415000002_testimonials_rls_admin_policies.sql
--    Policy: "superadmin_can_update_testimonials" (FOR UPDATE, authenticated)
--
-- 4. expenses table (INSERT/UPDATE/DELETE):
--    ✅ COVERED — "Managers can manage their outlet expenses" policy uses FOR ALL
--    and includes superadmin role check. Optimized in 20260414122500.
--    No additional policy needed.
--
-- 5. income table (INSERT):
--    ⚠️  NOT COVERED — The `income` table is referenced by the recordIncome server
--    action (apps/web/lib/actions/finance.ts) but no migration creates this table
--    or its RLS policies. Creating the table and adding superadmin INSERT policy.
--
-- Preservation: Non-superadmin roles continue to be denied access to admin-only
-- operations. All existing policies on other tables remain unchanged.

-- ─────────────────────────────────────────────────────────────────────────────
-- Create income table (referenced by recordIncome server action but missing)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id UUID NOT NULL REFERENCES public.outlets(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  actor_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on income table
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;

-- SELECT policy: superadmin and managers can view income records
CREATE POLICY "superadmin_can_select_income"
ON public.income
FOR SELECT
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) IN ('superadmin', 'manager')
);

-- INSERT policy: superadmin can record income
CREATE POLICY "superadmin_can_insert_income"
ON public.income
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
);

-- UPDATE policy: superadmin can update income records
CREATE POLICY "superadmin_can_update_income"
ON public.income
FOR UPDATE
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
);

-- DELETE policy: superadmin can delete income records
CREATE POLICY "superadmin_can_delete_income"
ON public.income
FOR DELETE
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
);
