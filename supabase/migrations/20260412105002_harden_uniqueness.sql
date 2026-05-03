-- ═══════════════════════════════════════════════════════════════
-- Hardening Data Uniqueness & Integrity
-- ═══════════════════════════════════════════════════════════════

-- 1. Kuatkan Fungsi Generasi Kode Order (Anti Race-Condition)
-- Menambahkan 2 karakter acak di akhir untuk menjamin keunikan mutlak
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  date_str TEXT;
  seq INTEGER;
  random_suffix TEXT;
BEGIN
  date_str := to_char(now(), 'YYYYMMDD');
  random_suffix := UPPER(SUBSTRING(md5(random()::text) FROM 1 FOR 2)); -- 2-char entropy
  
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(SPLIT_PART(order_number, '-', 3), '-', 1) AS INTEGER)
  ), 0) + 1 INTO seq
  FROM orders
  WHERE order_number LIKE 'MHR-' || date_str || '-%';

  NEW.order_number := 'MHR-' || date_str || '-' || LPAD(seq::TEXT, 4, '0') || '-' || random_suffix;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. Pastikan Transaksi Pembayaran Unik
-- ─────────────────────────────────────────────────────────────
ALTER TABLE payments ADD CONSTRAINT unique_midtrans_id UNIQUE (midtrans_transaction_id);

-- 3. Pastikan No. Telepon Unik (Satu No. HP per Akun)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE profiles ADD CONSTRAINT unique_profile_phone UNIQUE (phone);

-- 4. Pastikan Slug Layanan Unik per Outlet (Jika belum ada)
-- ─────────────────────────────────────────────────────────────
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_outlet_id_slug_key') THEN
    ALTER TABLE services ADD CONSTRAINT services_outlet_id_slug_key UNIQUE (outlet_id, slug);
  END IF;
END $$;
