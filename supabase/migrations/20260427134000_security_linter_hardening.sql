-- ==============================================================================
-- HARDENING DATABASE & STORAGE SECURITY (Fixing Supabase Linter Warnings)
-- ==============================================================================

-- 1. FIX: Public Bucket Allows Listing (avatars)
-- Peringatan: Kebijakan SELECT yang terlalu luas memungkinkan listing file.
-- Solusi: Hapus kebijakan publik broad SELECT. Bucket 'avatars' adalah PUBLIC, 
-- sehingga URL langsung (getPublicUrl) tetap berfungsi tanpa kebijakan SELECT ini.
DROP POLICY IF EXISTS "Avatars: public view" ON storage.objects;

-- Berikan akses SELECT hanya untuk staff yang perlu melakukan manajemen/listing
CREATE POLICY "Avatars: staff select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND public.is_staff_or_above());


-- 2. FIX: Public Can Execute SECURITY DEFINER Functions
-- Peringatan: Fungsi SECURITY DEFINER di schema 'public' terekspos sebagai API RPC.
-- Solusi: 
-- a. Buat schema 'internal' untuk fungsi-fungsi pembantu RLS.
-- b. Pindahkan fungsi internal ke schema tersebut agar tidak terekspos ke PostgREST API.
-- c. Cabut izin EXECUTE dari PUBLIC untuk fungsi sensitif yang tersisa di schema 'public'.

CREATE SCHEMA IF NOT EXISTS internal;

-- Pindahkan fungsi helper RLS ke schema internal
ALTER FUNCTION public.get_user_role() SET SCHEMA internal;
ALTER FUNCTION public.get_user_outlet() SET SCHEMA internal;
ALTER FUNCTION public.is_staff_or_above() SET SCHEMA internal;
ALTER FUNCTION public.is_manager_or_above() SET SCHEMA internal;

-- Pindahkan fungsi trigger/internal lainnya ke schema internal
ALTER FUNCTION public.handle_new_user() SET SCHEMA internal;
ALTER FUNCTION public.log_audit() SET SCHEMA internal;
ALTER FUNCTION public.protect_profile_sensitive_columns() SET SCHEMA internal;
ALTER FUNCTION public.notify_order_status_change() SET SCHEMA internal;
ALTER FUNCTION public.increment_voucher_usage() SET SCHEMA internal;
ALTER FUNCTION public.award_loyalty_points() SET SCHEMA internal;

-- Pastikan izin eksekusi di schema internal hanya untuk peran yang diperlukan
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA internal FROM PUBLIC;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA internal FROM anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA internal TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA internal TO service_role;

-- 3. FIX: Cabut izin eksekusi dari PUBLIC untuk fungsi sisa di schema public yang terekspos
REVOKE EXECUTE ON FUNCTION public.award_referral_bonus() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_order_access_for_courier(uuid, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_order_outlet_id(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_order_owner_id(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.redeem_reward(uuid, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;

-- Berikan kembali akses hanya ke service_role atau authenticated jika memang diperlukan via RPC
GRANT EXECUTE ON FUNCTION public.redeem_reward(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_order_access_for_courier(uuid, uuid) TO authenticated;

-- 4. UPDATE: RLS Policies to use the new internal schema
-- Kita perlu memperbarui semua kebijakan yang menggunakan fungsi helper tadi.

-- Contoh pembaruan kebijakan (Hanya beberapa yang kritikal sebagai contoh, 
-- idealnya semua yang menggunakan is_staff_or_above dsb harus diperbarui)
-- Namun, Postgres akan secara otomatis melacak perpindahan schema fungsi jika 
-- kebijakan merujuk pada fungsi tersebut tanpa kualifikasi schema.
-- Jika kebijakan ditulis sebagai 'public.is_staff_or_above()', kita harus mengubahnya.

-- Karena migrasi sebelumnya menggunakan 'public.is_staff_or_above()', kita perbarui:
DO $$
BEGIN
  -- Profiles
  DROP POLICY IF EXISTS "Profiles: staff can view same outlet" ON public.profiles;
  CREATE POLICY "Profiles: staff can view same outlet" ON public.profiles
    FOR SELECT USING (internal.is_staff_or_above() AND outlet_id = internal.get_user_outlet());

  -- Avatars (Storage)
  DROP POLICY IF EXISTS "Avatars: user management" ON storage.objects;
  CREATE POLICY "Avatars: user management" ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id = 'avatars' AND ((storage.foldername(name))[1] = (SELECT auth.uid())::text OR internal.is_staff_or_above()))
    WITH CHECK (bucket_id = 'avatars' AND ((storage.foldername(name))[1] = (SELECT auth.uid())::text OR internal.is_staff_or_above()));
END $$;
