-- ═══════════════════════════════════════════════════════════════
-- Migration: Add inventory_logs and machines tables
-- These tables exist on remote but were previously untracked
-- ═══════════════════════════════════════════════════════════════

-- Enums
DO $$ BEGIN
  CREATE TYPE public.inventory_log_type AS ENUM ('in', 'out', 'adjustment', 'damage', 'return');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.machine_type AS ENUM ('washer', 'dryer', 'steamer', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.machine_status AS ENUM ('available', 'in_use', 'maintenance', 'broken');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- inventory_logs
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_id uuid NOT NULL REFERENCES public.inventory(id),
  type public.inventory_log_type NOT NULL,
  quantity numeric NOT NULL,
  previous_quantity numeric NOT NULL,
  new_quantity numeric NOT NULL,
  user_id uuid REFERENCES public.profiles(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- machines
CREATE TABLE IF NOT EXISTS public.machines (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  outlet_id uuid NOT NULL REFERENCES public.outlets(id),
  name text NOT NULL,
  type public.machine_type NOT NULL,
  status public.machine_status DEFAULT 'available',
  capacity_kg integer,
  brand text,
  last_maintenance timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

-- inventory_logs policies
CREATE POLICY "Staff can view logs" ON public.inventory_logs
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "inventory_logs_insert_v1" ON public.inventory_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    internal.is_staff_or_above()
    AND EXISTS (
      SELECT 1 FROM public.inventory
      WHERE inventory.id = inventory_logs.inventory_id
      AND inventory.outlet_id = internal.get_user_outlet()
    )
  );

-- machines policies
CREATE POLICY "machines_select" ON public.machines
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "machines_insert" ON public.machines
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "machines_update" ON public.machines
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "machines_delete" ON public.machines
  FOR DELETE TO authenticated USING (true);
