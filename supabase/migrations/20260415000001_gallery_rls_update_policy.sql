-- Migration: Add explicit RLS UPDATE policy on gallery table for superadmin role
-- Bug Fix: Gallery Edit RLS Error (Bug 1)
-- 
-- Root Cause: The existing "Admins can manage gallery" policy uses FOR ALL with only
-- a USING clause. While FOR ALL should cover UPDATE, adding an explicit UPDATE policy
-- with both USING and WITH CHECK ensures the superadmin can perform UPDATE operations
-- via the user JWT (createClient), not the service role.
--
-- Preservation: Existing SELECT (public read) and the FOR ALL admin policy are preserved.
-- Non-superadmin roles continue to be denied UPDATE access.

-- Add explicit UPDATE policy for superadmin role on gallery table
CREATE POLICY "superadmin_can_update_gallery"
ON public.gallery
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
    AND profiles.role = 'superadmin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
    AND profiles.role = 'superadmin'
  )
);
