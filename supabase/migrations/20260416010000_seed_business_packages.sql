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
  gen_random_uuid(),
  'Paket Starter Laundry',
  'Starter',
  'Paket entry-level ideal untuk memulai bisnis laundry kiloan di lingkungan perumahan atau kos-kosan. Sudah termasuk mesin cuci, perlengkapan operasional, dan pelatihan dasar.',
  15000000,
  12000000,
  (now() + interval '30 days'),
  '[
    {"name": "Mesin Cuci Front Loading 7 kg", "quantity": 1, "spec": "Kapasitas 7 kg, hemat energi"},
    {"name": "Mesin Pengering 7 kg", "quantity": 1, "spec": "Kapasitas 7 kg, gas/listrik"},
    {"name": "Setrika Uap Profesional", "quantity": 1, "spec": "Setrika uap 2400W"},
    {"name": "Meja Setrika Lipat", "quantity": 1, "spec": "Meja setrika standar"},
    {"name": "Timbangan Digital", "quantity": 1, "spec": "Kapasitas 30 kg, akurasi 10g"},
    {"name": "Rak Pakaian Besi", "quantity": 2, "spec": "Rak gantung 1.5m"},
    {"name": "Deterjen & Pelembut Starter Pack", "quantity": 1, "spec": "Stok awal 3 bulan"},
    {"name": "Plastik Kemasan Branded", "quantity": 1, "spec": "500 lembar + hanger 200 pcs"}
  ]'::jsonb,
  5,
  '3 bulan pertama + hotline WhatsApp',
  '8–12 bulan',
  null,
  false,
  true,
  1
),

-- ─────────────────────────────────────────────
-- 2. Paket Standard
-- ─────────────────────────────────────────────
(
  gen_random_uuid(),
  'Paket Standard Laundry',
  'Standard',
  'Paket terlengkap untuk skala usaha menengah. Cocok untuk ruko atau tempat usaha mandiri dengan kapasitas produksi lebih tinggi dan layanan express.',
  35000000,
  null,
  null,
  '[
    {"name": "Mesin Cuci Front Loading 10 kg", "quantity": 2, "spec": "Kapasitas 10 kg, inverter"},
    {"name": "Mesin Pengering 10 kg", "quantity": 1, "spec": "Kapasitas 10 kg, gas"},
    {"name": "Mesin Cuci Top Loading 7 kg", "quantity": 1, "spec": "Untuk cucian cepat"},
    {"name": "Setrika Uap Profesional", "quantity": 2, "spec": "Setrika uap 2400W"},
    {"name": "Meja Setrika Lipat", "quantity": 2, "spec": "Meja setrika standar"},
    {"name": "Timbangan Digital", "quantity": 2, "spec": "Kapasitas 30 kg"},
    {"name": "Rak Pakaian Besi", "quantity": 4, "spec": "Rak gantung 1.5m"},
    {"name": "Kasir POS Tablet + Printer Struk", "quantity": 1, "spec": "Tablet 10 inci + printer thermal"},
    {"name": "Signage & Branding Outlet", "quantity": 1, "spec": "Spanduk, banner, stiker branded"},
    {"name": "Deterjen & Pelembut Starter Pack", "quantity": 1, "spec": "Stok awal 6 bulan"},
    {"name": "Plastik Kemasan Branded", "quantity": 1, "spec": "1000 lembar + hanger 500 pcs"},
    {"name": "Seragam Karyawan", "quantity": 3, "spec": "3 stel seragam branded Mahira"}
  ]'::jsonb,
  7,
  '6 bulan penuh + kunjungan lapangan bulanan',
  '10–15 bulan',
  null,
  true,
  true,
  2
),

-- ─────────────────────────────────────────────
-- 3. Paket Premium
-- ─────────────────────────────────────────────
(
  gen_random_uuid(),
  'Paket Premium Laundry',
  'Premium',
  'Paket premium all-in-one untuk skala bisnis besar. Dilengkapi mesin industri, sistem manajemen digital penuh, dan dukungan eksklusif 1 tahun. Cocok untuk lokasi strategis dengan volume tinggi.',
  75000000,
  null,
  null,
  '[
    {"name": "Mesin Cuci Industrial 15 kg", "quantity": 2, "spec": "Kapasitas 15 kg, inverter, stainless"},
    {"name": "Mesin Pengering Industrial 15 kg", "quantity": 2, "spec": "Kapasitas 15 kg, gas, efisiensi tinggi"},
    {"name": "Mesin Cuci Front Loading 10 kg", "quantity": 1, "spec": "Untuk layanan express"},
    {"name": "Setrika Uap Profesional", "quantity": 3, "spec": "Setrika uap 2400W"},
    {"name": "Meja Setrika Ergonomis", "quantity": 3, "spec": "Meja setrika premium"},
    {"name": "Timbangan Digital Presisi", "quantity": 2, "spec": "Kapasitas 50 kg, akurasi 5g"},
    {"name": "Rak Pakaian Besi Heavy Duty", "quantity": 6, "spec": "Rak gantung 2m, kapasitas 100 kg"},
    {"name": "Sistem POS Lengkap", "quantity": 1, "spec": "PC + monitor + printer struk + barcode scanner"},
    {"name": "CCTV 4 Kamera", "quantity": 1, "spec": "Kamera HD 1080p + DVR + monitor"},
    {"name": "AC Split 1 PK", "quantity": 2, "spec": "Untuk kenyamanan pelanggan & karyawan"},
    {"name": "Signage & Branding Premium", "quantity": 1, "spec": "Neon box, banner, stiker, seragam 5 stel"},
    {"name": "Deterjen & Pelembut Premium Pack", "quantity": 1, "spec": "Stok awal 12 bulan, produk premium"},
    {"name": "Plastik Kemasan Branded Premium", "quantity": 1, "spec": "2000 lembar + hanger 1000 pcs"},
    {"name": "Aplikasi Manajemen Laundry", "quantity": 1, "spec": "Akses penuh platform Mahira 1 tahun"}
  ]'::jsonb,
  10,
  '12 bulan penuh + manajer pendamping 2 minggu pertama',
  '12–18 bulan',
  null,
  false,
  true,
  3
);
