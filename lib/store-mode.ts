/**
 * Mağaza modu yardımcıları.
 *
 * NEXT_PUBLIC_STORE_MODE env değişkeni:
 *   "shopier" → Ürünler/sepet/checkout gizli, ziyaretçiler Shopier'a yönlendirilir.
 *   "native"  → Site içi mağaza, sepet ve ödeme sistemi aktif.
 *
 * PayTR anlaşması yapıldığında "native" yapılacak — tüm mağaza geri açılır.
 */

export type StoreMode = "shopier" | "native";

export const STORE_MODE: StoreMode =
  (process.env.NEXT_PUBLIC_STORE_MODE as StoreMode) || "native";

export const isShopierMode = STORE_MODE === "shopier";
export const isNativeMode = STORE_MODE === "native";

export const SHOPIER_STORE_URL =
  process.env.NEXT_PUBLIC_SHOPIER_STORE_URL || "https://www.shopier.com/meltemaktifyasam";
