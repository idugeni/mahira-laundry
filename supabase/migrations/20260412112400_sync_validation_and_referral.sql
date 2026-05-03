-- ═══════════════════════════════════════════════════════════════
-- Final Sync: Data Validation & Sultan Referral Logic
-- ═══════════════════════════════════════════════════════════════

-- 1. Tambahkan CHECK constraint untuk Tier agar Sinkron dengan UI
-- ─────────────────────────────────────────────────────────────
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS check_loyalty_tier_sync;
ALTER TABLE profiles ADD CONSTRAINT check_loyalty_tier_sync CHECK (
  (loyalty_tier = 'bronze') OR
  (loyalty_tier = 'silver' AND loyalty_points >= 0) OR -- Points check handled by trigger, but we ensure tier names are correct
  (loyalty_tier = 'gold' AND loyalty_points >= 0) OR
  (loyalty_tier = 'platinum' AND loyalty_points >= 0)
);

-- 2. Logika Referral Sultan (Bonus 25 Poin jika teman belanja >= 500rb)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION award_referral_bonus()
RETURNS TRIGGER AS $$
DECLARE
  referrer_id UUID;
  order_count INTEGER;
BEGIN
  -- Cek apakah ini order pertama dan bernilai >= 500rb
  SELECT COUNT(*) INTO order_count FROM orders WHERE customer_id = NEW.customer_id AND status = 'completed';
  
  IF order_count = 1 AND NEW.total >= 500000 THEN
    -- Cari siapa yang mereferensikan user ini
    SELECT referred_by INTO referrer_id FROM profiles WHERE id = NEW.customer_id;
    
    IF referrer_id IS NOT NULL THEN
      -- Berikan 25 poin ke referrer
      INSERT INTO loyalty (user_id, order_id, points, type, description, balance_after)
      SELECT referrer_id, NEW.id, 25, 'referral', 'Bonus referral dari teman Sultan: ' || NEW.order_number, (loyalty_points + 25)
      FROM profiles WHERE id = referrer_id;

      UPDATE profiles SET loyalty_points = loyalty_points + 25 WHERE id = referrer_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Hapus trigger lama jika ada untuk menghindari duplikasi
DROP TRIGGER IF EXISTS trg_referral_bonus ON orders;
CREATE TRIGGER trg_referral_bonus
AFTER UPDATE OF status ON orders
FOR EACH ROW
WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
EXECUTE FUNCTION award_referral_bonus();
