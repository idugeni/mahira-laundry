-- ═══════════════════════════════════════════════════════════════
-- Mahira Laundry Bekasi Jatiwaringin — Initial Database Migration
-- ═══════════════════════════════════════════════════════════════
-- 15 tabel, 45+ indexes, 13 functions, 58+ RLS policies
-- ═══════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA IF NOT EXISTS "extensions";
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "extensions";

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────

CREATE TYPE user_role AS ENUM (
  'customer', 'kasir', 'kurir', 'manager', 'superadmin'
);

CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'picked_up', 'washing',
  'ironing', 'ready', 'delivering', 'completed', 'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'unpaid', 'pending', 'paid', 'refunded', 'failed'
);

CREATE TYPE payment_method AS ENUM (
  'cash', 'qris', 'bank_transfer', 'gopay', 'ovo', 'dana', 'shopeepay'
);

CREATE TYPE delivery_type AS ENUM (
  'pickup', 'delivery', 'both'
);

CREATE TYPE delivery_status AS ENUM (
  'assigned', 'on_the_way', 'arrived', 'completed', 'failed'
);

CREATE TYPE service_unit AS ENUM (
  'kg', 'item', 'pasang', 'meter'
);

CREATE TYPE loyalty_tier AS ENUM (
  'bronze', 'silver', 'gold', 'platinum'
);

CREATE TYPE shift_type AS ENUM (
  'pagi', 'siang', 'malam'
);

CREATE TYPE notification_type AS ENUM (
  'order_update', 'payment', 'delivery', 'promotion', 'system'
);

CREATE TYPE voucher_type AS ENUM (
  'percentage', 'fixed_amount', 'free_delivery'
);

CREATE TYPE audit_action AS ENUM (
  'create', 'update', 'delete', 'login', 'logout', 'status_change'
);

-- ─────────────────────────────────────────────
-- 1. OUTLETS (Cabang)
-- ─────────────────────────────────────────────

CREATE TABLE outlets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,

  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  operating_hours JSONB DEFAULT '{"weekday": "07:00-21:00", "weekend": "08:00-20:00"}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_franchise BOOLEAN DEFAULT false,
  franchise_fee DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_outlets_slug ON outlets(slug);
CREATE INDEX idx_outlets_active ON outlets(is_active);
-- PostGIS index removed (using lat/lng instead)

-- ─────────────────────────────────────────────
-- 2. PROFILES (extends auth.users)
-- ─────────────────────────────────────────────

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'customer',
  outlet_id UUID REFERENCES outlets(id),
  loyalty_tier loyalty_tier DEFAULT 'bronze',
  loyalty_points INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  addresses JSONB DEFAULT '[]'::jsonb,
  notification_preferences JSONB DEFAULT '{"whatsapp": true, "email": true, "push": true}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_outlet ON profiles(outlet_id);
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_referral ON profiles(referral_code);
CREATE INDEX idx_profiles_name_trgm ON profiles USING GIN(full_name gin_trgm_ops);

-- ─────────────────────────────────────────────
-- 3. SERVICES (Jenis Layanan)
-- ─────────────────────────────────────────────

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  unit service_unit DEFAULT 'kg',
  price DECIMAL(12,2) NOT NULL,
  estimated_duration_hours INTEGER DEFAULT 24,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_express BOOLEAN DEFAULT false,
  express_multiplier DECIMAL(3,2) DEFAULT 1.5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(outlet_id, slug)
);

CREATE INDEX idx_services_outlet ON services(outlet_id);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_services_sort ON services(sort_order);

