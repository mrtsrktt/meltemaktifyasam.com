"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Package,
  ShoppingCart,
  Activity,
  MessageSquare,
  Mail,
  TrendingUp,
  Eye,
} from "lucide-react";

interface DashboardStats {
  products: number;
  pendingOrders: number;
  recentLeads: number;
  unreadMessages: number;
  subscribers: number;
}

interface RecentOrder {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: { fullName: string } | null;
}

interface RecentLead {
  id: string;
  full_name: string;
  phone: string;
  bmi: number;
  goal: string;
  created_at: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Bekliyor", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Onaylandi", color: "bg-blue-100 text-blue-700" },
  shipped: { label: "Kargoda", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Teslim", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Iptal", color: "bg-red-100 text-red-700" },
};

const goalLabels: Record<string, string> = {
  kilo_ver: "Kilo Ver",
  kilo_al: "Kilo Al",
  form_koru: "Form Koru",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    pendingOrders: 0,
    recentLeads: 0,
    unreadMessages: 0,
    subscribers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const supabase = createClient();

      const [products, orders, leads, messages, subscribers, recentOrd, recentLd] =
        await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("vki_leads")
            .select("id", { count: "exact", head: true })
            .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
          supabase
            .from("contact_messages")
            .select("id", { count: "exact", head: true })
            .eq("is_read", false),
          supabase
            .from("newsletter_subscribers")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true),
          supabase
            .from("orders")
            .select("id, total_amount, status, created_at, shipping_address")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("vki_leads")
            .select("id, full_name, phone, bmi, goal, created_at")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

      setStats({
        products: products.count || 0,
        pendingOrders: orders.count || 0,
        recentLeads: leads.count || 0,
        unreadMessages: messages.count || 0,
        subscribers: subscribers.count || 0,
      });
      setRecentOrders((recentOrd.data as RecentOrder[]) || []);
      setRecentLeads((recentLd.data as RecentLead[]) || []);
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  const statCards = [
    {
      label: "Toplam Urun",
      value: stats.products,
      icon: Package,
      color: "bg-emerald-500",
      href: "/admin/urunler",
    },
    {
      label: "Bekleyen Siparis",
      value: stats.pendingOrders,
      icon: ShoppingCart,
      color: "bg-orange-500",
      href: "/admin/siparisler",
    },
    {
      label: "Yeni Lead (7 gun)",
      value: stats.recentLeads,
      icon: Activity,
      color: "bg-blue-500",
      href: "/admin/vki-leadler",
    },
    {
      label: "Okunmamis Mesaj",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "bg-red-500",
      href: "/admin/mesajlar",
    },
    {
      label: "Bulten Abone",
      value: stats.subscribers,
      icon: Mail,
      color: "bg-purple-500",
      href: "/admin/bulten",
    },
  ];

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/tr"
          target="_blank"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <Eye size={16} />
          Siteyi Gör
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp size={18} />
              Son Siparisler
            </h2>
            <Link
              href="/admin/siparisler"
              className="text-xs text-emerald-600 hover:underline"
            >
              Tümünü gör
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-center text-gray-400 text-sm">
                Henuz siparis yok
              </p>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/siparisler/${order.id}`}
                  className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.shipping_address?.fullName || "Misafir"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {order.total_amount?.toLocaleString("tr-TR")} TL
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        statusLabels[order.status]?.color || ""
                      }`}
                    >
                      {statusLabels[order.status]?.label || order.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent VKI leads */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Activity size={18} />
              Son VKI Leadler
            </h2>
            <Link
              href="/admin/vki-leadler"
              className="text-xs text-emerald-600 hover:underline"
            >
              Tümünü gör
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLeads.length === 0 ? (
              <p className="px-5 py-8 text-center text-gray-400 text-sm">
                Henuz lead yok
              </p>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {lead.full_name}
                    </p>
                    <p className="text-xs text-gray-400">{lead.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      VKI: {lead.bmi}
                    </p>
                    <span className="text-xs text-gray-500">
                      {goalLabels[lead.goal] || lead.goal}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
