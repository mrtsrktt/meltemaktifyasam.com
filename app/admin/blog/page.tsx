"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/lib/supabase/types";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Filter,
} from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  nutrition: "Fonksiyonel Beslenme",
  sports: "Sporcu Beslenmesi",
  thyroid: "Tiroit & Kronik Hastalik",
  motivation: "Motivasyon & Zihin",
  recipes: "Tarifler",
  herbalife: "Herbalife",
};

const CATEGORIES = Object.keys(CATEGORY_LABELS);

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (categoryFilter) {
      query = query.eq("category", categoryFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Blog yazilari yuklenirken hata:", error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Bu yaziyi silmek istediginizden emin misiniz?"
    );
    if (!confirmed) return;

    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      console.error("Silme hatasi:", error);
      alert("Yazi silinirken bir hata olustu.");
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
    setDeletingId(null);
  };

  const handleTogglePublished = async (post: BlogPost) => {
    setTogglingId(post.id);
    const supabase = createClient();
    const newPublished = !post.is_published;
    const updates: Partial<BlogPost> = {
      is_published: newPublished,
    };
    if (newPublished && !post.published_at) {
      updates.published_at = new Date().toISOString();
    }
    if (!newPublished) {
      updates.published_at = null as unknown as string;
    }

    const { error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", post.id);

    if (error) {
      console.error("Durum degistirme hatasi:", error);
      alert("Durum degistirilirken bir hata olustu.");
    } else {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                is_published: newPublished,
                published_at: newPublished
                  ? updates.published_at || p.published_at
                  : null,
              }
            : p
        ) as BlogPost[]
      );
    }
    setTogglingId(null);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Yazilari</h1>
          <p className="text-sm text-gray-500 mt-1">
            Toplam {posts.length} yazi
          </p>
        </div>
        <Link
          href="/admin/blog/yeni"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni Yazi
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="">Tum Kategoriler</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            <span className="ml-2 text-sm text-gray-500">Yukleniyor...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Henuz blog yazisi bulunmuyor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">
                    Baslik
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">
                    Kategori
                  </th>
                  <th className="text-center px-6 py-3 font-semibold text-gray-600">
                    Durum
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">
                    Yayin Tarihi
                  </th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {post.title_tr}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {post.is_published ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          Yayinda
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                          Taslak
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(post.published_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublished(post)}
                          disabled={togglingId === post.id}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
                          title={
                            post.is_published
                              ? "Taslaga cevir"
                              : "Yayinla"
                          }
                        >
                          {togglingId === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : post.is_published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-emerald-600 transition-colors"
                          title="Duzenle"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deletingId === post.id}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Sil"
                        >
                          {deletingId === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
