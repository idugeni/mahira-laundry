-- 11. TESTIMONIALS (Ulasan Pelanggan)
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view published testimonials"
  ON testimonials FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can create their own testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own testimonials"
  ON testimonials FOR ALL
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_testimonials_user ON testimonials(user_id);
CREATE INDEX idx_testimonials_published ON testimonials(is_published) WHERE is_published = true;
