"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ArrowRight, Trash2, Minus, Plus } from "lucide-react";

// Mock cart - will be managed with state management later
const mockCart = [
  { id: "1", name: "Formula 1 Shake Karışımı", price: 899, quantity: 1 },
  { id: "3", name: "Herbal Konsantre Çay", price: 549, quantity: 2 },
];

export default function CartPage() {
  const t = useTranslations("cart");
  const items = mockCart;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-brand-dark">{t("title")}</h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center py-20"
          >
            <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground/20" />
            <p className="mt-4 text-lg text-muted-foreground">{t("empty")}</p>
            <Link href="/magaza">
              <Button className="mt-6 bg-brand-green hover:bg-brand-green-dark text-white">
                {t("continueShopping")}
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-20 w-20 rounded-lg bg-brand-green/10 flex items-center justify-center shrink-0">
                        <ShoppingBag className="h-8 w-8 text-brand-green/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-brand-dark truncate">
                          {item.name}
                        </h3>
                        <p className="text-brand-green font-bold">
                          {item.price.toLocaleString("tr-TR")} TL
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-dark">
                          {(item.price * item.quantity).toLocaleString("tr-TR")}{" "}
                          TL
                        </p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="mt-2 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-brand-dark mb-4">
                    Sipariş Özeti
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.name} x{item.quantity}
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
                    <span className="text-lg font-semibold">{t("total")}</span>
                    <span className="text-lg font-bold text-brand-green">
                      {total.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                  <Link href="/odeme">
                    <Button className="mt-6 w-full bg-brand-green hover:bg-brand-green-dark text-white">
                      {t("checkout")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
