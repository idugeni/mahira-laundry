-- ═══════════════════════════════════════════════════════════════
-- INDEX OPTIMIZATION: Missing FKeys & Redundancy Removal
-- ═══════════════════════════════════════════════════════════════

-- 1. ADD MISSING FKEY INDEXES (Performance for Joins)
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_reward_id ON redemptions(reward_id);


-- 2. REMOVE REDUNDANT INDEXES (Postgres already creates unique indexes)
-- ─────────────────────────────────────────────────────────────
-- Kolom-kolom ini sudah memiliki batasan UNIQUE, sehingga indeks manual tidak diperlukan
DROP INDEX IF EXISTS idx_outlets_slug;       -- Redundan dengan UNIQUE(slug)
DROP INDEX IF EXISTS idx_orders_number;     -- Redundan dengan UNIQUE(order_number)
DROP INDEX IF EXISTS idx_vouchers_code;      -- Redundan dengan UNIQUE(code)
DROP INDEX IF EXISTS idx_profiles_referral;  -- Redundan dengan UNIQUE(referral_code)


-- 3. ENSURE TESTIMONIAL INDEXES ARE OPTIMAL
-- ─────────────────────────────────────────────────────────────
-- Tetap pertahankan idx_testimonials_published karena krusial untuk filter beranda
-- Tapi pastikan menggunakan filter parsial untuk efisiensi ruang
DROP INDEX IF EXISTS idx_testimonials_published;
CREATE INDEX idx_testimonials_published_v2 ON testimonials(is_published) 
  WHERE is_published = true;


-- 4. CLEANUP UNUSED REDUNDANT LOGS INDEXES
-- ─────────────────────────────────────────────────────────────
-- Audit logs record_id sering dicari bersama table_name, indeks komposit lebih baik
DROP INDEX IF EXISTS idx_audit_table;
DROP INDEX IF EXISTS idx_audit_record;
CREATE INDEX idx_audit_table_record ON audit_logs(table_name, record_id);
