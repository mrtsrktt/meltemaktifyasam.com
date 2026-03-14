-- health_note kolonu ekle
ALTER TABLE vki_leads ADD COLUMN IF NOT EXISTS health_note TEXT;

-- goal CHECK constraint güncelle (yeni hedef seçenekleri ekle)
ALTER TABLE vki_leads DROP CONSTRAINT IF EXISTS vki_leads_goal_check;
ALTER TABLE vki_leads ADD CONSTRAINT vki_leads_goal_check
  CHECK (goal IN ('kilo_ver', 'kilo_al', 'form_koru', 'saglikli_beslenme', 'kronik_destek'));
