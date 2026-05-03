-- 1. Drop the fragmented policies we created earlier
DROP POLICY IF EXISTS "avatar_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "avatar_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "avatar_delete_policy" ON storage.objects;

DROP POLICY IF EXISTS "delivery_photos_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "delivery_photos_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "delivery_photos_delete_policy" ON storage.objects;

-- 2. Create unified "FOR ALL" policies for Avatars
CREATE POLICY "Avatar unified management" ON storage.objects 
  FOR ALL TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND (owner = (SELECT auth.uid()) OR is_staff_or_above())
  )
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (owner = (SELECT auth.uid()) OR is_staff_or_above())
  );

-- 3. Create unified "FOR ALL" policies for Delivery Photos
CREATE POLICY "Delivery photos unified management" ON storage.objects 
  FOR ALL TO authenticated
  USING (
    bucket_id = 'delivery-photos' 
    AND (get_user_role() = 'kurir' OR is_staff_or_above())
  )
  WITH CHECK (
    bucket_id = 'delivery-photos' 
    AND (get_user_role() = 'kurir' OR is_staff_or_above())
  );