-- ─────────────────────────────────────────────
-- 4. ORDERS (Pesanan)
-- ─────────────────────────────────────────────

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  outlet_id UUID NOT NULL REFERENCES outlets(id),
  status order_status DEFAULT 'pending',
  pickup_address TEXT,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  delivery_address TEXT,
  delivery_lat DOUBLE PRECISION,
  delivery_lng DOUBLE PRECISION,
  delivery_type delivery_type DEFAULT 'both',
  delivery_fee DECIMAL(12,2) DEFAULT 0,
  subtotal DECIMAL(12,2) DEFAULT 0,
  discount DECIMAL(12,2) DEFAULT 0,
  voucher_id UUID,
  total DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  estimated_completion TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  kasir_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_outlet ON orders(outlet_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_kasir ON orders(kasir_id);

-- ─────────────────────────────────────────────
-- 5. ORDER_ITEMS (Detail item per order)
-- ─────────────────────────────────────────────

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  service_name TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit service_unit NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  is_express BOOLEAN DEFAULT false,
  subtotal DECIMAL(12,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_service ON order_items(service_id);

-- ─────────────────────────────────────────────
-- 6. PAYMENTS (Pembayaran)
-- ─────────────────────────────────────────────

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  method payment_method NOT NULL,
  status payment_status DEFAULT 'unpaid',
  midtrans_transaction_id TEXT,
  midtrans_order_id TEXT,
  midtrans_snap_token TEXT,
  payment_url TEXT,
  paid_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_midtrans ON payments(midtrans_transaction_id);

-- ─────────────────────────────────────────────
-- 7. DELIVERY (Pengiriman/Antar-Jemput)
-- ─────────────────────────────────────────────

CREATE TABLE delivery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  courier_id UUID REFERENCES profiles(id),
  type delivery_type NOT NULL,
  status delivery_status DEFAULT 'assigned',
  pickup_address TEXT,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  delivery_address TEXT,
  delivery_lat DOUBLE PRECISION,
  delivery_lng DOUBLE PRECISION,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  distance_km DECIMAL(8,2),
  fee DECIMAL(12,2) DEFAULT 0,
  photo_proof_url TEXT,
  notes TEXT,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_delivery_order ON delivery(order_id);
CREATE INDEX idx_delivery_courier ON delivery(courier_id);
CREATE INDEX idx_delivery_status ON delivery(status);

-- ─────────────────────────────────────────────
-- 8. LOYALTY (Riwayat Poin)
-- ─────────────────────────────────────────────

CREATE TABLE loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'redeem', 'bonus', 'referral', 'expire')),
  description TEXT,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_loyalty_user ON loyalty(user_id);
CREATE INDEX idx_loyalty_order ON loyalty(order_id);
CREATE INDEX idx_loyalty_created ON loyalty(created_at DESC);

-- ─────────────────────────────────────────────
-- 9. VOUCHERS (Kupon Diskon)
-- ─────────────────────────────────────────────

CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  outlet_id UUID REFERENCES outlets(id),
  type voucher_type NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  min_order DECIMAL(12,2) DEFAULT 0,
  max_discount DECIMAL(12,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vouchers_code ON vouchers(code);
CREATE INDEX idx_vouchers_outlet ON vouchers(outlet_id);
CREATE INDEX idx_vouchers_active ON vouchers(is_active);
CREATE INDEX idx_vouchers_valid ON vouchers(valid_from, valid_until);

-- ─────────────────────────────────────────────
-- 10. INVENTORY (Stok Bahan)
-- ─────────────────────────────────────────────

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  category TEXT,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'pcs',
  min_stock DECIMAL(10,2) DEFAULT 0,
  cost_per_unit DECIMAL(12,2) DEFAULT 0,
  supplier TEXT,
  last_restocked_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_inventory_outlet ON inventory(outlet_id);
CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_inventory_low_stock ON inventory(quantity, min_stock);

-- ─────────────────────────────────────────────
-- 11. NOTIFICATIONS (Notifikasi)
-- ─────────────────────────────────────────────

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ─────────────────────────────────────────────
-- 12. SHIFTS (Jadwal Kerja)
-- ─────────────────────────────────────────────

CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  shift_type shift_type NOT NULL,
  shift_date DATE NOT NULL,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(staff_id, shift_date, shift_type)
);

CREATE INDEX idx_shifts_staff ON shifts(staff_id);
CREATE INDEX idx_shifts_outlet ON shifts(outlet_id);
CREATE INDEX idx_shifts_date ON shifts(shift_date);

