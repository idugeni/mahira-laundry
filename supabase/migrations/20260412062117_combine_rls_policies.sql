-- Fix: Combine Multiple Permissive Policies to resolve Supabase Performance Linter warnings

-- Combining policies for outlets
DROP POLICY IF EXISTS "Outlets: everyone can view active" ON outlets;
DROP POLICY IF EXISTS "Outlets: superadmin can do everything" ON outlets;
DROP POLICY IF EXISTS "Outlets: manager can update own outlet" ON outlets;
CREATE POLICY "outlets_combo_select_policy" ON outlets FOR SELECT 
  USING ( (is_active = true) OR (get_user_role() = 'superadmin') );
CREATE POLICY "outlets_combo_insert_policy" ON outlets FOR INSERT 
  WITH CHECK ( get_user_role() = 'superadmin' );
CREATE POLICY "outlets_combo_update_policy" ON outlets FOR UPDATE 
  USING ( (get_user_role() = 'manager' AND id = get_user_outlet()) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( get_user_role() = 'superadmin' );
CREATE POLICY "outlets_combo_delete_policy" ON outlets FOR DELETE 
  USING ( get_user_role() = 'superadmin' );

-- Combining policies for profiles
DROP POLICY IF EXISTS "Profiles: users can view own" ON profiles;
DROP POLICY IF EXISTS "Profiles: users can update own" ON profiles;
DROP POLICY IF EXISTS "Profiles: staff can view same outlet" ON profiles;
DROP POLICY IF EXISTS "Profiles: manager can manage same outlet staff" ON profiles;
DROP POLICY IF EXISTS "Profiles: superadmin full access" ON profiles;
CREATE POLICY "profiles_combo_select_policy" ON profiles FOR SELECT 
  USING ( (id = (select auth.uid())) OR (is_staff_or_above() AND outlet_id = get_user_outlet()) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "profiles_combo_insert_policy" ON profiles FOR INSERT 
  WITH CHECK ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "profiles_combo_update_policy" ON profiles FOR UPDATE 
  USING ( (id = (select auth.uid())) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "profiles_combo_delete_policy" ON profiles FOR DELETE 
  USING ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );

-- Combining policies for services
DROP POLICY IF EXISTS "Services: everyone can view active" ON services;
DROP POLICY IF EXISTS "Services: manager can manage own outlet" ON services;
DROP POLICY IF EXISTS "Services: superadmin full access" ON services;
CREATE POLICY "services_combo_select_policy" ON services FOR SELECT 
  USING ( (is_active = true) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "services_combo_insert_policy" ON services FOR INSERT 
  WITH CHECK ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "services_combo_update_policy" ON services FOR UPDATE 
  USING ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "services_combo_delete_policy" ON services FOR DELETE 
  USING ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );

-- Combining policies for orders
DROP POLICY IF EXISTS "Orders: customer can view own" ON orders;
DROP POLICY IF EXISTS "Orders: customer can create own" ON orders;
DROP POLICY IF EXISTS "Orders: customer can cancel own pending" ON orders;
DROP POLICY IF EXISTS "Orders: kasir can view own outlet" ON orders;
DROP POLICY IF EXISTS "Orders: kasir can create and update own outlet" ON orders;
DROP POLICY IF EXISTS "Orders: kurir can view assigned" ON orders;
DROP POLICY IF EXISTS "Orders: manager can manage own outlet" ON orders;
DROP POLICY IF EXISTS "Orders: superadmin full access" ON orders;
CREATE POLICY "orders_combo_select_policy" ON orders FOR SELECT 
  USING ( (customer_id = (select auth.uid())) OR (get_user_role() = 'kasir' AND outlet_id = get_user_outlet()) OR (get_user_role() = 'kurir' AND id IN (
      SELECT order_id FROM delivery WHERE courier_id = (select auth.uid())
    )) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "orders_combo_insert_policy" ON orders FOR INSERT 
  WITH CHECK ( (customer_id = (select auth.uid())) OR (get_user_role() = 'kasir' AND outlet_id = get_user_outlet()) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "orders_combo_update_policy" ON orders FOR UPDATE 
  USING ( (customer_id = (select auth.uid()) AND status = 'pending') OR (get_user_role() = 'kasir' AND outlet_id = get_user_outlet()) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( (get_user_role() = 'kasir' AND outlet_id = get_user_outlet()) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "orders_combo_delete_policy" ON orders FOR DELETE 
  USING ( (get_user_role() = 'kasir' AND outlet_id = get_user_outlet()) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );

-- Combining policies for order_items
DROP POLICY IF EXISTS "OrderItems: customer can view own" ON order_items;
DROP POLICY IF EXISTS "OrderItems: staff can manage own outlet" ON order_items;
DROP POLICY IF EXISTS "OrderItems: superadmin full access" ON order_items;
CREATE POLICY "order_items_combo_select_policy" ON order_items FOR SELECT 
  USING ( (order_id IN (SELECT id FROM orders WHERE customer_id = (select auth.uid()))) OR (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "order_items_combo_insert_policy" ON order_items FOR INSERT 
  WITH CHECK ( (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "order_items_combo_update_policy" ON order_items FOR UPDATE 
  USING ( (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "order_items_combo_delete_policy" ON order_items FOR DELETE 
  USING ( (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );

-- Combining policies for payments
DROP POLICY IF EXISTS "Payments: customer can view own" ON payments;
DROP POLICY IF EXISTS "Payments: staff can manage own outlet" ON payments;
DROP POLICY IF EXISTS "Payments: superadmin full access" ON payments;
CREATE POLICY "payments_combo_select_policy" ON payments FOR SELECT 
  USING ( (order_id IN (SELECT id FROM orders WHERE customer_id = (select auth.uid()))) OR (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "payments_combo_insert_policy" ON payments FOR INSERT 
  WITH CHECK ( (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "payments_combo_update_policy" ON payments FOR UPDATE 
  USING ( (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "payments_combo_delete_policy" ON payments FOR DELETE 
  USING ( (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );

-- Combining policies for delivery
DROP POLICY IF EXISTS "Delivery: customer can view own" ON delivery;
DROP POLICY IF EXISTS "Delivery: kurir can view and update assigned" ON delivery;
DROP POLICY IF EXISTS "Delivery: staff can manage own outlet" ON delivery;
DROP POLICY IF EXISTS "Delivery: superadmin full access" ON delivery;
CREATE POLICY "delivery_combo_select_policy" ON delivery FOR SELECT 
  USING ( (order_id IN (SELECT id FROM orders WHERE customer_id = (select auth.uid()))) OR (courier_id = (select auth.uid()) AND get_user_role() = 'kurir') OR (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "delivery_combo_insert_policy" ON delivery FOR INSERT 
  WITH CHECK ( (courier_id = (select auth.uid()) AND get_user_role() = 'kurir') OR (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "delivery_combo_update_policy" ON delivery FOR UPDATE 
  USING ( (courier_id = (select auth.uid()) AND get_user_role() = 'kurir') OR (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "delivery_combo_delete_policy" ON delivery FOR DELETE 
  USING ( (courier_id = (select auth.uid()) AND get_user_role() = 'kurir') OR (order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()) OR (get_user_role() = 'superadmin') );

-- Combining policies for loyalty
DROP POLICY IF EXISTS "Loyalty: user can view own" ON loyalty;
DROP POLICY IF EXISTS "Loyalty: staff can manage" ON loyalty;
DROP POLICY IF EXISTS "Loyalty: superadmin full access" ON loyalty;
CREATE POLICY "loyalty_combo_select_policy" ON loyalty FOR SELECT 
  USING ( (user_id = (select auth.uid())) OR (is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "loyalty_combo_insert_policy" ON loyalty FOR INSERT 
  WITH CHECK ( (is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "loyalty_combo_update_policy" ON loyalty FOR UPDATE 
  USING ( (is_staff_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "loyalty_combo_delete_policy" ON loyalty FOR DELETE 
  USING ( (is_staff_or_above()) OR (get_user_role() = 'superadmin') );

-- Combining policies for vouchers
DROP POLICY IF EXISTS "Vouchers: everyone can view active" ON vouchers;
DROP POLICY IF EXISTS "Vouchers: manager can manage" ON vouchers;
DROP POLICY IF EXISTS "Vouchers: superadmin full access" ON vouchers;
CREATE POLICY "vouchers_combo_select_policy" ON vouchers FOR SELECT 
  USING ( (is_active = true AND valid_from <= now() AND valid_until >= now()) OR (is_manager_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "vouchers_combo_insert_policy" ON vouchers FOR INSERT 
  WITH CHECK ( (is_manager_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "vouchers_combo_update_policy" ON vouchers FOR UPDATE 
  USING ( (is_manager_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "vouchers_combo_delete_policy" ON vouchers FOR DELETE 
  USING ( (is_manager_or_above()) OR (get_user_role() = 'superadmin') );

-- Combining policies for inventory
DROP POLICY IF EXISTS "Inventory: staff can view own outlet" ON inventory;
DROP POLICY IF EXISTS "Inventory: manager can manage own outlet" ON inventory;
DROP POLICY IF EXISTS "Inventory: superadmin full access" ON inventory;
CREATE POLICY "inventory_combo_select_policy" ON inventory FOR SELECT 
  USING ( (is_staff_or_above() AND outlet_id = get_user_outlet()) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "inventory_combo_insert_policy" ON inventory FOR INSERT 
  WITH CHECK ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "inventory_combo_update_policy" ON inventory FOR UPDATE 
  USING ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "inventory_combo_delete_policy" ON inventory FOR DELETE 
  USING ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );

-- Combining policies for notifications
DROP POLICY IF EXISTS "Notifications: user can view own" ON notifications;
DROP POLICY IF EXISTS "Notifications: user can update own (mark read)" ON notifications;
DROP POLICY IF EXISTS "Notifications: superadmin full access" ON notifications;
CREATE POLICY "notifications_combo_select_policy" ON notifications FOR SELECT 
  USING ( (user_id = (select auth.uid())) OR (get_user_role() = 'superadmin') );
CREATE POLICY "notifications_combo_insert_policy" ON notifications FOR INSERT 
  WITH CHECK ( get_user_role() = 'superadmin' );
CREATE POLICY "notifications_combo_update_policy" ON notifications FOR UPDATE 
  USING ( (user_id = (select auth.uid())) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( get_user_role() = 'superadmin' );
CREATE POLICY "notifications_combo_delete_policy" ON notifications FOR DELETE 
  USING ( get_user_role() = 'superadmin' );

-- Combining policies for shifts
DROP POLICY IF EXISTS "Shifts: staff can view own" ON shifts;
DROP POLICY IF EXISTS "Shifts: staff can update own (clock in/out)" ON shifts;
DROP POLICY IF EXISTS "Shifts: manager can manage own outlet" ON shifts;
DROP POLICY IF EXISTS "Shifts: superadmin full access" ON shifts;
CREATE POLICY "shifts_combo_select_policy" ON shifts FOR SELECT 
  USING ( (staff_id = (select auth.uid())) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "shifts_combo_insert_policy" ON shifts FOR INSERT 
  WITH CHECK ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "shifts_combo_update_policy" ON shifts FOR UPDATE 
  USING ( (staff_id = (select auth.uid())) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "shifts_combo_delete_policy" ON shifts FOR DELETE 
  USING ( (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') );

-- Combining policies for reviews
DROP POLICY IF EXISTS "Reviews: everyone can view published" ON reviews;
DROP POLICY IF EXISTS "Reviews: customer can create for own orders" ON reviews;
DROP POLICY IF EXISTS "Reviews: customer can update own" ON reviews;
DROP POLICY IF EXISTS "Reviews: manager can reply" ON reviews;
DROP POLICY IF EXISTS "Reviews: superadmin full access" ON reviews;
CREATE POLICY "reviews_combo_select_policy" ON reviews FOR SELECT 
  USING ( (is_published = true) OR (get_user_role() = 'superadmin') );
CREATE POLICY "reviews_combo_insert_policy" ON reviews FOR INSERT 
  WITH CHECK ( (customer_id = (select auth.uid())) OR (get_user_role() = 'superadmin') );
CREATE POLICY "reviews_combo_update_policy" ON reviews FOR UPDATE 
  USING ( (customer_id = (select auth.uid())) OR (is_manager_or_above() AND outlet_id = get_user_outlet()) OR (get_user_role() = 'superadmin') )
  WITH CHECK ( get_user_role() = 'superadmin' );
CREATE POLICY "reviews_combo_delete_policy" ON reviews FOR DELETE 
  USING ( get_user_role() = 'superadmin' );

-- Combining policies for audit_logs
DROP POLICY IF EXISTS "AuditLogs: manager can view own outlet" ON audit_logs;
DROP POLICY IF EXISTS "AuditLogs: superadmin full access" ON audit_logs;
CREATE POLICY "audit_logs_combo_select_policy" ON audit_logs FOR SELECT 
  USING ( (is_manager_or_above()) OR (get_user_role() = 'superadmin') );
CREATE POLICY "audit_logs_combo_insert_policy" ON audit_logs FOR INSERT 
  WITH CHECK ( get_user_role() = 'superadmin' );
CREATE POLICY "audit_logs_combo_update_policy" ON audit_logs FOR UPDATE 
  USING ( get_user_role() = 'superadmin' );
CREATE POLICY "audit_logs_combo_delete_policy" ON audit_logs FOR DELETE 
  USING ( get_user_role() = 'superadmin' );
