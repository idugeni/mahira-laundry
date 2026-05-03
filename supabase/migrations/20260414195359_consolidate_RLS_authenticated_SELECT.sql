-- Fix: Multiple Permissive Policies on profiles and testimonials for authenticated SELECT
-- This resolves Supabase Performance Linter warnings by being explicit about roles.

-- 1. PROFILES
-- Separate "Profiles: public can view limited info" so it only applies to anonymous users.
DROP POLICY IF EXISTS "Profiles: public can view limited info" ON public.profiles;
CREATE POLICY "Profiles: anon can view limited info"
  ON public.profiles FOR SELECT TO anon
  USING (true);

-- Update authenticated policy to include universal read (as previously allowed by public info policy)
-- to ensure features like testimonials continue working for all users.
DROP POLICY IF EXISTS "profiles_role_select_policy" ON public.profiles;
CREATE POLICY "profiles_role_select_policy" ON public.profiles FOR SELECT TO authenticated
  USING (true);

-- 2. TESTIMONIALS
-- Separate "Public can view published testimonials" so it only applies to anonymous users.
DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
CREATE POLICY "Public can view published testimonials"
  ON public.testimonials FOR SELECT TO anon
  USING (is_published = true);

-- testimonials_select_policy already covers (is_published = true) for authenticated users.
-- So no changes needed to testimonials_select_policy.
