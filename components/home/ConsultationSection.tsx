"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle } from "lucide-react";
import ConsultationForm from "@/components/shared/ConsultationForm";

export default function ConsultationSection() {
  const t = useTranslations("consultationSection");

  const features = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
  ];

  return (
    <section id="basvuru" className="py-14 sm:py-20 bg-gradient-to-br from-brand-green to-emerald-700 text-white relative overflow-hidden scroll-mt-16">
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-white/15 text-white border-0">
              <Sparkles className="mr-1.5 h-3 w-3" />
              {t("badge")}
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl leading-tight">
              {t("title")}
              <br />
              <span className="text-emerald-200">{t("titleHighlight")}</span>
            </h2>
            <p className="mt-4 text-white/75 leading-relaxed max-w-lg">
              {t("description")}
            </p>

            <div className="mt-6 space-y-2.5">
              {features.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2.5"
                >
                  <CheckCircle className="h-4 w-4 text-emerald-300 shrink-0" />
                  <span className="text-sm text-white/85">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15 shadow-2xl">
              <ConsultationForm
                variant="dark"
                title={t("formTitle")}
                subtitle={t("formSubtitle")}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
