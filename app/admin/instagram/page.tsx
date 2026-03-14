"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { InstagramPost } from "@/lib/supabase/types";
import {
  Instagram,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  ExternalLink,
  GripVertical,
  Upload,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export default function InstagramAdminPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    post_url: "",
    caption: "",
    sort_order: 0,
    is_reel: false,
  });

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("instagram_posts")
        .select("*")
        .order("sort_order", { ascending: true });

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Veriler yüklenemedi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Lütfen bir görsel seçin.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      // Upload image
      const ext = imageFile.name.split(".").pop();
      const fileName = `instagram-${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(`instagram/${fileName}`, imageFile);

      if (uploadError) throw new Error(`Görsel yüklenemedi: ${uploadError.message}`);

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(uploadData.path);

      // Insert post
      const { error: insertError } = await supabase
        .from("instagram_posts")
        .insert({
          image_url: urlData.publicUrl,
          post_url: form.post_url,
          caption: form.caption || null,
          sort_order: form.sort_order,
          is_reel: form.is_reel,
          is_active: true,
        });

      if (insertError) throw insertError;

      // Reset form
      setForm({ post_url: "", caption: "", sort_order: 0, is_reel: false });
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
      fetchPosts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kayıt sırasında hata oluştu.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id: string) => {
    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error: delError } = await supabase
        .from("instagram_posts")
        .delete()
        .eq("id", id);

      if (delError) throw delError;
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Silinemedi.";
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (post: InstagramPost) => {
    setTogglingId(post.id);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("instagram_posts")
        .update({ is_active: !post.is_active })
        .eq("id", post.id);

      if (updateError) throw updateError;
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, is_active: !p.is_active } : p))
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Güncellenemedi.";
      alert(message);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Instagram className="h-6 w-6 text-pink-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instagram Paylaşımları</h1>
            <p className="text-sm text-gray-500">
              Anasayfada gösterilecek Instagram postlarını yönetin
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 text-sm font-medium transition-colors"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "İptal" : "Yeni Ekle"}
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Post Ekle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Görsel *
              </label>
              {imagePreview ? (
                <div className="relative w-40 h-40 rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Önizleme" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-40 h-40 rounded-xl border-2 border-dashed border-gray-300 hover:border-pink-400 cursor-pointer transition-colors">
                  <Upload className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Görsel Seç</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Post URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram Post Linki *
              </label>
              <input
                type="url"
                required
                value={form.post_url}
                onChange={(e) => setForm({ ...form, post_url: e.target.value })}
                placeholder="https://www.instagram.com/p/..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama (opsiyonel)
              </label>
              <input
                type="text"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Post hakkında kısa not"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none"
              />
            </div>

            {/* Is Reel */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_reel"
                checked={form.is_reel}
                onChange={(e) => setForm({ ...form, is_reel: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="is_reel" className="text-sm font-medium text-gray-700">
                Bu bir Reels videosu (play ikonu gösterilir)
              </label>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sıralama (küçük = önce)
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </form>
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Instagram className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Henüz post eklenmemiş</p>
          <p className="text-sm mt-1">Yukarıdaki &quot;Yeni Ekle&quot; butonuyla başlayın</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                post.is_active ? "border-transparent" : "border-red-200 opacity-60"
              }`}
            >
              <div className="aspect-square">
                <img
                  src={post.image_url}
                  alt={post.caption || "Instagram post"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Reels badge */}
              {post.is_reel && (
                <div className="absolute top-1.5 right-8 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                  Reels
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <a
                  href={post.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-gray-700" />
                </a>
                <button
                  onClick={() => toggleActive(post)}
                  disabled={togglingId === post.id}
                  className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  {togglingId === post.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  ) : post.is_active ? (
                    <EyeOff className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-green-500" />
                  )}
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  disabled={deletingId === post.id}
                  className="bg-white rounded-full p-2 hover:bg-red-50 transition-colors"
                >
                  {deletingId === post.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-500" />
                  )}
                </button>
              </div>

              {/* Sort badge */}
              <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <GripVertical className="h-3 w-3" />
                {post.sort_order}
              </div>

              {/* Status badge */}
              {!post.is_active && (
                <div className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                  Gizli
                </div>
              )}

              {/* Caption */}
              {post.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-[10px] truncate">{post.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6">
        Toplamda {posts.length} post · Aktif: {posts.filter((p) => p.is_active).length} ·
        Anasayfada aktif olanlar sıralama değerine göre gösterilir
      </p>
    </div>
  );
}
