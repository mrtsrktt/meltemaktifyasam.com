"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowRight } from "lucide-react";

// Placeholder products until Supabase is connected
const mockProducts = [
  {
    id: "1",
    slug: "formula-1-shake",
    name_tr: "Formula 1 Shake Karışımı",
    name_en: "Formula 1 Shake Mix",
    price: 899.0,
    category: "weight_management",
    image_url: null,
  },
  {
    id: "2",
    slug: "protein-bar",
    name_tr: "Protein Bar",
    name_en: "Protein Bar",
    price: 349.0,
    category: "sport_nutrition",
    image_url: null,
  },
  {
    id: "3",
    slug: "herbal-cay",
    name_tr: "Herbal Konsantre Çay",
    name_en: "Herbal Concentrate Tea",
    price: 549.0,
    category: "weight_management",
    image_url: null,
  },
  {
    id: "4",
    slug: "aloe-vera",
    name_tr: "Aloe Vera İçeceği",
    name_en: "Aloe Vera Drink",
    price: 699.0,
    category: "vitamin_mineral",
    image_url: null,
  },
];

export default function ProductsPreview() {
  const t = useTranslations("products");

  return (
    <section className="py-20 bg-brand-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold text-brand-dark sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <Link href="/magaza" className="hidden sm:block">
            <Button variant="ghost" className="text-brand-green hover:text-brand-green-dark">
              {t("viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={{ pathname: "/magaza/[slug]", params: { slug: product.slug } }}>
                <Card className="group h-full overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="aspect-square bg-gradient-to-br from-brand-green/10 to-brand-orange/10 p-6">
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-brand-green/30" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2 bg-brand-green/10 text-brand-green text-xs">
                      {product.category === "weight_management"
                        ? t("weightManagement")
                        : product.category === "sport_nutrition"
                        ? t("sportNutrition")
                        : t("vitaminMineral")}
                    </Badge>
                    <h3 className="font-semibold text-brand-dark group-hover:text-brand-green transition-colors">
                      {product.name_tr}
                    </h3>
                    <p className="mt-2 text-lg font-bold text-brand-green">
                      {product.price.toLocaleString("tr-TR")} TL
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/magaza">
            <Button className="bg-brand-green hover:bg-brand-green-dark text-white">
              {t("viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
