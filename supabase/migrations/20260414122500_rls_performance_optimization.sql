-- Migration: RLS Performance Optimization
-- Description: Optimizes RLS policies by wrapping auth.uid() and other auth functions in subqueries.
-- This prevents the database from re-evaluating the function for every row, using a simpler 'InitPlan' instead.

-- 1. Table: public.expenses
DROP POLICY IF EXISTS "Managers can manage their outlet expenses" ON public.expenses;
CREATE POLICY "Managers can manage their outlet expenses" ON public.expenses
  FOR ALL USING (
    outlet_id IN (SELECT outlet_id FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('manager', 'superadmin'))
    OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- 2. Table: public.deposit_transactions
DROP POLICY IF EXISTS "Users can see their own deposits" ON public.deposit_transactions;
CREATE POLICY "Users can see their own deposits" ON public.deposit_transactions
  FOR SELECT USING (
    profile_id = (SELECT auth.uid()) 
    OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) IN ('manager', 'superadmin')
  );

-- 3. Table: public.franchise_payouts
DROP POLICY IF EXISTS "Managers can see their payouts" ON public.franchise_payouts;
CREATE POLICY "Managers can see their payouts" ON public.franchise_payouts
  FOR SELECT USING (
    outlet_id IN (SELECT outlet_id FROM public.profiles WHERE id = (SELECT auth.uid()))
    OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- 4. Table: public.order_status_logs
DROP POLICY IF EXISTS "Users can view logs for their orders" ON public.order_status_logs;
CREATE POLICY "Users can view logs for their orders" ON public.order_status_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_status_logs.order_id 
      AND (orders.customer_id = (SELECT auth.uid()) OR orders.outlet_id IN (SELECT outlet_id FROM public.profiles WHERE id = (SELECT auth.uid())))
    )
    OR (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'superadmin'
  );

-- Also optimize the actor_id check for deposit_transactions (Insert/Update if any)
-- Adding actor access for completeness
DROP POLICY IF EXISTS "Staff can manage deposits" ON public.deposit_transactions;
CREATE POLICY "Staff can manage deposits" ON public.deposit_transactions
  FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) IN ('manager', 'superadmin', 'kasir')
  );
