"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FeaturedProduct {
  id: string;
  slug: string;
  name_tr: string;
  price: number;
  image_url: string | null;
  category_id: string | null;
  categories: { name_tr: string }[] | { name_tr: string } | null;
}

export default function ProductsPreview() {
  const t = useTranslations("products");
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Touch/drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("id, slug, name_tr, price, image_url, category_id, categories(name_tr)")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(12);
      setProducts((data as FeaturedProduct[]) || []);
    };
    fetchFeatured();
  }, []);

  // Responsive: items per view
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerView(1);
      else if (width < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    },
    [currentIndex, maxIndex]
  );

  const goNext = useCallback(() => {
    if (currentIndex >= maxIndex) {
      goTo(0);
    } else {
      goTo(currentIndex + 1);
    }
  }, [currentIndex, maxIndex, goTo]);

  const goPrev = useCallback(() => {
    if (currentIndex <= 0) {
      goTo(maxIndex);
    } else {
      goTo(currentIndex - 1);
    }
  }, [currentIndex, maxIndex, goTo]);

  // Auto-play
  useEffect(() => {
    if (products.length <= itemsPerView || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(goNext, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [products.length, itemsPerView, isPaused, goNext]);

  // Touch handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragOffset(0);
    setIsPaused(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragOffset(clientX - dragStartX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 50;
    if (dragOffset < -threshold) goNext();
    else if (dragOffset > threshold) goPrev();
    setDragOffset(0);
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Dot indicators
  const totalDots = maxIndex + 1;

  if (products.length === 0) return null;

  const slideWidth = 100 / itemsPerView;
  const translateX = -(currentIndex * slideWidth) + (isDragging ? (dragOffset / (trackRef.current?.offsetWidth || 1)) * 100 : 0);

  return (
    <section className="py-20 bg-brand-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
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

        {/* Carousel */}
        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation arrows */}
          {products.length > itemsPerView && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-brand-green hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 sm:-translate-x-5"
                aria-label="Onceki"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-brand-green hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 sm:translate-x-5"
                aria-label="Sonraki"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Track */}
          <div className="overflow-hidden py-4 -my-4">
            <div
              ref={trackRef}
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(${translateX}%)`,
                transition: isDragging ? "none" : "transform 500ms cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={() => { if (isDragging) handleDragEnd(); }}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${slideWidth}%` }}
                >
                  <Link href={{ pathname: "/magaza/[slug]", params: { slug: product.slug } }}>
                    <Card className="group/card h-full overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 select-none">
                      <div className="aspect-square bg-gradient-to-br from-brand-green/10 to-brand-orange/10 p-6 overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name_tr}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover/card:scale-110"
                            draggable={false}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-16 w-16 text-brand-green/30" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        {product.categories && (
                          <span className="inline-block mb-2 px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green text-xs font-medium">
                            {Array.isArray(product.categories)
                              ? product.categories[0]?.name_tr
                              : product.categories.name_tr}
                          </span>
                        )}
                        <h3 className="font-semibold text-brand-dark group-hover/card:text-brand-green transition-colors line-clamp-2">
                          {product.name_tr}
                        </h3>
                        <p className="mt-2 text-lg font-bold text-brand-green">
                          {Number(product.price).toLocaleString("tr-TR")} TL
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {totalDots > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalDots }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-6 bg-brand-green"
                      : "w-2 bg-brand-green/25 hover:bg-brand-green/50"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile CTA */}
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
