-- Fix security vulnerability: Remove public listing on gallery bucket
-- Public buckets don't need SELECT policy to serve files via URL.

-- 1. Drop the overly permissive policy
DROP POLICY IF EXISTS "Public Gallery View" ON storage.objects;

-- 2. Add a restricted SELECT policy for admins only (if they need to list files in dashboard)
-- Note: Our dashboard actually lists from the 'gallery' table, not storage API, 
-- but a SELECT policy for admins is good practice for management tools.
CREATE POLICY "Admin Gallery List" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'gallery' AND
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
);
