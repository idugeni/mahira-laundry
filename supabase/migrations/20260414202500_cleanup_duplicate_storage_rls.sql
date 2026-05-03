-- 1. Hapus policy lama yang duplicate dan terlalu terbuka dari file initial migration
DROP POLICY IF EXISTS "Avatar upload: authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Delivery photos: kurir can upload" ON storage.objects;

-- Avatar dan delivery-photos sekarang hanya bergantung pada policy yang aman ('avatar_upload_policy' dsb) 
-- yang terbuat di migration 20260412143700_final_security_hardening.

-- 2. Tambahkan policy UPDATE dan DELETE agar konsisten dan user bisa mengganti profilnya sendiri
--    (Mencegah file storage membengkak tanpa bisa dihapus oleh user)

-- AVATARS
DROP POLICY IF EXISTS "avatar_update_policy" ON storage.objects;
CREATE POLICY "avatar_update_policy" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (owner = (SELECT auth.uid()) OR is_staff_or_above()))
  WITH CHECK (bucket_id = 'avatars' AND (owner = (SELECT auth.uid()) OR is_staff_or_above()));

DROP POLICY IF EXISTS "avatar_delete_policy" ON storage.objects;
CREATE POLICY "avatar_delete_policy" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (owner = (SELECT auth.uid()) OR is_staff_or_above()));

-- DELIVERY PHOTOS
DROP POLICY IF EXISTS "delivery_photos_update_policy" ON storage.objects;
CREATE POLICY "delivery_photos_update_policy" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'delivery-photos' AND (get_user_role() = 'kurir' OR is_staff_or_above()))
  WITH CHECK (bucket_id = 'delivery-photos' AND (get_user_role() = 'kurir' OR is_staff_or_above()));

DROP POLICY IF EXISTS "delivery_photos_delete_policy" ON storage.objects;
CREATE POLICY "delivery_photos_delete_policy" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'delivery-photos' AND (get_user_role() = 'kurir' OR is_staff_or_above()));
