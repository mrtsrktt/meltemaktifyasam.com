"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Flame, Sparkles, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SetProduct {
  price: number;
  name_tr: string;
  image_url: string | null;
}

interface FeaturedSet {
  id: string;
  name_tr: string;
  slug: string;
  description_tr: string | null;
  image_url: string | null;
  discount_percentage: number;
  discount_amount: number;
  product_set_items: {
    quantity: number;
    products: SetProduct | null;
  }[];
}

export default function ProductSetsPreview() {
  const [sets, setSets] = useState<FeaturedSet[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("product_sets")
      .select(
        "id, name_tr, slug, description_tr, image_url, discount_percentage, discount_amount, product_set_items(quantity, products(price, name_tr, image_url))"
      )
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setSets(data as unknown as FeaturedSet[]);
      });
  }, []);

  if (sets.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-amber-50" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold mb-4"
          >
            <Flame size={16} className="animate-pulse" />
            KAMPANYA
            <Flame size={16} className="animate-pulse" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Size Ozel{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Setler
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Ozel olarak hazirlanan urun setleri ile hem tasarruf edin hem de saglikli yasama ilk adimi atin
          </p>
        </motion.div>

        {/* Sets Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((set, i) => {
            const totalPrice = (set.product_set_items || []).reduce((sum, item) => {
              return sum + (Number(item.products?.price || 0) * (item.quantity || 1));
            }, 0);

            let discountedPrice = totalPrice;
            if (set.discount_percentage > 0) discountedPrice *= (1 - set.discount_percentage / 100);
            if (set.discount_amount > 0) discountedPrice -= set.discount_amount;
            discountedPrice = Math.max(0, discountedPrice);

            const savings = totalPrice - discountedPrice;
            const hasDiscount = savings > 0;

            const productImages = (set.product_set_items || [])
              .map((item) => item.products?.image_url)
              .filter(Boolean)
              .slice(0, 4);

            return (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={{ pathname: "/magaza/[slug]", params: { slug: set.slug } }}>
                  <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-orange-100">
                    {/* Discount badge */}
                    {hasDiscount && (
                      <div className="absolute top-3 right-3 z-10">
                        <motion.div
                          animate={{ rotate: [0, -3, 3, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold shadow-lg"
                        >
                          <Tag size={14} />
                          {set.discount_percentage > 0
                            ? `%${set.discount_percentage} Indirim`
                            : `-${set.discount_amount.toLocaleString("tr-TR")} TL`}
                        </motion.div>
                      </div>
                    )}

                    {/* Image area */}
                    <div className="relative h-52 bg-gradient-to-br from-orange-100 via-amber-50 to-red-50 p-4 overflow-hidden">
                      {set.image_url ? (
                        <img
                          src={set.image_url}
                          alt={set.name_tr}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : productImages.length > 0 ? (
                        <div className="flex items-center justify-center h-full gap-2">
                          {productImages.map((img, j) => (
                            <div
                              key={j}
                              className="w-20 h-20 rounded-xl bg-white/80 p-1.5 shadow-sm transition-transform duration-300"
                              style={{ transform: `rotate(${(j - 1.5) * 5}deg)` }}
                            >
                              <img
                                src={img!}
                                alt=""
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Sparkles size={48} className="text-orange-300" />
                        </div>
                      )}

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                          {(set.product_set_items || []).length} Urun
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {set.name_tr}
                      </h3>

                      {set.description_tr && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {set.description_tr}
                        </p>
                      )}

                      {/* Pricing */}
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          {hasDiscount && (
                            <p className="text-sm text-gray-400 line-through">
                              {totalPrice.toLocaleString("tr-TR")} TL
                            </p>
                          )}
                          <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            {discountedPrice.toLocaleString("tr-TR")} TL
                          </p>
                        </div>
                        {hasDiscount && (
                          <div className="text-right">
                            <p className="text-xs text-green-600 font-semibold">
                              {savings.toLocaleString("tr-TR")} TL tasarruf
                            </p>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm transition-all group-hover:shadow-lg group-hover:shadow-orange-500/25">
                        <Sparkles size={16} />
                        Seti Incele
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
