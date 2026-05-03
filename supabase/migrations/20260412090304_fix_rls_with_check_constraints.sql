-- Fix RLS WITH CHECK constraints that were accidentally restricted to admins/staff
-- in the previous combine_rls_policies migration.

-- 1. PROFILES: Allow users to update their own profile
DROP POLICY IF EXISTS "profiles_combo_update_policy" ON profiles;
CREATE POLICY "profiles_combo_update_policy" ON profiles FOR UPDATE 
  USING ( (id = (select auth.uid())) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( (id = (select auth.uid())) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );

-- 2. ORDERS: Allow customers to update their own orders (e.g. cancel)
DROP POLICY IF EXISTS "orders_combo_update_policy" ON orders;
CREATE POLICY "orders_combo_update_policy" ON orders FOR UPDATE 
  USING ( (customer_id = (select auth.uid()) AND status = 'pending') OR (get_user_role() = 'kasir' AND outlet_id = get_user_outlet()) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( (customer_id = (select auth.uid()) AND status = 'pending') OR (get_user_role() = 'kasir' AND outlet_id = get_user_outlet()) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );

-- 3. OUTLETS: Allow managers to update their own outlet
DROP POLICY IF EXISTS "outlets_combo_update_policy" ON outlets;
CREATE POLICY "outlets_combo_update_policy" ON outlets FOR UPDATE 
  USING ( (get_user_role() = 'manager' AND id = get_user_outlet()) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( (get_user_role() = 'manager' AND id = get_user_outlet()) OR (get_user_role() = 'superadmin') );

-- 4. REVIEWS: Allow customers to update their own reviews
DROP POLICY IF EXISTS "reviews_combo_update_policy" ON reviews;
CREATE POLICY "reviews_combo_update_policy" ON reviews FOR UPDATE 
  USING ( (customer_id = (select auth.uid())) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( (customer_id = (select auth.uid())) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );

-- 5. NOTIFICATIONS: Allow users to mark their own notifications as read
DROP POLICY IF EXISTS "notifications_combo_update_policy" ON notifications;
CREATE POLICY "notifications_combo_update_policy" ON notifications FOR UPDATE 
  USING ( (user_id = (select auth.uid())) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( (user_id = (select auth.uid())) OR (get_user_role() = 'superadmin') );
