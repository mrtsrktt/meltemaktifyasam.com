"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface BlogPost {
  id: string;
  slug: string;
  title_tr: string;
  excerpt_tr: string | null;
  cover_image: string | null;
  category: string | null;
  read_time: number | null;
  published_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  nutrition: "Fonksiyonel Beslenme",
  sports: "Sporcu Beslenmesi",
  thyroid: "Tiroit & Kronik Hastalik",
  motivation: "Motivasyon & Zihin",
  recipes: "Tarifler",
  herbalife: "Herbalife",
};

export default function BlogPreview() {
  const t = useTranslations("blog");
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("blog_posts")
        .select(
          "id, slug, title_tr, excerpt_tr, cover_image, category, read_time, published_at"
        )
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      setPosts((data as BlogPost[]) || []);
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-brand-green to-brand-green-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Son Yazilar</h2>
            <p className="mt-1 text-sm text-white/70">
            {t("subtitle")}
          </p>
          </div>
          <Link href="/blog" className="hidden sm:block">
            <Button
              size="sm"
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-medium"
            >
              Tumu
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </motion.div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <Link
                href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
              >
                <div className="group h-full bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  {/* Cover Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title_tr}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-green/10 to-brand-orange/10">
                        <BookOpen className="h-12 w-12 text-brand-green/30" />
                      </div>
                    )}
                    {/* Category Badge */}
                    {post.category && CATEGORY_LABELS[post.category] && (
                      <span className="absolute top-3 left-3 inline-block px-3 py-1 rounded-full bg-brand-green text-white text-xs font-semibold shadow">
                        {CATEGORY_LABELS[post.category]}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-green transition-colors line-clamp-2">
                      {post.title_tr}
                    </h3>
                    {post.excerpt_tr && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt_tr}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      {post.read_time && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {post.read_time} dk
                        </span>
                      )}
                      <span className="text-sm font-semibold text-brand-green group-hover:underline ml-auto">
                        Devamini Oku
                        <ArrowRight className="inline ml-1 h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/blog">
            <Button
              size="sm"
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20"
            >
              Tum Yazilari Gor
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
