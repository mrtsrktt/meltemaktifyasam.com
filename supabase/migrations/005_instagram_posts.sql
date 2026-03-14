CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  post_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  is_reel BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
