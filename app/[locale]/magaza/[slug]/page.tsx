"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Check,
} from "lucide-react";
import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";
import type { Product } from "@/lib/supabase/types";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("products");
  const locale = useLocale();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      setProduct(data as Product | null);
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <p className="mt-4 text-muted-foreground">{t("productNotFound")}</p>
        <Link href="/magaza">
          <Button className="mt-4 bg-brand-green hover:bg-brand-green-dark text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("viewAll")}
          </Button>
        </Link>
      </div>
    );
  }

  const productName = locale === "en" && product.name_en ? product.name_en : product.name_tr;
  const productDescription = locale === "en" && product.description_en ? product.description_en : product.description_tr;
  const productBenefits = locale === "en" && product.benefits_en ? product.benefits_en : product.benefits_tr;
  const productUsage = locale === "en" && product.usage_en ? product.usage_en : product.usage_tr;

  const categoryLabel =
    product.category === "weight_management"
      ? t("weightManagement")
      : product.category === "sport_nutrition"
      ? t("sportNutrition")
      : t("vitaminMineral");

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        slug: product.slug,
        name_tr: product.name_tr,
        price: Number(product.price),
        image_url: product.image_url,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    toast.success(`${productName} ${t("addedToCart")} (${quantity})`);
  };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/magaza"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-green transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("viewAll")}
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square rounded-3xl bg-gradient-to-br from-brand-green/10 to-brand-orange/10 flex items-center justify-center overflow-hidden"
          >
            {product.image_url ? (
              <img src={product.image_url} alt={productName} className="w-full h-full object-contain p-8" />
            ) : (
              <ShoppingBag className="h-32 w-32 text-brand-green/20" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge className="mb-4 bg-brand-green/10 text-brand-green">
              {categoryLabel}
            </Badge>
            <h1 className="text-3xl font-bold text-brand-dark">
              {productName}
            </h1>
            <p className="mt-2 text-3xl font-bold text-brand-green">
              {Number(product.price).toLocaleString("tr-TR")} TL
            </p>

            <Separator className="my-6" />

            {productDescription && (
              <div>
                <h3 className="font-semibold text-brand-dark mb-3">
                  {t("description")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {productDescription}
                </p>
              </div>
            )}

            {productBenefits && (
              <div className="mt-4">
                <h3 className="font-semibold text-brand-dark mb-2">{t("benefits")}</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {productBenefits}
                </p>
              </div>
            )}

            {productUsage && (
              <div className="mt-4">
                <h3 className="font-semibold text-brand-dark mb-2">{t("usage")}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {productUsage}
                </p>
              </div>
            )}

            <Separator className="my-6" />

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white"
              >
                {added ? (
                  <><Check className="mr-2 h-5 w-5" /> {t("added")}!</>
                ) : (
                  <><ShoppingCart className="mr-2 h-5 w-5" /> {t("addToCart")}</>
                )}
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {product.sku && `SKU: ${product.sku}`}
              {product.weight && ` • ${product.weight}`}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
