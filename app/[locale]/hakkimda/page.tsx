"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  GraduationCap,
  Award,
  Users,
  MessageCircle,
  Heart,
  Dumbbell,
  Brain,
  Salad,
  Activity,
} from "lucide-react";
import Image from "next/image";

const expertise = [
  { icon: Salad, label: "Fonksiyonel Beslenme" },
  { icon: Dumbbell, label: "Sporcu Beslenmesi" },
  { icon: Activity, label: "Tiroit & Kronik Hastalık Beslenmesi" },
  { icon: Brain, label: "Beden & Zihin Dönüşümü" },
  { icon: Heart, label: "Girişimci Yaşam Koçluğu" },
];

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905412523421";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-light via-white to-green-50 py-20">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-green/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-brand-green/10 text-brand-green">
                <Sparkles className="mr-1 h-3 w-3" />
                {t("role")}
              </Badge>
              <h1 className="text-4xl font-bold text-brand-dark sm:text-5xl">
                Meltem <span className="text-brand-green">Tanık</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Sağlıklı yaşam yolculuğumda edindiğim bilgi ve deneyimleri, danışanlarımla
                paylaşarak onların hayatlarını dönüştürmelerine yardımcı oluyorum. Fonksiyonel
                beslenme yaklaşımıyla her bireyin kendine özgü ihtiyaçlarına uygun programlar
                geliştiriyorum.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Boğaziçi Üniversitesi mezunu olarak, bilimsel temellere dayanan beslenme
                danışmanlığı sunuyor, Herbalife ürünleriyle desteklenen kapsamlı sağlık
                programları oluşturuyorum.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green/20 to-brand-orange/10">
                <Image
                  src="/images/profilfoto-1.png"
                  alt="Meltem Tanık - Fonksiyonel Beslenme Uzmanı"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-brand-dark">{t("expertise")}</h2>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-xl bg-brand-green/10 p-3">
                      <item.icon className="h-6 w-6 text-brand-green" />
                    </div>
                    <span className="font-medium text-brand-dark">{item.label}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certifications */}
      <section className="py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="h-6 w-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-dark">Eğitim</h2>
              </div>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <p className="font-semibold text-brand-dark">Boğaziçi Üniversitesi</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bölüm bilgisi teyit edilecektir.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-brand-orange" />
                <h2 className="text-2xl font-bold text-brand-dark">{t("certifications")}</h2>
              </div>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 space-y-3">
                  <p className="text-muted-foreground">
                    Sertifika bilgileri Meltem Hanım&apos;dan alındıktan sonra eklenecektir.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="h-6 w-6 text-brand-green" />
              <h2 className="text-3xl font-bold text-brand-dark">{t("team")}</h2>
            </div>
          </motion.div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-2xl mx-auto">
            {[
              { title: "Fonksiyonel Beslenme Uzmanı", desc: "Kişiselleştirilmiş beslenme programları" },
              { title: "Spor Antrenörü", desc: "Egzersiz planlaması ve performans koçluğu" },
            ].map((member, i) => (
              <motion.div
                key={member.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-md text-center">
                  <CardContent className="p-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                      <Users className="h-8 w-8 text-brand-green" />
                    </div>
                    <h3 className="font-semibold text-brand-dark">{member.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{member.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-green to-brand-green-dark text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">{t("ctaTitle")}</h2>
            <p className="mt-4 text-lg text-white/80">{t("ctaDescription")}</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block"
            >
              <Button
                size="lg"
                className="bg-white text-brand-green hover:bg-white/90 text-base px-8"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {t("ctaButton")}
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
