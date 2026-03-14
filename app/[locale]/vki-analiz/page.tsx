"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import VKIForm from "@/components/vki/VKIForm";
import { Shield, Clock, HeartPulse, TrendingUp, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const benefits = [
  {
    icon: HeartPulse,
    title: "Sağlık Riskinizi Öğrenin",
    desc: "VKİ değeriniz; kalp hastalıkları, diyabet ve metabolik sendrom gibi kronik riskleri erkenden görmenizi sağlar.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80",
  },
  {
    icon: TrendingUp,
    title: "Size Özel Program",
    desc: "Uzmanımız sonuçlarınıza göre sadece size ait beslenme ve egzersiz önerileri hazırlar. Genel tavsiye yok.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  },
  {
    icon: Shield,
    title: "Bilimsel & Güvenilir",
    desc: "Dünya Sağlık Örgütü standartlarını kullanan, klinik ortamlarda da uygulanan hesaplama yöntemi.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=80",
  },
  {
    icon: Clock,
    title: "60 Saniyede Sonuç",
    desc: "Boy ve kilonuzu girin, anında VKİ değerinizi, kategorinizi ve kişisel önerinizi öğrenin.",
    image: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400&q=80",
  },
];

const steps = [
  {
    num: "1",
    title: "Formu Doldurun",
    desc: "Boy, kilo ve hedef bilgilerinizi girin. 60 saniye sürer.",
  },
  {
    num: "2",
    title: "Uzman Analiz Eder",
    desc: "Fonksiyonel Beslenme Uzmanımız sonuçlarınızı inceler ve kişisel önerinizi hazırlar.",
  },
  {
    num: "3",
    title: "Programınız Hazır",
    desc: "WhatsApp üzerinden sizi arar, ücretsiz destek grubuna davet eder ve dönüşüm yolculuğunuz başlar.",
  },
];

const avatarColors = ["bg-brand-green", "bg-orange-400", "bg-blue-500", "bg-pink-500"];

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
                ⚡ Ücretsiz Uzman Analizi
              </Badge>

              <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl lg:text-5xl leading-tight">
                Sağlıklı Kilonuzu{" "}
                <span className="text-brand-green">Keşfedin</span>
              </h1>

              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg">
                Vücut Kitle İndeksinizi hesaplamanız 30 saniye sürer. Ama doğru yorumlamak
                için bir uzman gözü gerekir. Formu doldurun — Fonksiyonel Beslenme Uzmanımız
                size özel ücretsiz değerlendirme hazırlasın.
              </p>

              {/* Quick benefits */}
              <div className="mt-8 space-y-3">
                {[
                  "Anında VKİ sonucu ve kategori bilgisi",
                  "Uzmanından ücretsiz kişisel beslenme önerisi",
                  "60 günlük dönüşüm programına öncelikli başvuru hakkı",
                ].map((item, i) => (
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

              {/* Social proof */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {avatarColors.map((color, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full ${color} border-2 border-white`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">Bu ay <strong className="text-gray-700">312 kişi</strong> analiz yaptı</span>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card id="vki-form" className="border-0 shadow-2xl shadow-brand-green/5">
                <CardContent className="p-6 sm:p-8">
                  <VKIForm />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl">
              Nasıl Çalışır?
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              3 basit adımda sağlıklı yaşama ilk adımınızı atın
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {/* Arrow between steps (desktop only) */}
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 -right-4 translate-x-1/2 text-2xl text-brand-green/40">
                    →
                  </div>
                )}

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green/10 mb-4">
                  <span className="text-2xl font-bold text-brand-green">{step.num}</span>
                </div>
                <h3 className="font-semibold text-brand-dark mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl">
              Neden VKİ Hesaplamalıyım?
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Sağlıklı bir yaşamın ilk adımı, mevcut durumunuzu bilmektir
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
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Image */}
                  <div className="relative h-40">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
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

      {/* CTA Section */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl">
              Dönüşümünüze Hemen Başlayın
            </h2>
            <p className="mt-2 text-muted-foreground">
              Size en uygun yolu seçin — ikisi de tamamen ücretsiz.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {/* WhatsApp Kartı */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="h-full border-2 border-green-200 hover:border-green-400 transition-colors shadow-md">
                <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 w-fit mb-4">
                    ✨ Hızlı Yol
                  </span>

                  <h3 className="text-xl font-bold text-brand-dark mb-2">
                    WhatsApp&apos;tan Ulaşın
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                    Meltem Hanım&apos;a direkt mesaj atın, size özel programınızı ve ücretsiz
                    destek grubunu birlikte konuşalım. Mesajınız hazır, tek tıkla gönderiliyor.
                  </p>

                  <div>
                    <a
                      href="https://wa.me/905412523421?text=Merhaba%20Meltem%20Han%C4%B1m%2C%20hedeflerime%20ula%C5%9Fmak%20i%C3%A7in%20dan%C4%B1%C5%9Fmanl%C4%B1k%20hizmetiniz%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.%20Te%C5%9Fekk%C3%BCr%20ederim.%20%F0%9F%8C%BF"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 transition-colors"
                    >
                      Şimdi Mesaj At →
                    </a>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      Yanıt süresi genellikle 1-2 saat içinde
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Form Kartı */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -6 }}
            >
              <Card className="h-full border-2 border-orange-200 hover:border-orange-400 transition-colors shadow-md">
                <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                  <h3 className="text-xl font-bold text-brand-dark mb-2 mt-4">
                    Başvuru Formu Doldurun
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                    Kısa bir form doldurun, sizi tanıyalım. Ekibimiz en kısa sürede iletişime
                    geçerek hedeflerinize en uygun kişisel planı birlikte hazırlayalım.
                  </p>

                  <div>
                    <button
                      onClick={() => {
                        document.getElementById("vki-form")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center justify-center w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 transition-colors"
                    >
                      Formu Doldur →
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      İş günlerinde 24 saat içinde dönüş yapılır
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Güven notu */}
          <p className="text-center text-sm text-gray-400 mt-8">
            🔒 Bilgileriniz güvendedir · Spam gönderilmez · İstediğiniz zaman çıkabilirsiniz
          </p>
        </div>
      </section>
    </>
  );
}
