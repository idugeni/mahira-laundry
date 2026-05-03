-- ═══════════════════════════════════════════════════════════════
-- DEEP CLEANUP: Eliminating Duplicate RLS Policies
-- ═══════════════════════════════════════════════════════════════

-- 1. ORDERS: Drop specific old policies that conflict with FOR ALL
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "orders_role_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_role_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "Orders: customer can create own" ON orders;
DROP POLICY IF EXISTS "Orders: superadmin full access" ON orders;


-- 2. TESTIMONIALS: Remove initial trial policies
-- ─────────────────────────────────────────────────────────────
-- Gunakan tanda kutip karena PostgreSQL menyimpan nama kebijakan case-sensitive jika didefinisikan demikian
DROP POLICY IF EXISTS "Public can view published testimonials" ON testimonials;
DROP POLICY IF EXISTS "Users can create their own testimonials" ON testimonials;
DROP POLICY IF EXISTS "Users can manage their own testimonials" ON testimonials;


-- 3. FINAL UNIFIED ORDERS (Menambahkan SELECT secara eksplisit agar lebih aman)
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "orders_unified_update_delete_policy" ON orders;

CREATE POLICY "orders_ultimate_all_policy" ON orders FOR ALL TO authenticated
  USING (
    (customer_id = (SELECT auth.uid()))
    OR (is_staff_or_above())
    OR (get_user_role() = 'superadmin')
  )
  WITH CHECK (
    (customer_id = (SELECT auth.uid()) AND status = 'pending')
    OR (is_staff_or_above())
    OR (get_user_role() = 'superadmin')
  );
