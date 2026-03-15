"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Search,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  nutrition: "Fonksiyonel Beslenme",
  sports: "Sporcu Beslenmesi",
  thyroid: "Tiroit & Kronik Hastalık",
  motivation: "Motivasyon & Zihin",
  recipes: "Tarifler",
  herbalife: "Herbalife",
};

const CATEGORIES = Object.keys(CATEGORY_LABELS);
const PAGE_SIZE = 20;

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const fetchPosts = async () => {
    setLoading(true);
    const supabase = createClient();

    // First get total count
    let countQuery = supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true });

    if (categoryFilter) {
      countQuery = countQuery.eq("category", categoryFilter);
    }
    if (searchQuery.trim()) {
      countQuery = countQuery.ilike("title_tr", `%${searchQuery.trim()}%`);
    }

    const { count } = await countQuery;
    setTotalCount(count || 0);

    // Then get paginated data
    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

    if (categoryFilter) {
      query = query.eq("category", categoryFilter);
    }
    if (searchQuery.trim()) {
      query = query.ilike("title_tr", `%${searchQuery.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Blog yazıları yüklenirken hata:", error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, currentPage]);

  // Reset to page 1 and fetch when search changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchPosts();
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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
      alert("Yazı silinirken bir hata oluştu.");
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setTotalCount((prev) => prev - 1);
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
      alert("Durum değiştirilirken bir hata oluştu.");
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
            Toplam {totalCount} yazi
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

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Basliga gore ara..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">Tüm Kategoriler</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>
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
            <p className="text-gray-500">
              {searchQuery || categoryFilter
                ? "Aramanıza uygun yazı bulunamadı."
                : "Henuz blog yazisi bulunmuyor."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 font-semibold text-gray-600 w-16">
                    Görsel
                  </th>
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
                      {post.cover_image ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          <Image
                            src={post.cover_image}
                            alt={post.title_tr}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 line-clamp-1">
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-gray-500">
              Sayfa {currentPage} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 2
                )
                .reduce<(number | string)[]>((acc, page, idx, arr) => {
                  if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                    acc.push("...");
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, idx) =>
                  typeof item === "string" ? (
                    <span
                      key={`dots-${idx}`}
                      className="px-1 text-sm text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        currentPage === item
                          ? "bg-emerald-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
