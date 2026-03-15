"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, BookOpen, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/supabase/types";

const categories = [
  "all",
  "nutrition",
  "sports",
  "thyroid",
  "motivation",
  "recipes",
  "herbalife",
] as const;

const ITEMS_PER_PAGE = 9;

export default function BlogPage() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      setPosts((data as BlogPost[]) || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const getTitle = (p: BlogPost) => locale === "en" && p.title_en ? p.title_en : p.title_tr;
  const getExcerpt = (p: BlogPost) => locale === "en" && p.excerpt_en ? p.excerpt_en : p.excerpt_tr;

  const filtered = posts.filter((p) => {
    const matchCategory = activeCategory === "all" || p.category === activeCategory;
    const title = getTitle(p);
    const excerpt = getExcerpt(p) || "";
    const matchSearch = searchQuery.trim()
      ? title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(locale === "en" ? "en-US" : "tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        {/* Search */}
        <div className="mt-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
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

        {/* Category Filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={
                activeCategory === cat
                  ? "bg-brand-green hover:bg-brand-green-dark text-white"
                  : "border-brand-green/30 text-brand-green hover:bg-brand-green/10"
              }
            >
              {t(`categories.${cat}`)}
            </Button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="mt-12 flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center py-20">
            <BookOpen className="h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">
              {searchQuery ? t("noResults") : t("noPosts")}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}>
                    <Card className="group h-full overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
                      <div className="aspect-[16/9] bg-gradient-to-br from-brand-green/10 to-brand-orange/10 flex items-center justify-center overflow-hidden">
                        {post.cover_image ? (
                          <img src={post.cover_image} alt={getTitle(post)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <BookOpen className="h-12 w-12 text-brand-green/30" />
                        )}
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge
                            variant="secondary"
                            className="bg-brand-green/10 text-brand-green text-xs"
                          >
                            {t(`categories.${post.category}`)}
                          </Badge>
                          {post.read_time && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {post.read_time} {t("readTime")}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-brand-dark group-hover:text-brand-green transition-colors line-clamp-2">
                          {getTitle(post)}
                        </h3>
                        {getExcerpt(post) && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {getExcerpt(post)}
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {formatDate(post.published_at)}
                          </span>
                          <span className="inline-flex items-center text-sm font-medium text-brand-green">
                            {t("readMore")}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-brand-green text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
