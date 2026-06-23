"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Landmark, CreditCard, ChevronRight, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCartStore } from "@/lib/store/cart";
import { SHOPIER_STORE_URL } from "@/lib/payment";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905412523421";

export default function PaymentMethodModal() {
  const t = useTranslations("paymentChoice");
  const pendingAdd = useCartStore((s) => s.pendingAdd);
  const confirmHavale = useCartStore((s) => s.confirmHavale);
  const closeModal = useCartStore((s) => s.closeModal);

  const productName = pendingAdd?.item.name_tr;

  const handleHavale = () => {
    confirmHavale();
    if (productName) toast.success(`${productName} ${t("addedToCart")}`);
  };

  const handleCard = () => {
    closeModal();
    window.location.href = SHOPIER_STORE_URL;
  };

  const whatsappMessage = productName
    ? t("whatsappMessage", { product: productName })
    : t("whatsappMessageGeneric");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <Dialog
      open={pendingAdd !== null}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {/* Üst başlık şeridi */}
        <div className="bg-gradient-to-br from-brand-green/10 via-emerald-50 to-white px-6 pt-7 pb-5 text-center">
          <DialogHeader className="items-center">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-brand-dark">
              {t("title")}
            </DialogTitle>
            <DialogDescription className="mx-auto max-w-sm text-[13px] sm:text-sm">
              {t("desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-brand-green ring-1 ring-brand-green/15">
            <ShieldCheck className="h-3.5 w-3.5" />
            256-bit SSL · güvenli alışveriş
          </div>
        </div>

        <div className="px-5 pb-6 sm:px-6">
          <div className="space-y-3">
            {/* Havale / EFT — yeşil */}
            <button
              type="button"
              onClick={handleHavale}
              className="group flex w-full items-center gap-4 rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-4 text-left shadow-sm transition-all hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30">
                <Landmark className="h-6 w-6" />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-brand-dark">
                  {t("bankTransfer")}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {t("bankTransferDesc")}
                </span>
              </span>
              <ChevronRight className="h-5 w-5 text-emerald-500/70 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Kredi Kartı → Shopier — mavi */}
            <button
              type="button"
              onClick={handleCard}
              className="group flex w-full items-center gap-4 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white p-4 text-left shadow-sm transition-all hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                <CreditCard className="h-6 w-6" />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-brand-dark">
                  {t("card")}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {t("cardDesc")}
                </span>
              </span>
              <ChevronRight className="h-5 w-5 text-blue-500/70 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Ayraç: veya */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("or")}
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* WhatsApp — büyük, animasyonlu, ürüne özel hazır mesaj */}
          <div className="relative">
            {/* Pulse halkası */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[#25D366]/40 animate-ping opacity-60" />
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => closeModal()}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#1ebe5d] to-[#075E54] px-5 py-4 text-white font-bold text-base shadow-xl shadow-[#25D366]/30 ring-1 ring-white/20 transition-shadow hover:shadow-2xl"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-white"
                  aria-hidden
                >
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.355zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </span>
              {t("whatsappOrder")}
            </motion.a>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground leading-relaxed">
            {t("whatsappHint")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
