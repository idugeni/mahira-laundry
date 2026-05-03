-- ═══════════════════════════════════════════════════════════════
-- Luxury Loyalty Rewards (Extremely Hard Tiers)
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
  pts INTEGER;
  current_balance INTEGER;
  min_spend DECIMAL := 200000; -- Min spend 200k to earn points
  spend_per_point DECIMAL := 100000; -- High value: 1 point per 100k
  max_pts_per_order INTEGER := 50; -- Strictly capped
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- High threshold check
    IF NEW.total >= min_spend THEN
      pts := FLOOR(NEW.total / spend_per_point);
      
      -- Apply strict cap
      IF pts > max_pts_per_order THEN
        pts := max_pts_per_order;
      END IF;
      
      IF pts > 0 THEN
        SELECT loyalty_points INTO current_balance FROM profiles WHERE id = NEW.customer_id;

        INSERT INTO loyalty (user_id, order_id, points, type, description, balance_after)
        VALUES (NEW.customer_id, NEW.id, pts, 'earn',
                'Poin eksklusif dari order ' || NEW.order_number,
                COALESCE(current_balance, 0) + pts);

        -- Update Tier with high thresholds
        UPDATE profiles SET
          loyalty_points = loyalty_points + pts,
          loyalty_tier = CASE
            WHEN loyalty_points + pts >= 10000 THEN 'platinum' -- Equivalent to 1B spend
            WHEN loyalty_points + pts >= 5000 THEN 'gold'       -- Equivalent to 500M spend
            WHEN loyalty_points + pts >= 1000 THEN 'silver'     -- Equivalent to 100M spend
            ELSE 'bronze'
          END
        WHERE id = NEW.customer_id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
