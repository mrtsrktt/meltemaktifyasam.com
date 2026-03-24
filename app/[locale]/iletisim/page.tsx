"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  Instagram,
  Clock,
  Mail,
  Send,
  Loader2,
  Check,
  ChevronDown,
  Heart,
  Users,
  Star,
  Shield,
  Apple,
  Dumbbell,
  Stethoscope,
  Leaf,
  MapPin,
  Phone,
} from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905412523421";

const contactCards = [
  {
    href: `https://wa.me/905412523421`,
    icon: MessageCircle,
    iconBg: "bg-[#25D366]/10",
    iconColor: "text-[#25D366]",
    borderColor: "border-l-[#25D366]",
    title: "WhatsApp",
    desc: "Hızlı yanıt için WhatsApp\u2019tan yazın",
    tag: "En hızlı yanıt",
    external: true,
  },
  {
    href: "https://instagram.com/meltem.tanik",
    icon: Instagram,
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500",
    borderColor: "border-l-pink-500",
    title: "Instagram",
    desc: "@meltem.tanik",
    tag: null,
    external: true,
  },
  {
    href: "mailto:info@meltemaktifyasam.com",
    icon: Mail,
    iconBg: "bg-brand-green/10",
    iconColor: "text-brand-green",
    borderColor: "border-l-brand-green",
    title: "E-posta",
    desc: "info@meltemaktifyasam.com",
    tag: null,
    external: false,
  },
  {
    href: "tel:+905412523421",
    icon: Phone,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    borderColor: "border-l-indigo-500",
    title: "Telefon",
    desc: "0541 252 34 21",
    tag: null,
    external: false,
  },
  {
    href: null,
    icon: Clock,
    iconBg: "bg-brand-orange/10",
    iconColor: "text-brand-orange",
    borderColor: "border-l-brand-orange",
    title: "Çalışma Saatleri",
    desc: "Pazartesi - Cumartesi: 09:00 - 18:00",
    tag: null,
    external: false,
  },
  {
    href: null,
    icon: MapPin,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    borderColor: "border-l-blue-500",
    title: "Adres",
    desc: "FATİH Mah. ÖRNEK SOKAK B BLOK No: 2 B - FREZYA KONAKLARI Daire: 5, BÜYÜKÇEKMECE / İSTANBUL",
    tag: null,
    external: false,
  },
];

const stats = [
  { icon: Users, value: "500+", label: "Mutlu Danışan" },
  { icon: Star, value: "4.9", label: "Ortalama Puan" },
  { icon: Heart, value: "%95", label: "Memnuniyet" },
  { icon: Shield, value: "7/24", label: "WhatsApp Destek" },
];

const helpTopics = [
  {
    icon: Apple,
    title: "Kişisel Beslenme Programı",
    desc: "Yaşam tarzınıza ve hedeflerinize uygun, sürdürülebilir beslenme planı",
  },
  {
    icon: Dumbbell,
    title: "Kilo Yönetimi",
    desc: "Sağlıklı kilo verme, alma veya koruma için uzman desteği",
  },
  {
    icon: Stethoscope,
    title: "Kronik Hastalık Desteği",
    desc: "Diyabet, tiroid, PCOS gibi durumlara özel beslenme danışmanlığı",
  },
  {
    icon: Leaf,
    title: "Fonksiyonel Beslenme",
    desc: "Bağırsak sağlığı, enerji düzeni ve bağışıklık sisteminizi güçlendirme",
  },
];

