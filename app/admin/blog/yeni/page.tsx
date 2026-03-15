"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-lg border border-gray-300 flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  ),
});

const CATEGORY_LABELS: Record<string, string> = {
  nutrition: "Fonksiyonel Beslenme",
  sports: "Sporcu Beslenmesi",
  thyroid: "Tiroit & Kronik Hastalık",
  motivation: "Motivasyon & Zihin",
  recipes: "Tarifler",
  herbalife: "Herbalife",
};

const CATEGORIES = Object.keys(CATEGORY_LABELS);

function calculateReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [form, setForm] = useState({
    title_tr: "",
    excerpt_tr: "",
    category: "nutrition",
    is_published: false,
  });

  const slug = slugify(form.title_tr);
  const readTime = calculateReadTime(content);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `covers/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

    const { error } = await supabase.storage.from("blog-images").upload(fileName, file);
    if (error) {
      alert("Görsel yüklenirken hata oluştu: " + error.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(fileName);
    setCoverImageUrl(publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_tr.trim()) {
      alert("Baslik alani zorunludur.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase.from("blog_posts").insert({
      title_tr: form.title_tr.trim(),
      title_en: null,
      slug,
      excerpt_tr: form.excerpt_tr.trim() || null,
      excerpt_en: null,
      content_tr: content,
      content_en: null,
      category: form.category,
      cover_image: coverImageUrl || null,
      read_time: readTime,
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
    });

    if (error) {
      alert("Kayit hatasi: " + error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/blog");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Blog Yazisi</h1>
          {slug && <p className="text-xs text-gray-400 mt-0.5">/{slug}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Excerpt */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Baslik <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.title_tr}
              onChange={(e) => setForm({ ...form, title_tr: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500 outline-none"
              placeholder="Yazi basligi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ozet
            </label>
            <textarea
              value={form.excerpt_tr}
              onChange={(e) => setForm({ ...form, excerpt_tr: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500 outline-none resize-none"
              placeholder="Kisa ozet metni (listeleme sayfasinda gorunur)"
            />
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Icerik</label>
            <span className="text-xs text-gray-400">{readTime} dk okuma</span>
          </div>
          <RichTextEditor content={content} onChange={setContent} />
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
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500 outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Okuma Suresi</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli</label>
            <p className="text-xs text-gray-400 mb-2">Onerilen boyut: 1200x630px</p>
            {coverImageUrl ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                <Image src={coverImageUrl} alt="Kapak" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl("")}
                  className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 text-gray-600 hover:bg-white hover:text-red-600"
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
                    <span className="text-sm text-gray-500">Görsel yüklemek için tıklayın</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, WebP</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_published"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
              Hemen yayinla
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/blog" className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Iptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
