-- Fix trigger functions so they run with elevated privileges and don't fail due to RLS

ALTER FUNCTION public.award_loyalty_points() SECURITY DEFINER;
ALTER FUNCTION public.notify_order_status_change() SECURITY DEFINER;
ALTER FUNCTION public.increment_voucher_usage() SECURITY DEFINER;
