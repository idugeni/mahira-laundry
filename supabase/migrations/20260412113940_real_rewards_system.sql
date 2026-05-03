-- ═══════════════════════════════════════════════════════════════
-- Real Rewards System (Data-Driven & High Points)
-- ═══════════════════════════════════════════════════════════════

-- 1. Tabel Master Hadiah
-- ─────────────────────────────────────────────────────────────
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  stock INTEGER DEFAULT -1, -- -1 berarti unlimited
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Transaksi Penukaran (Redemptions)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Fungsi untuk Proses Penukaran Poin (Redeem)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION redeem_reward(p_user_id UUID, p_reward_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_points_cost INTEGER;
  v_current_points INTEGER;
  v_reward_name TEXT;
  v_redemption_id UUID;
BEGIN
  -- Ambil info hadiah
  SELECT name, points_cost INTO v_reward_name, v_points_cost 
  FROM rewards WHERE id = p_reward_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Hadiah tidak ditemukan atau tidak tersedia.');
  END IF;

  -- Cek saldo poin user
  SELECT loyalty_points INTO v_current_points FROM profiles WHERE id = p_user_id;
  
  IF v_current_points < v_points_cost THEN
    RETURN jsonb_build_object('error', 'Poin tidak cukup. Butuh ' || v_points_cost || ' poin.');
  END IF;

  -- 1. Potong Poin Profile
  UPDATE profiles SET loyalty_points = loyalty_points - v_points_cost WHERE id = p_user_id;

  -- 2. Catat di Riwayat Loyalty
  INSERT INTO loyalty (user_id, points, type, description, balance_after)
  VALUES (p_user_id, -v_points_cost, 'redeem', 'Penukaran hadiah: ' || v_reward_name, v_current_points - v_points_cost);

  -- 3. Catat Transaksi Penukaran
  INSERT INTO redemptions (user_id, reward_id, status)
  VALUES (p_user_id, p_reward_id, 'pending')
  RETURNING id INTO v_redemption_id;

  RETURN jsonb_build_object('success', true, 'redemption_id', v_redemption_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Masukkan Data Hadiah Real (Hadiah Kecil, Poin Tinggi)
-- ─────────────────────────────────────────────────────────────
INSERT INTO rewards (name, description, points_cost) VALUES
('Extra Parfum Laundry Premium', 'Tambahan wangi premium pada seluruh cucian Anda.', 50), -- Spend 5 Juta
('Voucher Mahira Rp 5.000', 'Potongan harga langsung untuk order berikutnya.', 100), -- Spend 10 Juta
('Voucher Mahira Rp 10.000', 'Potongan harga langsung untuk order berikutnya.', 180), -- Spend 18 Juta
('Layanan Anti-Bakteri & Jamur', 'Treatment khusus untuk pakaian lebih higienis.', 300); -- Spend 30 Juta

-- 5. Kebijakan RLS (Izin Membaca Hadiah)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active rewards" ON rewards FOR SELECT USING (is_active = true);

ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own redemptions" ON redemptions FOR SELECT USING (auth.uid() = user_id);