const faqs = [
  {
    q: "İlk görüşme ücretsiz mi?",
    a: "Evet! İlk değerlendirme görüşmemiz tamamen ücretsizdir. WhatsApp üzerinden veya formu doldurarak randevu alabilirsiniz.",
  },
  {
    q: "Online danışmanlık nasıl işliyor?",
    a: "WhatsApp görüntülü arama veya telefon görüşmesi ile online danışmanlık veriyoruz. Türkiye'nin her yerinden hizmet alabilirsiniz.",
  },
  {
    q: "Beslenme programı ne kadar sürede hazır olur?",
    a: "İlk görüşmenizin ardından 24-48 saat içinde size özel beslenme programınız hazırlanır ve WhatsApp üzerinden iletilir.",
  },
  {
    q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    a: "Havale/EFT, kredi kartı ve online ödeme seçenekleri mevcuttur. Detaylar görüşme sırasında paylaşılır.",
  },
  {
    q: "Destek grubu nedir?",
    a: "Danışanlarımıza özel WhatsApp destek grubumuz var. Burada motivasyon, tarif paylaşımı ve sürekli uzman desteği sunuyoruz.",
  },
  {
    q: "Program süresince takip var mı?",
    a: "Evet, haftalık düzenli takip yapıyoruz. Gerektiğinde programınızda güncellemeler yaparak hedeflerinize ulaşmanızı sağlıyoruz.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 rounded-xl bg-white px-6 py-5 text-left shadow-sm hover:shadow-md transition-shadow border border-gray-100"
      >
        <span className="font-medium text-brand-dark">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 py-4 text-sm text-muted-foreground leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || null,
          message: formData.get("message"),
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-light via-white to-emerald-50 py-16 sm:py-24">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-green/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-brand-orange/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-2 text-sm font-semibold text-brand-green mb-6">
              <MessageCircle className="h-4 w-4" />
              Size yardımcı olmak için buradayız
            </span>

            <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl lg:text-5xl leading-tight">
              Bizimle{" "}
              <span className="text-brand-green">İletişime</span>{" "}
              Geçin
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Sağlıklı yaşam yolculuğunuzda sorularınızı yanıtlamak, size en uygun programı
              oluşturmak ve her adımda yanınızda olmak için buradayız.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="relative -mt-8 z-10 pb-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl bg-white p-6 shadow-xl border border-gray-100"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-5 w-5 text-brand-green mx-auto mb-1" />
                <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form + Contact Info */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="relative border-0 shadow-xl overflow-hidden">
                {/* Decorative elements */}
                <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-brand-green/5" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-tr-full bg-brand-orange/5" />

                <CardContent className="relative p-8">
                  <h2 className="text-xl font-bold text-brand-dark mb-1">Mesaj Gönderin</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Formu doldurun, en kısa sürede size dönüş yapalım.
                  </p>

                  <AnimatePresence mode="wait">
                    {status === "success" ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-12 text-center"
                      >
                        {/* Confetti dots */}
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: ["#2ECC71", "#E67E22", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6"][i % 6],
                              left: `${15 + Math.random() * 70}%`,
                              top: `${10 + Math.random() * 30}%`,
                            }}
                            initial={{ opacity: 0, scale: 0, y: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1.5, 0],
                              y: [0, -30 - Math.random() * 40],
                              x: [-20 + Math.random() * 40],
                            }}
                            transition={{
                              duration: 1.2,
                              delay: i * 0.08,
                              ease: "easeOut",
                            }}
                          />
                        ))}

                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/10"
                        >
                          <Check className="h-10 w-10 text-brand-green" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-brand-dark mb-2">
                          {t("success")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          En kısa sürede size dönüş yapacağız.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Label htmlFor="name">{t("name")}</Label>
                            <Input id="name" name="name" required className="mt-1" />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                          >
                            <Label htmlFor="email">{t("email")}</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              className="mt-1"
                            />
                          </motion.div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Label htmlFor="phone">{t("phone")}</Label>
                          <Input id="phone" name="phone" type="tel" className="mt-1" />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                        >
                          <Label htmlFor="message">{t("message")}</Label>
                          <Textarea
                            id="message"
                            name="message"
                            required
                            rows={5}
                            className="mt-1"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-brand-green hover:bg-brand-green-dark text-white"
                          >
                            {status === "loading" ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="mr-2 h-4 w-4" />
                            )}
                            {t("send")}
                          </Button>
                        </motion.div>

                        <p className="text-xs text-center text-gray-400">
                          🔒 Bilgileriniz güvende · Yanıt süresi genellikle 2 saat içinde
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-brand-dark mb-2">İletişim Bilgileri</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Size en uygun kanaldan bize ulaşabilirsiniz.
              </p>

              {contactCards.map((card, i) => {
                const content = (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className={`border-0 border-l-4 ${card.borderColor} shadow-sm hover:shadow-lg transition-all`}>
                      <CardContent className="p-5 flex items-center gap-4">
                        <div className={`rounded-xl ${card.iconBg} p-3 shrink-0`}>
                          <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-brand-dark">{card.title}</h3>
                            {card.tag && (
                              <span className="text-[10px] font-semibold bg-[#25D366]/10 text-[#25D366] px-2 py-0.5 rounded-full">
                                {card.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {card.desc}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );

                return card.href ? (
                  <a
                    key={card.title}
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noopener noreferrer" : undefined}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={card.title}>{content}</div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Help Topics */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl">
              Hangi Konularda Yardımcı Olabilirim?
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Fonksiyonel beslenme uzmanlığı ile size destek olabileceğim alanlar
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {helpTopics.map((topic, i) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green/10">
                      <topic.icon className="h-7 w-7 text-brand-green" />
                    </div>
                    <h3 className="font-semibold text-brand-dark mb-2">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{topic.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl">
              Sıkça Sorulan Sorular
            </h2>
            <p className="mt-2 text-muted-foreground">
              Merak ettiklerinize hızlı yanıtlar
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            Sorunuzun yanıtını bulamadınız mı?{" "}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-green font-medium hover:underline"
            >
              WhatsApp&apos;tan bize yazın →
            </a>
          </motion.p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 sm:py-20 bg-gradient-to-r from-brand-green to-emerald-600">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white sm:text-3xl mb-4">
              Sağlıklı Yaşam Yolculuğunuza Bugün Başlayın
            </h2>
            <p className="text-green-100 mb-8 max-w-lg mx-auto">
              Ücretsiz ilk değerlendirme görüşmenizi hemen planlayın.
              Fonksiyonel Beslenme Uzmanımız sizi bekliyor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-white text-brand-green hover:bg-green-50 font-semibold px-8 w-full sm:w-auto">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp&apos;tan Yazın
                </Button>
              </a>
              <Button
                size="lg"
                className="bg-white/20 text-white hover:bg-white/30 font-semibold px-8 border-2 border-white/50"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                Mesaj Gönderin
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
