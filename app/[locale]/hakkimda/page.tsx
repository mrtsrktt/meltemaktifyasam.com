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
  MessageCircle,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Leaf,
  HeartPulse,
  Dumbbell,
  Brain,
} from "lucide-react";
import Image from "next/image";
import ConsultationForm from "@/components/shared/ConsultationForm";

const expertise = [
  {
    icon: Leaf,
    label: "Fonksiyonel Beslenme",
    desc: "Bireye özel beslenme programları ile metabolizmanızı optimize edin",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  },
  {
    icon: Dumbbell,
    label: "Sporcu Beslenmesi",
    desc: "Performansınızı en üst seviyeye taşıyın, doğru yakıt ile",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop",
  },
  {
    icon: HeartPulse,
    label: "Tiroit & Kronik Hastalık",
    desc: "Hashimoto ve kronik hastalıklar için özel beslenme protokolleri",
    img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
  },
  {
    icon: Brain,
    label: "Beden & Zihin Dönüşümü",
    desc: "Fiziksel ve zihinsel sağlığınızı bir arada güçlendirin",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  },
  {
    icon: TrendingUp,
    label: "Kilo Yönetimi",
    desc: "Kalıcı sonuçlar için bilimsel temelli kilo verme/alma programları",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
  },
  {
    icon: Shield,
    label: "Herbalife Danışmanlığı",
    desc: "Herbalife ürünleriyle desteklenen kapsamlı sağlık programları",
    img: "https://images.unsplash.com/photo-1505576399279-0d309261b291?w=400&h=300&fit=crop",
  },
];

const stats = [
  { value: "500+", label: "Mutlu Danışan" },
  { value: "5+", label: "Yıl Deneyim" },
  { value: "1000+", label: "Beslenme Programı" },
  { value: "%95", label: "Memnuniyet" },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905412523421";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-light via-white to-green-50 py-16 sm:py-24">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-green/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-orange/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-brand-green/10 text-brand-green border-0 px-3 py-1">
                <Sparkles className="mr-1.5 h-3 w-3" />
                {t("role")}
              </Badge>
              <h1 className="text-4xl font-bold text-brand-dark sm:text-5xl lg:text-6xl leading-tight">
                Meltem{" "}
                <span className="bg-gradient-to-r from-brand-green to-emerald-600 bg-clip-text text-transparent">
                  Tanik
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Sağlıklı yaşam yolculuğumda edindiğim bilgi ve deneyimleri, danışanlarımla
                paylaşarak onların hayatlarını dönüştürmelerine yardımcı oluyorum.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Fonksiyonel beslenme yaklaşımıyla her bireyin kendine özgü ihtiyaçlarına
                uygun programlar geliştiriyorum. Bilimsel temellere dayanan beslenme
                danışmanlığı ile kalıcı sonuçlar elde ediyoruz.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl font-bold text-brand-green">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-brand-green hover:bg-brand-green-dark text-white px-6">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp ile Ulaşın
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-3xl shadow-2xl shadow-brand-green/10">
                <Image
                  src="/images/profilfoto-1.png"
                  alt="Meltem Tanik"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 100vw, 384px"
                />
                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      500+ Mutlu Danışan
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 bg-brand-green/10 text-brand-green border-0">
              Uzmanlık Alanları
            </Badge>
            <h2 className="text-3xl font-bold text-brand-dark sm:text-4xl">
              Size Nasıl Yardımcı Olabilirim?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Her bireyin ihtiyacına özel, bilimsel temellere dayanan çözümler sunuyorum
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="group h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1">
                        <item.icon className="h-4 w-4 text-brand-green" />
                        <span className="text-xs font-semibold text-gray-800">{item.label}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diploma & Trust */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            {/* Diploma Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/images/diploma.jpeg"
                  alt="Diploma ve Sertifikalar"
                  width={700}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
              {/* Decorative badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4"
              >
                <div className="bg-brand-green text-white rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="text-sm font-semibold">Sertifikalı Uzman</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Trust Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl">
                  Eğitim & Sertifikalar
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Bilimsel temellere dayanan eğitimim ve sertifikalarım ile danışanlarıma
                en yüksek kalitede hizmet sunuyorum.
              </p>

              <div className="space-y-3">
                {[
                  "Boğaziçi Üniversitesi Mezunu",
                  "Herbalife Bağımsız Distribütörlüğü",
                  "Fonksiyonel Beslenme Uzmanlığı",
                  "Kişisel Gelişim & Yaşam Koçluğu",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm"
                  >
                    <CheckCircle className="h-5 w-5 text-brand-green shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-brand-green to-brand-green-dark text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-white/15 text-white border-0">
                <Sparkles className="mr-1.5 h-3 w-3" />
                Ücretsiz Danışmanlık
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Sağlıklı Yaşam Yolculuğunuz Burada Başlıyor
              </h2>
              <p className="mt-4 text-white/80 leading-relaxed">
                Kilo vermek, form kazanmak veya kronik bir rahatsızlık için beslenme
                desteği almak mı istiyorsunuz? Size özel bir program oluşturmam için
                formu doldurun, en kısa sürede dönelim.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Kişisel beslenme programı",
                  "Herbalife ürün danışmanlığı",
                  "WhatsApp ile sürekli destek",
                  "Ücretsiz ilk görüşme",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-300 shrink-0" />
                    <span className="text-sm text-white/90">{item}</span>
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
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <ConsultationForm variant="dark" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
