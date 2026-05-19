/** @type {import('next-sitemap').IConfig} */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://meltemaktifyasam.com";

// Public sayfalar — TR/EN pathname eşleşmeleri (i18n/routing.ts ile uyumlu).
// Ürün detay ve blog detay sayfaları dinamik (DB'den) olduğu için MVP'de dahil
// edilmedi; ileride bir API route ile dinamik üretilebilir.
const PAGE_MAP = [
  { tr: "/", en: "/", priority: 1.0 },
  { tr: "/hakkimda", en: "/about", priority: 0.9 },
  { tr: "/magaza", en: "/shop", priority: 0.9 },
  { tr: "/magaza/setler", en: "/shop/sets", priority: 0.8 },
  { tr: "/blog", en: "/blog", priority: 0.8 },
  { tr: "/vki-analiz", en: "/bmi-analysis", priority: 0.8 },
  { tr: "/iletisim", en: "/contact", priority: 0.7 },
  { tr: "/gizlilik-politikasi", en: "/privacy-policy", priority: 0.3 },
  { tr: "/kullanim-kosullari", en: "/terms-of-service", priority: 0.3 },
  { tr: "/kvkk", en: "/data-protection", priority: 0.3 },
  { tr: "/iade-politikasi", en: "/refund-policy", priority: 0.3 },
  { tr: "/teslimat-kosullari", en: "/shipping-terms", priority: 0.3 },
  {
    tr: "/mesafeli-satis-sozlesmesi",
    en: "/distance-sales-agreement",
    priority: 0.3,
  },
];

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  // Default tarama varsayılan sayfaları dahil etmesin — sadece additionalPaths.
  exclude: [
    "/*",
    "/admin",
    "/admin/*",
    "/api/*",
    "/60gun",
    "/icon.svg",
    "/apple-icon.svg",
  ],
  changefreq: "weekly",
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/60gun",
          "/tr/odeme",
          "/en/checkout",
          "/tr/sepet",
          "/en/cart",
          "/tr/hesabim",
          "/en/my-account",
        ],
      },
    ],
    additionalSitemaps: [`${SITE_URL}/sitemap.xml`],
  },
  // Manuel olarak TR + EN tüm public sayfaları ekle, her birine hreflang
  // alternate ref'leri yaz.
  additionalPaths: async () => {
    const lastmod = new Date().toISOString();
    const paths = [];

    for (const page of PAGE_MAP) {
      const trUrl = `${SITE_URL}/tr${page.tr === "/" ? "" : page.tr}`;
      const enUrl = `${SITE_URL}/en${page.en === "/" ? "" : page.en}`;
      // hrefIsAbsolute=true olmazsa next-sitemap href'in sonuna mevcut loc'u
      // ekleyip /tr/hakkimda/tr/hakkimda gibi bozuk URL'ler uretiyor.
      const alternateRefs = [
        { href: trUrl, hreflang: "tr", hrefIsAbsolute: true },
        { href: enUrl, hreflang: "en", hrefIsAbsolute: true },
        { href: trUrl, hreflang: "x-default", hrefIsAbsolute: true },
      ];

      paths.push({
        loc: `/tr${page.tr === "/" ? "" : page.tr}`,
        changefreq: "weekly",
        priority: page.priority,
        lastmod,
        alternateRefs,
      });
      paths.push({
        loc: `/en${page.en === "/" ? "" : page.en}`,
        changefreq: "weekly",
        priority: page.priority,
        lastmod,
        alternateRefs,
      });
    }

    return paths;
  },
};
