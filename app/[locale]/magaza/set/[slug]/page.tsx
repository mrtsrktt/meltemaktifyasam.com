"use client";

import { useEffect, useState, use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  ArrowLeft,
  ShoppingCart,
  Check,
  Tag,
  Sparkles,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";

interface SetProduct {
  id: string;
  slug: string;
  name_tr: string;
  price: number;
  image_url: string | null;
}

interface SetDetail {
  id: string;
  name_tr: string;
  slug: string;
  description_tr: string | null;
  image_url: string | null;
  discount_percentage: number;
  discount_amount: number;
  product_set_items: {
    quantity: number;
    sort_order: number;
    products: SetProduct;
  }[];
}

export default function SetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("products");
  const [set, setSet] = useState<SetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedAll, setAddedAll] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("product_sets")
      .select(
        "id, name_tr, slug, description_tr, image_url, discount_percentage, discount_amount, product_set_items(quantity, sort_order, products(id, slug, name_tr, price, image_url))"
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single()
      .then(({ data }) => {
        if (data) {
          // Sort items by sort_order
          data.product_set_items?.sort(
            (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
          );
        }
        setSet(data as unknown as SetDetail | null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
      </div>
    );
  }

  if (!set) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <p className="mt-4 text-muted-foreground">Set bulunamadı</p>
        <Link href="/magaza">
          <Button className="mt-4 bg-brand-green hover:bg-brand-green-dark text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Magazaya Don
          </Button>
        </Link>
      </div>
    );
  }

  const items = set.product_set_items || [];
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.products?.price || 0) * (item.quantity || 1),
    0
  );

  let discountedPrice = totalPrice;
  if (set.discount_percentage > 0)
    discountedPrice *= 1 - Number(set.discount_percentage) / 100;
  if (set.discount_amount > 0)
    discountedPrice -= Number(set.discount_amount);
  discountedPrice = Math.max(0, discountedPrice);

  const savings = totalPrice - discountedPrice;
  const hasDiscount = savings > 0;

  const handleAddAllToCart = () => {
    // Set'i tek bir sepet ogesi olarak ekle (indirimli fiyatiyla)
    const firstImage = set.image_url || items.find((i) => i.products?.image_url)?.products?.image_url || null;
    addItem({
      id: set.id,
      slug: set.slug,
      name_tr: set.name_tr,
      price: discountedPrice,
      originalPrice: hasDiscount ? totalPrice : undefined,
      image_url: firstImage,
      type: "set",
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
    toast.success(`${set.name_tr} seti sepete eklendi`);
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/magaza"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-green transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Magazaya Don
        </Link>

        {/* Set Header */}
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          {/* Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            {hasDiscount && (
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="absolute -top-3 -right-3 z-20"
              >
                <div className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold shadow-xl shadow-red-500/25">
                  <Tag size={16} />
                  {Number(set.discount_percentage) > 0
                    ? `%${set.discount_percentage} Indirim`
                    : `-${Number(set.discount_amount).toLocaleString("tr-TR")} TL`}
                </div>
              </motion.div>
            )}

            {set.image_url ? (
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-orange-50 via-white to-red-50 border border-orange-100 flex items-center justify-center overflow-hidden">
                <img src={set.image_url} alt={set.name_tr} className="w-full h-full object-contain p-8" />
              </div>
            ) : items.length > 0 ? (
              <div className="rounded-3xl bg-gradient-to-br from-orange-50 via-white to-amber-50 border border-orange-100 p-6 sm:p-8 overflow-hidden">
                {/* Main featured product */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center mb-4"
                >
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-white shadow-lg p-4">
                    {items[0]?.products?.image_url ? (
                      <img src={items[0].products.image_url} alt={items[0].products?.name_tr || ""} className="w-full h-full object-contain" />
                    ) : (
                      <ShoppingBag className="w-full h-full text-orange-200 p-8" />
                    )}
                  </div>
                </motion.div>

                {/* Other products in a row */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {items.slice(1, 7).map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white shadow-md p-2 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                      {item.products?.image_url ? (
                        <img src={item.products.image_url} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <ShoppingBag className="w-full h-full text-orange-200 p-3" />
                      )}
                    </motion.div>
                  ))}
                  {items.length > 7 && (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                      +{items.length - 7}
                    </div>
                  )}
                </div>

                {/* Product count badge */}
                <div className="mt-4 flex justify-center">
                  <span className="text-xs font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    {items.length} urun bu sette
                  </span>
                </div>
              </div>
            ) : (
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
                <Sparkles size={64} className="text-orange-300" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold mb-4">
              <Sparkles size={14} />
              OZEL SET • {items.length} URUN
            </div>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {set.name_tr}
            </h1>

            {set.description_tr && (
              <p className="mt-4 text-gray-600 leading-relaxed text-lg">
                {set.description_tr}
              </p>
            )}

            {/* Pricing */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
              <div className="flex items-end justify-between">
                <div>
                  {hasDiscount && (
                    <p className="text-lg text-gray-400 line-through">
                      {totalPrice.toLocaleString("tr-TR")} TL
                    </p>
                  )}
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {discountedPrice.toLocaleString("tr-TR")} TL
                  </p>
                </div>
                {hasDiscount && (
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      {savings.toLocaleString("tr-TR")} TL tasarruf
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-6">
              <Button
                size="lg"
                onClick={handleAddAllToCart}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {addedAll ? (
                  <>
                    <Check className="mr-2 h-5 w-5" /> Tüm Ürünler Sepete Eklendi!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Seti Sepete Ekle
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Products in Set */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Set Icerigi ({items.length} Urun)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item, i) => {
              const product = item.products;
              if (!product) return null;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={{
                      pathname: "/magaza/[slug]",
                      params: { slug: product.slug },
                    }}
                  >
                    <Card className="group h-full overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
                      <div className="aspect-square bg-gradient-to-br from-brand-green/10 to-brand-orange/10 p-4 overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name_tr}
                            className="w-full h-full object-contain transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-12 w-12 text-brand-green/30" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-brand-green transition-colors line-clamp-2 text-sm">
                          {product.name_tr}
                        </h3>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-base font-bold text-brand-green">
                            {Number(product.price).toLocaleString("tr-TR")} TL
                          </p>
                          {item.quantity > 1 && (
                            <span className="text-xs text-gray-500">
                              x{item.quantity}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
