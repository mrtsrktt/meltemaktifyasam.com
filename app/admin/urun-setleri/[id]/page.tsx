"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Product, ProductSet } from "@/lib/supabase/types";
import { ArrowLeft, Plus, Trash2, Search, X, Save } from "lucide-react";

interface SetItem {
  product: Product;
  quantity: number;
}

export default function EditProductSetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [showProductPicker, setShowProductPicker] = useState(false);

  const [form, setForm] = useState({
    name_tr: "",
    description_tr: "",
    discount_percentage: "",
    discount_amount: "",
    is_active: true,
    is_featured: false,
  });

  const [setItems, setSetItems] = useState<SetItem[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Fetch all products
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("name_tr")
      .then(({ data }) => setProducts((data as Product[]) || []));

    // Fetch set data
    const fetchSet = async () => {
      const { data: setData } = await supabase
        .from("product_sets")
        .select("*")
        .eq("id", id)
        .single();

      if (!setData) {
        router.push("/admin/urun-setleri");
        return;
      }

      setForm({
        name_tr: setData.name_tr,
        description_tr: setData.description_tr || "",
        discount_percentage: Number(setData.discount_percentage) ? String(setData.discount_percentage) : "",
        discount_amount: Number(setData.discount_amount) ? String(setData.discount_amount) : "",
        is_active: setData.is_active,
        is_featured: setData.is_featured,
      });
      setExistingImageUrl(setData.image_url);

      // Fetch set items with products
      const { data: itemsData } = await supabase
        .from("product_set_items")
        .select("*, products(*)")
        .eq("set_id", id)
        .order("sort_order");

      if (itemsData) {
        const items: SetItem[] = itemsData.map((item: any) => ({
          product: item.products as Product,
          quantity: item.quantity,
        }));
        setSetItems(items);
      }

      setLoading(false);
    };

    fetchSet();
  }, [id, router]);

  const slug = slugify(form.name_tr);

  const totalPrice = setItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const discountPct = parseFloat(form.discount_percentage) || 0;
  const discountAmt = parseFloat(form.discount_amount) || 0;

  const discountedPrice = (() => {
    let price = totalPrice;
    if (discountPct > 0) price = price * (1 - discountPct / 100);
    if (discountAmt > 0) price = price - discountAmt;
    return Math.max(0, price);
  })();

  const savings = totalPrice - discountedPrice;

  const addProduct = (product: Product) => {
    if (setItems.find((item) => item.product.id === product.id)) return;
    setSetItems([...setItems, { product, quantity: 1 }]);
    setShowProductPicker(false);
    setProductSearch("");
  };

  const removeProduct = (productId: string) => {
    setSetItems(setItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setSetItems(
      setItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name_tr.toLowerCase().includes(productSearch.toLowerCase()) &&
      !setItems.find((item) => item.product.id === p.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setItems.length < 2) {
      alert("En az 2 urun eklemelisiniz.");
      return;
    }
    if (setItems.length > 10) {
      alert("En fazla 10 urun ekleyebilirsiniz.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    let image_url = existingImageUrl;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const fileName = `set-${slug}-${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);
      if (uploadError) {
        alert("Görsel yükleme hatası: " + uploadError.message);
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

    const { error: setError } = await supabase
      .from("product_sets")
      .update({
        name_tr: form.name_tr,
        slug,
        description_tr: form.description_tr || null,
        image_url,
        discount_percentage: discountPct,
        discount_amount: discountAmt,
        is_active: form.is_active,
        is_featured: form.is_featured,
      })
      .eq("id", id);

    if (setError) {
      alert("Hata: " + setError.message);
      setSaving(false);
      return;
    }

    // Replace all items
    await supabase.from("product_set_items").delete().eq("set_id", id);

    const items = setItems.map((item, i) => ({
      set_id: id,
      product_id: item.product.id,
      quantity: item.quantity,
      sort_order: i,
    }));

    const { error: itemsError } = await supabase.from("product_set_items").insert(items);
    if (itemsError) {
      alert("Urun ekleme hatasi: " + itemsError.message);
      setSaving(false);
      return;
    }

    router.push("/admin/urun-setleri");
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
        <Link href="/admin/urun-setleri" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Seti Duzenle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Set Bilgileri</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Set Adi *</label>
            <input
              type="text"
              required
              value={form.name_tr}
              onChange={(e) => setForm({ ...form, name_tr: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
            />
            {slug && <p className="text-xs text-gray-400 mt-1">Slug: {slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aciklama</label>
            <textarea
              value={form.description_tr}
              onChange={(e) => setForm({ ...form, description_tr: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Set Görseli</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
            {(imagePreview || existingImageUrl) && (
              <img
                src={imagePreview || existingImageUrl || ""}
                alt="Onizleme"
                className="mt-2 w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
              />
              Aktif
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
              />
              One Cikan
            </label>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Urunler ({setItems.length}/10)
            </h2>
            <button
              type="button"
              onClick={() => setShowProductPicker(true)}
              disabled={setItems.length >= 10}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Urun Ekle
            </button>
          </div>

          {setItems.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Sete en az 2 urun ekleyin</p>
          ) : (
            <div className="space-y-2">
              {setItems.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.name_tr} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.product.name_tr}</p>
                    <p className="text-xs text-gray-500">{Number(item.product.price).toLocaleString("tr-TR")} TL</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500">Adet:</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 rounded border border-gray-300 text-sm text-center"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 w-24 text-right">
                    {(Number(item.product.price) * item.quantity).toLocaleString("tr-TR")} TL
                  </p>
                  <button
                    type="button"
                    onClick={() => removeProduct(item.product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Discount */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Indirim</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yuzde Indirim (%)</label>
              <input
                type="number"
                min={0}
                max={99}
                step={1}
                value={form.discount_percentage}
                onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tutar Indirim (TL)</label>
              <input
                type="number"
                min={0}
                step={1}
                value={form.discount_amount}
                onChange={(e) => setForm({ ...form, discount_amount: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>
          </div>

          {setItems.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Toplam Fiyat:</span>
                <span className="text-gray-500 line-through">{totalPrice.toLocaleString("tr-TR")} TL</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Tasarruf:</span>
                  <span className="text-red-600 font-medium">-{savings.toLocaleString("tr-TR")} TL</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                <span className="text-gray-900">Set Fiyati:</span>
                <span className="text-emerald-600">{discountedPrice.toLocaleString("tr-TR")} TL</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/urun-setleri"
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Iptal
          </Link>
          <button
            type="submit"
            disabled={saving || setItems.length < 2}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {saving ? "Kaydediliyor..." : "Degisiklikleri Kaydet"}
          </button>
        </div>
      </form>

      {/* Product Picker Modal */}
      {showProductPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Urun Sec</h3>
              <button
                onClick={() => { setShowProductPicker(false); setProductSearch(""); }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Urun ara..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto flex-1 space-y-1">
              {filteredProducts.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Ürün bulunamadı</p>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name_tr} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{product.name_tr}</p>
                    </div>
                    <p className="text-sm font-medium text-emerald-600">
                      {Number(product.price).toLocaleString("tr-TR")} TL
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
