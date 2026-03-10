"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check, Loader2 } from "lucide-react";

export default function NewsletterSection() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/bulten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-brand-green to-brand-green-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <Mail className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-white/80">{t("subtitle")}</p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0"
          >
            <Input
              type="email"
              placeholder={t("placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 flex-1 rounded-lg border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-white sm:rounded-r-none"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="h-12 bg-brand-orange hover:bg-brand-orange-dark text-white px-8 sm:rounded-l-none"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : status === "success" ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t("success")}
                </>
              ) : (
                t("button")
              )}
            </Button>
          </form>

          {status === "error" && (
            <p className="mt-3 text-sm text-red-200">{t("error")}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
