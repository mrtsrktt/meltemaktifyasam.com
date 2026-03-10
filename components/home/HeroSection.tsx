"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-light via-white to-green-50 py-20 lg:py-32">
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-green/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand-orange/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-2 text-sm font-medium text-brand-green">
              <Sparkles className="h-4 w-4" />
              Fonksiyonel Beslenme Uzmanı
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
              {t("title1")}
              <br />
              <span className="text-brand-green">{t("title2")}</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              {t("subtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/vki-analiz">
                <Button
                  size="lg"
                  className="bg-brand-green hover:bg-brand-green-dark text-white text-base px-8"
                >
                  {t("cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/magaza">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-brand-green text-brand-green hover:bg-brand-green/10 text-base px-8"
                >
                  {t("ctaShop")}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-8">
              <div>
                <p className="text-2xl font-bold text-brand-dark">2.400+</p>
                <p className="text-sm text-muted-foreground">Takipçi</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-dark">500+</p>
                <p className="text-sm text-muted-foreground">Mutlu Danışan</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-dark">5+</p>
                <p className="text-sm text-muted-foreground">Yıl Deneyim</p>
              </div>
            </div>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green/20 to-brand-orange/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-brand-green/20">
                    <Sparkles className="h-12 w-12 text-brand-green" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Meltem Tanık
                  </p>
                </div>
              </div>
              {/* Decorative floating cards */}
              <motion.div
                className="absolute -right-4 top-20 rounded-2xl bg-white p-4 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="text-xs font-medium text-brand-green">Doğrulanmış</p>
                <p className="text-lg font-bold text-brand-dark">Uzman</p>
              </motion.div>
              <motion.div
                className="absolute -left-4 bottom-20 rounded-2xl bg-white p-4 shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <p className="text-xs font-medium text-brand-orange">Instagram</p>
                <p className="text-lg font-bold text-brand-dark">@meltem.tanik</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
