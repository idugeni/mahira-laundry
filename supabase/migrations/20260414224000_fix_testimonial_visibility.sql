-- Allow public to see full_name in profiles (needed for testimonials join)
CREATE POLICY "Profiles: public can view limited info"
  ON profiles FOR SELECT
  USING (true);

-- Ensure testimonials has a proper public select policy
-- (This should already exist but we'll make sure)
DROP POLICY IF EXISTS "Public can view published testimonials" ON testimonials;
CREATE POLICY "Public can view published testimonials"
  ON testimonials FOR SELECT
  USING (is_published = true);
