# Meltem Tanık — Site Dönüşüm Değişiklikleri

## Genel Amaç

Siteyi "ürün satışı yapan mağaza" modundan "tanıtım + danışmanlık + Shopier'a yönlendirme" moduna çeviriyoruz. Tüm mağaza/sepet/ödeme altyapısı kodda kalacak ama bir flag ile gizlenecek. PayTR anlaşması geldiğinde flag değiştirilip her şey geri açılacak.

**ÖNEMLİ KURALLAR:**
- Hiçbir mevcut dosya/bileşen/DB tablosu silinmeyecek — sadece gizlenecek
- Tüm değişiklikler `NEXT_PUBLIC_STORE_MODE` env flag'ine bağlı olacak
- `shopier` modunda: ürünler gizli, sepet gizli, checkout gizli, Shopier'a yönlendirme aktif
- `native` modunda: mevcut sistem aynen çalışır, hiçbir fark yok
- Her adımı bitirdikten sonra `npm run build` ile hatasız derlenmesini kontrol et
- Commit yapma, ben onayladıktan sonra birlikte yapacağız

---

## ADIM 1: Altyapı — Store Mode Flag Sistemi

### 1.1 — `.env.local` güncelle

Mevcut Shopier payment satırlarının **üstüne** şu iki satırı ekle:

```env
# Mağaza Modu: "shopier" = ürünler gizli, Shopier'a yönlendirme
#               "native"  = site içi mağaza + ödeme aktif
NEXT_PUBLIC_STORE_MODE=shopier
NEXT_PUBLIC_SHOPIER_STORE_URL=https://www.shopier.com/meltemaktifyasam
```

### 1.2 — `lib/store-mode.ts` oluştur (yeni dosya)

```ts
/**
 * Mağaza modu yardımcıları.
 * "shopier" → Ürünler/sepet/checkout gizli, ziyaretçiler Shopier'a yönlendirilir.
 * "native"  → Site içi mağaza, sepet ve ödeme sistemi aktif.
 */
export type StoreMode = "shopier" | "native";

export const STORE_MODE: StoreMode =
  (process.env.NEXT_PUBLIC_STORE_MODE as StoreMode) || "native";

export const isShopierMode = STORE_MODE === "shopier";
export const isNativeMode = STORE_MODE === "native";

export const SHOPIER_STORE_URL =
  process.env.NEXT_PUBLIC_SHOPIER_STORE_URL || "https://www.shopier.com/meltemaktifyasam";
```

---

## ADIM 2: Header — Sepet Gizleme + Mağaza Linki Değişikliği

**Dosya:** `components/layout/Header.tsx`

### Değişiklikler:

1. En üste import ekle:
```ts
import { isShopierMode, SHOPIER_STORE_URL } from "@/lib/store-mode";
```

2. `navLinks` dizisini store moduna göre koşullu yap:
   - `shopier` modunda `{ href: "/magaza", key: "shop" }` satırını **çıkar** (gizle)
   - Yerine navbar'da "Ürünlerimiz" adında Shopier'a yönlendiren bir external link koy

3. `CartIcon` bileşeninin render'ını `isShopierMode` ile kontrol et:
   - `shopier` modunda `<CartIcon />` hiç render edilmesin (hem desktop hem mobilde)
   - `native` modunda aynen kalsın

4. Desktop Actions bölümünde `<CartIcon />` yerine:
```tsx
{!isShopierMode && <CartIcon />}
```

5. Mobile Menu bölümünde de aynı kontrol:
```tsx
{!isShopierMode && <CartIcon />}
```

6. Navbar'da Shopier modunda "Ürünlerimiz" linki ekle (navLinks filtresinden sonra, desktop nav'da):
```tsx
{isShopierMode && (
  <a
    href={SHOPIER_STORE_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-brand-green text-white/80"
  >
    {t("shop")}
  </a>
)}
```

7. Mobil menüde de aynı external link:
```tsx
{isShopierMode && (
  <a
    href={SHOPIER_STORE_URL}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => setOpen(false)}
    className="rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent text-foreground/70"
  >
    {t("shop")}
  </a>
)}
```

