"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Play, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface InstaPost {
  id: string;
  image_url: string;
  post_url: string;
  caption: string | null;
  is_reel: boolean;
}

function PostCard({ post }: { post: InstaPost }) {
  return (
    <div className="flex-shrink-0 w-full">
      <a
        href={post.post_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative aspect-square block overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow"
      >
        <Image
          src={post.image_url}
          alt={post.caption || "Instagram post"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
        />
        {post.is_reel && (
          <div className="absolute top-2.5 right-2.5 bg-black/50 rounded-full p-1.5 backdrop-blur-sm shadow-lg">
            <Play className="h-3.5 w-3.5 text-white fill-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          {post.is_reel ? (
            <Play className="h-12 w-12 text-white fill-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          ) : (
            <Heart className="h-8 w-8 text-white fill-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 group-hover:ring-pink-400/30 transition-all" />
      </a>
      {post.caption && (
        <p className="text-xs text-gray-500 leading-snug line-clamp-2 text-center mt-2 px-1">
          {post.caption}
        </p>
      )}
    </div>
  );
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("instagram_posts")
      .select("id, image_url, post_url, caption, is_reel")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(12)
      .then(({ data }) => {
        if (data) setPosts(data);
      });
  }, []);

  // Desktop: 5+ posts → slide, showing 5 at a time
  // Mobile: 3+ posts → slide, showing 2 at a time
  const desktopSlide = posts.length >= 5;
  const mobileSlide = posts.length > 2;
  const needsSlide = desktopSlide || mobileSlide;

  const maxIndexDesktop = desktopSlide ? posts.length - 5 : 0;
  const maxIndexMobile = mobileSlide ? posts.length - 2 : 0;

  const goNext = useCallback(() => {
    setCurrent((prev) => {
      // Use the larger maxIndex to allow full sliding on both
      const max = Math.max(maxIndexDesktop, maxIndexMobile);
      return prev >= max ? 0 : prev + 1;
    });
  }, [maxIndexDesktop, maxIndexMobile]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => {
      const max = Math.max(maxIndexDesktop, maxIndexMobile);
      return prev <= 0 ? max : prev - 1;
    });
  }, [maxIndexDesktop, maxIndexMobile]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!needsSlide) return;
    intervalRef.current = setInterval(goNext, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [needsSlide, goNext]);

  const resetAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, 3000);
  };

  if (posts.length === 0) return null;

  // For non-sliding: just show all posts in a grid
  if (!needsSlide) {
    return (
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50" />
        <div className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Header />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <CTAButton />
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50" />
      <div className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header />

        {/* Slider */}
        <div className="relative">
          {/* Navigation arrows */}
          <button
            onClick={() => { goPrev(); resetAutoSlide(); }}
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => { goNext(); resetAutoSlide(); }}
            className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          <div className="overflow-hidden mx-4 sm:mx-0">
            <motion.div
              className="flex gap-3 sm:gap-4"
              animate={{ x: `calc(-${current} * (100% / 2 + 6px))` }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              style={{
                // Each card takes different widths based on screen
                // Mobile: 50% - gap, Desktop: 20% - gap
              }}
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-10px)] lg:w-[calc(20%-13px)]"
                >
                  <PostCard post={post} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); resetAutoSlide(); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-gradient-to-r from-pink-500 to-purple-500"
                    : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        <CTAButton />
      </div>
    </section>
  );
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-sm font-semibold px-5 py-2 mb-5 shadow-lg shadow-pink-200/50"
      >
        <Instagram className="h-4 w-4" />
        @meltem.tanik
      </motion.div>

      <h2 className="text-3xl font-bold text-brand-dark sm:text-4xl">
        Dönüşüm Hikayeleri{" "}
        <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Burada
        </span>{" "}
        <motion.span
          initial={{ rotate: 0 }}
          whileInView={{ rotate: [0, 14, -8, 14, 0] }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="inline-block"
        >
          ✨
        </motion.span>
      </h2>
      <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-lg">
        Her gün ilham veren tarifler, bilgi dolu içerikler ve gerçek dönüşüm hikayeleri paylaşıyoruz.
        Sen de ailemize katıl!
      </p>
    </motion.div>
  );
}

function CTAButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-10 text-center"
    >
      <a
        href="https://instagram.com/meltem.tanik"
        target="_blank"
        rel="noopener noreferrer"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-semibold px-8 py-3.5 shadow-lg shadow-pink-300/30 hover:shadow-pink-300/50 transition-shadow text-base"
        >
          <Instagram className="h-5 w-5" />
          Takip Et & İlham Al
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </a>
      <p className="mt-3 text-sm text-muted-foreground">
        <span className="font-medium text-gray-600">1.200+</span> kişi bizi takip ediyor
      </p>
    </motion.div>
  );
}
