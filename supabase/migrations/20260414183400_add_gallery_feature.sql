-- 1. Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Lainnya',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 3. Database Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read active gallery') THEN
        CREATE POLICY "Public can read active gallery" ON public.gallery
          FOR SELECT USING (is_active = true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage gallery') THEN
        CREATE POLICY "Admins can manage gallery" ON public.gallery
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE profiles.id = auth.uid()
              AND profiles.role = 'superadmin'
            )
          );
    END IF;
END $$;

-- 4. Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage Access Control (RLS on storage.objects)
DO $$
BEGIN
    -- Public Access
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Gallery View' AND tablename = 'objects') THEN
        CREATE POLICY "Public Gallery View" ON storage.objects FOR SELECT USING ( bucket_id = 'gallery' );
    END IF;

    -- Admin Upload
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Gallery Upload' AND tablename = 'objects') THEN
        CREATE POLICY "Admin Gallery Upload" ON storage.objects FOR INSERT WITH CHECK (
          bucket_id = 'gallery' AND
          (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
        );
    END IF;

    -- Admin Delete
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Gallery Delete' AND tablename = 'objects') THEN
        CREATE POLICY "Admin Gallery Delete" ON storage.objects FOR DELETE USING (
          bucket_id = 'gallery' AND
          (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
        );
    END IF;
END $$;
