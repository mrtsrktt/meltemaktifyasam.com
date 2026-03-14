"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/supabase/types";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Check,
  X,
  FolderTree,
} from "lucide-react";

interface CategoryNode extends Category {
  children: CategoryNode[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Form state
  const [formNameTr, setFormNameTr] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formParentId, setFormParentId] = useState<string | null>(null);
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const buildTree = (flat: Category[]): CategoryNode[] => {
    const map = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];

    flat.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));

    flat.forEach((cat) => {
      const node = map.get(cat.id)!;
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const fetchCategories = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name_tr", { ascending: true });

    if (data) {
      setCategories(buildTree(data));
      // Expand all by default
      setExpandedIds(new Set(data.filter((c) => !c.parent_id).map((c) => c.id)));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const resetForm = () => {
    setFormNameTr("");
    setFormNameEn("");
    setFormSlug("");
    setFormParentId(null);
    setFormSortOrder(0);
    setEditingId(null);
    setShowForm(false);
  };

  const handleNameChange = (value: string) => {
    setFormNameTr(value);
    if (!editingId) {
      setFormSlug(slugify(value));
    }
  };

  const handleSave = async () => {
    if (!formNameTr.trim() || !formSlug.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const payload = {
      name_tr: formNameTr.trim(),
      name_en: formNameEn.trim() || null,
      slug: formSlug.trim(),
      parent_id: formParentId,
      sort_order: formSortOrder,
      is_active: true,
    };

    if (editingId) {
      await supabase.from("categories").update(payload).eq("id", editingId);
    } else {
      await supabase.from("categories").insert(payload);
    }

    setSaving(false);
    resetForm();
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormNameTr(cat.name_tr);
    setFormNameEn(cat.name_en || "");
    setFormSlug(cat.slug);
    setFormParentId(cat.parent_id);
    setFormSortOrder(cat.sort_order);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediginize emin misiniz? Alt kategorileri de silinecektir.")) return;

    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Flatten categories for parent select dropdown
  const flatCategories = (nodes: CategoryNode[], depth = 0): { id: string; name: string; depth: number }[] => {
    const result: { id: string; name: string; depth: number }[] = [];
    nodes.forEach((node) => {
      result.push({ id: node.id, name: node.name_tr, depth });
      if (node.children.length > 0) {
        result.push(...flatCategories(node.children, depth + 1));
      }
    });
    return result;
  };

  const renderCategory = (cat: CategoryNode, depth = 0) => {
    const hasChildren = cat.children.length > 0;
    const isExpanded = expandedIds.has(cat.id);

    return (
      <div key={cat.id}>
        <div
          className={`flex items-center gap-2 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors ${
            depth > 0 ? "bg-gray-50/50" : ""
          }`}
          style={{ paddingLeft: `${depth * 24 + 16}px` }}
        >
          <GripVertical size={16} className="text-gray-300 flex-shrink-0" />

          {hasChildren ? (
            <button
              onClick={() => toggleExpand(cat.id)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="w-4 flex-shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{cat.name_tr}</span>
              {cat.name_en && (
                <span className="text-sm text-gray-400">({cat.name_en})</span>
              )}
              {depth === 0 && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Ana Kategori
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">/{cat.slug}</div>
          </div>

          <span className="text-xs text-gray-400 flex-shrink-0">
            Sira: {cat.sort_order}
          </span>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => {
                setFormParentId(cat.id);
                setShowForm(true);
                setEditingId(null);
                setFormNameTr("");
                setFormNameEn("");
                setFormSlug("");
                setFormSortOrder(0);
              }}
              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Alt kategori ekle"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => handleEdit(cat)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Duzenle"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDelete(cat.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sil"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>{cat.children.map((child) => renderCategory(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  const allFlat = flatCategories(categories);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderTree size={24} className="text-emerald-600" />
            Kategoriler
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Urun kategorilerini ve alt kategorilerini yonetin
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Yeni Kategori
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Kategori Duzenle" : "Yeni Kategori"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori Adi (TR) *
              </label>
              <input
                type="text"
                value={formNameTr}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                placeholder="orn: Kilo Yonetimi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori Adi (EN)
              </label>
              <input
                type="text"
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                placeholder="e.g. Weight Management"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-mono"
                placeholder="orn: kilo-yonetimi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ust Kategori
              </label>
              <select
                value={formParentId || ""}
                onChange={(e) => setFormParentId(e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              >
                <option value="">Ana Kategori (ust seviye)</option>
                {allFlat
                  .filter((c) => c.id !== editingId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {"—".repeat(c.depth)} {c.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Siralama
              </label>
              <input
                type="number"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleSave}
              disabled={saving || !formNameTr.trim() || !formSlug.trim()}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Check size={16} />
              {saving ? "Kaydediliyor..." : editingId ? "Guncelle" : "Kaydet"}
            </button>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <X size={16} />
              Iptal
            </button>
          </div>
        </div>
      )}

      {/* Category Tree */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FolderTree size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">Henuz kategori eklenmemis</p>
            <p className="text-sm mt-1">
              Yukaridaki &quot;Yeni Kategori&quot; butonuyla baslayabilirsiniz
            </p>
          </div>
        ) : (
          <div>{categories.map((cat) => renderCategory(cat))}</div>
        )}
      </div>
    </div>
  );
}
