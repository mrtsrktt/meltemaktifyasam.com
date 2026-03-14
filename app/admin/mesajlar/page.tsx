"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactMessage } from "@/lib/supabase/types";
import {
  MessageSquare,
  Mail,
  Phone,
  CheckCircle,
  Filter,
  Loader2,
  AlertCircle,
  X,
  Eye,
  Inbox,
} from "lucide-react";

type ReadFilter = "all" | "unread" | "read";

export default function MesajlarPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [markingId, setMarkingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      let query = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (readFilter === "unread") {
        query = query.eq("is_read", false);
      } else if (readFilter === "read") {
        query = query.eq("is_read", true);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Mesajlar yüklenemedi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readFilter]);

  const markAsRead = async (msg: ContactMessage) => {
    if (msg.is_read) return;
    setMarkingId(msg.id);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", msg.id);

      if (updateError) throw updateError;

      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );

      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...msg, is_read: true });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Durum güncellenemedi.";
      alert(message);
    } finally {
      setMarkingId(null);
    }
  };

  const truncate = (text: string | null, maxLen: number) => {
    if (!text) return "-";
    return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
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

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
            <p className="text-sm text-gray-500">
              Iletisim formu uzerinden gelen mesajlar
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold border border-red-200">
              <Inbox className="w-3.5 h-3.5" />
              {unreadCount} okunmamis
            </span>
          )}
          <span className="text-sm text-gray-500">
            Toplam: {messages.length}
          </span>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Durum:</span>
          <div className="flex gap-2">
            {(
              [
                { value: "all", label: "Tumu" },
                { value: "unread", label: "Okunmamis" },
                { value: "read", label: "Okunmus" },
              ] as { value: ReadFilter; label: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setReadFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  readFilter === opt.value
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
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MessageSquare className="w-10 h-10 mb-2" />
            <p className="text-sm">Henuz mesaj bulunmuyor.</p>
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
                    E-posta
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Telefon
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Mesaj
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">
                    Durum
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
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      !msg.is_read
                        ? "bg-emerald-50/40 border-l-4 border-l-emerald-400"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {msg.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {msg.email || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        {msg.phone || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {truncate(msg.message, 50)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {msg.is_read ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          <CheckCircle className="w-3 h-3" />
                          Okundu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <Inbox className="w-3 h-3" />
                          Yeni
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(msg.created_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMessage(msg);
                          }}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Mesaji gor"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!msg.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(msg);
                            }}
                            disabled={markingId === msg.id}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Okundu olarak isaretle"
                          >
                            {markingId === msg.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedMessage.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {formatDate(selectedMessage.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase">
                    E-posta
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {selectedMessage.email || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase">
                    Telefon
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {selectedMessage.phone || "-"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-400 uppercase">
                  Mesaj
                </span>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
              {!selectedMessage.is_read && (
                <button
                  onClick={() => markAsRead(selectedMessage)}
                  disabled={markingId === selectedMessage.id}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {markingId === selectedMessage.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Okundu Olarak Isaretle
                </button>
              )}
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
