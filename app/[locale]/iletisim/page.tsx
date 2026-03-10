"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
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
  Phone,
  Send,
  Loader2,
  Check,
} from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905XXXXXXXXX";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate form submission
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                {status === "success" ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                      <Check className="h-8 w-8 text-brand-green" />
                    </div>
                    <h3 className="text-xl font-semibold text-brand-dark">
                      {t("success")}
                    </h3>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name">{t("name")}</Label>
                        <Input id="name" required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email">{t("email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input id="phone" type="tel" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="message">{t("message")}</Label>
                      <Textarea
                        id="message"
                        required
                        rows={5}
                        className="mt-1"
                      />
                    </div>
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
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* WhatsApp */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4"
                >
                  <div className="rounded-xl bg-[#25D366]/10 p-3">
                    <MessageCircle className="h-6 w-6 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark">
                      {t("whatsapp")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Hızlı yanıt için WhatsApp&apos;tan yazın
                    </p>
                  </div>
                </a>
              </CardContent>
            </Card>

            {/* Instagram */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <a
                  href="https://instagram.com/meltem.tanik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4"
                >
                  <div className="rounded-xl bg-pink-500/10 p-3">
                    <Instagram className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark">Instagram</h3>
                    <p className="text-sm text-muted-foreground">
                      @meltem.tanik
                    </p>
                  </div>
                </a>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-brand-green/10 p-3">
                    <Mail className="h-6 w-6 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark">E-posta</h3>
                    <p className="text-sm text-muted-foreground">
                      info@meltemaktifyasam.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-brand-orange/10 p-3">
                    <Clock className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark">
                      {t("hours")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("hoursDetail")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
