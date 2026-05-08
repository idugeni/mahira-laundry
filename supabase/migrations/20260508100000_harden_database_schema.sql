-- Migration: Harden Database Schema
-- Description: Set critical columns to NOT NULL and ensure default values are applied.

-- 1. Profiles Table
-- Ensure no nulls exist before applying constraint
UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;
UPDATE public.profiles SET is_active = true WHERE is_active IS NULL;

ALTER TABLE public.profiles 
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN role SET NOT NULL,
  ALTER COLUMN role SET DEFAULT 'customer'::user_role,
  ALTER COLUMN is_active SET NOT NULL,
  ALTER COLUMN is_active SET DEFAULT true;

-- 2. Orders Table
-- Ensure no nulls exist before applying constraint
UPDATE public.orders SET status = 'pending' WHERE status IS NULL;
UPDATE public.orders SET total = 0 WHERE total IS NULL;
UPDATE public.orders SET subtotal = 0 WHERE subtotal IS NULL;
UPDATE public.orders SET tax_amount = 0 WHERE tax_amount IS NULL;
UPDATE public.orders SET discount = 0 WHERE discount IS NULL;
UPDATE public.orders SET delivery_fee = 0 WHERE delivery_fee IS NULL;
UPDATE public.orders SET service_fee = 0 WHERE service_fee IS NULL;

ALTER TABLE public.orders 
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'pending'::order_status,
  ALTER COLUMN total SET NOT NULL,
  ALTER COLUMN total SET DEFAULT 0,
  ALTER COLUMN subtotal SET NOT NULL,
  ALTER COLUMN subtotal SET DEFAULT 0,
  ALTER COLUMN tax_amount SET NOT NULL,
  ALTER COLUMN tax_amount SET DEFAULT 0,
  ALTER COLUMN discount SET NOT NULL,
  ALTER COLUMN discount SET DEFAULT 0,
  ALTER COLUMN delivery_fee SET NOT NULL,
  ALTER COLUMN delivery_fee SET DEFAULT 0,
  ALTER COLUMN service_fee SET NOT NULL,
  ALTER COLUMN service_fee SET DEFAULT 0;

-- 3. Payments Table
UPDATE public.payments SET status = 'unpaid' WHERE status IS NULL;

ALTER TABLE public.payments 
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'unpaid'::payment_status;

-- 4. Outlets Table
UPDATE public.outlets SET is_active = true WHERE is_active IS NULL;

ALTER TABLE public.outlets 
  ALTER COLUMN is_active SET NOT NULL,
  ALTER COLUMN is_active SET DEFAULT true;

-- 5. Services Table
UPDATE public.services SET is_active = true WHERE is_active IS NULL;

ALTER TABLE public.services 
  ALTER COLUMN is_active SET NOT NULL,
  ALTER COLUMN is_active SET DEFAULT true;
