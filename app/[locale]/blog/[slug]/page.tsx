"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/supabase/types";

const CATEGORY_LABELS: Record<string, string> = {
  nutrition: "Fonksiyonel Beslenme",
  sports: "Sporcu Beslenmesi",
  thyroid: "Tiroit & Kronik Hastalik",
  motivation: "Motivasyon & Zihin",
  recipes: "Tarifler",
  herbalife: "Herbalife",
};

function renderMarkdown(text: string): string {
  let html = text
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-brand-dark mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-brand-dark mt-10 mb-4">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-brand-dark">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="w-full rounded-xl my-6 shadow-md" loading="lazy" />'
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-brand-green underline hover:text-brand-green-dark" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-muted-foreground leading-relaxed">$1</li>')
    .replace(/^---$/gm, '<hr class="my-8 border-gray-200" />');

  html = html.replace(
    /(<li[^>]*>.*?<\/li>\n?)+/g,
    (match) => `<ul class="my-4 space-y-1">${match}</ul>`
  );

  const lines = html.split("\n");
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push("");
      continue;
    }
    if (
      trimmed.startsWith("<h") ||
      trimmed.startsWith("<ul") ||
      trimmed.startsWith("<li") ||
      trimmed.startsWith("<img") ||
      trimmed.startsWith("<hr") ||
      trimmed.startsWith("</")
    ) {
      result.push(trimmed);
    } else {
      result.push(`<p class="text-muted-foreground leading-relaxed mb-4">${trimmed}</p>`);
    }
  }

  return result.join("\n");
}

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("blog");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevPost, setPrevPost] = useState<{ slug: string; title_tr: string } | null>(null);
  const [nextPost, setNextPost] = useState<{ slug: string; title_tr: string } | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

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

      if (data) {
        const [{ data: prev }, { data: next }] = await Promise.all([
          supabase
            .from("blog_posts")
            .select("slug, title_tr")
            .eq("is_published", true)
            .lt("published_at", data.published_at || data.created_at)
            .order("published_at", { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from("blog_posts")
            .select("slug, title_tr")
            .eq("is_published", true)
            .gt("published_at", data.published_at || data.created_at)
            .order("published_at", { ascending: true })
            .limit(1)
            .single(),
        ]);
        setPrevPost(prev as { slug: string; title_tr: string } | null);
        setNextPost(next as { slug: string; title_tr: string } | null);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title_tr || "";
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setShareOpen(false);
      return;
    }
    window.open(urls[platform], "_blank", "noopener,noreferrer");
    setShareOpen(false);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
        <p className="mt-4 text-muted-foreground">Yazi bulunamadi</p>
        <Link href="/blog">
          <Button className="mt-4 bg-brand-green hover:bg-brand-green-dark text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Blog&apos;a Don
          </Button>
        </Link>
      </div>
    );
  }

  const contentHtml = renderMarkdown(post.content_tr || "");

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-green transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Tum Yazilar
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-brand-green/10 text-brand-green border-0">
              {CATEGORY_LABELS[post.category] || post.category}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {post.read_time} dk okuma
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.published_at)}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl leading-tight">
            {post.title_tr}
          </h1>

          {/* Share */}
          <div className="mt-4 relative">
            <button
              onClick={() => setShareOpen(!shareOpen)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-green transition-colors"
            >
              <Share2 size={16} />
              Paylas
            </button>
            {shareOpen && (
              <div className="absolute top-8 left-0 z-10 bg-white rounded-xl shadow-lg border border-gray-200 p-2 flex gap-1">
                <button onClick={() => handleShare("whatsapp")} className="px-3 py-1.5 rounded-lg text-sm hover:bg-green-50 text-green-600">WhatsApp</button>
                <button onClick={() => handleShare("twitter")} className="px-3 py-1.5 rounded-lg text-sm hover:bg-blue-50 text-blue-500">Twitter</button>
                <button onClick={() => handleShare("facebook")} className="px-3 py-1.5 rounded-lg text-sm hover:bg-blue-50 text-blue-700">Facebook</button>
                <button onClick={() => handleShare("copy")} className="px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 text-gray-600">Link Kopyala</button>
              </div>
            )}
          </div>

          {/* Cover Image */}
          {post.cover_image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-8 rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={post.cover_image}
                alt={post.title_tr}
                className="w-full aspect-[16/9] object-cover"
              />
            </motion.div>
          )}

          {/* Content - Markdown rendered */}
          <div
            className="mt-10 max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </motion.article>

        {/* Prev/Next Navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-16 border-t border-gray-200 pt-8 grid grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={{ pathname: "/blog/[slug]", params: { slug: prevPost.slug } }}
                className="group flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-400 mt-0.5 group-hover:text-brand-green shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Onceki Yazi</p>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-brand-green line-clamp-2">{prevPost.title_tr}</p>
                </div>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link
                href={{ pathname: "/blog/[slug]", params: { slug: nextPost.slug } }}
                className="group flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-right justify-end"
              >
                <div>
                  <p className="text-xs text-gray-400 mb-1">Sonraki Yazi</p>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-brand-green line-clamp-2">{nextPost.title_tr}</p>
                </div>
                <ChevronRight size={20} className="text-gray-400 mt-0.5 group-hover:text-brand-green shrink-0" />
              </Link>
            ) : <div />}
          </div>
        )}
      </div>
    </section>
  );
}
