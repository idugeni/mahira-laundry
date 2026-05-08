-- Migration: Performance & Security Optimization Pack
-- Description: Add missing indexes for foreign keys, optimize audit logs, and add data integrity constraints.

-- 1. Indexing Foreign Keys for Performance
-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_outlet_id ON public.profiles(outlet_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_outlet_id ON public.orders(outlet_id);
CREATE INDEX IF NOT EXISTS idx_orders_kasir_id ON public.orders(kasir_id);
CREATE INDEX IF NOT EXISTS idx_orders_washer_id ON public.orders(washer_id);
CREATE INDEX IF NOT EXISTS idx_orders_ironer_id ON public.orders(ironer_id);
CREATE INDEX IF NOT EXISTS idx_orders_qc_id ON public.orders(qc_id);

-- Order Items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_service_id ON public.order_items(service_id);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);

-- Delivery
CREATE INDEX IF NOT EXISTS idx_delivery_order_id ON public.delivery(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_courier_id ON public.delivery(courier_id);

-- Loyalty & Rewards
CREATE INDEX IF NOT EXISTS idx_loyalty_user_id ON public.loyalty(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_order_id ON public.loyalty(order_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON public.redemptions(user_id);

-- Inventory
CREATE INDEX IF NOT EXISTS idx_inventory_outlet_id ON public.inventory(outlet_id);

-- Notifications & Reviews
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON public.reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON public.reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_outlet_id ON public.reviews(outlet_id);

-- 2. Audit Logs Optimization
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON public.audit_logs(record_id);

-- 3. Data Integrity Constraints
ALTER TABLE public.profiles 
  ADD CONSTRAINT check_positive_loyalty_points CHECK (loyalty_points >= 0);

ALTER TABLE public.inventory 
  ADD CONSTRAINT check_positive_quantity CHECK (quantity >= 0);

-- 4. Additional Performance: Search by Phone/Email
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
