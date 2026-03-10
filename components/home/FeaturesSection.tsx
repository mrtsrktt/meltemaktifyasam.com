"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Salad, Package, Brain } from "lucide-react";

const features = [
  {
    key: "nutrition",
    icon: Salad,
    color: "text-brand-green",
    bg: "bg-brand-green/10",
  },
  {
    key: "products",
    icon: Package,
    color: "text-brand-orange",
    bg: "bg-brand-orange/10",
  },
  {
    key: "mentoring",
    icon: Brain,
    color: "text-brand-green",
    bg: "bg-brand-green/10",
  },
];

export default function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-brand-dark sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="group h-full border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-8">
                  <div
                    className={`inline-flex rounded-2xl p-3 ${feature.bg} transition-transform group-hover:scale-110`}
                  >
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-brand-dark">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
