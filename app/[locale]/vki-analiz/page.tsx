"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import VKIForm from "@/components/vki/VKIForm";
import { Activity } from "lucide-react";

export default function VKIPage() {
  const t = useTranslations("vki");

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-2 text-sm font-medium text-brand-green mb-6">
              <Activity className="h-4 w-4" />
              {t("title")}
            </div>
            <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {t("subtitle")}
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm">
                  <strong>{"< 18.5"}</strong> — {t("categories.underweight")}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
                <div className="h-3 w-3 rounded-full bg-brand-green" />
                <span className="text-sm">
                  <strong>18.5 – 24.9</strong> — {t("categories.normal")}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-orange-50 p-4">
                <div className="h-3 w-3 rounded-full bg-brand-orange" />
                <span className="text-sm">
                  <strong>25 – 29.9</strong> — {t("categories.overweight")}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm">
                  <strong>{"≥ 30"}</strong> — {t("categories.obese")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <VKIForm />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
