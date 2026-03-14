-- =============================================
-- Kategori Sistemi
-- =============================================

-- Kategoriler tablosu (ana kategori + alt kategori destegi)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_tr TEXT NOT NULL,
  name_en TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can do anything with categories" ON categories FOR ALL USING (is_admin());

-- Products tablosundaki category alanini category_id olarak degistir
ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id);
