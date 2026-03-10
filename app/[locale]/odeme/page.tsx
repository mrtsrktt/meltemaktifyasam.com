"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, AlertTriangle } from "lucide-react";

export default function CheckoutPage() {
  const t = useTranslations("checkout");

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-brand-dark">{t("title")}</h1>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Shipping Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-brand-dark mb-6">
                  {t("shippingInfo")}
                </h2>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="fullName">{t("fullName")}</Label>
                      <Input id="fullName" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input id="phone" type="tel" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">{t("address")}</Label>
                    <Input id="address" className="mt-1" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="city">{t("city")}</Label>
                      <Input id="city" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="district">{t("district")}</Label>
                      <Input id="district" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">{t("zipCode")}</Label>
                      <Input id="zipCode" className="mt-1" />
                    </div>
                  </div>
                </div>

                {/* Payment Notice */}
                <div className="mt-8 rounded-xl bg-brand-orange/10 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-brand-orange">
                      {t("paymentNote")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ödeme altyapısı (iyzico/PayTR) entegre edildikten sonra
                      burada güvenli ödeme yapabileceksiniz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-brand-dark mb-4">
                  {t("orderSummary")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Formula 1 Shake x1
                    </span>
                    <span className="font-medium">899 TL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Herbal Çay x2
                    </span>
                    <span className="font-medium">1.098 TL</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between">
                  <span className="font-semibold">Toplam</span>
                  <span className="font-bold text-brand-green">1.997 TL</span>
                </div>
                <Button
                  disabled
                  className="mt-6 w-full bg-brand-green text-white"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {t("placeOrder")}
                </Button>
                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <CreditCard className="h-3 w-3" />
                  Güvenli ödeme altyapısı
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
