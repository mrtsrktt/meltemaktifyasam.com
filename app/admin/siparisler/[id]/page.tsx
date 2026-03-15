"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Order, OrderItem } from "@/lib/supabase/types";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Save,
  CheckCircle,
} from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "Bekliyor",
  confirmed: "Onaylandi",
  shipped: "Kargoda",
  delivered: "Teslim",
  cancelled: "Iptal",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusOptions = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export default function SiparisDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<Order["status"]>("pending");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  async function fetchOrder() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Sipariş yüklenirken hata:", error);
    } else {
      setOrder(data as OrderWithItems);
      setSelectedStatus(data.status);
    }
    setLoading(false);
  }

  async function handleStatusUpdate() {
    if (!order || selectedStatus === order.status) return;

    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: selectedStatus })
      .eq("id", order.id);

    if (error) {
      console.error("Durum guncellenirken hata:", error);
    } else {
      setOrder({ ...order, status: selectedStatus });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatPrice(amount: number) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  }

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="text-center text-gray-500 py-12">Yukleniyor...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="text-center text-gray-500 py-12">
          Sipariş bulunamadı.
        </div>
        <div className="text-center">
          <Link
            href="/admin/siparisler"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Siparislere Don
          </Link>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shipping_address as Record<
    string,
    string
  > | null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        href="/admin/siparisler"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Siparislere Don
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Siparis #{order.id.slice(0, 8)}
            </h1>
            <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[order.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {statusLabels[order.status] || order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" />
            Siparis Bilgileri
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Siparis ID</span>
              <span className="text-sm font-mono text-gray-900">
                {order.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Tarih</span>
              <span className="text-sm text-gray-900">
                {formatDate(order.created_at)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Durum</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[order.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {statusLabels[order.status] || order.status}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3">
              <span className="text-sm font-medium text-gray-700">Toplam</span>
              <span className="text-lg font-bold text-emerald-600">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500" />
            Musteri Bilgileri
          </h2>
          {shippingAddress ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Ad Soyad</span>
                <span className="text-sm text-gray-900">
                  {shippingAddress.fullName || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Telefon</span>
                <span className="text-sm text-gray-900">
                  {shippingAddress.phone || "-"}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p>{shippingAddress.address || "-"}</p>
                    <p>
                      {[
                        shippingAddress.district,
                        shippingAddress.city,
                        shippingAddress.zipCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Müşteri bilgisi bulunamadı.
            </p>
          )}
        </div>
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Durum Guncelle
        </h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as Order["status"])}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={saving || selectedStatus === order.status}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              "Kaydediliyor..."
            ) : saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Kaydedildi
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Kaydet
              </>
            )}
          </button>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Siparis Kalemleri
          </h2>
        </div>
        {order.order_items && order.order_items.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Urun
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Adet
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Birim Fiyat
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ara Toplam
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.order_items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.product_name.startsWith("[SET]") ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                          SET
                        </span>
                        <span>{item.product_name.replace("[SET] ", "")}</span>
                      </div>
                    ) : (
                      item.product_name
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-right">
                    {formatPrice(item.unit_price)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    {formatPrice(item.quantity * item.unit_price)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td
                  colSpan={3}
                  className="px-6 py-4 text-sm font-semibold text-gray-700 text-right"
                >
                  Genel Toplam
                </td>
                <td className="px-6 py-4 text-lg font-bold text-emerald-600 text-right">
                  {formatPrice(order.total_amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Sipariş kalemi bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
