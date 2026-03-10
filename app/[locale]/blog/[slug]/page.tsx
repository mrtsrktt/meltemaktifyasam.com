"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Calendar, BookOpen } from "lucide-react";
import { use } from "react";

const mockPosts: Record<string, {
  slug: string;
  title_tr: string;
  content_tr: string;
  category: string;
  readTime: number;
  published_at: string;
}> = {
  "fonksiyonel-beslenme-nedir": {
    slug: "fonksiyonel-beslenme-nedir",
    title_tr: "Fonksiyonel Beslenme Nedir? Temel İlkeler",
    content_tr: `Fonksiyonel beslenme, vücudun doğal iyileşme mekanizmalarını destekleyen, kişiye özel bir beslenme yaklaşımıdır.

Bu yaklaşımda, her bireyin biyokimyasal yapısı farklı olduğu kabul edilir ve beslenme programı buna göre şekillendirilir.

Fonksiyonel beslenmenin temel ilkeleri arasında bütünsel yaklaşım, bireysellik, besin kalitesi ve yaşam tarzı entegrasyonu yer alır.

Geleneksel beslenme anlayışından farklı olarak, fonksiyonel beslenme sadece kalori hesabına odaklanmaz. Besinlerin vücuttaki fonksiyonel etkilerini, hormon dengesini, bağırsak sağlığını ve inflamasyon düzeylerini de göz önünde bulundurur.`,
    category: "nutrition",
    readTime: 5,
    published_at: "2024-01-15",
  },
  "sporcu-beslenmesi-rehberi": {
    slug: "sporcu-beslenmesi-rehberi",
    title_tr: "Sporcu Beslenmesi: Kapsamlı Rehber",
    content_tr: `Sporcu beslenmesi, fiziksel performansı optimize etmek için kritik öneme sahiptir.

Egzersiz öncesi beslenme, antrenman sırasında enerji sağlar. Karbonhidrat ağırlıklı bir öğün, egzersizden 2-3 saat önce tüketilmelidir.

Egzersiz sonrası beslenme ise kas onarımı ve toparlanma için gereklidir. Protein ve karbonhidrat kombinasyonu, egzersizden sonraki 30-60 dakika içinde alınmalıdır.

Hidrasyon da sporcu beslenmesinin vazgeçilmez bir parçasıdır. Antrenman öncesi, sırası ve sonrasında yeterli sıvı alımı performansı doğrudan etkiler.`,
    category: "sports",
    readTime: 8,
    published_at: "2024-01-10",
  },
};

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("blog");
  const post = mockPosts[slug];

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
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.readTime} {t("readTime")}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(post.published_at).toLocaleDateString("tr-TR")}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl">
            {post.title_tr}
          </h1>

          {/* Cover Image Placeholder */}
          <div className="mt-8 aspect-[16/9] rounded-2xl bg-gradient-to-br from-brand-green/10 to-brand-orange/10 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-brand-green/20" />
          </div>

          <Separator className="my-8" />

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {post.content_tr.split("\n\n").map((paragraph, i) => (
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
