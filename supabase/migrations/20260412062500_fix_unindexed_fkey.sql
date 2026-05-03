-- Fix missing index for foreign key profiles_referred_by_fkey
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);
