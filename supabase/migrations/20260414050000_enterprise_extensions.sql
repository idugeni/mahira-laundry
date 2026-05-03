-- Enterprise & Financial Extensions Migration
-- ─────────────────────────────────────────────

-- 1. Modify Profiles for Balance
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS balance DECIMAL(12,2) DEFAULT 0;

-- 2. Expenses Table (Operational Costs)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'ops', 'electricity', 'water', 'rent', 'marketing', 'other'
  amount DECIMAL(12,2) NOT NULL,
  notes TEXT,
  proof_url TEXT,
  actor_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Deposit Transactions (Laundry Saldo)
CREATE TABLE IF NOT EXISTS deposit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL, -- 'topup', 'payment', 'refund'
  reference_id UUID, -- order_id if type is payment/refund
  notes TEXT,
  actor_id UUID REFERENCES profiles(id), -- staff who processed it
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Franchise Payouts (Royalty Tracking)
CREATE TABLE IF NOT EXISTS franchise_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  period_month INTEGER NOT NULL,
  period_year INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'verified'
  proof_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(outlet_id, period_month, period_year)
);

-- 5. Order Status Logs (Timeline Tracking)
CREATE TABLE IF NOT EXISTS order_status_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS POLICIES
-- ─────────────────────────────────────────────

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_logs ENABLE ROW LEVEL SECURITY;

-- Order Status Logs (Anyone involved in the order can see)
CREATE POLICY "Users can view logs for their orders" ON order_status_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_status_logs.order_id 
      AND (orders.customer_id = auth.uid() OR orders.outlet_id IN (SELECT outlet_id FROM profiles WHERE id = auth.uid()))
    )
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
  );

-- Expenses (Managers and Superadmins)
CREATE POLICY "Managers can manage their outlet expenses" ON expenses
  FOR ALL USING (
    outlet_id IN (SELECT outlet_id FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'superadmin'))
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
  );

-- Deposit Transactions
CREATE POLICY "Users can see their own deposits" ON deposit_transactions
  FOR SELECT USING (profile_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('manager', 'superadmin'));

-- Franchise Payouts
CREATE POLICY "Managers can see their payouts" ON franchise_payouts
  FOR SELECT USING (
    outlet_id IN (SELECT outlet_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
  );
