"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Flame,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Phone,
  Calendar,
  Microscope,
  UserCheck,
  Award,
  ChevronDown,
  Lock,
  Clock,
  Sparkles,
} from "lucide-react";
import ConsultationForm from "@/components/shared/ConsultationForm";

/* ─────────────────────────────────────────────────────────────
   Sabitler
   ───────────────────────────────────────────────────────────── */
const WHATSAPP_URL = "https://wa.me/905412523421";
const CAMPAIGN_END = new Date("2026-07-12T23:59:59+03:00");
const HERO_IMAGE = "/images/profilfoto-1.png";
const DIPLOMA_IMAGE = "/images/diploma.jpeg";
const LEAD_SOURCE = "60gun_kampanya";

/* ─────────────────────────────────────────────────────────────
   Yardımcı: Bölüme yumuşak scroll
   ───────────────────────────────────────────────────────────── */
function scrollToForm() {
  if (typeof window === "undefined") return;
  const el = document.getElementById("basvuru");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─────────────────────────────────────────────────────────────
   Geri Sayım bileşeni
   ───────────────────────────────────────────────────────────── */
function Countdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    // SSR / hydration için boş placeholder
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {["GÜN", "SAAT", "DAKİKA", "SANİYE"].map((label) => (
          <div
            key={label}
            className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-4 text-center"
          >
            <div className="text-3xl sm:text-4xl font-black tabular-nums text-white">
              --
            </div>
            <div className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/70">
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const diff = Math.max(0, CAMPAIGN_END.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const cells = [
    { label: "GÜN", value: days },
    { label: "SAAT", value: hours },
    { label: "DAKİKA", value: minutes },
    { label: "SANİYE", value: seconds },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {cells.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-4 text-center shadow-lg"
        >
          <div className="text-3xl sm:text-4xl font-black tabular-nums text-white">
            {String(c.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/80">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SSS Accordion
   ───────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "Sağlık sorunum var, bu program bana uygun mu?",
    a: "Tam tersine — bu program özellikle sağlık sorunu, hormon dengesizliği, insülin direnci, tiroit gibi konuları olan kişiler için tasarlandı. Senin durumunu detaylı dinleyip, sana özel plan kuruyoruz.",
  },
  {
    q: "60 günde ne kadar kilo verebilirim?",
    a: "Bu kişiye göre değişir. Vücut tipi, başlangıç ağırlığı, sağlık durumu hepsi etkili. 60 günde 5-15 kilo aralığında verenler çoğunlukta. Önemli olan sürdürülebilir verme.",
  },
  {
    q: "Herbalife ürünü almak zorunda mıyım?",
    a: "Hayır. Programda ürün satışı yok. Eğer sana uygunsa öneririm, uygun değilse başka çözümler kurarız. Karar senin.",
  },
  {
    q: "Paket fiyatına neler dahil?",
    a: "60 gün boyunca birebir takip, kişiye özel plan, WhatsApp desteği, online görüşmeler ve takip dahildir. Ürünler dahil değildir, isteğe bağlıdır.",
  },
  {
    q: "Nasıl ödeyebilirim?",
    a: "Başvurun sonrası seni arıyoruz, görüşmeden sonra sana güvenli ödeme linki gönderiyoruz. Kredi kartı taksit imkanı var.",
  },
  {
    q: "Şu an kayıt yaptırsam ne zaman başlıyor?",
    a: "Başvurun ulaşır ulaşmaz seni arıyoruz. İlk görüşmeden sonra (genellikle 1-3 gün içinde) sana özel programınla başlıyoruz.",
  },
  {
    q: "Kontenjan dolarsa ne olur?",
    a: "60 kişilik kontenjan dolduğunda kampanya kapanır. Sonraki kampanya tarihi belli değil ve fiyat normal seviyesine (15.000 ₺) döner.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left hover:bg-slate-50/60 transition-colors"
        aria-expanded={open}
      >
        <span className="text-[15px] sm:text-base font-semibold text-slate-900">
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 sm:px-6 pb-5 -mt-1 text-sm sm:text-[15px] leading-relaxed text-slate-600">
          {a}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Paket avantaj listesi
   ───────────────────────────────────────────────────────────── */
const PACKAGE_ITEMS = [
  "Detaylı sağlık görüşmesi ve kişiye özel beslenme planı",
  "Haftalık güncellenen menü ve takip",
  "Günlük WhatsApp desteği — sorularına 24 saat içinde cevap",
  "Düzenli online görüşmeler",
  "Egzersiz ve yaşam tarzı önerileri",
  "İhtiyaca göre takviye/ürün önerisi",
  "Motivasyon ve psikolojik destek",
  "Program sonrası 1 ay ücretsiz takip",
];

/* ─────────────────────────────────────────────────────────────
   Ana sayfa
   ───────────────────────────────────────────────────────────── */
export default function Campaign60Page() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ============ STICKY HEADER ============ */}
      <header className="sticky top-0 z-50 w-full border-b border-orange-100/60 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href="/"
            aria-label="Meltem Tanık - Ana Sayfa"
            className="flex items-center shrink-0"
          >
            <Image
              src="/logo.png"
              alt="Meltem Tanık"
              width={160}
              height={42}
              className="h-8 sm:h-9 w-auto"
              priority
            />
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3 py-2 text-[13px] font-semibold text-[#1f8a4d] hover:bg-[#25D366]/20 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-4 sm:px-5 py-2 text-[13px] sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:bg-orange-600 transition-colors"
            >
              HEMEN BAŞVUR
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ============ 1. HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Sıcak yaz gradient'i */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/60 to-rose-50" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Sol blok */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3.5 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-wide text-rose-700 border border-rose-200">
                <Flame className="h-3.5 w-3.5" />
                60 KİŞİYLE SINIRLI KAMPANYA
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-slate-900">
                60 Günde{" "}
                <span className="text-brand-orange">Hayalini Kurduğun</span>{" "}
                Bedene
              </h1>

              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-700">
                Defalarca denedin. Kendine söz verdin, sonra kırdın. Kabahat
                senin değil — yanında doğru kişi yoktu.{" "}
                <strong className="text-slate-900">
                  Şimdi birlikteyiz, bu sefer başaracağız.
                </strong>
              </p>

              {/* Fiyat bloğu */}
              <div className="mt-7 rounded-2xl bg-white/70 backdrop-blur-sm border border-orange-200/70 p-5 shadow-md shadow-orange-100/40">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-sm text-slate-400 line-through">
                    Normal Fiyat: 15.000 ₺
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-bold uppercase tracking-wide text-rose-600">
                    KAMPANYA:
                  </span>
                  <span className="text-4xl sm:text-5xl font-black text-brand-orange tracking-tight">
                    9.900 ₺
                  </span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                  (60 gün boyunca birebir özel danışmanlık)
                </p>
              </div>

              {/* Avantaj rozetleri */}
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Birebir Takip",
                  "Sana Özel Plan",
                  "%95 Başarı",
                ].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-slate-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    {label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-7">
                <motion.button
                  type="button"
                  onClick={scrollToForm}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-brand-orange px-7 py-4 text-base sm:text-lg font-bold text-white shadow-xl shadow-orange-500/30 hover:bg-orange-600 transition-colors"
                >
                  ÜCRETSİZ BAŞVURUMU YAP
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
                <p className="mt-2.5 text-xs text-slate-500">
                  60 kontenjandan yer kalmadan başvur
                </p>
              </div>
            </motion.div>

            {/* Sağ blok — foto */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-3xl shadow-2xl shadow-orange-500/15 ring-1 ring-orange-100">
                <Image
                  src={HERO_IMAGE}
                  alt="Meltem Tanık - Fonksiyonel Beslenme Uzmanı"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 100vw, 384px"
                />
                {/* Foto üzeri rozet */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-[200px] rounded-2xl bg-white/95 backdrop-blur-sm px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-xs font-bold text-slate-900">
                        14+ Yıl Uzmanlık
                      </div>
                      <div className="text-[11px] text-slate-500">
                        500+ Danışan
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ 2. TETİK ============ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Yıllardır denedin. Bu sefer farklı olacak. İşte neden:
            </h2>

            <div className="mt-8 sm:mt-10 space-y-5 text-left sm:text-center text-base sm:text-lg leading-relaxed text-slate-700">
              <p>
                Defalarca diyet yaptın. İlk hafta belki 2 kilo verdin. Sonra
                durdu. Sonra geri geldi.
              </p>
              <p>Kendine kızdın. &ldquo;İradem yok&rdquo; dedin.</p>
              <p className="text-xl sm:text-2xl font-bold text-brand-orange">
                Kabahat senin değil.
              </p>
              <p>
                Sana verilen her diyet, başka birinin başarısının üzerine
                kuruldu. Sen tanınmadan, yaşam tarzın anlaşılmadan,
                ihtiyaçların sorgulanmadan...
              </p>
              <p className="text-slate-900 font-semibold">
                Senin vücudun, senin parmak izin kadar tek. Bu yüzden senin
                programın da öyle olmalı.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ 3. OTORİTE - Meltem kim? ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Diploma */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-md aspect-[4/3] overflow-hidden rounded-2xl border-4 border-white shadow-2xl shadow-slate-200">
                <Image
                  src={DIPLOMA_IMAGE}
                  alt="Meltem Tanık - Diploma ve Sertifikalar"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
              </div>
            </motion.div>

            {/* Metin */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                <Sparkles className="h-3 w-3" />
                Tanışalım
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Ben Meltem Tanık
              </h2>
              <p className="mt-2 text-sm sm:text-base font-medium text-emerald-700">
                Diplomalı Fonksiyonel Beslenme Uzmanı | 2012&apos;den beri
              </p>

              <div className="mt-5 space-y-4 text-[15px] sm:text-base leading-relaxed text-slate-700">
                <p>
                  14 yıldır beslenme alanındayım. Klasik diyet listelerinden
                  farklı bir yol seçtim:{" "}
                  <strong className="text-slate-900">
                    Fonksiyonel beslenme.
                  </strong>{" "}
                  Bu yaklaşımda her insanın metabolizması, hormonları,
                  alerjileri, yaşam tarzı ayrı incelenir.
                </p>
                <p>
                  Son yıllarda{" "}
                  <strong className="text-slate-900">
                    500&apos;den fazla danışana
                  </strong>{" "}
                  birebir eşlik ettim.{" "}
                  <strong className="text-slate-900">
                    %95&apos;i hedefine ulaştı.
                  </strong>{" "}
                  Çünkü herkese aynı listeyi vermedim — herkese kendi listesini
                  hazırladım.
                </p>
              </div>

              {/* Metrik kartları */}
              <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { value: "14+", label: "Yıl Deneyim" },
                  { value: "500+", label: "Danışan" },
                  { value: "%95", label: "Başarı Oranı" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl bg-white border border-slate-200 px-3 py-4 text-center shadow-sm"
                  >
                    <div className="text-2xl sm:text-3xl font-black text-brand-orange tracking-tight">
                      {m.value}
                    </div>
                    <div className="mt-0.5 text-[11px] sm:text-xs font-medium uppercase tracking-wide text-slate-500">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ 4. FARK - 3 kart ============ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Klasik Diyetisyenlerden ve HB Distribütörlerinden Farkım Ne?
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:gap-6 md:grid-cols-3">
            {[
              {
                icon: Microscope,
                title: "Önce Seni Tanıyorum",
                text: "Program başlamadan önce seni, hayat tarzını ve hedeflerini detaylı dinlemek istiyorum. Hangi alışkanlıklar, hangi engeller, ne istiyorsun... Sen senin gibisin, bunu bilmeden plan yazmam.",
              },
              {
                icon: UserCheck,
                title: "Senin İçin Kuruluyor",
                text: "60 gün boyunca planın sadece senin için. Yaşam tarzına, çalışma saatlerine, sevdiklerin yemeklere göre uyarlanır. Standart liste yok.",
              },
              {
                icon: Award,
                title: "Ürün Satmıyorum, Çözüm Tasarlıyorum",
                text: "Herbalife distribütörüyüm ama herkese HB önermiyorum. Sana gerekirse veriyorum, gerekmiyorsa başka çözümler buluyoruz. Komisyon değil, sonuç peşindeyim.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-brand-orange">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {c.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  {c.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. BEFORE/AFTER ============ */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Hedefe Ulaşan Danışanlarımdan Birkaç Örnek
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              500+ başarı hikayesinden bazıları (Tümü yazılı izinleriyle
              paylaşılmıştır)
            </p>
          </motion.div>

          {/* Placeholder grid */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { name: "Ayşe K.", detail: "8 Kilo / 12 Hafta", tag: "İnsülin Direnci" },
              { name: "Zeynep D.", detail: "11 Kilo / 10 Hafta", tag: "Tiroit" },
              { name: "Selin A.", detail: "6 Kilo / 8 Hafta", tag: "Hormon" },
              { name: "Merve T.", detail: "9 Kilo / 12 Hafta", tag: "İnsülin Direnci" },
              { name: "Esra B.", detail: "7 Kilo / 9 Hafta", tag: "Tiroit" },
              { name: "Gizem Y.", detail: "10 Kilo / 12 Hafta", tag: "Hormon" },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Placeholder photo area */}
                <div className="grid grid-cols-2 gap-px bg-slate-100">
                  {["Öncesi", "Sonrası"].map((label) => (
                    <div
                      key={label}
                      className="aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400"
                    >
                      <Award className="h-7 w-7 mb-1" />
                      <span className="text-[10px] font-semibold uppercase tracking-wide">
                        {label}
                      </span>
                      <span className="mt-0.5 text-[9px] text-slate-400/70">
                        foto eklenecek
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-3 sm:p-4">
                  <div className="text-sm font-bold text-slate-900">
                    {p.name}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{p.detail}</div>
                  <div className="mt-2 inline-block rounded-full bg-orange-50 text-brand-orange text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 border border-orange-100">
                    {p.tag}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-orange px-6 py-3 text-base font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-colors"
            >
              Sen de bu listeye katıl
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ 6. PAKET İÇERİĞİ ============ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              60 Gün Boyunca Tam Olarak Ne Alıyorsun?
            </h2>
          </motion.div>

          <ul className="mt-10 space-y-3">
            {PACKAGE_ITEMS.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-[15px] sm:text-base text-slate-700 leading-relaxed">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 7. FİYAT ============ */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-orange-50/40 to-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Kampanya Fiyatı
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              60 günlük birebir VIP danışmanlık paketi
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 rounded-3xl bg-white border-2 border-orange-200 shadow-2xl shadow-orange-200/40 p-7 sm:p-10 text-center"
          >
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-slate-500">
              Normal Birebir Danışmanlık Fiyatı
            </p>
            <p className="mt-2 text-2xl sm:text-3xl text-slate-400 line-through tabular-nums">
              15.000 ₺
            </p>

            <div className="my-5 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

            <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
              Bu kampanyaya özel:
            </p>
            <p className="mt-2 text-6xl sm:text-7xl font-black text-brand-orange tracking-tighter tabular-nums">
              9.900 ₺
            </p>
            <p className="mt-2 text-sm font-semibold text-emerald-700">
              Tasarruf: 5.100 ₺ (~%34 indirim)
            </p>

            <p className="mt-6 text-xs sm:text-sm text-slate-500">
              Kontenjan dolduğunda kampanya kapanır.
            </p>

            <motion.button
              type="button"
              onClick={scrollToForm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-7 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-brand-orange px-8 py-4 text-base sm:text-lg font-bold text-white shadow-xl shadow-orange-500/30 hover:bg-orange-600 transition-colors"
            >
              BAŞVURUMU YAP
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>

          {/* Güven rozetleri */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
            {[
              { icon: Lock, text: "Güvenli başvuru" },
              { icon: Phone, text: "24 saat içinde geri arama" },
              { icon: ShieldCheck, text: "Ödeme görüşme sonrası" },
            ].map((b) => (
              <div
                key={b.text}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
              >
                <b.icon className="h-4 w-4 text-emerald-600" />
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 8. YAZ ACİLİYETİ ============ */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        {/* Sıcak gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-amber-500" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Sol: countdown + tarih */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide">
                <Clock className="h-3.5 w-3.5" />
                Kampanya Bitimine
              </div>
              <div className="mt-5">
                <Countdown />
              </div>
              <p className="mt-4 text-xs sm:text-sm text-white/80">
                Bitiş: 12 Temmuz 2026 — kontenjan dolarsa daha erken kapanır
              </p>
            </motion.div>

            {/* Sağ: metin */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Yaz Sana 60 Gün Uzaklıkta
              </h2>
              <div className="mt-5 space-y-3.5 text-[15px] sm:text-base leading-relaxed text-white/90">
                <p>
                  Bugün başlarsan, 60 gün sonra Temmuz&apos;un ortasındasın.
                </p>
                <p className="font-semibold">
                  Plaj. Mayo. Düğünler. Tatil fotoğrafları.
                </p>
                <p>
                  Geçen yaz da aynı şeyi söyledin kendine. Belki ondan önceki
                  yaz da.{" "}
                  <strong>Bir şey değişmedikçe, hiçbir şey değişmez.</strong>
                </p>
                <p className="text-lg sm:text-xl font-bold text-white">
                  Bu yaz aynanın önünde gülümseyen sen olacaksın.
                </p>
              </div>

              <button
                type="button"
                onClick={scrollToForm}
                className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-base font-bold text-brand-orange shadow-xl shadow-black/15 hover:bg-orange-50 transition-colors"
              >
                BAŞVURUMU YAP
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ 9. SSS ============ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Sık Sorulan Sorular
            </h2>
          </motion.div>

          <div className="mt-10 space-y-3">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 10. SON CTA + FORM ============ */}
      <section
        id="basvuru"
        className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-16 sm:py-24 scroll-mt-16"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          {/* Üst metin */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Karar Senin. Yaza Hazırlanmaya Bugün Başla.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              60 kontenjandan biri senin olsun. Başvur, 24 saat içinde seni
              arayalım.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-wide text-rose-700 border border-rose-200">
              <Flame className="h-3.5 w-3.5" />
              KAMPANYA SÜRESİNDE GEÇERLİ — Kontenjan dolduğunda kapanır
            </div>
          </motion.div>

          {/* Form kartı */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-10 rounded-3xl bg-white border border-orange-200/70 shadow-2xl shadow-orange-200/30 p-6 sm:p-8"
          >
            <ConsultationForm
              variant="light"
              title="Ücretsiz Başvuru Formu"
              subtitle="Bilgilerini bırak, 24 saat içinde seni arayalım."
              source={LEAD_SOURCE}
              submitLabel="BAŞVURUMU YAP"
            />
          </motion.div>

          {/* Alt güven satırı */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Bilgilerin güvende
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              24 saat içinde geri arama
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Hemen kayıt — hemen başla
            </span>
          </div>
        </div>
      </section>

      {/* ============ Mini Footer ============ */}
      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Meltem Tanık — Fonksiyonel
            Beslenme Uzmanı. Tüm hakları saklıdır.
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Bu sayfa kampanya amaçlı hazırlanmıştır. Bireysel sonuçlar kişiden
            kişiye değişebilir.
          </p>
        </div>
      </footer>
    </main>
  );
}
