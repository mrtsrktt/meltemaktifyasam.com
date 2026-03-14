"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { VkiLead } from "@/lib/supabase/types";
import {
  Activity,
  Phone,
  Mail,
  CheckCircle,
  Circle,
  MessageCircle,
  Filter,
  Loader2,
  AlertCircle,
  Users,
} from "lucide-react";

type GoalFilter = "all" | "kilo_ver" | "kilo_al" | "form_koru";

const goalLabels: Record<string, string> = {
  kilo_ver: "Kilo Ver",
  kilo_al: "Kilo Al",
  form_koru: "Form Koru",
};

const bmiCategoryColors: Record<string, string> = {
  Zayif: "text-blue-600 bg-blue-50 border-blue-200",
  Normal: "text-green-600 bg-green-50 border-green-200",
  "Fazla Kilolu": "text-orange-600 bg-orange-50 border-orange-200",
  Obez: "text-red-600 bg-red-50 border-red-200",
};

export default function VkiLeadlerPage() {
  const [leads, setLeads] = useState<VkiLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goalFilter, setGoalFilter] = useState<GoalFilter>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      let query = supabase
        .from("vki_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (goalFilter !== "all") {
        query = query.eq("goal", goalFilter);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setLeads(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Veriler yuklenemedi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalFilter]);

  const toggleContacted = async (lead: VkiLead) => {
    setTogglingId(lead.id);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("vki_leads")
        .update({ is_contacted: !lead.is_contacted })
        .eq("id", lead.id);

      if (updateError) throw updateError;

      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id ? { ...l, is_contacted: !l.is_contacted } : l
        )
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Durum guncellenemedi.";
      alert(message);
    } finally {
      setTogglingId(null);
    }
  };

  const openWhatsApp = (phone: string, fullName: string) => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    const message = encodeURIComponent(
      `Merhaba ${fullName}, VKI hesaplama formunu doldurdugunuz icin tesekkur ederiz. Size nasil yardimci olabiliriz?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Basvurular</h1>
            <p className="text-sm text-gray-500">
              Danismanlik basvuru formu uzerinden gelen potansiyel musteriler
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>Toplam: {leads.length}</span>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Hedef:</span>
          <div className="flex gap-2">
            {(
              [
                { value: "all", label: "Tumu" },
                { value: "kilo_ver", label: "Kilo Ver" },
                { value: "kilo_al", label: "Kilo Al" },
                { value: "form_koru", label: "Form Koru" },
              ] as { value: GoalFilter; label: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGoalFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  goalFilter === opt.value
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            <span className="ml-2 text-sm text-gray-500">Yukleniyor...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Activity className="w-10 h-10 mb-2" />
            <p className="text-sm">Henuz lead bulunmuyor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Ad Soyad
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Telefon
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    E-posta
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    VKI
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Kategori
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Hedef
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">
                    Iletisim
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Tarih
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {lead.full_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        {lead.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {lead.email || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-mono">
                      {lead.bmi != null ? Number(lead.bmi).toFixed(1) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {lead.bmi_category ? (
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            bmiCategoryColors[lead.bmi_category] ||
                            "text-gray-600 bg-gray-50 border-gray-200"
                          }`}
                        >
                          {lead.bmi_category}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {lead.goal ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {goalLabels[lead.goal] || lead.goal}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleContacted(lead)}
                        disabled={togglingId === lead.id}
                        className="inline-flex items-center gap-1 disabled:opacity-50"
                        title={
                          lead.is_contacted
                            ? "Iletisim kuruldu"
                            : "Iletisim kurulmadi"
                        }
                      >
                        {togglingId === lead.id ? (
                          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        ) : lead.is_contacted ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 hover:text-emerald-400 transition-colors" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {lead.phone && (
                        <button
                          onClick={() =>
                            openWhatsApp(lead.phone!, lead.full_name || "")
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp
                        </button>
                      )}
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
