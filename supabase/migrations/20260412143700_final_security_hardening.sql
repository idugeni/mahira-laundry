-- ═══════════════════════════════════════════════════════════════
-- MAXIMAL SECURITY & PERFORMANCE HARDENING
-- ═══════════════════════════════════════════════════════════════

-- 1. OPTIMASI FUNGSI PEMBANTU (Performance Boost)
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = (SELECT auth.uid());
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION get_user_outlet()
RETURNS UUID AS $$
  SELECT outlet_id FROM profiles WHERE id = (SELECT auth.uid());
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION is_staff_or_above()
RETURNS BOOLEAN AS $$
  SELECT role IN ('kasir', 'kurir', 'manager', 'superadmin')
  FROM profiles WHERE id = (SELECT auth.uid());
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;


-- 2. PROTEKSI PROFILES (Anti-Escalation & Audit)
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION protect_profile_sensitive_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT role FROM profiles WHERE id = (SELECT auth.uid())) != 'superadmin' THEN
    NEW.role := OLD.role;
    NEW.loyalty_points := OLD.loyalty_points;
    NEW.loyalty_tier := OLD.loyalty_tier;
    NEW.referral_code := OLD.referral_code;
    NEW.referred_by := OLD.referred_by;
    NEW.outlet_id := OLD.outlet_id;
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_protect_profile_sensitive ON profiles;
CREATE TRIGGER trg_protect_profile_sensitive
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION protect_profile_sensitive_columns();


-- 3. TESTIMONIALS: Triple-Layer Security
-- ─────────────────────────────────────────────────────────────

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonials_select_policy" ON testimonials;
CREATE POLICY "testimonials_select_policy" ON testimonials FOR SELECT TO authenticated
  USING (
    (is_published = true)
    OR (user_id = (SELECT auth.uid()))
    OR (get_user_role() IN ('superadmin', 'manager'))
  );

DROP POLICY IF EXISTS "testimonials_insert_policy" ON testimonials;
CREATE POLICY "testimonials_insert_policy" ON testimonials FOR INSERT TO authenticated
  WITH CHECK (
    (user_id = (SELECT auth.uid())) 
    AND (is_published = false)
  );

DROP POLICY IF EXISTS "testimonials_update_policy" ON testimonials;
CREATE POLICY "testimonials_update_policy" ON testimonials FOR UPDATE TO authenticated
  USING (
    (get_user_role() IN ('superadmin', 'manager'))
    OR (user_id = (SELECT auth.uid()) AND is_published = false)
  )
  WITH CHECK (
    (get_user_role() IN ('superadmin', 'manager'))
    OR (user_id = (SELECT auth.uid()) AND is_published = false)
  );

-- 4. REALTIME & INTEGRASI
-- ─────────────────────────────────────────────────────────────

-- Aktifkan Realtime untuk Testimonials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'testimonials'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;
  END IF;
END $$;


-- 5. STORAGE BUCKETS SECURITY
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "delivery_photos_upload_policy" ON storage.objects;
CREATE POLICY "delivery_photos_upload_policy" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'delivery-photos' 
    AND (get_user_role() = 'kurir' OR is_staff_or_above())
  );

DROP POLICY IF EXISTS "avatar_upload_policy" ON storage.objects;
CREATE POLICY "avatar_upload_policy" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (owner = (SELECT auth.uid()) OR is_staff_or_above())
  );
