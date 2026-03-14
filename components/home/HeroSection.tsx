"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    image: "/images/profilfoto-1.png",
    badge: "Fonksiyonel Beslenme Uzmani",
    title1: "Baskasiyla Calistin Ama",
    title2: "Sonuc Alamadin mi?",
    subtitle:
      "Ben Fonksiyonel Beslenme Uzmani Meltem TANIK. Fonksiyonel beslenme yaklasimiyla yuzlerce danisanimin hayatini donusturdum. Senin de donusumun burada basliyor.",
    cta: "Ucretsiz Basvuru Yap",
    ctaLink: "#basvuru",
    ctaSecondary: "Hakkimda",
    ctaSecondaryLink: "/hakkimda" as const,
    stats: [
      { value: "500+", label: "Mutlu Danisan" },
      { value: "%95", label: "Memnuniyet" },
      { value: "5+", label: "Yil Deneyim" },
    ],
  },
  {
    image: "/images/profil-2.jpg",
    badge: "Herbalife Bagimsiz Distributoru",
    title1: "Saglikli Yasam",
    title2: "Bir Karar Uzaginda",
    subtitle:
      "Kisisellestirilmis beslenme programlari, Herbalife urunleriyle desteklenen cozumler ve 7/24 WhatsApp destegi ile hedefinize birlikte ulasalim.",
    cta: "Urunleri Kesfet",
    ctaLink: "/magaza" as const,
    ctaSecondary: "VKI Hesapla",
    ctaSecondaryLink: "/vki-analiz" as const,
    stats: [
      { value: "1000+", label: "Beslenme Programi" },
      { value: "55+", label: "Herbalife Urunu" },
      { value: "7/24", label: "WhatsApp Destek" },
    ],
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(goNext, 7000);
    return () => clearInterval(interval);
  }, [goNext]);

  const slide = slides[current];

  const scrollToForm = () => {
    const el = document.getElementById("basvuru");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]">
      {/* Background - animated gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 ${
            current === 0
              ? "bg-gradient-to-br from-[#0f1923] via-[#1a2a3a] to-[#0d2818]"
              : "bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#f0f9ff]"
          }`}
        />
      </AnimatePresence>

      {/* Decorative blurs */}
      <div className={`absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl ${current === 0 ? "bg-emerald-500/10" : "bg-brand-green/10"}`} />
      <div className={`absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-3xl ${current === 0 ? "bg-orange-500/5" : "bg-brand-orange/10"}`} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Text Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                current === 0
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-brand-green/10 text-brand-green"
              }`}>
                <Sparkles className="h-4 w-4" />
                {slide.badge}
              </div>

              <h1 className={`text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl ${
                current === 0 ? "text-white" : "text-brand-dark"
              }`}>
                {slide.title1}
                <br />
                <span className={current === 0 ? "text-emerald-400" : "text-brand-green"}>
                  {slide.title2}
                </span>
              </h1>

              <p className={`mt-5 max-w-lg text-base lg:text-lg leading-relaxed ${
                current === 0 ? "text-gray-300" : "text-muted-foreground"
              }`}>
                {slide.subtitle}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {current === 0 ? (
                  <Button
                    size="lg"
                    onClick={scrollToForm}
                    className="bg-brand-green hover:bg-brand-green-dark text-white text-base px-8"
                  >
                    {slide.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Link href="/magaza">
                    <Button
                      size="lg"
                      className="bg-brand-green hover:bg-brand-green-dark text-white text-base px-8"
                    >
                      {slide.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href={slide.ctaSecondaryLink}>
                  <Button
                    size="lg"
                    className={`text-base px-8 ${
                      current === 0
                        ? "bg-white/10 border border-white/30 text-white hover:bg-white/20"
                        : "bg-transparent border border-brand-green text-brand-green hover:bg-brand-green/10"
                    }`}
                  >
                    {slide.ctaSecondary}
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 flex gap-6 sm:gap-8">
                {slide.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className={`text-2xl font-bold ${current === 0 ? "text-white" : "text-brand-dark"}`}>
                      {stat.value}
                    </p>
                    <p className={`text-xs ${current === 0 ? "text-gray-400" : "text-muted-foreground"}`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${current}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className={`relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-3xl shadow-2xl ${
                current === 0
                  ? "shadow-emerald-500/10 ring-1 ring-white/10"
                  : "shadow-brand-green/10"
              }`}>
                <Image
                  src={slide.image}
                  alt="Meltem Tanik"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute bottom-6 left-0 sm:-left-4 bg-white rounded-xl p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">500+ Mutlu Danisan</span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={goPrev}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              current === 0
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? `w-8 ${current === 0 ? "bg-emerald-400" : "bg-brand-green"}`
                    : `w-2 ${current === 0 ? "bg-white/30" : "bg-gray-300"}`
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              current === 0
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
