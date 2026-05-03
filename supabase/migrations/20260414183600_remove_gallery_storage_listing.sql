-- Fix security vulnerability: Remove ALL listing permissions on gallery bucket
-- Public buckets don't need a SELECT policy to serve files via URL.
-- Any SELECT policy triggers the 'Anyone can list all files in this bucket' linter warning 
-- because it implies listing is permitted (or the linter enforces 0 SELECT policies on public buckets).

-- Drop the admin-only list policy we created earlier
DROP POLICY IF EXISTS "Admin Gallery List" ON storage.objects;

-- Also double-check and drop the public one again just in case
DROP POLICY IF EXISTS "Public Gallery View" ON storage.objects;
