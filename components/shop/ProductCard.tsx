"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Check } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";

interface Product {
  id: string;
  slug: string;
  name_tr: string;
  price: number;
  category: string;
  image_url: string | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("products");
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      slug: product.slug,
      name_tr: product.name_tr,
      price: Number(product.price),
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const categoryLabel =
    product.category === "weight_management"
      ? t("weightManagement")
      : product.category === "sport_nutrition"
      ? t("sportNutrition")
      : t("vitaminMineral");

  return (
    <Card className="group h-full overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
      <Link href={{ pathname: "/magaza/[slug]", params: { slug: product.slug } }}>
        <div className="aspect-square bg-gradient-to-br from-brand-green/10 to-brand-orange/10 p-6 overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name_tr} className="w-full h-full object-contain transition-transform group-hover:scale-110" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-brand-green/30 transition-transform group-hover:scale-110" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Badge variant="secondary" className="mb-2 bg-brand-green/10 text-brand-green text-xs">
          {categoryLabel}
        </Badge>
        <Link href={{ pathname: "/magaza/[slug]", params: { slug: product.slug } }}>
          <h3 className="font-semibold text-brand-dark group-hover:text-brand-green transition-colors">
            {product.name_tr}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-brand-green">
            {Number(product.price).toLocaleString("tr-TR")} TL
          </p>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="bg-brand-green hover:bg-brand-green-dark text-white"
          >
            {added ? (
              <><Check className="mr-1 h-3 w-3" /> Eklendi</>
            ) : (
              <><Plus className="mr-1 h-3 w-3" /> {t("addToCart")}</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
