"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Check, Loader2, Phone, User, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ConsultationFormProps {
  variant?: "light" | "dark";
  title?: string;
  subtitle?: string;
}

export default function ConsultationForm({
  variant = "light",
  title = "Ucretsiz Danismanlik Basvurusu",
  subtitle = "Formu doldurun, size en kisa surede donelim.",
}: ConsultationFormProps) {
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
          phone: formData.get("phone"),
          message: `[BASVURU FORMU] ${formData.get("message") || "Danismanlik talebi"}`,
        }),
      });

      if (res.ok) {
        setStatus("success");
        toast.success("Basvurunuz alindi! En kisa surede sizinle iletisime gececegiz.");
        form.reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("idle");
        toast.error("Bir hata olustu, lutfen tekrar deneyin.");
      }
    } catch {
      setStatus("idle");
      toast.error("Baglanti hatasi.");
    }
  };

  const isDark = variant === "dark";
  const inputClass = isDark
    ? "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-sm backdrop-blur-sm"
    : "w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-sm shadow-sm";
  const iconClass = isDark ? "text-white/40" : "text-gray-400";
  const labelClass = isDark ? "text-white/80" : "text-gray-700";

  return (
    <div>
      <div className="mb-6">
        <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"} sm:text-2xl`}>
          {title}
        </h3>
        <p className={`mt-1 text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
          {subtitle}
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
            Basvurunuz Alindi!
          </p>
          <p className={`mt-1 text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
            En kisa surede sizinle iletisime gececegiz.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={`block text-xs font-medium ${labelClass} mb-1`}>Ad Soyad *</label>
            <div className="relative">
              <User size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} />
              <input name="name" required placeholder="Adiniz Soyadiniz" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-medium ${labelClass} mb-1`}>Telefon *</label>
              <div className="relative">
                <Phone size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} />
                <input name="phone" type="tel" required placeholder="0500 000 00 00" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium ${labelClass} mb-1`}>E-posta</label>
              <div className="relative">
                <Mail size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`} />
                <input name="email" type="email" placeholder="ornek@mail.com" className={inputClass} />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium ${labelClass} mb-1`}>Mesajiniz</label>
            <div className="relative">
              <MessageSquare size={16} className={`absolute left-3 top-3 ${iconClass}`} />
              <textarea
                name="message"
                rows={3}
                placeholder="Hedefinizi veya sorularinizi kisa yazin..."
                className={`${inputClass} pl-10 resize-none`}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={status === "loading"}
            className={`w-full py-3 rounded-xl font-semibold text-sm ${
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
            {status === "loading" ? "Gonderiliyor..." : "Ucretsiz Danismanlik Iste"}
          </Button>
        </form>
      )}
    </div>
  );
}
