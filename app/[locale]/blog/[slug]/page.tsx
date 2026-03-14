"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Calendar, BookOpen } from "lucide-react";
import { use, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/supabase/types";

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("blog");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      setPost(data as BlogPost | null);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center">
        <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/30" />
        <p className="mt-4 text-muted-foreground">Yazı bulunamadı</p>
        <Link
          href="/blog"
          className="mt-4 inline-flex items-center text-brand-green"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("title")}
        </Link>
      </div>
    );
  }

  return (
    <article className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-green transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("title")}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-brand-green/10 text-brand-green">
              {t(`categories.${post.category}`)}
            </Badge>
            {post.read_time && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {post.read_time} {t("readTime")}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(post.published_at).toLocaleDateString("tr-TR")}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl">
            {post.title_tr}
          </h1>

          {/* Cover Image */}
          <div className="mt-8 aspect-[16/9] rounded-2xl bg-gradient-to-br from-brand-green/10 to-brand-orange/10 flex items-center justify-center overflow-hidden">
            {post.cover_image ? (
              <img src={post.cover_image} alt={post.title_tr} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="h-16 w-16 text-brand-green/20" />
            )}
          </div>

          <Separator className="my-8" />

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {(post.content_tr || "").split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </article>
  );
}
