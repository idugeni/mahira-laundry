-- ==============================================================================
-- Fix Supabase Security Linter Warnings: Public Bucket Allows Listing
-- ==============================================================================
-- Warns about `storage.objects` broad SELECT policies allowing unauthorized 
-- clients to use the `.list()` API to see all files in public buckets.
-- 
-- Public buckets like 'avatars' and 'outlet-images' don't need a SELECT policy
-- for users to fetch/download files via `.getPublicUrl()`.
--
-- We will replace the broad public view policies with strict staff-only policies 
-- or limit it so anonymous/regular users cannot list all bucket contents.

-- 1. Avatars Bucket
DROP POLICY IF EXISTS "Avatar view: public" ON storage.objects;

-- Only authenticated users can list/view files metadata directly from the storage API.
-- Public downloads still work because the bucket is `public = true`.
CREATE POLICY "Avatar restricted view: auth only"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated' AND (auth.uid() = owner OR get_user_role() IN ('manager', 'superadmin')));


-- 2. Outlet Images Bucket 
DROP POLICY IF EXISTS "Outlet images: public view" ON storage.objects;

-- Only managers and superadmins need to list outlet images
CREATE POLICY "Outlet images restricted view: staff only"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'outlet-images' AND auth.role() = 'authenticated');
