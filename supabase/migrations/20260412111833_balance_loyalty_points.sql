-- ═══════════════════════════════════════════════════════════════
-- Balancing Loyalty Points for Business Sustainability
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
  pts INTEGER;
  current_balance INTEGER;
  min_spend DECIMAL := 30000; -- Min spend to earn points
  spend_per_point DECIMAL := 25000; -- 1 point for every 25k
  max_pts_per_order INTEGER := 100; -- Cap per transaction
BEGIN
  -- Only award points for completed orders that weren't already completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Calculation Logic
    IF NEW.total >= min_spend THEN
      pts := FLOOR(NEW.total / spend_per_point);
      
      -- Apply Cap
      IF pts > max_pts_per_order THEN
        pts := max_pts_per_order;
      END IF;
      
      -- If after calculation and cap pts is still > 0
      IF pts > 0 THEN
        SELECT loyalty_points INTO current_balance FROM profiles WHERE id = NEW.customer_id;

        -- Record in loyalty history
        INSERT INTO loyalty (user_id, order_id, points, type, description, balance_after)
        VALUES (NEW.customer_id, NEW.id, pts, 'earn',
                'Poin dari order ' || NEW.order_number,
                COALESCE(current_balance, 0) + pts);

        -- Update Profile Points & Tier
        UPDATE profiles SET
          loyalty_points = loyalty_points + pts,
          loyalty_tier = CASE
            WHEN loyalty_points + pts >= 5000 THEN 'platinum'
            WHEN loyalty_points + pts >= 2000 THEN 'gold'
            WHEN loyalty_points + pts >= 500 THEN 'silver'
            ELSE 'bronze'
          END
        WHERE id = NEW.customer_id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
