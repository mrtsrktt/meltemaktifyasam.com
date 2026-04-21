-- Kısa / anlamlı sipariş numarası (YYYYMMDDNN formatı, örn: 2026042101)
-- Müşteriye gösterilir, UUID id'yi değiştirmez.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number BIGINT UNIQUE;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  date_prefix BIGINT;
  next_seq BIGINT;
BEGIN
  -- Günlük üretimi serileştir
  PERFORM pg_advisory_xact_lock(hashtext('order_number_gen'));

  date_prefix := (to_char(COALESCE(NEW.created_at, NOW()), 'YYYYMMDD'))::BIGINT;

  SELECT COALESCE(MAX(order_number) - date_prefix * 100, 0) + 1
  INTO next_seq
  FROM orders
  WHERE order_number BETWEEN date_prefix * 100 AND date_prefix * 100 + 99;

  NEW.order_number := date_prefix * 100 + next_seq;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION generate_order_number();
