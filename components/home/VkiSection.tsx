"use client"

import { useTranslations } from "next-intl"
import { motion, useAnimationControls, useMotionValue, animate } from "framer-motion"
import { useEffect } from "react"
import { Link } from "@/i18n/navigation"

/* ─── İkon bileşenleri ─── */
function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function PulseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="w-3.5 h-3.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

/* ─── Gauge SVG bileşeni ─── */
function GaugeSVG({ gaugeQuestion }: { gaugeQuestion: string }) {
  const arcControls = [
    useAnimationControls(),
    useAnimationControls(),
    useAnimationControls(),
    useAnimationControls(),
  ]

  const rotate = useMotionValue(-90)

  useEffect(() => {
    arcControls.forEach((ctrl, i) => {
      ctrl.start({
        pathLength: 1,
        transition: { duration: 0.45, delay: 0.15 + i * 0.18, ease: "easeOut" },
      })
    })

    const seq = async () => {
      await new Promise((r) => setTimeout(r, 350))
      await animate(rotate, 80, {
        duration: 1.8,
        ease: [0.34, 1.56, 0.64, 1],
      })
      await animate(rotate, -22, {
        duration: 0.75,
        ease: [0.4, 0, 0.2, 1],
      })
      animate(rotate, [-22, -16, -22], {
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      })
    }
    seq()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const arcs = [
    { d: "M 20 110 A 80 80 0 0 1 43.43 53.43", stroke: "#3b82f6" },
    { d: "M 43.43 53.43 A 80 80 0 0 1 100 30",   stroke: "#16a34a" },
    { d: "M 100 30 A 80 80 0 0 1 156.57 53.43",  stroke: "#f59e0b" },
    { d: "M 156.57 53.43 A 80 80 0 0 1 180 110", stroke: "#ef4444" },
  ]

  return (
    <svg viewBox="0 0 200 135" className="w-full max-w-[260px] mx-auto">
      <path
        d="M 20 110 A 80 80 0 0 1 180 110"
        fill="none" stroke="#f1f5f9" strokeWidth="16" strokeLinecap="round"
      />

      {arcs.map((arc, i) => (
        <motion.path
          key={i}
          d={arc.d}
          fill="none"
          stroke={arc.stroke}
          strokeWidth="14"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={arcControls[i]}
        />
      ))}

      <motion.g style={{ transformOrigin: "100px 110px", rotate }}>
        <line x1="100" y1="110" x2="100" y2="36"
          stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="100" cy="110" r="6.5" fill="#1e293b" />
        <circle cx="100" cy="110" r="10" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.15" />
        <circle cx="100" cy="39" r="3" fill="#16a34a" />
      </motion.g>

      <text x="100" y="91" textAnchor="middle"
        fontSize="24" fontWeight="800" fill="#0f172a" letterSpacing="-0.5">
        ??.?
      </text>
      <text x="100" y="128" textAnchor="middle"
        fontSize="9.5" fill="#94a3b8" letterSpacing="0.2">
        {gaugeQuestion}
      </text>
    </svg>
  )
}

/* ─── Ana bileşen ─── */
export function VkiSection() {
  const t = useTranslations("vkiSection")

  const zones = [
    { label: t("underweight"), bg: "#eff6ff", text: "#1e40af" },
    { label: t("normal"),      bg: "#f0fdf4", text: "#14532d" },
    { label: t("overweight"),  bg: "#fffbeb", text: "#78350f" },
    { label: t("obese"),       bg: "#fef2f2", text: "#7f1d1d" },
  ]

  const benefits = [
    t("benefit1"),
    t("benefit2"),
    t("benefit3"),
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-orange-50 py-16 px-6">
      <div className="pointer-events-none absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-green-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">

        {/* Sol: Gauge kartı */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative flex-shrink-0"
        >
          <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-3xl border-2 border-dashed border-yellow-300" />

          <div className="relative rounded-3xl bg-white p-8 shadow-xl shadow-green-100/60 min-w-[270px] text-center">
            <GaugeSVG gaugeQuestion={t("gaugeQuestion")} />

            <div className="mt-3 flex justify-between gap-1 px-1">
              {zones.map((z) => (
                <span
                  key={z.label}
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: z.bg, color: z.text }}
                >
                  {z.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sağ: Metin alanı */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex-1 max-w-lg"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700">
            <PulseIcon />
            {t("badge")}
          </div>

          <h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
            {t("title")}{" "}
            <span className="text-green-600">{t("titleHighlight")}</span>
          </h2>

          <p className="mb-6 text-lg leading-relaxed text-gray-600">
            {t("description")}
          </p>

          <ul className="mb-8 space-y-3.5">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-gray-700">{b}</span>
              </li>
            ))}
          </ul>

          <Link href="/vki-analiz">
            <motion.button
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
              className="group inline-flex items-center gap-3 rounded-2xl bg-green-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-green-200 transition-colors duration-200 hover:bg-green-700"
            >
              {t("cta")}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </motion.button>
          </Link>

          <p className="mt-4 text-sm text-gray-400">
            {t("trustNote")}
          </p>
        </motion.div>

      </div>
    </section>
  )
}

export default VkiSection
