"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Salad, Package, Brain, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

const features = [
  {
    key: "nutrition",
    icon: Salad,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80",
    gradient: "from-emerald-600/80 to-green-900/70",
    accentColor: "bg-emerald-500",
    iconBg: "bg-emerald-500/90",
    href: "/hakkimda" as const,
  },
  {
    key: "products",
    icon: Package,
    image:
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&h=600&fit=crop&q=80",
    gradient: "from-orange-600/80 to-amber-900/70",
    accentColor: "bg-orange-500",
    iconBg: "bg-orange-500/90",
    href: "/magaza" as const,
  },
  {
    key: "mentoring",
    icon: Brain,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&q=80",
    gradient: "from-teal-600/80 to-cyan-900/70",
    accentColor: "bg-teal-500",
    iconBg: "bg-teal-500/90",
    href: "/hakkimda" as const,
  },
];


export default function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-sm font-semibold mb-4"
          >
            Profesyonel Destek
          </motion.span>
          <h2 className="text-3xl font-bold text-brand-dark sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <Link href={feature.href}>
                <div className="group relative h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer">
                  {/* Image */}
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={t(`${feature.key}.title`)}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${feature.gradient}`}
                    />

                    {/* Icon badge */}
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className={`absolute top-4 right-4 ${feature.iconBg} backdrop-blur-sm rounded-xl p-3 shadow-lg`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>

                    {/* Title on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                        {t(`${feature.key}.title`)}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative bg-white p-5 sm:p-6">
                    {/* Accent line */}
                    <div
                      className={`absolute top-0 left-6 right-6 h-0.5 ${feature.accentColor} rounded-full`}
                    />
                    <p className="text-muted-foreground leading-relaxed mt-1">
                      {t(`${feature.key}.description`)}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-semibold text-brand-dark group-hover:text-brand-green transition-colors">
                      Detayli Bilgi
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Hover shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
