"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import ProductGrid from "@/components/shop/ProductGrid";

// Mock products - will be fetched from Supabase later
const mockProducts = [
  {
    id: "1",
    slug: "formula-1-shake",
    name_tr: "Formula 1 Shake Karışımı",
    name_en: "Formula 1 Shake Mix",
    price: 899.0,
    category: "weight_management",
    image_url: null,
    stock: 10,
  },
  {
    id: "2",
    slug: "protein-bar",
    name_tr: "Protein Bar",
    name_en: "Protein Bar",
    price: 349.0,
    category: "sport_nutrition",
    image_url: null,
    stock: 25,
  },
  {
    id: "3",
    slug: "herbal-cay",
    name_tr: "Herbal Konsantre Çay",
    name_en: "Herbal Concentrate Tea",
    price: 549.0,
    category: "weight_management",
    image_url: null,
    stock: 15,
  },
  {
    id: "4",
    slug: "aloe-vera",
    name_tr: "Aloe Vera İçeceği",
    name_en: "Aloe Vera Drink",
    price: 699.0,
    category: "vitamin_mineral",
    image_url: null,
    stock: 8,
  },
  {
    id: "5",
    slug: "protein-tozu",
    name_tr: "Protein Tozu",
    name_en: "Protein Powder",
    price: 1299.0,
    category: "sport_nutrition",
    image_url: null,
    stock: 12,
  },
  {
    id: "6",
    slug: "multivitamin",
    name_tr: "Multivitamin Kompleks",
    name_en: "Multivitamin Complex",
    price: 449.0,
    category: "vitamin_mineral",
    image_url: null,
    stock: 20,
  },
  {
    id: "7",
    slug: "formula-1-cikolata",
    name_tr: "Formula 1 Çikolata Aromalı",
    name_en: "Formula 1 Chocolate Flavor",
    price: 899.0,
    category: "weight_management",
    image_url: null,
    stock: 5,
  },
  {
    id: "8",
    slug: "omega-3",
    name_tr: "Omega-3 Balık Yağı",
    name_en: "Omega-3 Fish Oil",
    price: 599.0,
    category: "vitamin_mineral",
    image_url: null,
    stock: 18,
  },
];

export default function ShopPage() {
  const t = useTranslations("products");

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="mt-8">
          <ProductGrid products={mockProducts} />
        </div>
      </div>
    </section>
  );
}
