"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/supabase/types";
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const CATEGORY_LABELS: Record<string, string> = {
  nutrition: "Fonksiyonel Beslenme",
  sports: "Sporcu Beslenmesi",
  thyroid: "Tiroit & Kronik Hastalik",
  motivation: "Motivasyon & Zihin",
  recipes: "Tarifler",
  herbalife: "Herbalife",
};

const CATEGORIES = Object.keys(CATEGORY_LABELS);

function turkishSlugify(text: string): string {
  const charMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };

  return text
    .toLowerCase()
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => charMap[match] || match)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function calculateReadTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [form, setForm] = useState({
    title_tr: "",
    title_en: "",
    excerpt_tr: "",
    excerpt_en: "",
    content_tr: "",
    content_en: "",
    category: "nutrition",
    is_published: false,
  });
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Yazi yuklenirken hata:", error);
        alert("Yazi bulunamadi.");
        router.push("/admin/blog");
        return;
      }

      setOriginalPost(data);
      setForm({
        title_tr: data.title_tr || "",
        title_en: data.title_en || "",
        excerpt_tr: data.excerpt_tr || "",
        excerpt_en: data.excerpt_en || "",
        content_tr: data.content_tr || "",
        content_en: data.content_en || "",
        category: data.category || "nutrition",
        is_published: data.is_published || false,
      });
      setCoverImageUrl(data.cover_image || "");
      setLoading(false);
    };

    fetchPost();
  }, [id, router]);

  const slug = turkishSlugify(form.title_tr);
  const readTime = calculateReadTime(form.content_tr);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    },
    []
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Gorsel yukleme hatasi:", uploadError);
      alert("Gorsel yuklenirken bir hata olustu.");
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(filePath);

    setCoverImageUrl(publicUrl);
    setUploading(false);
  };

  const handleRemoveImage = () => {
    setCoverImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title_tr.trim()) {
      alert("Baslik (TR) alani zorunludur.");
      return;
    }

    if (!form.category) {
      alert("Kategori secimi zorunludur.");
      return;
    }

    setSaving(true);

    const supabase = createClient();
    const wasPublished = originalPost?.is_published;
    const nowPublished = form.is_published;

    const updateData: Record<string, unknown> = {
      title_tr: form.title_tr.trim(),
      title_en: form.title_en.trim() || null,
      slug,
      excerpt_tr: form.excerpt_tr.trim() || null,
      excerpt_en: form.excerpt_en.trim() || null,
      content_tr: form.content_tr.trim(),
      content_en: form.content_en.trim() || null,
      category: form.category,
      cover_image: coverImageUrl || null,
      read_time: readTime,
      is_published: nowPublished,
    };

    // Set published_at when first publishing
    if (nowPublished && !wasPublished) {
      updateData.published_at = new Date().toISOString();
    }
    // Clear published_at when unpublishing
    if (!nowPublished && wasPublished) {
      updateData.published_at = null;
    }

    const { error } = await supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Guncelleme hatasi:", error);
      alert("Yazi guncellenirken bir hata olustu.");
      setSaving(false);
      return;
    }

    router.push("/admin/blog");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
        <span className="ml-2 text-sm text-gray-500">Yukleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yaziyi Duzenle</h1>
          <p className="text-sm text-gray-500 mt-1">
            {originalPost?.title_tr}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Turkish Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Turkce Icerik
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Baslik (TR) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title_tr"
              value={form.title_tr}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
              placeholder="Yazi basligi"
            />
            {slug && (
              <p className="mt-1 text-xs text-gray-400">
                Slug: <span className="font-mono">{slug}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ozet (TR)
            </label>
            <textarea
              name="excerpt_tr"
              value={form.excerpt_tr}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none resize-none"
              placeholder="Kisa ozet metni"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icerik (TR)
            </label>
            <textarea
              name="content_tr"
              value={form.content_tr}
              onChange={handleChange}
              rows={12}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none resize-y"
              placeholder="Yazi icerigi"
            />
            <p className="mt-1 text-xs text-gray-400">
              Tahmini okuma suresi: {readTime} dk
            </p>
          </div>
        </div>

        {/* English Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Ingilizce Icerik (Opsiyonel)
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Baslik (EN)
            </label>
            <input
              type="text"
              name="title_en"
              value={form.title_en}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ozet (EN)
            </label>
            <textarea
              name="excerpt_en"
              value={form.excerpt_en}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none resize-none"
              placeholder="Short excerpt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icerik (EN)
            </label>
            <textarea
              name="content_en"
              value={form.content_en}
              onChange={handleChange}
              rows={12}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none resize-y"
              placeholder="Post content"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Ayarlar</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Okuma Suresi
              </label>
              <input
                type="text"
                value={`${readTime} dakika`}
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kapak Gorseli
            </label>
            {coverImageUrl ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={coverImageUrl}
                  alt="Kapak gorseli"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 text-gray-600 hover:bg-white hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors">
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Gorsel yuklemek icin tiklayin
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PNG, JPG, WebP (max 5MB)
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Published */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_published"
              id="is_published"
              checked={form.is_published}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
            />
            <label
              htmlFor="is_published"
              className="text-sm font-medium text-gray-700"
            >
              Yayinda
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/blog"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Iptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Kaydediliyor..." : "Guncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
