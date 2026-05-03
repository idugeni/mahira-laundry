-- ═══════════════════════════════════════════════════════════════
-- Final Fix for Orders INSERT RLS Policy
-- ═══════════════════════════════════════════════════════════════

-- Ensure we drop all possible variants of the insert policy
DROP POLICY IF EXISTS "orders_role_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_combo_insert_policy" ON orders;

-- Create a robust INSERT policy
CREATE POLICY "orders_role_insert_policy" ON orders FOR INSERT TO authenticated
  WITH CHECK (
    (customer_id = (select auth.uid())) -- A customer can only create an order for themselves
    OR (get_user_role() IN ('manager', 'kasir')) -- Or staff can create for anyone (outlet restriction handled by outlet_id if needed)
    OR (get_user_role() = 'superadmin')
  );

-- Also ensure SELECT is rock solid to allow RETURNING *
DROP POLICY IF EXISTS "orders_role_select_policy" ON orders;
CREATE POLICY "orders_role_select_policy" ON orders FOR SELECT TO authenticated
  USING (
    (customer_id = (select auth.uid())) -- Self
    OR (get_user_role() = 'superadmin')
    OR (get_user_role() IN ('manager', 'kasir') AND outlet_id = get_user_outlet())
    OR (get_user_role() = 'kurir' AND check_order_access_for_courier(id, (select auth.uid())))
  );
