-- ═══════════════════════════════════════════════════════════════
-- Affiliate & Referral Automation
-- ═══════════════════════════════════════════════════════════════

-- 1. Perbarui Fungsi handle_new_user untuk mendeteksi Referral
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
  referrer_id UUID;
BEGIN
  -- Ambil kode referal dari meta data (jika ada)
  ref_code := NEW.raw_user_meta_data->>'referred_by_code';
  
  -- Jika ada kode, cari ID pemilik kodenya
  IF ref_code IS NOT NULL AND ref_code <> '' THEN
    SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = ref_code;
  END IF;

  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    phone, 
    role,
    referred_by
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NEW.phone,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'),
    referrer_id -- Akan berisi UUID referrer atau NULL jika kode tidak valid
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
