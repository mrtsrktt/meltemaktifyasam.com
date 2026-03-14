"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
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

export default function BlogPage() {
  const t = useTranslations("blog");
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  const filtered =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

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
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        {/* Category Filter */}
        <div className="mt-8 flex flex-wrap gap-2">
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
            <p className="mt-4 text-muted-foreground">Henüz yazı yayınlanmadı</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
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
                        <img src={post.cover_image} alt={post.title_tr} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="h-12 w-12 text-brand-green/30" />
                      )}
                    </div>
                    <CardContent className="p-6">
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
                      <h3 className="text-lg font-semibold text-brand-dark group-hover:text-brand-green transition-colors">
                        {post.title_tr}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt_tr}
                      </p>
                      <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-green">
                        {t("readMore")}
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
