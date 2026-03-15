"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Play, Heart, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface InstaPost {
  id: string;
  image_url: string;
  post_url: string;
  caption: string | null;
  is_reel: boolean;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstaPost[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("instagram_posts")
      .select("id, image_url, post_url, caption, is_reel")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (data) setPosts(data);
      });
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50" />
      <div className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          {/* Instagram gradient badge */}
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

        {/* Posts Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
          {posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow"
            >
              <Image
                src={post.image_url}
                alt={post.caption || "Instagram post"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />

              {/* Reels play badge */}
              {post.is_reel && (
                <div className="absolute top-2.5 right-2.5 bg-black/50 rounded-full p-1.5 backdrop-blur-sm shadow-lg">
                  <Play className="h-3.5 w-3.5 text-white fill-white" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
                {post.is_reel ? (
                  <Play className="h-12 w-12 text-white fill-white drop-shadow-lg" />
                ) : (
                  <Heart className="h-8 w-8 text-white fill-white drop-shadow-lg" />
                )}
                {post.caption && (
                  <p className="absolute bottom-3 left-3 right-3 text-white text-xs truncate font-medium">
                    {post.caption}
                  </p>
                )}
              </div>

              {/* Subtle border glow */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 group-hover:ring-pink-400/30 transition-all" />
            </motion.a>
          ))}
        </div>

        {/* CTA */}
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
      </div>
    </section>
  );
}
