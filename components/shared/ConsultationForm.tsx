"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Check, Loader2, Phone, User, Mail, Target, Ruler, Weight, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ConsultationFormProps {
  variant?: "light" | "dark";
  title?: string;
  subtitle?: string;
}

export default function ConsultationForm({
  variant = "light",
  title,
  subtitle,
}: ConsultationFormProps) {
  const t = useTranslations("consultation");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const displayTitle = title || t("defaultTitle");
  const displaySubtitle = subtitle || t("defaultSubtitle");

  const goals = [
    { value: "kilo_ver", label: t("goalLose") },
    { value: "kilo_al", label: t("goalGain") },
    { value: "form_koru", label: t("goalMaintain") },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const height = parseFloat(formData.get("height") as string) || 0;
    const weight = parseFloat(formData.get("weight") as string) || 0;
    const heightM = height / 100;
    const bmi = heightM > 0 ? weight / (heightM * heightM) : 0;

    let bmi_category = "Normal";
    if (bmi < 18.5) bmi_category = "Zayıf";
    else if (bmi < 25) bmi_category = "Normal";
    else if (bmi < 30) bmi_category = "Fazla Kilolu";
    else bmi_category = "Obez";

    try {
      const res = await fetch("/api/vki", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email") || null,
          age: formData.get("age") || null,
          height: height,
          weight: weight,
          bmi: Math.round(bmi * 10) / 10,
          bmi_category,
          goal: formData.get("goal"),
          health_note: formData.get("health_note") || null,
          consent: true,
        }),
      });

      if (res.ok) {
        setStatus("success");
        toast.success(t("successToast"));
        form.reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("idle");
        toast.error(t("errorToast"));
      }
    } catch {
      setStatus("idle");
      toast.error(t("connectionError"));
    }
  };

  const isDark = variant === "dark";
  const inputClass = isDark
    ? "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-sm backdrop-blur-sm"
    : "w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-sm shadow-sm";
  const selectClass = isDark
    ? "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-sm backdrop-blur-sm [&>option]:bg-gray-800 [&>option]:text-white"
    : "w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-sm shadow-sm";
  const iconClass = isDark ? "text-white/40" : "text-gray-400";
  const labelClass = isDark ? "text-white/80" : "text-gray-700";

  return (
    <div>
      <div className="mb-5">
        <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"} sm:text-2xl`}>
          {displayTitle}
        </h3>
        <p className={`mt-1 text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
          {displaySubtitle}
        </p>
      </div>

      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl p-8 text-center ${isDark ? "bg-white/10 backdrop-blur-sm" : "bg-brand-green/5 border border-brand-green/20"}`}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/20">
            <Check className="h-7 w-7 text-brand-green" />
          </div>
          <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("successTitle")}
          </p>
          <p className={`mt-1 text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
            {t("successSubtitle")}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <div>
            <label className={`block text-xs font-medium ${labelClass} mb-1`}>{t("nameLabel")}</label>
            <div className="relative">
              <User size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} />
              <input name="name" required placeholder={t("namePlaceholder")} className={inputClass} />
            </div>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-medium ${labelClass} mb-1`}>{t("phoneLabel")}</label>
              <div className="relative">
                <Phone size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} />
                <input name="phone" type="tel" required placeholder={t("phonePlaceholder")} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium ${labelClass} mb-1`}>{t("emailLabel")}</label>
              <div className="relative">
                <Mail size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} />
                <input name="email" type="email" placeholder={t("emailPlaceholder")} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Age + Height + Weight */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block text-xs font-medium ${labelClass} mb-1`}>{t("ageLabel")}</label>
              <div className="relative">
                <Calendar size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} />
                <input name="age" type="number" min={10} max={99} placeholder="35" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium ${labelClass} mb-1`}>{t("heightLabel")}</label>
              <div className="relative">
                <Ruler size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} />
                <input name="height" type="number" min={100} max={250} required placeholder="170" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium ${labelClass} mb-1`}>{t("weightLabel")}</label>
              <div className="relative">
                <Weight size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} />
                <input name="weight" type="number" min={30} max={300} required placeholder="75" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Health note */}
          <div>
            <label className={`block text-xs font-medium ${labelClass} mb-1`}>{t("healthLabel")}</label>
            <textarea
              name="health_note"
              rows={2}
              placeholder={t("healthPlaceholder")}
              className={`${inputClass} pl-4 resize-none`}
            />
          </div>

          {/* Goal */}
          <div>
            <label className={`block text-xs font-medium ${labelClass} mb-1`}>{t("goalLabel")}</label>
            <div className="relative">
              <Target size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} />
              <select name="goal" required className={`${selectClass} pl-10`}>
                <option value="">{t("goalPlaceholder")}</option>
                {goals.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={status === "loading"}
            className={`w-full py-3 rounded-xl font-semibold text-sm mt-1 ${
              isDark
                ? "bg-white text-brand-green hover:bg-white/90"
                : "bg-brand-green hover:bg-brand-green-dark text-white"
            }`}
          >
            {status === "loading" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {status === "loading" ? t("submitting") : t("submitButton")}
          </Button>

          <p className={`text-center text-[10px] ${isDark ? "text-white/40" : "text-gray-400"}`}>
            {t("privacyNote")}
          </p>
        </form>
      )}
    </div>
  );
}
