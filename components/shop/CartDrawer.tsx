"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";

// Cart will be managed with context/zustand later.
// This is a UI-only component for now.

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  items?: CartItem[];
  children: React.ReactNode;
}

export default function CartDrawer({ items = [], children }: CartDrawerProps) {
  const t = useTranslations("cart");
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-heading">
            <ShoppingBag className="h-5 w-5 text-brand-green" />
            {t("title")}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">{t("empty")}</p>
            <Link href="/magaza">
              <Button
                variant="outline"
                className="border-brand-green text-brand-green"
              >
                {t("continueShopping")}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <div className="h-16 w-16 rounded-lg bg-brand-green/10 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-brand-green/30" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-sm text-brand-green font-semibold">
                      {item.price.toLocaleString("tr-TR")} TL
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">{t("total")}</span>
                <span className="text-lg font-bold text-brand-green">
                  {total.toLocaleString("tr-TR")} TL
                </span>
              </div>
              <Link href="/odeme">
                <Button className="w-full bg-brand-green hover:bg-brand-green-dark text-white">
                  {t("checkout")}
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
