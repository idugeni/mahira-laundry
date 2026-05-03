-- ═══════════════════════════════════════════════════════════════
-- Extreme Loyalty Rewards (Ultra-Exclusive Points Cost)
-- ═══════════════════════════════════════════════════════════════

-- Update biaya poin menjadi jauh lebih tinggi untuk hadiah yang sama
-- ─────────────────────────────────────────────────────────────
UPDATE rewards 
SET points_cost = 500 
WHERE name = 'Extra Parfum Laundry Premium';

UPDATE rewards 
SET points_cost = 1000 
WHERE name = 'Voucher Mahira Rp 5.000';

-- Kita ganti yang 10rb menjadi voucher yang lebih besar namun poin tetap gila
UPDATE rewards 
SET name = 'Voucher Mahira Rp 15.000', points_cost = 2500 
WHERE name = 'Voucher Mahira Rp 10.000';

UPDATE rewards 
SET name = 'Layanan Anti-Bakteri Sultan', points_cost = 5000 
WHERE name = 'Layanan Anti-Bakteri & Jamur';

-- Tambahkan satu reward mahkota sebagai tujuan akhir
INSERT INTO rewards (name, description, points_cost)
VALUES ('Membership VIP Lifetime Card', 'Kartu fisik member eksklusif Mahira Laundry.', 10000); -- Spend 1 Miliar
