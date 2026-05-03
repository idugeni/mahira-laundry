-- Migration: RLS Policy Consolidation for deposit_transactions
-- Description: Merges overlapping policies for 'authenticated' users into a single unified policy.
-- Also restricts access to 'authenticated' users ONLY, resolving 'anon' role warnings.

-- 1. Drop existing overlapping policies
DROP POLICY IF EXISTS "Users can see their own deposits" ON public.deposit_transactions;
DROP POLICY IF EXISTS "Staff can manage deposits" ON public.deposit_transactions;

-- 2. Create unified policy for ALL actions
-- Covers: 
-- - Customers viewing/managing their own transactions
-- - Staff (Manager, Superadmin, Kasir) managing all transactions
CREATE POLICY "Unified deposit transactions access" ON public.deposit_transactions
  FOR ALL
  TO authenticated
  USING (
    profile_id = (SELECT auth.uid()) 
    OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) IN ('manager', 'superadmin', 'kasir')
  );

-- 3. Ensure RLS is enabled (should be, but reinforcing)
ALTER TABLE public.deposit_transactions ENABLE ROW LEVEL SECURITY;
