"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/supabase/types";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import Link from "next/link";

const categories = [
  { value: "weight_management", label: "Kilo Yonetimi" },
  { value: "sport_nutrition", label: "Spor Beslenmesi" },
  { value: "vitamin_mineral", label: "Vitamin & Mineral" },
  { value: "beverages", label: "Icecekler" },
  { value: "protein_snacks", label: "Protein Atistirmalik" },
  { value: "supplements", label: "Takviye Edici" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name_tr: "", name_en: "", description_tr: "", description_en: "",
    price: "", stock: "0", category: "weight_management", sku: "", weight: "",
    benefits_tr: "", benefits_en: "", usage_tr: "", usage_en: "",
    is_active: true, is_featured: false, image_url: null as string | null,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        const p = data as Product;
        setForm({
          name_tr: p.name_tr, name_en: p.name_en || "", description_tr: p.description_tr || "",
          description_en: p.description_en || "", price: String(p.price), stock: String(p.stock),
          category: p.category, sku: p.sku || "", weight: p.weight || "",
          benefits_tr: p.benefits_tr || "", benefits_en: p.benefits_en || "",
          usage_tr: p.usage_tr || "", usage_en: p.usage_en || "",
          is_active: p.is_active, is_featured: p.is_featured, image_url: p.image_url,
        });
        if (p.image_url) setImagePreview(p.image_url);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    let image_url = form.image_url;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const fileName = `${slugify(form.name_tr)}-${Date.now()}.${ext}`;
      const { data: uploadData } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadData.path);
        image_url = urlData.publicUrl;
      }
    }

    const { error } = await supabase
      .from("products")
      .update({
        slug: slugify(form.name_tr),
        name_tr: form.name_tr, name_en: form.name_en || null,
        description_tr: form.description_tr || null, description_en: form.description_en || null,
        price: parseFloat(form.price), stock: parseInt(form.stock),
        category: form.category, sku: form.sku || null, weight: form.weight || null,
        benefits_tr: form.benefits_tr || null, benefits_en: form.benefits_en || null,
        usage_tr: form.usage_tr || null, usage_en: form.usage_en || null,
        image_url, is_active: form.is_active, is_featured: form.is_featured,
      })
      .eq("id", id);

    if (!error) {
      router.push("/admin/urunler");
    }
    setSaving(false);
  };

  const updateForm = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/urunler" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Urunu Duzenle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Temel Bilgiler</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urun Adi (TR) *</label>
              <input type="text" required value={form.name_tr} onChange={(e) => updateForm("name_tr", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urun Adi (EN)</label>
              <input type="text" value={form.name_en} onChange={(e) => updateForm("name_en", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL) *</label>
              <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => updateForm("price", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
              <input type="number" required min="0" value={form.stock} onChange={(e) => updateForm("stock", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" value={form.sku} onChange={(e) => updateForm("sku", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gramaj</label>
              <input type="text" value={form.weight} onChange={(e) => updateForm("weight", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
            <select value={form.category} onChange={(e) => updateForm("category", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm">
              {categories.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => updateForm("is_active", e.target.checked)} className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
              Aktif (sitede goster)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => updateForm("is_featured", e.target.checked)} className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
              One Cikan (ana sayfada goster)
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Urun Gorseli</h2>
          {imagePreview ? (
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg" />
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); setForm(p => ({...p, image_url: null})); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Gorsel yukle</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Aciklamalar</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aciklama (TR)</label>
              <textarea rows={4} value={form.description_tr} onChange={(e) => updateForm("description_tr", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aciklama (EN)</label>
              <textarea rows={4} value={form.description_en} onChange={(e) => updateForm("description_en", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faydalari (TR)</label>
              <textarea rows={3} value={form.benefits_tr} onChange={(e) => updateForm("benefits_tr", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kullanim Talimati (TR)</label>
              <textarea rows={3} value={form.usage_tr} onChange={(e) => updateForm("usage_tr", e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/admin/urunler" className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Iptal</Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            <Save size={18} />
            {saving ? "Kaydediliyor..." : "Guncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
