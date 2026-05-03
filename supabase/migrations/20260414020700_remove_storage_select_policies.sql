-- ==============================================================================
-- Final Fix for Supabase Security Linter: Public Bucket Allows Listing
-- ==============================================================================
-- The Supabase linter flags public buckets with any SELECT policy on storage.objects
-- that is too broad, as it allows unauthorized listing of all files.
--
-- For public buckets ('avatars', 'outlet-images'), file access via public URLs 
-- does NOT require a SELECT policy. Listing is rarely needed.
-- 
-- We will remove these SELECT policies entirely to block listing while 
-- maintaining public read access via direct URLs.

-- 1. Remove old/broad policies
DROP POLICY IF EXISTS "Avatar view: public" ON storage.objects;
DROP POLICY IF EXISTS "Outlet images: public view" ON storage.objects;

-- 2. Remove the "auth-only" policies from the previous fix (still flagged as broad)
DROP POLICY IF EXISTS "Avatar restricted view: auth only" ON storage.objects;
DROP POLICY IF EXISTS "Outlet images restricted view: staff only" ON storage.objects;

-- 3. Just to be absolutely sure, we ensure no other SELECT policies exist for these buckets
-- that might have been added by other migrations.
-- (Postgres doesn't support wildcard drop, so we rely on naming conventions found in migrations).