### Dokunulmayacaklar:
- Logo, dil değiştirici, hesap ikonu, VKİ CTA butonu aynen kalacak
- `native` modunda header tamamen mevcut haliyle çalışacak

---

## ADIM 3: Anasayfa — Yeni Section Sıralaması

**Dosya:** `app/[locale]/page.tsx`

### Değişiklikler:

1. Yeni bileşenleri import et:
```ts
import ProblemSolutionSection from "@/components/home/ProblemSolutionSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ShopierStoreSection from "@/components/home/ShopierStoreSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { isShopierMode } from "@/lib/store-mode";
```

2. `HomePage` bileşenini koşullu render yap:

```tsx
export default function HomePage() {
  return (
    <>
      <HeroSection />
      {isShopierMode && <ProblemSolutionSection />}
      {isShopierMode && <HowItWorksSection />}
      <FeaturesSection />
      {!isShopierMode && <InstagramFeed />}
      {!isShopierMode && <ProductsPreview />}
      {!isShopierMode && <ProductSetsPreview />}
      <VkiSection />
      <TestimonialsSection />
      {isShopierMode && <ShopierStoreSection />}
      <ConsultationSection />
      {isShopierMode && <InstagramFeed />}
      <BlogPreview />
      <NewsletterSection />
    </>
  );
}
```

**Shopier modunda section sırası:**
1. Hero (tek, slider yok)
2. Sorun-Çözüm (yeni)
3. Nasıl Çalışıyorum (yeni)
4. Hizmetler (mevcut FeaturesSection)
5. VKİ Analiz
6. Başarı Hikayeleri (Testimonials)
7. Mağaza Yönlendirme (yeni — Shopier CTA)
8. Danışmanlık Formu
9. Instagram Feed
10. Blog Önizleme
11. Newsletter

**Native modunda section sırası (mevcut aynen korunur):**
1. Hero (slider)
2. Features
3. Instagram Feed
4. Products Preview
5. Product Sets Preview
6. VKİ
7. Consultation
8. Testimonials
9. Blog Preview
10. Newsletter (yeni eklenen — her iki modda da görünür)

---

## ADIM 4: HeroSection — Shopier Modunda Tek Hero

**Dosya:** `components/home/HeroSection.tsx`

### Değişiklikler:

1. Import ekle:
```ts
import { isShopierMode, SHOPIER_STORE_URL } from "@/lib/store-mode";
```

2. Shopier modunda slider mantığını devre dışı bırak:
   - `slides` dizisinden sadece ilk slide'ı (danışmanlık odaklı, koyu temalı) kullan
   - Auto-slide interval'ı, navigation butonlarını ve dot indicator'ları gizle
   - Slide 2'deki "Ürünleri Keşfet" CTA'sı yerine slide 1'in CTA'ları kullanılsın

3. Slide 2'nin "Ürünleri Keşfet" (`/magaza` linki) butonunu shopier modunda değiştir:
   - Shopier modunda bu buton `SHOPIER_STORE_URL`'e external link olsun
   - Veya tamamen gösterilmesin (slide 1 zaten danışmanlık odaklı)

4. En basit yaklaşım: Shopier modunda `slides` dizisini sadece 1 elemanlı yap:
```ts
const allSlides = [slide1Config, slide2Config];
const slides = isShopierMode ? [allSlides[0]] : allSlides;
```

5. Navigation kontrolleri (prev/next butonları, dot indicators) slides.length > 1 olduğunda gösterilsin:
```tsx
{slides.length > 1 && (
  <div className="flex items-center justify-center gap-4 mt-10">
    {/* navigation butonları */}
  </div>
)}
```

Bu sayede shopier modunda otomatik olarak tek hero, native modunda mevcut slider çalışır.

---

## ADIM 5: FeaturesSection — Ürünler Kartı Link Değişikliği

**Dosya:** `components/home/FeaturesSection.tsx`

### Değişiklikler:

1. Import ekle:
```ts
import { isShopierMode, SHOPIER_STORE_URL } from "@/lib/store-mode";
```

