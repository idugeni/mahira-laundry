-- ═══════════════════════════════════════════════════════════════
-- Update Business Package Prices
-- ═══════════════════════════════════════════════════════════════
-- Starter: 18jt (promo 15jt)
-- Standard: 35jt
-- Premium: 75jt
-- ═══════════════════════════════════════════════════════════════

UPDATE public.business_packages
SET 
  price = 18000000,
  promo_price = 15000000
WHERE tier = 'Starter';

UPDATE public.business_packages
SET 
  price = 35000000,
  promo_price = NULL
WHERE tier = 'Standard';

UPDATE public.business_packages
SET 
  price = 75000000,
  promo_price = NULL
WHERE tier = 'Premium';
