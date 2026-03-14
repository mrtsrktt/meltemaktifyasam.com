"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  slug: string;
  name_tr: string;
  price: number;
  category: string;
  image_url: string | null;
}

const categories = [
  { key: "all", value: "all" },
  { key: "weightManagement", value: "weight_management" },
  { key: "sportNutrition", value: "sport_nutrition" },
  { key: "vitaminMineral", value: "vitamin_mineral" },
];

export default function ProductGrid({ products }: { products: Product[] }) {
  const t = useTranslations("products");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={activeCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.value)}
            className={
              activeCategory === cat.value
                ? "bg-brand-green hover:bg-brand-green-dark text-white"
                : "border-brand-green/30 text-brand-green hover:bg-brand-green/10"
            }
          >
            {cat.key === "all" ? t("allCategories") : t(cat.key)}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          Bu kategoride henüz ürün bulunmuyor.
        </div>
      )}
    </div>
  );
}
