"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Check, Filter, X, Search } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import type { Category } from "@/lib/supabase/types";

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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const supabase = createClient();

    // Fetch categories
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setCategories(data);
      });

    // Fetch products with their category relations
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

  const handleSelectCategory = (catId: string | null) => {
    setSelectedCategory(catId);
    setMobileFilterOpen(false);
  };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Filter size={16} />
            Filtrele
          </button>
        </motion.div>

        <div className="mt-8 flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Kategoriler
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => handleSelectCategory(null)}
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
                      onClick={() => handleSelectCategory(cat.id)}
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

          {/* Mobile filter overlay */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Kategoriler</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                <nav className="space-y-1">
                  <button
                    onClick={() => handleSelectCategory(null)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                      selectedCategory === null
                        ? "bg-brand-green text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100"
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
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.id
                            ? "bg-brand-green text-white font-medium"
                            : "text-gray-600 hover:bg-gray-100"
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
            </div>
          )}

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

            {/* Active filter badge */}
            {selectedCategory && (
              <div className="flex items-center gap-2 mb-6">
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
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
  };

  const productCatNames = product.product_categories
    ?.map((pc) => categories.find((c) => c.id === pc.category_id)?.name_tr)
    .filter(Boolean);

  return (
    <Card className="group h-full overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
      <Link href={{ pathname: "/magaza/[slug]", params: { slug: product.slug } }}>
        <div className="aspect-square bg-gradient-to-br from-brand-green/10 to-brand-orange/10 p-6 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name_tr}
              className="w-full h-full object-contain transition-transform group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-brand-green/30 transition-transform group-hover:scale-110" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        {productCatNames && productCatNames.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {productCatNames.map((name, i) => (
              <span
                key={i}
                className="inline-block px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green text-xs font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        )}
        <Link href={{ pathname: "/magaza/[slug]", params: { slug: product.slug } }}>
          <h3 className="font-semibold text-brand-dark group-hover:text-brand-green transition-colors line-clamp-2">
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
