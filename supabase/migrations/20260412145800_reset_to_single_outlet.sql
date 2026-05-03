-- ═══════════════════════════════════════════════════════════════
-- RESET OUTLETS: Establishing Jatiwaringin as the Only Outlet
-- ═══════════════════════════════════════════════════════════════

-- 1. Hapus semua outlet lama (termasuk dummy data lama)
-- Menggunakan TRUNCATE dengan CASCADE untuk membersihkan tabel terkait jika ada
TRUNCATE TABLE outlets CASCADE;

-- 2. Masukkan satu-satunya outlet resmi (Jatiwaringin, Bekasi)
INSERT INTO outlets (
  id, 
  name, 
  slug, 
  address, 
  phone, 
  whatsapp, 
  email, 
  latitude, 
  longitude, 
  is_active
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- ID Tetap untuk konsistensi
  'Mahira Laundry Jatiwaringin',
  'jatiwaringin',
  'Jl. Raya Jatiwaringin No. 12, Pondok Gede, Kota Bekasi, Jawa Barat 17411',
  '0838-0651-8859',
  '6283806518859',
  'hello@mahiralaundry.id',
  -6.273114,
  106.924298,
  true
);

-- 3. Update profil yang mungkin masih terikat ke outlet lama (jika ada)
UPDATE profiles SET outlet_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
