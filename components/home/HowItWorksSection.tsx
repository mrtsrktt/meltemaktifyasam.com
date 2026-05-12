"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ClipboardCheck, Utensils, TrendingUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HowItWorksSection() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      n: "01",
      icon: ClipboardCheck,
      titleKey: "step1Title",
      descKey: "step1Desc",
    },
    {
      n: "02",
      icon: Utensils,
      titleKey: "step2Title",
      descKey: "step2Desc",
    },
    {
      n: "03",
      icon: TrendingUp,
      titleKey: "step3Title",
      descKey: "step3Desc",
    },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge className="mb-4 bg-brand-green/10 text-brand-green border-0 hover:bg-brand-green/15">
            <Sparkles className="mr-1.5 h-3 w-3" />
            {t("badge")}
          </Badge>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-brand-dark sm:text-4xl lg:text-5xl">
            {t("title")}{" "}
            <span className="text-brand-green">{t("titleHighlight")}</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Dashed connector — desktop only */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-12 hidden h-px lg:block"
            style={{
              backgroundImage:
                "linear-gradient(to right, #16a34a 50%, transparent 50%)",
              backgroundSize: "12px 1px",
              backgroundRepeat: "repeat-x",
              opacity: 0.4,
            }}
          />

          <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number badge */}
                <span className="absolute -top-2 right-1/2 z-10 translate-x-[60px] translate-y-0 rounded-full bg-brand-orange px-2.5 py-0.5 text-xs font-bold text-white shadow-md ring-2 ring-white">
                  {step.n}
                </span>

                {/* Icon circle */}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-emerald-600 shadow-xl shadow-brand-green/25 ring-4 ring-white">
                  <step.icon className="h-10 w-10 text-white" strokeWidth={1.75} />
                </div>

                {/* Text */}
                <h3 className="mt-6 text-xl font-bold text-brand-dark">
                  {t(step.titleKey)}
                </h3>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
                  {t(step.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
