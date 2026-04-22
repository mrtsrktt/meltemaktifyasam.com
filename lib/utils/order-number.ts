/**
 * Sipariş numarası türetme
 * Migration 007 uygulandıysa DB'den order_number kullanılır.
 * Değilse UUID ve created_at'ten deterministik fallback hesaplanır
 * (API route.ts ile aynı algoritma — müşteri gördüğü ile admin paneli aynı no).
 */
export function formatOrderNumber(order: {
  id: string;
  order_number?: number | null;
  created_at: string;
}): string {
  if (order.order_number) return String(order.order_number);

  const d = new Date(order.created_at);
  const datePrefix = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(d.getDate()).padStart(2, "0")}`;
  const hexTail = order.id.replace(/-/g, "").slice(-4);
  const numericTail = String(parseInt(hexTail, 16) % 100).padStart(2, "0");
  return `${datePrefix}${numericTail}`;
}