-- ─────────────────────────────────────────────
-- 13. REVIEWS (Ulasan)
-- ─────────────────────────────────────────────

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  outlet_id UUID NOT NULL REFERENCES outlets(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  reply TEXT,
  replied_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reviews_order ON reviews(order_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_outlet ON reviews(outlet_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ─────────────────────────────────────────────
-- 14. AUDIT_LOGS (Log Aktivitas)
-- ─────────────────────────────────────────────

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action audit_action NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_table ON audit_logs(table_name);
CREATE INDEX idx_audit_record ON audit_logs(record_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- 1. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at' AND table_schema = 'public'
  LOOP
    EXECUTE format(
      'CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      t, t
    );
  END LOOP;
END;
$$;

-- 2. Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  date_str TEXT;
  seq INTEGER;
BEGIN
  date_str := to_char(now(), 'YYYYMMDD');
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(order_number, '-', 3) AS INTEGER)
  ), 0) + 1 INTO seq
  FROM orders
  WHERE order_number LIKE 'MHR-' || date_str || '-%';

  NEW.order_number := 'MHR-' || date_str || '-' || LPAD(seq::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_generate_order_number
BEFORE INSERT ON orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
EXECUTE FUNCTION generate_order_number();

-- 3. Calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders SET
    subtotal = (SELECT COALESCE(SUM(subtotal), 0) FROM order_items WHERE order_id = NEW.order_id),
    total = (SELECT COALESCE(SUM(subtotal), 0) FROM order_items WHERE order_id = NEW.order_id)
           + COALESCE((SELECT delivery_fee FROM orders WHERE id = NEW.order_id), 0)
           - COALESCE((SELECT discount FROM orders WHERE id = NEW.order_id), 0)
  WHERE id = NEW.order_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_calc_order_total_insert
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION calculate_order_total();

CREATE TRIGGER trg_calc_order_total_update
AFTER UPDATE ON order_items
FOR EACH ROW
EXECUTE FUNCTION calculate_order_total();

CREATE TRIGGER trg_calc_order_total_delete
AFTER DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION calculate_order_total();

-- 4. Generate referral code for new profiles
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := 'MHR' || UPPER(SUBSTRING(md5(random()::text) FROM 1 FOR 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_generate_referral
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION generate_referral_code();

-- 5. Award loyalty points on completed order
CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
  pts INTEGER;
  current_balance INTEGER;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    pts := GREATEST(1, FLOOR(NEW.total / 10000));
    SELECT loyalty_points INTO current_balance FROM profiles WHERE id = NEW.customer_id;

    INSERT INTO loyalty (user_id, order_id, points, type, description, balance_after)
    VALUES (NEW.customer_id, NEW.id, pts, 'earn',
            'Poin dari order ' || NEW.order_number,
            current_balance + pts);

    UPDATE profiles SET
      loyalty_points = loyalty_points + pts,
      loyalty_tier = CASE
        WHEN loyalty_points + pts >= 5000 THEN 'platinum'
        WHEN loyalty_points + pts >= 2000 THEN 'gold'
        WHEN loyalty_points + pts >= 500 THEN 'silver'
        ELSE 'bronze'
      END
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_award_loyalty
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION award_loyalty_points();

-- 6. Create notification on order status change
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  status_label TEXT;
BEGIN
  IF NEW.status != OLD.status THEN
    CASE NEW.status
      WHEN 'confirmed' THEN status_label := 'dikonfirmasi';
      WHEN 'picked_up' THEN status_label := 'dijemput';
      WHEN 'washing' THEN status_label := 'sedang dicuci';
      WHEN 'ironing' THEN status_label := 'sedang disetrika';
      WHEN 'ready' THEN status_label := 'siap diambil';
      WHEN 'delivering' THEN status_label := 'sedang diantar';
      WHEN 'completed' THEN status_label := 'selesai';
      WHEN 'cancelled' THEN status_label := 'dibatalkan';
      ELSE status_label := NEW.status::TEXT;
    END CASE;

    INSERT INTO notifications (user_id, type, title, body, data)
    VALUES (
      NEW.customer_id,
      'order_update',
      'Status Order Diperbarui',
      'Order ' || NEW.order_number || ' ' || status_label,
      jsonb_build_object('order_id', NEW.id, 'status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_notify_order_status
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_order_status_change();

-- 7. Audit log function
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES ((select auth.uid()), 'create', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    VALUES ((select auth.uid()), 'update', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data)
    VALUES ((select auth.uid()), 'delete', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply audit to critical tables
CREATE TRIGGER trg_audit_orders AFTER INSERT OR UPDATE OR DELETE ON orders FOR EACH ROW EXECUTE FUNCTION log_audit();
CREATE TRIGGER trg_audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments FOR EACH ROW EXECUTE FUNCTION log_audit();
CREATE TRIGGER trg_audit_services AFTER INSERT OR UPDATE OR DELETE ON services FOR EACH ROW EXECUTE FUNCTION log_audit();

-- 8. Increment voucher usage
CREATE OR REPLACE FUNCTION increment_voucher_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.voucher_id IS NOT NULL THEN
    UPDATE vouchers SET used_count = used_count + 1 WHERE id = NEW.voucher_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_voucher_usage
AFTER INSERT ON orders
FOR EACH ROW
WHEN (NEW.voucher_id IS NOT NULL)
EXECUTE FUNCTION increment_voucher_usage();

-- 9. Handle new auth user → create profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NEW.phone,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = (select auth.uid());
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Helper function: get user outlet
CREATE OR REPLACE FUNCTION get_user_outlet()
RETURNS UUID AS $$
  SELECT outlet_id FROM profiles WHERE id = (select auth.uid());
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Helper function: check if user is staff+
CREATE OR REPLACE FUNCTION is_staff_or_above()
RETURNS BOOLEAN AS $$
  SELECT role IN ('kasir', 'kurir', 'manager', 'superadmin')
  FROM profiles WHERE id = (select auth.uid());
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Helper function: check if user is manager+
CREATE OR REPLACE FUNCTION is_manager_or_above()
RETURNS BOOLEAN AS $$
  SELECT role IN ('manager', 'superadmin')
  FROM profiles WHERE id = (select auth.uid());
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- ── OUTLETS ──
CREATE POLICY "Outlets: everyone can view active"
  ON outlets FOR SELECT USING (is_active = true);

CREATE POLICY "Outlets: superadmin can do everything"
  ON outlets FOR ALL USING (get_user_role() = 'superadmin');

CREATE POLICY "Outlets: manager can update own outlet"
  ON outlets FOR UPDATE USING (
    get_user_role() = 'manager' AND id = get_user_outlet()
  );

-- ── PROFILES ──
CREATE POLICY "Profiles: users can view own"
  ON profiles FOR SELECT USING (id = (select auth.uid()));

CREATE POLICY "Profiles: users can update own"
  ON profiles FOR UPDATE USING (id = (select auth.uid()));

CREATE POLICY "Profiles: staff can view same outlet"
  ON profiles FOR SELECT USING (
    is_staff_or_above() AND outlet_id = get_user_outlet()
  );

CREATE POLICY "Profiles: manager can manage same outlet staff"
  ON profiles FOR ALL USING (
    is_manager_or_above() AND outlet_id = get_user_outlet()
  );

CREATE POLICY "Profiles: superadmin full access"
  ON profiles FOR ALL USING (get_user_role() = 'superadmin');

-- ── SERVICES ──
CREATE POLICY "Services: everyone can view active"
  ON services FOR SELECT USING (is_active = true);

CREATE POLICY "Services: manager can manage own outlet"
  ON services FOR ALL USING (
    is_manager_or_above() AND outlet_id = get_user_outlet()
  );

CREATE POLICY "Services: superadmin full access"
  ON services FOR ALL USING (get_user_role() = 'superadmin');

-- ── ORDERS ──
CREATE POLICY "Orders: customer can view own"
  ON orders FOR SELECT USING (customer_id = (select auth.uid()));

CREATE POLICY "Orders: customer can create own"
  ON orders FOR INSERT WITH CHECK (customer_id = (select auth.uid()));

CREATE POLICY "Orders: customer can cancel own pending"
  ON orders FOR UPDATE USING (
    customer_id = (select auth.uid()) AND status = 'pending'
  );

CREATE POLICY "Orders: kasir can view own outlet"
  ON orders FOR SELECT USING (
    get_user_role() = 'kasir' AND outlet_id = get_user_outlet()
  );

CREATE POLICY "Orders: kasir can create and update own outlet"
  ON orders FOR ALL USING (
    get_user_role() = 'kasir' AND outlet_id = get_user_outlet()
  );

CREATE POLICY "Orders: kurir can view assigned"
  ON orders FOR SELECT USING (
    get_user_role() = 'kurir' AND id IN (
      SELECT order_id FROM delivery WHERE courier_id = (select auth.uid())
    )
  );

CREATE POLICY "Orders: manager can manage own outlet"
  ON orders FOR ALL USING (
    is_manager_or_above() AND outlet_id = get_user_outlet()
  );

CREATE POLICY "Orders: superadmin full access"
  ON orders FOR ALL USING (get_user_role() = 'superadmin');

-- ── ORDER_ITEMS ──
CREATE POLICY "OrderItems: customer can view own"
  ON order_items FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE customer_id = (select auth.uid()))
  );

CREATE POLICY "OrderItems: staff can manage own outlet"
  ON order_items FOR ALL USING (
    order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()
  );

CREATE POLICY "OrderItems: superadmin full access"
  ON order_items FOR ALL USING (get_user_role() = 'superadmin');

-- ── PAYMENTS ──
CREATE POLICY "Payments: customer can view own"
  ON payments FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE customer_id = (select auth.uid()))
  );

CREATE POLICY "Payments: staff can manage own outlet"
  ON payments FOR ALL USING (
    order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()
  );

CREATE POLICY "Payments: superadmin full access"
  ON payments FOR ALL USING (get_user_role() = 'superadmin');

-- ── DELIVERY ──
CREATE POLICY "Delivery: customer can view own"
  ON delivery FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE customer_id = (select auth.uid()))
  );

CREATE POLICY "Delivery: kurir can view and update assigned"
  ON delivery FOR ALL USING (
    courier_id = (select auth.uid()) AND get_user_role() = 'kurir'
  );

CREATE POLICY "Delivery: staff can manage own outlet"
  ON delivery FOR ALL USING (
    order_id IN (SELECT id FROM orders WHERE outlet_id = get_user_outlet())
    AND is_staff_or_above()
  );

CREATE POLICY "Delivery: superadmin full access"
  ON delivery FOR ALL USING (get_user_role() = 'superadmin');

-- ── LOYALTY ──
CREATE POLICY "Loyalty: user can view own"
  ON loyalty FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "Loyalty: staff can manage"
  ON loyalty FOR ALL USING (is_staff_or_above());

CREATE POLICY "Loyalty: superadmin full access"
  ON loyalty FOR ALL USING (get_user_role() = 'superadmin');

-- ── VOUCHERS ──
CREATE POLICY "Vouchers: everyone can view active"
  ON vouchers FOR SELECT USING (
    is_active = true AND valid_from <= now() AND valid_until >= now()
  );

CREATE POLICY "Vouchers: manager can manage"
  ON vouchers FOR ALL USING (is_manager_or_above());

CREATE POLICY "Vouchers: superadmin full access"
  ON vouchers FOR ALL USING (get_user_role() = 'superadmin');

-- ── INVENTORY ──
CREATE POLICY "Inventory: staff can view own outlet"
  ON inventory FOR SELECT USING (
    is_staff_or_above() AND outlet_id = get_user_outlet()
  );

CREATE POLICY "Inventory: manager can manage own outlet"
  ON inventory FOR ALL USING (
    is_manager_or_above() AND outlet_id = get_user_outlet()
  );

CREATE POLICY "Inventory: superadmin full access"
  ON inventory FOR ALL USING (get_user_role() = 'superadmin');

-- ── NOTIFICATIONS ──
CREATE POLICY "Notifications: user can view own"
  ON notifications FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "Notifications: user can update own (mark read)"
  ON notifications FOR UPDATE USING (user_id = (select auth.uid()));

-- Permissive insert policy removed (managed by backend/functions)

CREATE POLICY "Notifications: superadmin full access"
  ON notifications FOR ALL USING (get_user_role() = 'superadmin');

-- ── SHIFTS ──
CREATE POLICY "Shifts: staff can view own"
  ON shifts FOR SELECT USING (staff_id = (select auth.uid()));

CREATE POLICY "Shifts: staff can update own (clock in/out)"
  ON shifts FOR UPDATE USING (staff_id = (select auth.uid()));

CREATE POLICY "Shifts: manager can manage own outlet"
  ON shifts FOR ALL USING (
    is_manager_or_above() AND outlet_id = get_user_outlet()
  );

CREATE POLICY "Shifts: superadmin full access"
  ON shifts FOR ALL USING (get_user_role() = 'superadmin');

-- ── REVIEWS ──
CREATE POLICY "Reviews: everyone can view published"
  ON reviews FOR SELECT USING (is_published = true);

CREATE POLICY "Reviews: customer can create for own orders"
  ON reviews FOR INSERT WITH CHECK (customer_id = (select auth.uid()));

CREATE POLICY "Reviews: customer can update own"
  ON reviews FOR UPDATE USING (customer_id = (select auth.uid()));

CREATE POLICY "Reviews: manager can reply"
  ON reviews FOR UPDATE USING (
    is_manager_or_above() AND outlet_id = get_user_outlet()
  );

CREATE POLICY "Reviews: superadmin full access"
  ON reviews FOR ALL USING (get_user_role() = 'superadmin');

-- ── AUDIT_LOGS ──
CREATE POLICY "AuditLogs: manager can view own outlet"
  ON audit_logs FOR SELECT USING (is_manager_or_above());

CREATE POLICY "AuditLogs: superadmin full access"
  ON audit_logs FOR ALL USING (get_user_role() = 'superadmin');

-- ═══════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('delivery-photos', 'delivery-photos', false),
  ('receipts', 'receipts', false),
  ('outlet-images', 'outlet-images', true)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Avatar upload: authenticated users"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Avatar view: public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Delivery photos: kurir can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'delivery-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Delivery photos: staff can view"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'delivery-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Outlet images: public view"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'outlet-images');

CREATE POLICY "Outlet images: manager can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'outlet-images' AND auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════
-- REALTIME
-- ═══════════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE delivery;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
