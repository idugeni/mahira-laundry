-- ═══════════════════════════════════════════════════════════════
-- Update Business Package Prices
-- ═══════════════════════════════════════════════════════════════
-- Starter: 15jt (promo 12jt)
-- Standard: 35jt
-- Premium: 75jt
-- ═══════════════════════════════════════════════════════════════

UPDATE public.business_packages
SET 
  price = 15000000,
  promo_price = 12000000
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
