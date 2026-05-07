-- ═══════════════════════════════════════════════════════════════
-- Seed: Paket Usaha Laundry Mahira
-- ═══════════════════════════════════════════════════════════════
-- 3 paket kemitraan: Starter, Standard, Premium
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.business_packages (
  id,
  name,
  tier,
  description,
  price,
  promo_price,
  promo_expires_at,
  items,
  training_duration_days,
  support_coverage,
  estimated_roi,
  image_url,
  is_featured,
  is_active,
  sort_order
) VALUES

-- ─────────────────────────────────────────────
-- 1. Paket Starter
-- ─────────────────────────────────────────────
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
  'Paket Hemat Laundry',
  'Starter',
  'Paket paling ekonomis untuk memulai usaha laundry dari rumah. Sudah termasuk setrika uap boiler profesional dan perlengkapan dasar.',
  25000000,
  15000000,
  (now() + interval '30 days'),
  '[
    {"name": "Setrika uap boiler 10 liter", "quantity": 1, "spec": "Boiler stainless, hemat gas"},
    {"name": "Rak pakaian besi", "quantity": 1, "spec": "1.5 meter, gantung & lipat"},
    {"name": "Gantungan baju (1 kodi)", "quantity": 20, "spec": "Hanger kawat coating"},
    {"name": "Deterjen & Pewangi", "quantity": 1, "spec": "Stok untuk 1 bulan"},
    {"name": "Spanduk Promosi", "quantity": 1, "spec": "Spanduk info/promosi Mahira Laundry"}
  ]'::jsonb,
  3,
  '1 bulan pertama + hotline WhatsApp',
  '6–10 bulan',
  null,
  false,
  true,
  1
),

-- ─────────────────────────────────────────────
-- 2. Paket Standard
-- ─────────────────────────────────────────────
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678902',
  'Paket Business Laundry',
  'Standard',
  'Paket lengkap untuk skala ruko atau kios. Dilengkapi 2 unit mesin cuci & pengering untuk kapasitas produksi harian yang stabil.',
  42000000,
  35000000,
  (now() + interval '30 days'),
  '[
    {"name": "Mesin Cuci Front Loading", "quantity": 2, "spec": "Bukaan depan, inverter, hemat air"},
    {"name": "Mesin Pengering (Dryer)", "quantity": 2, "spec": "Kapasitas 10kg, konversi gas"},
    {"name": "Timbangan Digital", "quantity": 1, "spec": "Kapasitas 30kg, akurasi tinggi"},
    {"name": "Rak Besi Pakaian", "quantity": 2, "spec": "1.5 meter heavy duty"},
    {"name": "Persediaan Deterjen & Parfum", "quantity": 1, "spec": "Stok untuk 2 bulan"},
    {"name": "Kemasan Plastik", "quantity": 1, "spec": "Plastik pembungkus semua ukuran"},
    {"name": "Spanduk Promosi", "quantity": 1, "spec": "Spanduk info/promosi Mahira Laundry"}
  ]'::jsonb,
  7,
  '3 bulan penuh + kunjungan lapangan bulanan',
  '10–14 bulan',
  null,
  true,
  true,
  2
),

-- ─────────────────────────────────────────────
-- 3. Paket Premium
-- ─────────────────────────────────────────────
(
  'c3d4e5f6-a7b8-9012-cdef-123456789013',
  'Paket Enterprise Laundry',
  'Premium',
  'Paket investasi terbaik untuk skala bisnis besar. Kapasitas produksi tinggi dengan 4 unit mesin dan sistem manajemen lengkap.',
  90000000,
  75000000,
  (now() + interval '30 days'),
  '[
    {"name": "Mesin Cuci Front Loading", "quantity": 4, "spec": "Bukaan depan, inverter, heavy duty"},
    {"name": "Mesin Pengering (Dryer)", "quantity": 4, "spec": "Kapasitas 10kg, konversi gas"},
    {"name": "Setrika Uap Boiler 20 Liter", "quantity": 1, "spec": "Dua kepala setrika"},
    {"name": "Timbangan Digital", "quantity": 2, "spec": "Kapasitas 30kg, akurasi tinggi"},
    {"name": "Rak Besi Pakaian", "quantity": 4, "spec": "1.5 meter heavy duty"},
    {"name": "Persediaan Deterjen & Parfum", "quantity": 1, "spec": "Stok untuk 4 bulan"},
    {"name": "Kemasan Plastik", "quantity": 1, "spec": "Stok kemasan 6 bulan (semua ukuran)"},
    {"name": "Branding & Signage", "quantity": 1, "spec": "Spanduk info, X-Banner, & Neon Box"},
    {"name": "Sistem POS Kasir", "quantity": 1, "spec": "Tablet + Printer Thermal + Laci Uang"}
  ]'::jsonb,
  14,
  '12 bulan penuh + manajer pendamping 2 minggu pertama',
  '12–18 bulan',
  null,
  false,
  true,
  3
);
