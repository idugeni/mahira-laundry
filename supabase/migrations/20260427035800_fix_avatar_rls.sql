-- Drop existing restrictive avatar policies
DROP POLICY IF EXISTS "Avatar unified management" ON storage.objects;
DROP POLICY IF EXISTS "Avatar upload: authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Avatar view: public" ON storage.objects;

-- 1. SELECT policy: Allow everyone to see any avatar (since avatars are public)
CREATE POLICY "Avatars: public view" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'avatars');

-- 2. ALL policy: Allow users to manage their own avatar based on folder path
-- Path structure: {user_id}/avatar.{ext}
CREATE POLICY "Avatars: user management" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND (
      (storage.foldername(name))[1] = (SELECT auth.uid())::text
      OR 
      public.is_staff_or_above()
    )
  )
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (
      (storage.foldername(name))[1] = (SELECT auth.uid())::text
      OR 
      public.is_staff_or_above()
    )
  );

-- 3. Additional policy for staff/admin to manage all avatars (just in case)
CREATE POLICY "Avatars: staff management" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND public.is_staff_or_above()
  )
  WITH CHECK (
    bucket_id = 'avatars' 
    AND public.is_staff_or_above()
  );
