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
  operating_hours,
  is_active
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- ID Tetap untuk konsistensi
  'Mahira Laundry Jatiwaringin',
  'jatiwaringin',
  'Jl. Cempaka Baru No.109, RT.002/RW.05, Jaticempaka, Kec. Pd. Gede, Kota Bks, Jawa Barat 13620',
  '0838-0651-8859',
  '6283806518859',
  'hello@mahiralaundry.id',
  -6.2621416,
  106.909272,
  '{"monday": "09:00-17:00", "tuesday": "08:00-19:00", "wednesday": "08:00-19:00", "thursday": "08:00-19:00", "friday": "08:00-19:00", "saturday": "08:00-19:00", "sunday": "closed"}'::jsonb,
  true
);

-- 3. Update profil yang mungkin masih terikat ke outlet lama (jika ada)
UPDATE profiles SET outlet_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
