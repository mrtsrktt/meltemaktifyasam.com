"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

const mockPosts = [
  {
    slug: "fonksiyonel-beslenme-nedir",
    title_tr: "Fonksiyonel Beslenme Nedir? Temel İlkeler",
    excerpt_tr:
      "Fonksiyonel beslenme, vücudun doğal iyileşme mekanizmalarını destekleyen, kişiye özel bir beslenme yaklaşımıdır.",
    category: "nutrition",
    readTime: 5,
    published_at: "2024-01-15",
  },
  {
    slug: "sporcu-beslenmesi-rehberi",
    title_tr: "Sporcu Beslenmesi: Kapsamlı Rehber",
    excerpt_tr:
      "Egzersiz öncesi, sırası ve sonrası beslenme stratejileri ile performansınızı artırın.",
    category: "sports",
    readTime: 8,
    published_at: "2024-01-10",
  },
  {
    slug: "tiroit-ve-beslenme",
    title_tr: "Tiroit Hastalıkları ve Beslenme İlişkisi",
    excerpt_tr:
      "Hipotiroidizm ve hipertiroidizmde beslenmenin rolü, tüketilmesi ve kaçınılması gereken besinler.",
    category: "thyroid",
    readTime: 6,
    published_at: "2024-01-05",
  },
  {
    slug: "sabah-rutini-enerji",
    title_tr: "Enerjik Bir Güne Başlamak İçin 5 Sabah Rutini",
    excerpt_tr:
      "Güne enerji dolu başlamanın sırları: beslenme, hareket ve zihinsel hazırlık.",
    category: "motivation",
    readTime: 4,
    published_at: "2024-01-01",
  },
  {
    slug: "yesil-smoothie-tarifleri",
    title_tr: "5 Kolay ve Lezzetli Yeşil Smoothie Tarifi",
    excerpt_tr:
      "Herbalife Formula 1 ile hazırlayabileceğiniz pratik ve besleyici smoothie tarifleri.",
    category: "recipes",
    readTime: 3,
    published_at: "2023-12-28",
  },
  {
    slug: "herbalife-ile-kilo-yonetimi",
    title_tr: "Herbalife Ürünleri ile Kilo Yönetimi",
    excerpt_tr:
      "Herbalife beslenme programı ile sağlıklı ve sürdürülebilir kilo yönetimi nasıl yapılır?",
    category: "herbalife",
    readTime: 7,
    published_at: "2023-12-25",
  },
];

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

  const filtered =
    activeCategory === "all"
      ? mockPosts
      : mockPosts.filter((p) => p.category === activeCategory);

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
                  <div className="aspect-[16/9] bg-gradient-to-br from-brand-green/10 to-brand-orange/10 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-brand-green/30" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-brand-green/10 text-brand-green text-xs"
                      >
                        {t(`categories.${post.category}`)}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readTime} {t("readTime")}
                      </span>
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
      </div>
    </section>
  );
}
