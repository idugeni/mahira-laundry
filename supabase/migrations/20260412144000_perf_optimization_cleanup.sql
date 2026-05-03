-- ═══════════════════════════════════════════════════════════════
-- PRODUCTION-GRADE OPTIMIZATION & CLEANUP
-- ═══════════════════════════════════════════════════════════════
-- Berdasarkan laporan Supabase Linter (0003_auth_rls_initplan & 0006_multiple_permissive_policies)

-- 1. CLEANUP & CONSOLIDATE: INVENTORY
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "inventory_combo_insert_policy" ON inventory;
DROP POLICY IF EXISTS "inventory_combo_update_policy" ON inventory;
DROP POLICY IF EXISTS "inventory_combo_delete_policy" ON inventory;
DROP POLICY IF EXISTS "inventory_role_access_policy" ON inventory;
DROP POLICY IF EXISTS "inventory_staff_only" ON inventory;

CREATE POLICY "inventory_unified_policy" ON inventory AS PERMISSIVE FOR ALL TO authenticated
  USING ( (is_staff_or_above()) OR (get_user_role() = 'superadmin') );


-- 2. CLEANUP & CONSOLIDATE: ORDERS
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can delete their own pending orders" ON orders;
DROP POLICY IF EXISTS "orders_combo_delete_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;
DROP POLICY IF EXISTS "orders_role_update_policy" ON orders;

-- Kebijakan Update & Delete Terpadu untuk Orders
CREATE POLICY "orders_unified_update_delete_policy" ON orders FOR ALL TO authenticated
  USING (
    (customer_id = (SELECT auth.uid()) AND status = 'pending')
    OR (is_staff_or_above())
    OR (get_user_role() = 'superadmin')
  )
  WITH CHECK (
    (customer_id = (SELECT auth.uid()) AND status = 'pending')
    OR (is_staff_or_above())
    OR (get_user_role() = 'superadmin')
  );


-- 3. CLEANUP & CONSOLIDATE: ORDER_ITEMS & PAYMENTS
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "order_items_role_select_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_select_policy" ON order_items;

CREATE POLICY "order_items_unified_select" ON order_items FOR SELECT TO authenticated
  USING (
    (order_id IN (SELECT id FROM orders WHERE customer_id = (SELECT auth.uid())))
    OR (is_staff_or_above())
    OR (get_user_role() = 'superadmin')
  );

DROP POLICY IF EXISTS "payments_role_select_policy" ON payments;
DROP POLICY IF EXISTS "payments_select_policy" ON payments;

CREATE POLICY "payments_unified_select" ON payments FOR SELECT TO authenticated
  USING (
    (order_id IN (SELECT id FROM orders WHERE customer_id = (SELECT auth.uid())))
    OR (is_staff_or_above())
    OR (get_user_role() = 'superadmin')
  );


-- 4. CLEANUP & CONSOLIDATE: TESTIMONIALS (Membereskan sisa peninggalan)
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can create their own testimonials" ON testimonials;
DROP POLICY IF EXISTS "Users can manage their own testimonials" ON testimonials;
-- Testimonials sudah memiliki kebijakan baru dari migrasi sebelumnya (final_security_hardening.sql)


-- 5. OPTIMASI REDEMPTIONS (Scalar Subquery Caching)
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view their own redemptions" ON redemptions;
CREATE POLICY "redemptions_select_policy" ON redemptions FOR SELECT TO authenticated
  USING ( (user_id = (SELECT auth.uid())) OR (is_staff_or_above()) );


-- 6. FINAL PERFORMANCE POLISH (Semua auth.uid() menjadi subquery)
-- ─────────────────────────────────────────────────────────────
-- Memastikan tidak ada sisa auth.uid() tanpa (SELECT ...) di tabel krusial

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit_logs_role_policy" ON audit_logs;
CREATE POLICY "audit_logs_select_policy_v2" ON audit_logs FOR SELECT TO authenticated
  USING ( (get_user_role() = 'superadmin') );
