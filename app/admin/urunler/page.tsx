"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Product, Category } from "@/lib/supabase/types";
import { Plus, Search, Edit, Trash2, Star, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 20;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCats, setProductCats] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    const supabase = createClient();

    const [{ data: productsData }, { data: catsData }, { data: pcData }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("product_categories").select("product_id, category_id"),
    ]);

    setProducts((productsData as Product[]) || []);
    setCategories((catsData as Category[]) || []);

    // Build product -> category map
    const map: Record<string, string[]> = {};
    (pcData || []).forEach((pc: { product_id: string; category_id: string }) => {
      if (!map[pc.product_id]) map[pc.product_id] = [];
      map[pc.product_id].push(pc.category_id);
    });
    setProductCats(map);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("product_categories").delete().eq("product_id", id);
    await supabase.from("products").delete().eq("id", id);
    setDeleteId(null);
    fetchProducts();
  };

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
    fetchProducts();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("products").update({ is_featured: !current }).eq("id", id);
    fetchProducts();
  };

  const getCatNames = (productId: string) => {
    const catIds = productCats[productId] || [];
    return catIds
      .map((id) => categories.find((c) => c.id === id)?.name_tr)
      .filter(Boolean);
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name_tr.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "all" || (productCats[p.id] || []).includes(categoryFilter);
    return matchSearch && matchCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Urunler ({products.length})</h1>
        <Link
          href="/admin/urunler/yeni"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Yeni Urun
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Urun ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
        >
          <option value="all">Tum Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name_tr}</option>
          ))}
        </select>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {filtered.length} urun{filtered.length !== products.length && ` (toplam ${products.length})`}
        </span>
        {totalPages > 1 && (
          <span>Sayfa {currentPage} / {totalPages}</span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Urun</th>
                <th className="px-4 py-3 font-medium text-gray-600">Kategori</th>
                <th className="px-4 py-3 font-medium text-gray-600">Fiyat</th>
                <th className="px-4 py-3 font-medium text-gray-600">Durum</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">Islemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    {products.length === 0
                      ? "Henuz urun eklenmemis"
                      : "Aramaniza uygun urun bulunamadi"}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name_tr}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            IMG
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name_tr}</p>
                          {product.sku && (
                            <p className="text-xs text-gray-400">SKU: {product.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {getCatNames(product.id).map((name, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {Number(product.price).toLocaleString("tr-TR")} TL
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(product.id, product.is_active)}
                          title={product.is_active ? "Aktif" : "Pasif"}
                          className={`p-1 rounded ${
                            product.is_active
                              ? "text-green-600 hover:bg-green-50"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          {product.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => toggleFeatured(product.id, product.is_featured)}
                          title={product.is_featured ? "One Cikan" : "Normal"}
                          className={`p-1 rounded ${
                            product.is_featured
                              ? "text-yellow-500 hover:bg-yellow-50"
                              : "text-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          <Star size={16} fill={product.is_featured ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/urunler/${product.id}`}
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Onceki
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-emerald-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Sonraki
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Urunu Sil</h3>
            <p className="text-sm text-gray-500 mb-4">
              Bu urunu silmek istediginize emin misiniz? Bu islem geri alinamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Iptal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
