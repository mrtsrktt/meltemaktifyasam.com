"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import VKIForm from "@/components/vki/VKIForm";
import { Activity, Shield, Clock, HeartPulse, TrendingUp, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const benefits = [
  {
    icon: HeartPulse,
    title: "Saglik Riskinizi Ogrenin",
    desc: "VKI degeriniz, kalp hastaliklari ve diyabet gibi kronik riskleri anlamaniza yardimci olur.",
  },
  {
    icon: TrendingUp,
    title: "Kisisel Program Alin",
    desc: "Sonucunuza gore size ozel beslenme ve egzersiz programi olusturuyoruz.",
  },
  {
    icon: Shield,
    title: "Bilimsel & Guvenilir",
    desc: "Dunya Saglik Orgutu standartlarina uygun hesaplama yontemi kullanilmaktadir.",
  },
  {
    icon: Clock,
    title: "30 Saniyede Sonuc",
    desc: "Boy ve kilonuzu girin, aninda VKI degerinizi ve kategorinizi ogrenin.",
  },
];

export default function VKIPage() {
  const t = useTranslations("vki");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-light via-white to-emerald-50 py-14 sm:py-20">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-green/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge className="mb-4 bg-brand-green/10 text-brand-green border-0 px-3 py-1">
                <Activity className="mr-1.5 h-3 w-3" />
                Vucut Kitle Indeksi Hesaplama
              </Badge>

              <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl lg:text-5xl leading-tight">
                Saglikli Kilonuzu{" "}
                <span className="text-brand-green">Kesfin</span>
              </h1>

              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg">
                Vucut Kitle Indeksi (VKI), boyunuza gore ideal kilonuzda olup olmadiginizi
                gosteren bilimsel bir olcumdur. Hedefinize uygun kisisel bir program icin
                ilk adimi atin.
              </p>

              {/* Quick benefits */}
              <div className="mt-8 space-y-3">
                {["Ucretsiz ve anonim hesaplama", "Aninda sonuc ve kategori", "Uzman yorumu ile kisisel oneri"].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2.5"
                  >
                    <CheckCircle className="h-4 w-4 text-brand-green shrink-0" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-2xl shadow-brand-green/5">
                <CardContent className="p-6 sm:p-8">
                  <VKIForm />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl">
              Neden VKI Hesaplamaliyim?
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Saglikli bir yasamin ilk adimi, mevcut durumunuzu bilmektir
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="rounded-xl bg-brand-green/10 p-2.5 w-fit mb-3">
                      <item.icon className="h-5 w-5 text-brand-green" />
                    </div>
                    <h3 className="font-semibold text-brand-dark text-sm">{item.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
