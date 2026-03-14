"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Upload, X, Check } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/lib/supabase/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    name_tr: "",
    description_tr: "",
    price: "",
    sku: "",
    benefits_tr: "",
    usage_tr: "",
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (selectedCategoryIds.length === 0) {
      setError("En az bir kategori secmelisiniz.");
      setSaving(false);
      return;
    }

    const supabase = createClient();
    let image_url = null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const fileName = `${slugify(form.name_tr)}-${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        setError(`Gorsel yuklenemedi: ${uploadError.message}`);
        setSaving(false);
        return;
      }

      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadData.path);
        image_url = urlData.publicUrl;
      }
    }

    const slug = slugify(form.name_tr);

    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        slug,
        name_tr: form.name_tr,
        description_tr: form.description_tr || null,
        price: parseFloat(form.price),
        sku: form.sku || null,
        benefits_tr: form.benefits_tr || null,
        usage_tr: form.usage_tr || null,
        image_url,
        is_active: form.is_active,
        is_featured: form.is_featured,
      })
      .select("id")
      .single();

    if (insertError || !product) {
      setError(`Urun kaydedilemedi: ${insertError?.message || "Bilinmeyen hata"}`);
      setSaving(false);
      return;
    }

    // Insert product-category relations
    const { error: catError } = await supabase
      .from("product_categories")
      .insert(selectedCategoryIds.map((catId) => ({
        product_id: product.id,
        category_id: catId,
      })));

    if (catError) {
      setError(`Kategoriler kaydedilemedi: ${catError.message}`);
      setSaving(false);
      return;
    }

    router.push("/admin/urunler");
  };

  const updateForm = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/urunler"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Urun Ekle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Temel Bilgiler</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urun Adi *
            </label>
            <input
              type="text"
              required
              value={form.name_tr}
              onChange={(e) => updateForm("name_tr", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              placeholder="Formula 1 Shake Karışımı"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat (TL) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateForm("price", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                placeholder="899.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => updateForm("sku", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                placeholder="HBL-F1-001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategoriler *
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const selected = selectedCategoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                      selected
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white text-gray-600 border-gray-300 hover:border-emerald-400 hover:text-emerald-600"
                    }`}
                  >
                    {selected && <Check size={14} />}
                    {cat.name_tr}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateForm("is_active", e.target.checked)}
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
              />
              Aktif (sitede goster)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => updateForm("is_featured", e.target.checked)}
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
              />
              One Cikan (ana sayfada goster)
            </label>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Urun Gorseli</h2>
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Gorsel yukle</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG (max 2MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Descriptions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Detaylar</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urun Aciklamasi
            </label>
            <textarea
              rows={5}
              value={form.description_tr}
              onChange={(e) => updateForm("description_tr", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              placeholder="Urun aciklamasi, gramaj bilgisi vb."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faydalari
            </label>
            <textarea
              rows={3}
              value={form.benefits_tr}
              onChange={(e) => updateForm("benefits_tr", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              placeholder="Her satira bir fayda yazin..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kullanim Talimati
            </label>
            <textarea
              rows={3}
              value={form.usage_tr}
              onChange={(e) => updateForm("usage_tr", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              placeholder="Kullanim talimati..."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <Link
            href="/admin/urunler"
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Iptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
