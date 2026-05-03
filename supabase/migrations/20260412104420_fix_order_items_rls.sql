-- ═══════════════════════════════════════════════════════════════
-- Fix RLS Policies for Order Items and Payments (Insert Access)
-- ═══════════════════════════════════════════════════════════════

-- 1. ORDER_ITEMS Policies
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "order_items_role_select_policy" ON order_items;
CREATE POLICY "order_items_role_select_policy" ON order_items FOR SELECT TO authenticated
  USING (
    (get_order_owner_id(order_id) = (select auth.uid())) -- Customer sees own
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND get_order_outlet_id(order_id) = get_user_outlet()) -- Staff sees outlet
  );

DROP POLICY IF EXISTS "order_items_role_insert_policy" ON order_items;
CREATE POLICY "order_items_role_insert_policy" ON order_items FOR INSERT TO authenticated
  WITH CHECK (
    (get_order_owner_id(order_id) = (select auth.uid())) -- Customer inserts for own order
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND get_order_outlet_id(order_id) = get_user_outlet()) -- Staff inserts for outlet
  );

-- 2. PAYMENTS Policies
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "payments_role_select_policy" ON payments;
CREATE POLICY "payments_role_select_policy" ON payments FOR SELECT TO authenticated
  USING (
    (get_order_owner_id(order_id) = (select auth.uid())) -- Customer sees own
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND get_order_outlet_id(order_id) = get_user_outlet()) -- Staff sees outlet
  );

DROP POLICY IF EXISTS "payments_role_insert_policy" ON payments;
CREATE POLICY "payments_role_insert_policy" ON payments FOR INSERT TO authenticated
  WITH CHECK (
    (get_order_owner_id(order_id) = (select auth.uid())) -- Customer inserts for own order
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND get_order_outlet_id(order_id) = get_user_outlet()) -- Staff inserts for outlet
  );
