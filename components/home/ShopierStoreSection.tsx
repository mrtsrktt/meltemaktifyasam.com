"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { SHOPIER_STORE_URL } from "@/lib/store-mode";

export default function ShopierStoreSection() {
  const t = useTranslations("shopierStore");

  const badges = [
    { icon: ShieldCheck, key: "securePay" },
    { icon: Truck, key: "fastShipping" },
    { icon: CreditCard, key: "installment" },
  ] as const;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Dark gradient background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-[#0f1923] via-[#0d2818] to-[#072b1a]"
      />

      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl"
      />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-brand-green shadow-lg shadow-emerald-500/30 ring-1 ring-white/10">
            <ShoppingBag className="h-7 w-7 text-white" />
          </div>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {t("description")}
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          {badges.map((b, i) => (
            <motion.div
              key={b.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <b.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-white sm:text-[15px]">
                {t(b.key)}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <motion.a
            href={SHOPIER_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-green to-emerald-500 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-emerald-500/30 ring-1 ring-white/15 transition-shadow hover:shadow-emerald-500/50 sm:px-10 sm:py-5 sm:text-lg"
          >
            <ShoppingBag className="h-5 w-5" />
            {t("cta")}
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-white/50">
            {t("trustNote")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