2. `features` dizisindeki `products` kartının `href`'ini koşullu yap:
   - `shopier` modunda: href Shopier mağaza URL'si olacak (external link)
   - `native` modunda: `/magaza` (mevcut)

3. `products` kartını render ederken link türünü kontrol et:
   - Eğer href bir external URL ise `<a>` tag'i kullan (target="_blank")
   - Değilse mevcut `<Link>` bileşenini kullan

Öneri: features dizisine `external: boolean` alanı ekle:
```ts
const features = [
  {
    key: "nutrition",
    icon: Salad,
    href: "/hakkimda" as const,
    external: false,
    // ... diğer alanlar
  },
  {
    key: "products",
    icon: Package,
    href: isShopierMode ? SHOPIER_STORE_URL : ("/magaza" as const),
    external: isShopierMode,
    // ... diğer alanlar
  },
  {
    key: "mentoring",
    icon: Brain,
    href: "/hakkimda" as const,
    external: false,
    // ... diğer alanlar
  },
];
```

Render'da:
```tsx
{feature.external ? (
  <a href={feature.href as string} target="_blank" rel="noopener noreferrer">
    {/* kart içeriği */}
  </a>
) : (
  <Link href={feature.href}>
    {/* kart içeriği */}
  </Link>
)}
```

---

## ADIM 6: Yeni Bileşenler Oluşturma

### 6.1 — `components/home/ProblemSolutionSection.tsx` (yeni dosya)

Ziyaretçinin ağrı noktalarını gösteren empati bölümü.

**Tasarım:**
- "use client", next-intl (`useTranslations("problemSolution")`), framer-motion
- Arka plan: beyazdan hafif yeşile gradient
- Badge + Başlık + Vurgulu alt başlık
- 4-5 sorun kartı (2x2 grid desktop, dikey mobil):
  - Her kart: ikon + sorun metni
  - İkonlar: lucide-react (AlertCircle, TrendingDown, Battery, Scale, HeartPulse)
  - Kartlar: border, rounded-2xl, hover efekti, framer-motion whileInView animasyon
- Altında çözüm cümlesi (yeşil, büyük font)
- CTA butonu: "Ücretsiz Başvuru Yap" → `#basvuru` scroll

### 6.2 — `components/home/HowItWorksSection.tsx` (yeni dosya)

3 adımlı "Nasıl Çalışıyorum" timeline bölümü.

**Tasarım:**
- "use client", next-intl (`useTranslations("howItWorks")`), framer-motion
- Arka plan: beyaz (bg-white)
- Badge + Başlık
- 3 adım yatay timeline (desktop), dikey (mobil):
  1. ClipboardCheck ikonu — "VKİ Analizini Yap" — form doldur
  2. Utensils ikonu — "Programını Al" — kişiye özel beslenme
  3. TrendingUp ikonu — "Sonuçları Gör" — takip ve dönüşüm
- Her adım: büyük yeşil daire içinde ikon, numara badge, başlık, açıklama
- Adımlar arası kesikli çizgi bağlantı
- Staggered animasyon (sıralı görünüm)

### 6.3 — `components/home/ShopierStoreSection.tsx` (yeni dosya)

Shopier mağazasına yönlendirme bölümü.

