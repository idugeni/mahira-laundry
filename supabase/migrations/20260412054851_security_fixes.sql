-- 1. Fix Function Search Path Mutable
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.generate_order_number() SET search_path = public;
ALTER FUNCTION public.calculate_order_total() SET search_path = public;
ALTER FUNCTION public.generate_referral_code() SET search_path = public;
ALTER FUNCTION public.award_loyalty_points() SET search_path = public;
ALTER FUNCTION public.notify_order_status_change() SET search_path = public;
ALTER FUNCTION public.log_audit() SET search_path = public;
ALTER FUNCTION public.increment_voucher_usage() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.get_user_role() SET search_path = public;
ALTER FUNCTION public.get_user_outlet() SET search_path = public;
ALTER FUNCTION public.is_staff_or_above() SET search_path = public;
ALTER FUNCTION public.is_manager_or_above() SET search_path = public;

-- 2. Move pg_trgm extension to extensions schema
CREATE SCHEMA IF NOT EXISTS "extensions";
ALTER EXTENSION pg_trgm SET SCHEMA "extensions";

-- 3. Remove permissive RLS policy from notifications
DROP POLICY IF EXISTS "Notifications: system can insert" ON public.notifications;
