-- ═══════════════════════════════════════════════════════════════
-- Hardening RLS Policies for Mahira Laundry
-- ═══════════════════════════════════════════════════════════════
-- Tujuan: Memastikan tabel sensitif hanya dapat diakses oleh role 'authenticated'
-- dan membatasi akses publik (anon) hanya pada informasi umum.

-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES (Sangat Sensitif)
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_combo_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_combo_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_combo_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_combo_delete_policy" ON profiles;

CREATE POLICY "profiles_select_policy" ON profiles AS PERMISSIVE FOR SELECT TO authenticated
  USING ( (id = (select auth.uid())) OR (is_staff_or_above()) OR (get_user_role() = 'superadmin') );

CREATE POLICY "profiles_insert_policy" ON profiles AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK ( (get_user_role() = 'superadmin') );

CREATE POLICY "profiles_update_policy" ON profiles AS PERMISSIVE FOR UPDATE TO authenticated
  USING ( (id = (select auth.uid())) OR (is_manager_or_above()) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( (id = (select auth.uid())) OR (is_manager_or_above()) OR (get_user_role() = 'superadmin') );

-- ─────────────────────────────────────────────────────────────
-- 2. ORDERS & TRANSACTIONS (Sangat Privat)
-- ─────────────────────────────────────────────────────────────
-- Tabel: orders, order_items, payments
DROP POLICY IF EXISTS "orders_combo_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_combo_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_combo_update_policy" ON orders;
DROP POLICY IF EXISTS "payments_combo_select_policy" ON payments;

-- Orders
CREATE POLICY "orders_select_policy" ON orders AS PERMISSIVE FOR SELECT TO authenticated
  USING ( (customer_id = (select auth.uid())) OR (is_staff_or_above()) OR (get_user_role() = 'superadmin') );

CREATE POLICY "orders_insert_policy" ON orders AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK ( (customer_id = (select auth.uid())) OR (is_staff_or_above()) OR (get_user_role() = 'superadmin') );

CREATE POLICY "orders_update_policy" ON orders AS PERMISSIVE FOR UPDATE TO authenticated
  USING ( (customer_id = (select auth.uid()) AND status = 'pending') OR (is_staff_or_above()) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( (customer_id = (select auth.uid()) AND status = 'pending') OR (is_staff_or_above()) OR (get_user_role() = 'superadmin') );

-- Order Items
DROP POLICY IF EXISTS "order_items_combo_select_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_combo_insert_policy" ON order_items;
DROP POLICY IF EXISTS "order_items_combo_update_policy" ON order_items;

CREATE POLICY "order_items_select_policy" ON order_items AS PERMISSIVE FOR SELECT TO authenticated
  USING ( (order_id IN (SELECT id FROM orders WHERE customer_id = (select auth.uid()))) OR (is_staff_or_above()) OR (get_user_role() = 'superadmin') );

-- Payments (Tutup akses publik total)
DROP POLICY IF EXISTS "payments_combo_select_policy" ON payments;
DROP POLICY IF EXISTS "payments_combo_insert_policy" ON payments;
DROP POLICY IF EXISTS "payments_combo_update_policy" ON payments;

CREATE POLICY "payments_select_policy" ON payments AS PERMISSIVE FOR SELECT TO authenticated
  USING ( (order_id IN (SELECT id FROM orders WHERE customer_id = (select auth.uid()))) OR (is_staff_or_above()) OR (get_user_role() = 'superadmin') );

-- ─────────────────────────────────────────────────────────────
-- 3. PERUSAHAAN & LAYANAN (Publik Terbatas)
-- ─────────────────────────────────────────────────────────────
-- Outlets
DROP POLICY IF EXISTS "outlets_combo_select_policy" ON outlets;
CREATE POLICY "outlets_public_select" ON outlets AS PERMISSIVE FOR SELECT TO public
  USING ( (is_active = true) OR (get_user_role() = 'superadmin') );

-- Services
DROP POLICY IF EXISTS "services_combo_select_policy" ON services;
CREATE POLICY "services_public_select" ON services AS PERMISSIVE FOR SELECT TO public
  USING ( (is_active = true) OR (is_manager_or_above()) OR (get_user_role() = 'superadmin') );

-- Reviews
DROP POLICY IF EXISTS "reviews_combo_select_policy" ON reviews;
CREATE POLICY "reviews_public_select" ON reviews AS PERMISSIVE FOR SELECT TO public
  USING ( (is_published = true) OR (is_manager_or_above()) OR (get_user_role() = 'superadmin') );

-- ─────────────────────────────────────────────────────────────
-- 4. OPERASIONAL (Internal Only)
-- ─────────────────────────────────────────────────────────────
-- Inventory, Audit Logs, Shifts
DROP POLICY IF EXISTS "inventory_combo_select_policy" ON inventory;
CREATE POLICY "inventory_staff_only" ON inventory AS PERMISSIVE FOR ALL TO authenticated
  USING ( (is_staff_or_above()) OR (get_user_role() = 'superadmin') );

DROP POLICY IF EXISTS "audit_logs_combo_select_policy" ON audit_logs;
CREATE POLICY "audit_logs_admin_only" ON audit_logs AS PERMISSIVE FOR SELECT TO authenticated
  USING ( (get_user_role() = 'superadmin') );

-- ─────────────────────────────────────────────────────────────
-- 5. NOTIFICATIONS & LOYALTY (Personal Only)
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "notifications_combo_select_policy" ON notifications;
DROP POLICY IF EXISTS "notifications_combo_update_policy" ON notifications;

CREATE POLICY "notifications_personal_select" ON notifications AS PERMISSIVE FOR SELECT TO authenticated
  USING ( (user_id = (select auth.uid())) OR (get_user_role() = 'superadmin') );

CREATE POLICY "notifications_personal_update" ON notifications AS PERMISSIVE FOR UPDATE TO authenticated
  USING ( (user_id = (select auth.uid())) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( (user_id = (select auth.uid())) OR (get_user_role() = 'superadmin') );

DROP POLICY IF EXISTS "loyalty_combo_select_policy" ON loyalty;
CREATE POLICY "loyalty_personal_select" ON loyalty AS PERMISSIVE FOR SELECT TO authenticated
  USING ( (user_id = (select auth.uid())) OR (is_staff_or_above()) OR (get_user_role() = 'superadmin') );
