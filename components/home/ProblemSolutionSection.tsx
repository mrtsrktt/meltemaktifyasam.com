"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  AlertCircle,
  TrendingDown,
  Battery,
  HeartPulse,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProblemSolutionSection() {
  const t = useTranslations("problemSolution");

  const problems = [
    { key: "problem1", icon: TrendingDown },
    { key: "problem2", icon: AlertCircle },
    { key: "problem3", icon: Battery },
    { key: "problem4", icon: HeartPulse },
    { key: "problem5", icon: Users },
  ] as const;

  const scrollToForm = () => {
    const el = document.getElementById("basvuru");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-green-50/40 to-white py-16 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-green/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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

        {/* Problem cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand-green/30 hover:shadow-lg hover:shadow-brand-green/5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors group-hover:bg-brand-green/10 group-hover:text-brand-green">
                <p.icon className="h-5 w-5" />
              </div>
              <p className="pt-1 text-[15px] leading-relaxed text-slate-700">
                <span className="mr-1 text-slate-400">"</span>
                {t(p.key)}
                <span className="ml-1 text-slate-400">"</span>
              </p>
            </motion.div>
          ))}
        </div>

        {/* Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 text-center"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-brand-green/20 bg-gradient-to-br from-brand-green/5 to-emerald-50 p-8 sm:p-10">
            <p className="text-xl font-semibold leading-relaxed text-brand-dark sm:text-2xl">
              {t("solution")}
            </p>
            <motion.button
              type="button"
              onClick={scrollToForm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand-green px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-green/25 transition-colors hover:bg-brand-green-dark"
            >
              {t("cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
