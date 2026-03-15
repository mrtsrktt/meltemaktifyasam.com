"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, Loader2, RotateCcw, CheckCircle } from "lucide-react";

interface VKIResult {
  bmi: number;
  category: string;
  categoryKey: string;
  color: string;
}

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905412523421";

function calculateBMI(weight: number, heightCm: number): VKIResult {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  if (rounded < 18.5) {
    return { bmi: rounded, category: "Zayıf", categoryKey: "underweight", color: "text-blue-500" };
  } else if (rounded < 25) {
    return { bmi: rounded, category: "Normal", categoryKey: "normal", color: "text-brand-green" };
  } else if (rounded < 30) {
    return { bmi: rounded, category: "Fazla Kilolu", categoryKey: "overweight", color: "text-brand-orange" };
  } else {
    return { bmi: rounded, category: "Obez", categoryKey: "obese", color: "text-red-500" };
  }
}

function getGaugeRotation(bmi: number): number {
  const clamped = Math.min(Math.max(bmi, 10), 45);
  return ((clamped - 10) / 35) * 180;
}

export default function VKIForm() {
  const t = useTranslations("vki");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    consent: true,
  });
  const [result, setResult] = useState<VKIResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);

    if (!height || !weight) {
      setLoading(false);
      return;
    }

    const vkiResult = calculateBMI(weight, height);

    try {
      await fetch("/api/vki", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bmi: vkiResult.bmi,
          bmi_category: vkiResult.category,
        }),
      });
    } catch {
      // Continue even if API fails
    }

    setTimeout(() => {
      setResult(vkiResult);
      setLoading(false);
    }, 1000);
  };

  const resetForm = () => {
    setResult(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      age: "",
      height: "",
      weight: "",
      goal: "",
      consent: true,
    });
  };

  const whatsappMessage = result
    ? encodeURIComponent(
        `Merhaba Meltem Hanım, VKİ analizimi yaptım. Adım ${formData.name}, VKİ değerim ${result.bmi}. Ücretsiz danışmanlık almak istiyorum.`
      )
    : "";

  return (
    <AnimatePresence mode="wait">
      {!result ? (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Banner */}
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 text-center">
            {t("banner")}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="age">{t("age")}</Label>
              <Input
                id="age"
                type="number"
                min="10"
                max="100"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="height">{t("height")}</Label>
              <Input
                id="height"
                type="number"
                min="100"
                max="250"
                step="0.1"
                required
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="weight">{t("weight")}</Label>
              <Input
                id="weight"
                type="number"
                min="30"
                max="300"
                step="0.1"
                required
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>{t("goal")}</Label>
            <Select
              value={formData.goal}
              onValueChange={(value) =>
                setFormData({ ...formData, goal: value ?? "" })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t("goalPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kilo_ver">{t("goals.loseWeight")}</SelectItem>
                <SelectItem value="form_koru">{t("goals.maintainWeight")}</SelectItem>
                <SelectItem value="kilo_al">{t("goals.gainMuscle")}</SelectItem>
                <SelectItem value="saglikli_beslenme">{t("goals.healthyEating")}</SelectItem>
                <SelectItem value="kronik_destek">{t("goals.chronicSupport")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="consent"
              checked={formData.consent}
              onChange={(e) =>
                setFormData({ ...formData, consent: e.target.checked })
              }
              className="rounded border-border"
            />
            <Label htmlFor="consent" className="text-sm font-normal">
              {t("consentLabel")}
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            {t("submitButton")}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            {t("privacyNote")}
          </p>
        </motion.form>
      ) : (
        <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-center space-y-6"
        >
          {/* BMI Gauge */}
          <div className="relative mx-auto w-64 h-32 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-32">
              <svg viewBox="0 0 200 100" className="w-full">
                <path
                  d="M 10 100 A 90 90 0 0 1 190 100"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path d="M 10 100 A 90 90 0 0 1 52 30" fill="none" stroke="#3B82F6" strokeWidth="12" strokeLinecap="round" />
                <path d="M 52 30 A 90 90 0 0 1 100 10" fill="none" stroke="#2ECC71" strokeWidth="12" strokeLinecap="round" />
                <path d="M 100 10 A 90 90 0 0 1 148 30" fill="none" stroke="#E67E22" strokeWidth="12" strokeLinecap="round" />
                <path d="M 148 30 A 90 90 0 0 1 190 100" fill="none" stroke="#EF4444" strokeWidth="12" strokeLinecap="round" />
                <motion.line
                  x1="100" y1="100" x2="100" y2="20"
                  stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: getGaugeRotation(result.bmi) - 90 }}
                  transition={{ duration: 1.5, type: "spring" }}
                  style={{ transformOrigin: "100px 100px" }}
                />
                <circle cx="100" cy="100" r="5" fill="#1A1A2E" />
              </svg>
            </div>
          </div>

          {/* BMI Score */}
          <div>
            <motion.p
              className={`text-5xl font-bold ${result.color}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {result.bmi}
            </motion.p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <CheckCircle className={`h-5 w-5 ${result.color}`} />
              <p className={`text-xl font-semibold ${result.color}`}>
                {t(`categories.${result.categoryKey}`)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {result.categoryKey === "normal"
                ? t("resultNormal")
                : t("resultOther")}
            </p>
          </div>

          {/* Success Message */}
          <Card className="border-0 shadow-md bg-green-50">
            <CardContent className="p-6">
              <p className="text-green-800 font-medium">
                {t("successMessage")}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white sm:w-auto"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {t("whatsappButton")}
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              onClick={resetForm}
              className="border-brand-green text-brand-green"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t("recalculate")}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
