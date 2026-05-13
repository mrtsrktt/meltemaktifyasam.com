-- Lead kaynağı (kampanya / sayfa / reklam) takibi.
-- Müşteriye gösterilmez; admin panelde başvuruları kaynağına göre
-- ayırt etmek için kullanılır (örn: "60gun_kampanya").

ALTER TABLE vki_leads
  ADD COLUMN IF NOT EXISTS source TEXT;

COMMENT ON COLUMN vki_leads.source IS
  'Başvurunun geldiği kaynak/kampanya etiketi. Örn: 60gun_kampanya, anasayfa, instagram_ads. NULL = belirtilmemiş (varsayılan).';

-- Aynı kampanyadan gelenleri filtreleyebilmek için kısa bir index
CREATE INDEX IF NOT EXISTS vki_leads_source_idx ON vki_leads(source) WHERE source IS NOT NULL;
