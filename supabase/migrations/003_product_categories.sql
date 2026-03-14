-- =============================================
-- Urun - Kategori coktan coka iliski tablosu
-- =============================================

CREATE TABLE IF NOT EXISTS product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Mevcut urunlerin category_id degerlerini tasi
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id FROM products WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- RLS
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view product categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Admins can do anything with product categories" ON product_categories FOR ALL USING (is_admin());
