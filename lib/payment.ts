// Ödeme yapılandırması — iki yöntem:
// 1) Havale/EFT (site içi checkout)
// 2) Kredi kartı → Shopier mağazasına yönlendirme

export const SHOPIER_STORE_URL =
  process.env.NEXT_PUBLIC_SHOPIER_STORE_URL ||
  "https://www.shopier.com/meltemaktifyasam";

// Banka bilgileri herkese açık (müşteri ödeme için görür) — kodda varsayılan
// tutuluyor ki sunucu env ayarına bağlı kalmadan her zaman görünsün.
export const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || "Ziraat Bankası";
export const BANK_ACCOUNT_HOLDER =
  process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER || "Meltem Tanık";
export const BANK_IBAN =
  process.env.NEXT_PUBLIC_BANK_IBAN || "TR57 0001 0016 0091 7838 3550 01";
