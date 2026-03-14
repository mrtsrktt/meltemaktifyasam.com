"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, CheckCircle } from "lucide-react";

export default function VKISection() {
  return (
    <section className="py-14 sm:py-20 bg-gradient-to-br from-gray-50 to-brand-light relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-green/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-bl-full" />

              {/* Gauge illustration */}
              <div className="flex justify-center mb-6">
                <svg viewBox="0 0 200 110" className="w-48 sm:w-56">
                  <path d="M 10 100 A 90 90 0 0 1 52 30" fill="none" stroke="#3B82F6" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 52 30 A 90 90 0 0 1 100 10" fill="none" stroke="#2ECC71" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 100 10 A 90 90 0 0 1 148 30" fill="none" stroke="#E67E22" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 148 30 A 90 90 0 0 1 190 100" fill="none" stroke="#EF4444" strokeWidth="10" strokeLinecap="round" />
                  <motion.line
                    x1="100" y1="100" x2="100" y2="22"
                    stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round"
                    initial={{ rotate: -90 }}
                    whileInView={{ rotate: 10 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, type: "spring", delay: 0.5 }}
                    style={{ transformOrigin: "100px 100px" }}
                  />
                  <circle cx="100" cy="100" r="4" fill="#1A1A2E" />
                </svg>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-brand-dark">??.?</p>
                <p className="text-sm text-muted-foreground mt-1">Senin VKI degerin kac?</p>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-2 text-center text-[10px]">
                <div className="bg-blue-50 rounded-lg py-1.5 text-blue-600 font-medium">Zayif</div>
                <div className="bg-green-50 rounded-lg py-1.5 text-green-600 font-medium">Normal</div>
                <div className="bg-orange-50 rounded-lg py-1.5 text-orange-600 font-medium">Kilolu</div>
                <div className="bg-red-50 rounded-lg py-1.5 text-red-600 font-medium">Obez</div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-2 text-sm font-medium text-brand-green mb-4">
              <Activity className="h-4 w-4" />
              Ucretsiz VKI Analizi
            </div>

            <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl lg:text-4xl leading-tight">
              Ideal Kilonuzu{" "}
              <span className="text-brand-green">Ogrenin</span>
            </h2>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              30 saniyede vucut kitle indeksinizi hesaplayin, saglik durumunuzu ogrenin
              ve size ozel beslenme programi icin ilk adimi atin.
            </p>

            <div className="mt-6 space-y-2.5">
              {[
                "Boy ve kilonuzu girin, aninda sonuc alin",
                "Sonucunuza gore kisisel beslenme onerisi",
                "Tamamen ucretsiz, kayit gerektirmez",
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-2.5"
                >
                  <CheckCircle className="h-4 w-4 text-brand-green shrink-0" />
                  <span className="text-sm text-gray-600">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/vki-analiz">
                <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white text-base px-8">
                  VKI Hesapla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
