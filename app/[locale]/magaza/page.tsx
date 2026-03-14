"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Check, X, Search, ChevronLeft, ChevronRight, Tag, Sparkles, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";
import type { Category } from "@/lib/supabase/types";
import { useRef, useCallback } from "react";

interface ShopSet {
  id: string;
  name_tr: string;
  slug: string;
  description_tr: string | null;
  image_url: string | null;
  discount_percentage: number;
  discount_amount: number;
  product_set_items: {
    quantity: number;
    products: { price: number; image_url: string | null } | null;
  }[];
}

interface ShopProduct {
  id: string;
  slug: string;
  name_tr: string;
  price: number;
  image_url: string | null;
  product_categories: { category_id: string }[];
}

export default function ShopPage() {
  const t = useTranslations("products");
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sets, setSets] = useState<ShopSet[]>([]);
  const [setIndex, setSetIndex] = useState(0);
  const [setItemsPerView, setSetItemsPerView] = useState(3);

  useEffect(() => {
    const updatePerView = () => {
      setSetItemsPerView(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };
    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Fetch sets
    supabase
      .from("product_sets")
      .select("id, name_tr, slug, description_tr, image_url, discount_percentage, discount_amount, product_set_items(quantity, products(price, image_url))")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (data) setSets(data as unknown as ShopSet[]);
      });

    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setCategories(data);
      });

    supabase
      .from("products")
      .select("id, slug, name_tr, price, image_url, product_categories(category_id)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts((data as ShopProduct[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory
      ? p.product_categories?.some((pc) => pc.category_id === selectedCategory)
      : true;
    const matchesSearch = searchQuery.trim()
      ? p.name_tr.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (catId: string) =>
    products.filter((p) =>
      p.product_categories?.some((pc) => pc.category_id === catId)
    ).length;

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl">
            Herbalife Urunleri
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Mobile category tabs - always visible */}
        <div className="mt-6 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-brand-green text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tumunu Gor ({products.length})
            </button>
            {categories.map((cat) => {
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-brand-green text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.name_tr} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Sets Slider */}
        {sets.length > 0 && (
          <SetsSlider sets={sets} setIndex={setIndex} setSetIndex={setSetIndex} itemsPerView={setItemsPerView} />
        )}

        <div className="mt-6 flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Kategoriler
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    selectedCategory === null
                      ? "bg-brand-green text-white font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span>Tum Urunler</span>
                  <span className={`text-xs ${selectedCategory === null ? "text-white/80" : "text-gray-400"}`}>
                    {products.length}
                  </span>
                </button>
                {categories.map((cat) => {
                  const count = getCategoryCount(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-brand-green text-white font-medium"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <span>{cat.name_tr}</span>
                      <span className={`text-xs ${selectedCategory === cat.id ? "text-white/80" : "text-gray-400"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Urun ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Active filter badge - desktop only */}
            {selectedCategory && (
              <div className="hidden lg:flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-500">Filtre:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-sm font-medium">
                  {categories.find((c) => c.id === selectedCategory)?.name_tr}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="hover:text-brand-green-dark"
                  >
                    <X size={14} />
                  </button>
                </span>
                <span className="text-sm text-gray-400">
                  ({filtered.length} urun)
                </span>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg">Bu kategoride henuz urun bulunmuyor.</p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <ProductCardShop product={product} categories={categories} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SetsSlider({
  sets,
  setIndex,
  setSetIndex,
  itemsPerView,
}: {
  sets: ShopSet[];
  setIndex: number;
  setSetIndex: (i: number) => void;
  itemsPerView: number;
}) {
  const maxIndex = Math.max(0, sets.length - itemsPerView);

  const goNext = () => setSetIndex(setIndex >= maxIndex ? 0 : setIndex + 1);
  const goPrev = () => setSetIndex(setIndex <= 0 ? maxIndex : setIndex - 1);

  const slideWidth = 100 / itemsPerView;
  const translateX = -(setIndex * slideWidth);

  // Auto-slide
  useEffect(() => {
    if (sets.length <= itemsPerView) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sets.length, itemsPerView, setIndex]);

  return (
    <div className="mt-8 mb-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl bg-gradient-to-r from-orange-50 via-red-50 to-amber-50 border border-orange-200/50 p-4 sm:p-5"
      >
        {/* Animated corner decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-red-200/20 to-transparent rounded-tr-full" />

        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            >
              <Sparkles size={22} className="text-orange-500" />
            </motion.div>
            <Link href="/magaza/setler" className="hover:opacity-80 transition-opacity">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Ozel Setler</h2>
              <p className="text-xs text-orange-600 font-medium flex items-center gap-1">Tum setleri gor <ArrowRight size={12} /></p>
            </Link>
          </div>
          {sets.length > itemsPerView && (
            <div className="flex gap-2">
              <button
                onClick={goPrev}
                className="w-8 h-8 rounded-full bg-white shadow-sm border border-orange-200 flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={goNext}
                className="w-8 h-8 rounded-full bg-white shadow-sm border border-orange-200 flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${translateX}%)` }}
          >
          {sets.map((set) => {
            const totalPrice = (set.product_set_items || []).reduce((sum, item) => {
              return sum + (Number(item.products?.price || 0) * (item.quantity || 1));
            }, 0);

            let discountedPrice = totalPrice;
            if (Number(set.discount_percentage) > 0) discountedPrice *= (1 - Number(set.discount_percentage) / 100);
            if (Number(set.discount_amount) > 0) discountedPrice -= Number(set.discount_amount);
            discountedPrice = Math.max(0, discountedPrice);

            const hasDiscount = totalPrice - discountedPrice > 0;

            const productImages = (set.product_set_items || [])
              .map((item) => item.products?.image_url)
              .filter(Boolean)
              .slice(0, 3);

            return (
              <div
                key={set.id}
                className="flex-shrink-0 px-2"
                style={{ width: `${slideWidth}%` }}
              >
                <Link href={{ pathname: "/magaza/set/[slug]", params: { slug: set.slug } }}>
                  <div className="group relative rounded-xl overflow-hidden bg-white border border-orange-200/60 hover:shadow-xl hover:border-orange-300 transition-all hover:-translate-y-1">
                    {hasDiscount && (
                      <motion.div
                        animate={{
                          scale: [1, 1.15, 1],
                          rotate: [0, -5, 5, -3, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
                        className="absolute top-2 right-2 z-10"
                      >
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold shadow-lg shadow-red-500/30 ring-2 ring-white/50">
                          <Tag size={12} />
                          {Number(set.discount_percentage) > 0
                            ? `%${set.discount_percentage}`
                            : `-${Number(set.discount_amount).toLocaleString("tr-TR")} TL`}
                        </span>
                      </motion.div>
                    )}

                    <div className="h-36 sm:h-40 flex items-center justify-center p-3 gap-2 bg-gradient-to-br from-orange-50/50 to-amber-50/50">
                      {set.image_url ? (
                        <img src={set.image_url} alt={set.name_tr} className="h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                      ) : productImages.length > 0 ? (
                        productImages.map((img, j) => (
                          <div key={j} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white p-1.5 shadow-sm group-hover:shadow-md transition-shadow">
                            <img src={img!} alt="" className="w-full h-full object-contain" />
                          </div>
                        ))
                      ) : (
                        <Sparkles size={32} className="text-orange-300" />
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-1">
                        {set.name_tr}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        {hasDiscount && (
                          <span className="text-xs text-gray-400 line-through decoration-red-400">
                            {totalPrice.toLocaleString("tr-TR")} TL
                          </span>
                        )}
                        <span className="text-lg font-extrabold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                          {discountedPrice.toLocaleString("tr-TR")} TL
                        </span>
                      </div>
                      {hasDiscount && (
                        <p className="text-[11px] text-green-600 font-semibold mt-0.5">
                          {(totalPrice - discountedPrice).toLocaleString("tr-TR")} TL kazanc
                        </p>
                      )}
                    </div>

                    {/* Shimmer on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        </div>

        {/* Dots */}
        {sets.length > itemsPerView && (
          <div className="flex justify-center gap-1.5 mt-3">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSetIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === setIndex ? "w-5 bg-orange-500" : "w-1.5 bg-orange-300/40"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ProductCardShop({
  product,
  categories,
}: {
  product: ShopProduct;
  categories: Category[];
}) {
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
    toast.success(`${product.name_tr} sepete eklendi`);
  };

  const productCatNames = product.product_categories
    ?.map((pc) => categories.find((c) => c.id === pc.category_id)?.name_tr)
    .filter(Boolean);

  return (
    <Card className="group h-full overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
      <Link href={{ pathname: "/magaza/[slug]", params: { slug: product.slug } }}>
        <div className="aspect-square bg-gradient-to-br from-brand-green/10 to-brand-orange/10 p-4 sm:p-6 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name_tr}
              className="w-full h-full object-contain transition-transform group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-brand-green/30 transition-transform group-hover:scale-110" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-3 sm:p-4">
        {productCatNames && productCatNames.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5">
            {productCatNames.map((name, i) => (
              <span
                key={i}
                className="inline-block px-1.5 py-0.5 rounded-full bg-brand-green/10 text-brand-green text-[10px] sm:text-xs font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        )}
        <Link href={{ pathname: "/magaza/[slug]", params: { slug: product.slug } }}>
          <h3 className="font-semibold text-brand-dark group-hover:text-brand-green transition-colors line-clamp-2 text-sm sm:text-base">
            {product.name_tr}
          </h3>
        </Link>
        <div className="mt-2 sm:mt-3 flex items-center justify-between">
          <p className="text-base sm:text-lg font-bold text-brand-green">
            {Number(product.price).toLocaleString("tr-TR")} TL
          </p>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="bg-brand-green hover:bg-brand-green-dark text-white text-xs sm:text-sm px-2 sm:px-3"
          >
            {added ? (
              <><Check className="mr-1 h-3 w-3" /> Eklendi</>
            ) : (
              <><Plus className="mr-1 h-3 w-3" /> <span className="hidden sm:inline">{t("addToCart")}</span><span className="sm:hidden">Ekle</span></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
