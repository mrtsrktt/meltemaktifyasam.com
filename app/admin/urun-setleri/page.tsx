"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { ProductSet } from "@/lib/supabase/types";
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";

export default function ProductSetsPage() {
  const [sets, setSets] = useState<(ProductSet & { itemCount: number; totalPrice: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSets = async () => {
    const supabase = createClient();
    const { data: setsData } = await supabase
      .from("product_sets")
      .select("*")
      .order("created_at", { ascending: false });

    if (!setsData) {
      setSets([]);
      setLoading(false);
      return;
    }

    // Get item counts and total prices
    const enriched = await Promise.all(
      setsData.map(async (s) => {
        const { data: items } = await supabase
          .from("product_set_items")
          .select("quantity, products(price)")
          .eq("set_id", s.id);

        const itemCount = items?.length || 0;
        const totalPrice = (items || []).reduce((sum, item: any) => {
          const price = item.products?.price || 0;
          return sum + Number(price) * (item.quantity || 1);
        }, 0);

        return { ...s, itemCount, totalPrice };
      })
    );

    setSets(enriched);
    setLoading(false);
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("product_set_items").delete().eq("set_id", id);
    await supabase.from("product_sets").delete().eq("id", id);
    setDeleteId(null);
    fetchSets();
  };

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("product_sets").update({ is_active: !current }).eq("id", id);
    fetchSets();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("product_sets").update({ is_featured: !current }).eq("id", id);
    fetchSets();
  };

  const getDiscountedPrice = (set: (typeof sets)[0]) => {
    let price = set.totalPrice;
    if (set.discount_percentage > 0) {
      price = price * (1 - set.discount_percentage / 100);
    }
    if (set.discount_amount > 0) {
      price = price - set.discount_amount;
    }
    return Math.max(0, price);
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Urun Setleri ({sets.length})</h1>
        <Link
          href="/admin/urun-setleri/yeni"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Yeni Set
        </Link>
      </div>

      {sets.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 mb-4">Henuz urun seti eklenmemis</p>
          <Link
            href="/admin/urun-setleri/yeni"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Plus size={18} />
            Ilk Seti Olustur
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">Set Adi</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Urun Sayisi</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Toplam Fiyat</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Indirim</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Set Fiyati</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Durum</th>
                  <th className="px-4 py-3 font-medium text-gray-600 text-right">Islemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sets.map((set) => (
                  <tr key={set.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {set.image_url ? (
                          <img src={set.image_url} alt={set.name_tr} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-orange-500 text-xs font-bold">
                            SET
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{set.name_tr}</p>
                          <p className="text-xs text-gray-400">/{set.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{set.itemCount} urun</td>
                    <td className="px-4 py-3 text-gray-500 line-through">
                      {set.totalPrice.toLocaleString("tr-TR")} TL
                    </td>
                    <td className="px-4 py-3">
                      {set.discount_percentage > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          %{set.discount_percentage}
                        </span>
                      )}
                      {set.discount_amount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          -{set.discount_amount.toLocaleString("tr-TR")} TL
                        </span>
                      )}
                      {set.discount_percentage === 0 && set.discount_amount === 0 && (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600">
                      {getDiscountedPrice(set).toLocaleString("tr-TR")} TL
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(set.id, set.is_active)}
                          className={`p-1 rounded ${set.is_active ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                        >
                          {set.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => toggleFeatured(set.id, set.is_featured)}
                          className={`p-1 rounded ${set.is_featured ? "text-yellow-500 hover:bg-yellow-50" : "text-gray-300 hover:bg-gray-100"}`}
                        >
                          <Star size={16} fill={set.is_featured ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/urun-setleri/${set.id}`}
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(set.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seti Sil</h3>
            <p className="text-sm text-gray-500 mb-4">
              Bu seti silmek istediginize emin misiniz? Bu islem geri alinamaz.
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
