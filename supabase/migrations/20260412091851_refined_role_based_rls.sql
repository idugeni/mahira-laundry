-- ═══════════════════════════════════════════════════════════════
-- Refined Role-Based RLS Policies (Enterprise Grade)
-- ═══════════════════════════════════════════════════════════════

-- Reset existing combo policies to strictly define roles
-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_combo_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_combo_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_combo_update_policy" ON profiles;

-- SELECT
CREATE POLICY "profiles_role_select_policy" ON profiles FOR SELECT TO authenticated
  USING (
    (id = (select auth.uid())) -- Self
    OR (get_user_role() = 'superadmin') -- Overlord
    OR (get_user_role() = 'manager' AND outlet_id = get_user_outlet()) -- Manager can see own outlet staff/customers
    OR (get_user_role() = 'kasir' AND outlet_id = get_user_outlet()) -- Kasir can see customers in their outlet
  );

-- UPDATE
CREATE POLICY "profiles_role_update_policy" ON profiles FOR UPDATE TO authenticated
  USING (
    (id = (select auth.uid())) -- Self
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() = 'manager' AND outlet_id = get_user_outlet()) -- Manager can manage staff/customers in their outlet
  )
  WITH CHECK (
    (id = (select auth.uid())) -- Self
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() = 'manager' AND outlet_id = get_user_outlet())
  );

-- ─────────────────────────────────────────────────────────────
-- 2. ORDERS
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;
DROP POLICY IF EXISTS "orders_combo_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_combo_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_combo_update_policy" ON orders;

-- SELECT
CREATE POLICY "orders_role_select_policy" ON orders FOR SELECT TO authenticated
  USING (
    (customer_id = (select auth.uid())) -- Customer sees own
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND outlet_id = get_user_outlet()) -- Staff sees outlet orders
    OR (get_user_role() = 'kurir' AND id IN (SELECT order_id FROM delivery WHERE courier_id = (select auth.uid()))) -- Kurir sees assigned
  );

-- INSERT
CREATE POLICY "orders_role_insert_policy" ON orders FOR INSERT TO authenticated
  WITH CHECK (
    (customer_id = (select auth.uid())) -- Customer creates own
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND outlet_id = get_user_outlet()) -- Staff creates for customers
  );

-- UPDATE
CREATE POLICY "orders_role_update_policy" ON orders FOR UPDATE TO authenticated
  USING (
    (customer_id = (select auth.uid()) AND status = 'pending') -- Customer can only cancel pending
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND outlet_id = get_user_outlet()) -- Staff manage outlet orders
    OR (get_user_role() = 'kurir' AND id IN (SELECT order_id FROM delivery WHERE courier_id = (select auth.uid()))) -- Kurir update assigned status
  )
  WITH CHECK (
    (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND outlet_id = get_user_outlet())
    OR (get_user_role() = 'kurir' AND status IN ('picked_up', 'delivering', 'completed')) -- Kurir restricted to specific status updates
  );

-- ─────────────────────────────────────────────────────────────
-- 3. DELIVERY
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "delivery_combo_select_policy" ON delivery;
DROP POLICY IF EXISTS "delivery_combo_insert_policy" ON delivery;
DROP POLICY IF EXISTS "delivery_combo_update_policy" ON delivery;

-- SELECT
CREATE POLICY "delivery_role_select_policy" ON delivery FOR SELECT TO authenticated
  USING (
    (order_id IN (SELECT id FROM orders WHERE customer_id = (select auth.uid()))) -- Customer sees own
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir', 'kurir') AND (SELECT outlet_id FROM orders WHERE id = order_id) = get_user_outlet())
    OR (courier_id = (select auth.uid())) -- Kurir sees assigned
  );

-- UPDATE
CREATE POLICY "delivery_role_update_policy" ON delivery FOR UPDATE TO authenticated
  USING (
    (get_user_role() = 'superadmin')
    OR (courier_id = (select auth.uid())) -- Kurir can update assigned
    OR (get_user_role() = 'manager' AND (SELECT outlet_id FROM orders WHERE id = order_id) = get_user_outlet()) -- Manager manage outlet
  )
  WITH CHECK (
    (get_user_role() = 'superadmin')
    OR (courier_id = (select auth.uid()))
    OR (get_user_role() = 'manager')
  );

-- ─────────────────────────────────────────────────────────────
-- 4. INVENTORY (Internal Only)
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "inventory_staff_only" ON inventory;
DROP POLICY IF EXISTS "inventory_combo_select_policy" ON inventory;

CREATE POLICY "inventory_role_access_policy" ON inventory FOR ALL TO authenticated
  USING (
    (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND outlet_id = get_user_outlet())
  );

-- ─────────────────────────────────────────────────────────────
-- 5. SHIFTS
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "shifts_combo_select_policy" ON shifts;
DROP POLICY IF EXISTS "shifts_combo_update_policy" ON shifts;

CREATE POLICY "shifts_role_select_policy" ON shifts FOR SELECT TO authenticated
  USING (
    (staff_id = (select auth.uid())) -- Own shift
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() = 'manager' AND outlet_id = get_user_outlet())
  );

CREATE POLICY "shifts_role_update_policy" ON shifts FOR UPDATE TO authenticated
  USING (
    (staff_id = (select auth.uid())) -- Own shift (clock in/out)
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() = 'manager' AND outlet_id = get_user_outlet())
  );

-- ─────────────────────────────────────────────────────────────
-- 6. AUDIT LOGS
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "audit_logs_admin_only" ON audit_logs;
DROP POLICY IF EXISTS "audit_logs_combo_select_policy" ON audit_logs;

CREATE POLICY "audit_logs_role_policy" ON audit_logs FOR SELECT TO authenticated
  USING (
    (get_user_role() = 'superadmin')
    OR (get_user_role() = 'manager' AND user_id IN (SELECT id FROM profiles WHERE outlet_id = get_user_outlet()))
  );