**Tasarım:**
- "use client", next-intl (`useTranslations("shopierStore")`), framer-motion
- `SHOPIER_STORE_URL`'i `@/lib/store-mode`'dan import et
- Arka plan: koyu gradient (brand-dark'tan koyu yeşile) — premium his
- Dekoratif blur blobları
- Beyaz metin
- Başlık + Açıklama
- 3 güven badge'i yatay sıra: Shield "Güvenli Ödeme" / Truck "Hızlı Kargo" / CreditCard "Taksit İmkanı"
- Büyük, göze çarpan CTA butonu: "Mağazamızı Ziyaret Edin →" (ExternalLink ikonu)
  - `<a href={SHOPIER_STORE_URL} target="_blank" rel="noopener noreferrer">`
- Altında küçük güven notu

**ÖNEMLİ TON:** "Başka siteye gidiyorsunuz" hissi vermemeli. "Güvenli alışveriş sayfamız" dili kullanılmalı.

---

## ADIM 7: Sayfa Yönlendirmeleri (Shopier Modunda)

### 7.1 — `/magaza` sayfası

**Dosya:** `app/[locale]/magaza/page.tsx`

Dosyanın en üstüne (mevcut importların üstüne) ekle:
```ts
import { isShopierMode, SHOPIER_STORE_URL } from "@/lib/store-mode";
import { redirect } from "next/navigation";
```

Bileşenin en başına (return'den önce) ekle:
```ts
if (isShopierMode) {
  redirect(SHOPIER_STORE_URL);
}
```

**NOT:** Bu server component ise `redirect()` kullan. Client component ise `useEffect` + `window.location.href` kullan. Dosyayı oku, hangisi olduğunu kontrol et.

### 7.2 — `/magaza/[slug]` sayfası

**Dosya:** `app/[locale]/magaza/[slug]/page.tsx`

Aynı redirect mantığı:
```ts
if (isShopierMode) {
  redirect(SHOPIER_STORE_URL);
}
```

### 7.3 — `/magaza/setler` ve `/magaza/set/[slug]` sayfaları

Her ikisine de aynı redirect ekle.

### 7.4 — `/sepet` sayfası

**Dosya:** `app/[locale]/sepet/page.tsx`

```ts
if (isShopierMode) {
  redirect(SHOPIER_STORE_URL);
}
```

### 7.5 — `/odeme` sayfası

**Dosya:** `app/[locale]/odeme/page.tsx`

Bu dosya "use client" olduğu için redirect farklı olacak:
```tsx
import { isShopierMode, SHOPIER_STORE_URL } from "@/lib/store-mode";

// Bileşenin en başında:
if (isShopierMode) {
  if (typeof window !== "undefined") {
    window.location.href = SHOPIER_STORE_URL;
  }
  return null;
}
```

### 7.6 — `/hesabim` sayfası

Shopier modunda hesap sayfası gereksiz olabilir. Eğer sadece sipariş takibi için kullanılıyorsa, Shopier'a yönlendirebiliriz. Ama VKI leadler ve profil bilgisi de varsa kalabilir. **Şimdilik dokunma**, sonra değerlendirelim.

---

## ADIM 8: Çeviri Dosyaları Güncelleme

### 8.1 — `messages/tr.json`

Mevcut JSON'un sonuna (closing `}` öncesine) şu blokları ekle:

```json
"problemSolution": {
  "badge": "Tanıdık Geldi mi?",
  "title": "Bu Sorunlarla mı",
  "titleHighlight": "Mücadele Ediyorsunuz?",
  "problem1": "Diyet yapıyorum ama bir türlü kilo veremiyorum",
  "problem2": "Ne yesem bilmiyorum, sürekli aynı döngüdeyim",
  "problem3": "Enerji düşüklüğü, sürekli yorgunluk hissediyorum",
  "problem4": "Tiroit, insülin direnci veya kronik bir sorunla mücadele ediyorum",
  "problem5": "Başka uzmanlarla çalıştım ama sonuç alamadım",
  "solution": "Fonksiyonel beslenme ile kök sebebe iniyoruz. Belirtileri değil, sorunu çözüyoruz.",
  "cta": "Ücretsiz Başvuru Yap"
},
"howItWorks": {
  "badge": "Nasıl Çalışıyorum?",
  "title": "3 Basit Adımda",
  "titleHighlight": "Dönüşümünüzü Başlatın",
  "step1Title": "VKİ Analizini Yap",
  "step1Desc": "30 saniyede ücretsiz VKİ analizinizi tamamlayın. Boy, kilo ve hedefinizi girin.",
  "step2Title": "Programınızı Alın",
  "step2Desc": "Size özel fonksiyonel beslenme programı hazırlansın. Hedeflerinize göre kişiselleştirilmiş plan.",
  "step3Title": "Sonuçları Görün",
  "step3Desc": "Haftalık takip ve WhatsApp desteği ile dönüşümünüzü birlikte yaşayın."
},
"shopierStore": {
  "title": "Ürünlerimizi",
  "titleHighlight": "Keşfedin",
  "description": "Fonksiyonel beslenme ürünlerimizi güvenli alışveriş sayfamızdan inceleyebilir, dilediğiniz ödeme yöntemiyle sipariş verebilirsiniz.",
  "securePay": "Güvenli Ödeme",
  "fastShipping": "Hızlı Kargo",
  "installment": "Taksit İmkanı",
  "cta": "Mağazamızı Ziyaret Edin",
  "trustNote": "Güvenli ödeme altyapısı ile korunan alışveriş sayfamıza yönlendirileceksiniz."
}
```

### 8.2 — `messages/en.json`

Aynı blokların İngilizce karşılıkları:

```json
"problemSolution": {
  "badge": "Sound Familiar?",
  "title": "Are You Struggling",
  "titleHighlight": "With These Issues?",
  "problem1": "I'm dieting but I can't seem to lose weight",
  "problem2": "I don't know what to eat, stuck in the same cycle",
  "problem3": "Low energy, constant fatigue",
  "problem4": "Dealing with thyroid, insulin resistance, or a chronic condition",
  "problem5": "I've worked with other experts but didn't get results",
  "solution": "With functional nutrition, we address the root cause. We solve the problem, not just the symptoms.",
  "cta": "Free Consultation"
},
"howItWorks": {
  "badge": "How It Works",
  "title": "Start Your Transformation",
  "titleHighlight": "In 3 Simple Steps",
  "step1Title": "Take the BMI Analysis",
  "step1Desc": "Complete your free BMI analysis in 30 seconds. Enter your height, weight, and goal.",
  "step2Title": "Get Your Program",
  "step2Desc": "Receive a personalized functional nutrition program. A plan tailored to your goals.",
  "step3Title": "See the Results",
  "step3Desc": "Experience your transformation with weekly follow-ups and WhatsApp support."
},
"shopierStore": {
  "title": "Explore Our",
  "titleHighlight": "Products",
  "description": "Browse our functional nutrition products on our secure shopping page and order with your preferred payment method.",
  "securePay": "Secure Payment",
  "fastShipping": "Fast Shipping",
  "installment": "Installment Options",
  "cta": "Visit Our Store",
  "trustNote": "You will be redirected to our shopping page protected by secure payment infrastructure."
}
```

---

## ADIM 9: Footer Güncelleme

**Dosya:** `components/layout/Footer.tsx`

### Değişiklikler:

1. Import ekle:
```ts
import { isShopierMode, SHOPIER_STORE_URL } from "@/lib/store-mode";
```

2. "Hızlı Linkler" bölümündeki "Mağaza" linkini koşullu yap:
   - `shopier` modunda: `<a href={SHOPIER_STORE_URL} target="_blank">` (external)
   - `native` modunda: `<Link href="/magaza">` (mevcut)

---

## ADIM 10: Build Kontrolü + Son Doğrulama

1. `npm run build` çalıştır — hatasız tamamlanmalı
2. `npm run dev` ile test et:
   - Anasayfa: yeni section'lar görünmeli, ürün carousel'leri gizli olmalı
   - Header: sepet ikonu gizli, "Mağaza" linki Shopier'a yönlendirmeli
   - `/magaza` URL'sine gitmeye çalış → Shopier'a redirect olmalı
   - `/sepet` URL'sine gitmeye çalış → Shopier'a redirect olmalı
3. `.env.local`'de `NEXT_PUBLIC_STORE_MODE=native` yapıp test et:
   - Her şey eski haline dönmeli (ürünler, sepet, slider hepsi geri gelmeli)

---

## YAPILMAYACAKLAR (şimdilik)

Bu dökümandaki adımlar tamamlandıktan sonra ayrı fazlarda yapılacak:

- [ ] Testimonials güçlendirme (DB'ye taşıma, fotoğraflı yorumlar)
- [ ] Danışmanlık sayfası oluşturma (`/danismanlik`)
- [ ] Instagram reklam landing sayfası (`/hosgeldiniz`)
- [ ] Hakkımda sayfası güçlendirme
- [ ] SEO düzeltmeleri (generateMetadata, OG görselleri, hreflang)
- [ ] Blog SSR refactor
- [ ] Admin panele Shopier URL alanı ekleme
