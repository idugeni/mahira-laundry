-- Migration Phase 1: Register Enum Values
-- Description: Adds new statuses and units to existing database enums. 
-- Note: These are executed separately to avoid PostgreSQL transaction limitations with ALTER TYPE.

-- 1. Order Status Values
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'qc_passed';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'ready_for_delivery';

-- 2. Service Unit Values
ALTER TYPE public.service_unit ADD VALUE IF NOT EXISTS 'sqm';
ALTER TYPE public.service_unit ADD VALUE IF NOT EXISTS 'set';
