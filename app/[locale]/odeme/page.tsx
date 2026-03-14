"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Lock,
  AlertTriangle,
  Loader2,
  Check,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/siparis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.get("fullName"),
          customer_email: formData.get("email"),
          customer_phone: formData.get("phone"),
          shipping_address: formData.get("address"),
          shipping_city: formData.get("city"),
          shipping_district: formData.get("district"),
          shipping_zip: formData.get("zipCode"),
          items: items.map((item) => ({
            product_id: item.id,
            name_tr: item.name_tr,
            quantity: item.quantity,
            unit_price: item.price,
          })),
          total_amount: total,
        }),
      });

      if (res.ok) {
        setStatus("success");
        clearCart();
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  };

  if (items.length === 0 && status !== "success") {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center py-20">
          <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground/20" />
          <p className="mt-4 text-lg text-muted-foreground">
            Sepetiniz boş
          </p>
          <Link href="/magaza">
            <Button className="mt-6 bg-brand-green hover:bg-brand-green-dark text-white">
              Mağazaya Git
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  if (status === "success") {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/10">
              <Check className="h-10 w-10 text-brand-green" />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark">
              Siparişiniz Alındı!
            </h2>
            <p className="mt-2 text-muted-foreground">
              En kısa sürede sizinle iletişime geçeceğiz.
            </p>
            <Link href="/magaza">
              <Button className="mt-6 bg-brand-green hover:bg-brand-green-dark text-white">
                Alışverişe Devam Et
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-brand-dark">{t("title")}</h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
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
                        <Input
                          id="fullName"
                          name="fullName"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">{t("address")}</Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <Label htmlFor="city">{t("city")}</Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">{t("district")}</Label>
                        <Input
                          id="district"
                          name="district"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">{t("zipCode")}</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          className="mt-1"
                        />
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
                        Siparişiniz WhatsApp üzerinden onaylanacak ve ödeme
                        detayları paylaşılacaktır.
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
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.name_tr} x{item.quantity}
                        </span>
                        <span className="font-medium">
                          {(item.price * item.quantity).toLocaleString("tr-TR")}{" "}
                          TL
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Toplam</span>
                    <span className="font-bold text-brand-green">
                      {total.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-6 w-full bg-brand-green hover:bg-brand-green-dark text-white"
                  >
                    {status === "loading" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    {t("placeOrder")}
                  </Button>
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <CreditCard className="h-3 w-3" />
                    Güvenli sipariş
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </form>
      </div>
    </section>
  );
}
