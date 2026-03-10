"use client";

import { useTranslations } from "next-intl";
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
} from "lucide-react";
import { useState, use } from "react";

// Mock product data
const allProducts: Record<string, {
  id: string;
  slug: string;
  name_tr: string;
  description_tr: string;
  price: number;
  category: string;
  stock: number;
}> = {
  "formula-1-shake": {
    id: "1",
    slug: "formula-1-shake",
    name_tr: "Formula 1 Shake Karışımı",
    description_tr:
      "Herbalife Formula 1, dengeli beslenmenizi destekleyen, protein bakımından zengin bir öğün yerine geçen shake karışımıdır. Her porsiyonda yüksek kaliteli soya proteini, lif, vitamin ve mineraller içerir.",
    price: 899.0,
    category: "weight_management",
    stock: 10,
  },
  "protein-bar": {
    id: "2",
    slug: "protein-bar",
    name_tr: "Protein Bar",
    description_tr:
      "Hareket halindeyken pratik bir protein kaynağı. Her barda 10g protein içerir. Egzersiz sonrası veya ara öğün olarak idealdir.",
    price: 349.0,
    category: "sport_nutrition",
    stock: 25,
  },
  "herbal-cay": {
    id: "3",
    slug: "herbal-cay",
    name_tr: "Herbal Konsantre Çay",
    description_tr:
      "Yeşil çay ve portakal pekoe çay karışımıyla hazırlanan düşük kalorili içecek. Metabolizmayı destekler ve enerji verir.",
    price: 549.0,
    category: "weight_management",
    stock: 15,
  },
  "aloe-vera": {
    id: "4",
    slug: "aloe-vera",
    name_tr: "Aloe Vera İçeceği",
    description_tr:
      "Aloe vera yaprağından elde edilen, sindirim sistemini destekleyen ferahlatıcı içecek. Günlük sıvı alımınızı artırmanın lezzetli yolu.",
    price: 699.0,
    category: "vitamin_mineral",
    stock: 8,
  },
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("products");
  const [quantity, setQuantity] = useState(1);

  const product = allProducts[slug];

  if (!product) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <p className="mt-4 text-muted-foreground">Ürün bulunamadı</p>
        <Link href="/magaza">
          <Button className="mt-4 bg-brand-green hover:bg-brand-green-dark text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("viewAll")}
          </Button>
        </Link>
      </div>
    );
  }

  const categoryLabel =
    product.category === "weight_management"
      ? t("weightManagement")
      : product.category === "sport_nutrition"
      ? t("sportNutrition")
      : t("vitaminMineral");

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/magaza"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-green transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("viewAll")}
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square rounded-3xl bg-gradient-to-br from-brand-green/10 to-brand-orange/10 flex items-center justify-center"
          >
            <ShoppingBag className="h-32 w-32 text-brand-green/20" />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge className="mb-4 bg-brand-green/10 text-brand-green">
              {categoryLabel}
            </Badge>
            <h1 className="text-3xl font-bold text-brand-dark">
              {product.name_tr}
            </h1>
            <p className="mt-2 text-3xl font-bold text-brand-green">
              {product.price.toLocaleString("tr-TR")} TL
            </p>

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold text-brand-dark mb-3">
                {t("description")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description_tr}
              </p>
            </div>

            <Separator className="my-6" />

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {t("addToCart")}
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Stok: {product.stock} adet
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
