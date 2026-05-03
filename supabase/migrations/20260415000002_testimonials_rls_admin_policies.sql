-- Migration: Add RLS INSERT and UPDATE policies on testimonials table for superadmin role
-- Bug Fix: Testimonial CRUD Gaps (Bug 5)
--
-- Root Cause: The testimonials table lacks INSERT and UPDATE policies for the superadmin
-- role. The existing policies only allow customers to insert their own testimonials and
-- superadmin to update is_published status. Adding explicit INSERT and UPDATE policies
-- allows superadmin to create testimonials on behalf of users and edit content/rating.
--
-- Preservation: Existing customer INSERT policy and superadmin status update policy
-- are preserved. Non-superadmin roles continue to be denied admin-level access.

-- Add INSERT policy for superadmin role on testimonials table
CREATE POLICY "superadmin_can_insert_testimonials"
ON public.testimonials
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
    AND profiles.role = 'superadmin'
  )
);

-- Add UPDATE policy for superadmin role on testimonials table (content and rating)
CREATE POLICY "superadmin_can_update_testimonials"
ON public.testimonials
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
