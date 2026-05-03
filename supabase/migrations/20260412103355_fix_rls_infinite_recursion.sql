-- ═══════════════════════════════════════════════════════════════
-- Fix Infinite Recursion in RLS Policies
-- ═══════════════════════════════════════════════════════════════

-- 1. Create Security Definer helper functions to break recursion
-- These functions bypass RLS to perform specific checks
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION check_order_access_for_courier(o_id UUID, u_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM delivery 
    WHERE order_id = o_id AND courier_id = u_id
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION get_order_owner_id(o_id UUID)
RETURNS UUID AS $$
  SELECT customer_id FROM orders WHERE id = o_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION get_order_outlet_id(o_id UUID)
RETURNS UUID AS $$
  SELECT outlet_id FROM orders WHERE id = o_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- 2. Update ORDERS policies
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "orders_role_select_policy" ON orders;
CREATE POLICY "orders_role_select_policy" ON orders FOR SELECT TO authenticated
  USING (
    (customer_id = (select auth.uid())) -- Customer sees own
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND outlet_id = get_user_outlet()) -- Staff sees outlet orders
    OR (get_user_role() = 'kurir' AND check_order_access_for_courier(id, (select auth.uid()))) -- Use helper function to avoid recursion
  );

DROP POLICY IF EXISTS "orders_role_update_policy" ON orders;
CREATE POLICY "orders_role_update_policy" ON orders FOR UPDATE TO authenticated
  USING (
    (customer_id = (select auth.uid()) AND status = 'pending') -- Customer can only cancel pending
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND outlet_id = get_user_outlet()) -- Staff manage outlet orders
    OR (get_user_role() = 'kurir' AND check_order_access_for_courier(id, (select auth.uid()))) -- Kurir update assigned status
  )
  WITH CHECK (
    (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND outlet_id = get_user_outlet())
    OR (get_user_role() = 'kurir' AND status IN ('picked_up', 'delivering', 'completed'))
  );

-- 3. Update DELIVERY policies
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "delivery_role_select_policy" ON delivery;
CREATE POLICY "delivery_role_select_policy" ON delivery FOR SELECT TO authenticated
  USING (
    (get_order_owner_id(order_id) = (select auth.uid())) -- Use helper to avoid checking orders table RLS
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir', 'kurir') AND get_order_outlet_id(order_id) = get_user_outlet())
    OR (courier_id = (select auth.uid())) -- Kurir sees assigned
  );

DROP POLICY IF EXISTS "delivery_role_update_policy" ON delivery;
CREATE POLICY "delivery_role_update_policy" ON delivery FOR UPDATE TO authenticated
  USING (
    (get_user_role() = 'superadmin')
    OR (courier_id = (select auth.uid())) -- Kurir can update assigned
    OR (get_user_role() = 'manager' AND get_order_outlet_id(order_id) = get_user_outlet()) -- Manager manage outlet
  )
  WITH CHECK (
    (get_user_role() = 'superadmin')
    OR (courier_id = (select auth.uid()))
    OR (get_user_role() = 'manager')
  );

-- 4. Update AUDIT LOGS policy (also has a potential subquery issue)
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "audit_logs_role_policy" ON audit_logs;
CREATE POLICY "audit_logs_role_policy" ON audit_logs FOR SELECT TO authenticated
  USING (
    (get_user_role() = 'superadmin')
    OR (get_user_role() = 'manager' AND (SELECT outlet_id FROM profiles WHERE id = user_id) = get_user_outlet())
  );
