// Ödeme yapılandırması — iki yöntem:
// 1) Havale/EFT (site içi checkout)
// 2) Kredi kartı → Shopier mağazasına yönlendirme

export const SHOPIER_STORE_URL =
  process.env.NEXT_PUBLIC_SHOPIER_STORE_URL ||
  "https://www.shopier.com/meltemaktifyasam";

export const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || "";
export const BANK_ACCOUNT_HOLDER =
  process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER || "";
export const BANK_IBAN = process.env.NEXT_PUBLIC_BANK_IBAN || "";
