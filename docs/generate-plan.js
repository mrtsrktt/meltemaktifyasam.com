const fs = require("fs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  AlignmentType,
  HeadingLevel,
  LevelFormat,
  BorderStyle,
  WidthType,
  ShadingType,
  PageNumber,
  PageBreak,
  TabStopType,
  TabStopPosition,
} = require("docx");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerBorder = { style: BorderStyle.SINGLE, size: 1, color: "1A1A2E" };
const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

const brandDark = "1A1A2E";
const brandGreen = "2ECC71";
const brandOrange = "E67E22";

function headerCell(text, width) {
  return new TableCell({
    borders: headerBorders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: brandDark, type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "Arial", size: 20 })],
      }),
    ],
  });
}

function cell(text, width, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            font: "Arial",
            size: 20,
            bold: opts.bold || false,
            color: opts.color || "333333",
          }),
        ],
      }),
    ],
  });
}

function statusCell(text, width) {
  const colorMap = {
    "Tamamland\u0131": { fill: "D5F5E3", color: "1E8449" },
    "Devam Ediyor": { fill: "FEF9E7", color: "B7950B" },
    "Planland\u0131": { fill: "EBF5FB", color: "2E86C1" },
  };
  const style = colorMap[text] || { fill: "F2F3F4", color: "566573" };
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: style.fill, type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, font: "Arial", size: 20, color: style.color })],
      }),
    ],
  });
}

function heading(text, level) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120 },
    children: [new TextRun({ text, font: "Arial" })],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text,
        font: "Arial",
        size: 22,
        bold: opts.bold || false,
        color: opts.color || "333333",
      }),
    ],
  });
}

function bulletItem(text, ref = "bullets", level = 0) {
  return new Paragraph({
    numbering: { reference: ref, level },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: "333333" })],
  });
}

function numberedItem(text, ref = "numbers", level = 0) {
  return new Paragraph({
    numbering: { reference: ref, level },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: "333333" })],
  });
}

// Phase status table
const phaseTableWidth = 9360;
const phaseColWidths = [1200, 3000, 2960, 2200];

const phaseTable = new Table({
  width: { size: phaseTableWidth, type: WidthType.DXA },
  columnWidths: phaseColWidths,
  rows: [
    new TableRow({
      children: [
        headerCell("Faz", phaseColWidths[0]),
        headerCell("Ad\u0131", phaseColWidths[1]),
        headerCell("A\u00e7\u0131klama", phaseColWidths[2]),
        headerCell("Durum", phaseColWidths[3]),
      ],
    }),
    new TableRow({
      children: [
        cell("Faz 1", phaseColWidths[0], { bold: true }),
        cell("Veritaban\u0131 & Kimlik Do\u011frulama", phaseColWidths[1]),
        cell("Supabase kurulumu, tablolar, RLS, Auth", phaseColWidths[2]),
        statusCell("Tamamland\u0131", phaseColWidths[3]),
      ],
    }),
    new TableRow({
      children: [
        cell("Faz 2", phaseColWidths[0], { bold: true }),
        cell("Admin Panel Aray\u00fcz\u00fc", phaseColWidths[1]),
        cell("T\u00fcm admin sayfalar\u0131n\u0131n UI geli\u015ftirmesi", phaseColWidths[2]),
        statusCell("Tamamland\u0131", phaseColWidths[3]),
      ],
    }),
    new TableRow({
      children: [
        cell("Faz 3", phaseColWidths[0], { bold: true }),
        cell("Frontend Supabase Entegrasyonu", phaseColWidths[1]),
        cell("Blog, ileti\u015fim, sepet, \u00f6deme ba\u011flant\u0131s\u0131", phaseColWidths[2]),
        statusCell("Tamamland\u0131", phaseColWidths[3]),
      ],
    }),
    new TableRow({
      children: [
        cell("Faz 4", phaseColWidths[0], { bold: true }),
        cell("Build Do\u011frulama", phaseColWidths[1]),
        cell("Derleme hatalar\u0131 giderme, test", phaseColWidths[2]),
        statusCell("Tamamland\u0131", phaseColWidths[3]),
      ],
    }),
  ],
});

// Database tables
const dbColWidths = [2200, 4960, 2200];

const dbTable = new Table({
  width: { size: phaseTableWidth, type: WidthType.DXA },
  columnWidths: dbColWidths,
  rows: [
    new TableRow({
      children: [
        headerCell("Tablo Ad\u0131", dbColWidths[0]),
        headerCell("A\u00e7\u0131klama", dbColWidths[1]),
        headerCell("RLS", dbColWidths[2]),
      ],
    }),
    ...([
      ["products", "\u00dcr\u00fcnler (ad, a\u00e7\u0131klama, fiyat, kategori, g\u00f6rsel)", "Herkese okuma"],
      ["blog_posts", "Blog yaz\u0131lar\u0131 (ba\u015fl\u0131k, i\u00e7erik, slug, kapak g\u00f6rseli)", "Yay\u0131nlanm\u0131\u015f okuma"],
      ["orders", "Sipari\u015fler (adres JSONB, toplam, durum)", "Admin tam eri\u015fim"],
      ["order_items", "Sipari\u015f kalemleri (\u00fcr\u00fcn, miktar, birim fiyat)", "Admin tam eri\u015fim"],
      ["contact_messages", "\u0130leti\u015fim mesajlar\u0131 (ad, e-posta, mesaj)", "Herkes ekleme"],
      ["newsletter_subscribers", "B\u00fclten aboneleri (e-posta, durum)", "Herkes ekleme"],
      ["vki_leads", "VK\u0130 hesaplay\u0131c\u0131 leadleri (boy, kilo, sonu\u00e7)", "Herkes ekleme"],
      ["profiles", "Kullan\u0131c\u0131 profilleri (rol, ad)", "Kendi profilini okuma"],
    ].map(([name, desc, rls]) =>
      new TableRow({
        children: [
          cell(name, dbColWidths[0], { bold: true }),
          cell(desc, dbColWidths[1]),
          cell(rls, dbColWidths[2]),
        ],
      })
    )),
  ],
});

// Admin pages table
const adminColWidths = [2000, 3360, 4000];

const adminTable = new Table({
  width: { size: phaseTableWidth, type: WidthType.DXA },
  columnWidths: adminColWidths,
  rows: [
    new TableRow({
      children: [
        headerCell("Sayfa", adminColWidths[0]),
        headerCell("Rota", adminColWidths[1]),
        headerCell("\u00d6zellikler", adminColWidths[2]),
      ],
    }),
    ...([
      ["Dashboard", "/admin", "\u00d6zet kartlar\u0131, istatistikler, son aktiviteler"],
      ["\u00dcr\u00fcnler", "/admin/urunler", "CRUD, g\u00f6rsel y\u00fckleme, kategori filtreleme"],
      ["Blog", "/admin/blog", "Yaz\u0131 olu\u015fturma/d\u00fczenleme, yay\u0131nlama durumu"],
      ["Sipari\u015fler", "/admin/siparisler", "Liste, detay, durum g\u00fcncelleme (5 a\u015fama)"],
      ["VK\u0130 Leadler", "/admin/vki-leadler", "VK\u0130 hesaplay\u0131c\u0131dan gelen potansiyel m\u00fc\u015fteriler"],
      ["Mesajlar", "/admin/mesajlar", "\u0130leti\u015fim formundan gelen mesajlar"],
      ["B\u00fclten", "/admin/bulten", "E-posta aboneleri y\u00f6netimi"],
      ["Kullan\u0131c\u0131lar", "/admin/kullanicilar", "Kullan\u0131c\u0131 rolleri y\u00f6netimi"],
      ["Giri\u015f", "/admin/giris", "E-posta/\u015fifre ile admin giri\u015fi"],
    ].map(([name, route, features]) =>
      new TableRow({
        children: [
          cell(name, adminColWidths[0], { bold: true }),
          cell(route, adminColWidths[1]),
          cell(features, adminColWidths[2]),
        ],
      })
    )),
  ],
});

// Tech stack table
const techColWidths = [2800, 6560];

const techTable = new Table({
  width: { size: phaseTableWidth, type: WidthType.DXA },
  columnWidths: techColWidths,
  rows: [
    new TableRow({
      children: [
        headerCell("Teknoloji", techColWidths[0]),
        headerCell("Kullan\u0131m Amac\u0131", techColWidths[1]),
      ],
    }),
    ...([
      ["Next.js 16 (App Router)", "Sunucu taraf\u0131 render, rotalama, API route\u2019lar"],
      ["React 19", "Bile\u015fen tabanl\u0131 kullan\u0131c\u0131 aray\u00fcz\u00fc"],
      ["TypeScript", "Tip g\u00fcvenli\u011fi ve geli\u015ftirici deneyimi"],
      ["Tailwind CSS 4", "Utility-first CSS \u00e7er\u00e7evesi"],
      ["Supabase", "PostgreSQL, Auth, Storage, RLS"],
      ["next-intl", "\u00c7ok dilli destek (T\u00fcrk\u00e7e / \u0130ngilizce)"],
      ["Zustand", "Sepet y\u00f6netimi (localStorage ile)"],
      ["Lucide React", "\u0130kon k\u00fct\u00fcphanesi"],
      ["Framer Motion", "Sayfa animasyonlar\u0131"],
    ].map(([tech, usage]) =>
      new TableRow({
        children: [
          cell(tech, techColWidths[0], { bold: true }),
          cell(usage, techColWidths[1]),
        ],
      })
    )),
  ],
});

// Order status table
const statusColWidths = [2400, 2400, 4560];

const orderStatusTable = new Table({
  width: { size: phaseTableWidth, type: WidthType.DXA },
  columnWidths: statusColWidths,
  rows: [
    new TableRow({
      children: [
        headerCell("Durum Kodu", statusColWidths[0]),
        headerCell("T\u00fcrk\u00e7e Ad\u0131", statusColWidths[1]),
        headerCell("A\u00e7\u0131klama", statusColWidths[2]),
      ],
    }),
    ...([
      ["pending", "Beklemede", "Sipari\u015f al\u0131nd\u0131, hen\u00fcz i\u015fleme al\u0131nmad\u0131"],
      ["confirmed", "Onayland\u0131", "Sipari\u015f admin taraf\u0131ndan onayland\u0131"],
      ["shipped", "Kargoya Verildi", "\u00dcr\u00fcn kargoya teslim edildi"],
      ["delivered", "Teslim Edildi", "M\u00fc\u015fteriye ula\u015ft\u0131"],
      ["cancelled", "\u0130ptal Edildi", "Sipari\u015f iptal edildi"],
    ].map(([code, name, desc]) =>
      new TableRow({
        children: [
          cell(code, statusColWidths[0], { bold: true }),
          cell(name, statusColWidths[1]),
          cell(desc, statusColWidths[2]),
        ],
      })
    )),
  ],
});

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22 },
      },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: brandDark },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: brandDark },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "2E86C1" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "\u25E6",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [
    // ===== COVER / TITLE PAGE =====
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: brandGreen, space: 1 } },
              children: [
                new TextRun({ text: "meltemtanik.com", font: "Arial", size: 18, color: brandDark, bold: true }),
                new TextRun({ text: "\tAdmin Panel Teknik Plan\u0131", font: "Arial", size: 18, color: "888888" }),
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Sayfa ", font: "Arial", size: 18, color: "888888" }),
                new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" }),
              ],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({ spacing: { before: 2400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "MELTEM TANIK", font: "Arial", size: 56, bold: true, color: brandDark }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Fonksiyonel Beslenme Uzman\u0131 & B\u00fct\u00fcnsel Sa\u011fl\u0131k Ment\u00f6r\u00fc", font: "Arial", size: 26, color: "666666" }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: brandGreen, space: 8 } },
          children: [],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Admin Panel Teknik Plan\u0131", font: "Arial", size: 40, bold: true, color: brandDark }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Kapsaml\u0131 Y\u00f6netim Paneli Geli\u015ftirme Dok\u00fcman\u0131", font: "Arial", size: 24, color: "888888" }),
          ],
        }),
        new Paragraph({ spacing: { before: 1200 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Tarih: 14 Mart 2026", font: "Arial", size: 22, color: "666666" }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Versiyon: 1.0", font: "Arial", size: 22, color: "666666" }),
          ],
        }),

        // ===== PAGE BREAK =====
        new Paragraph({ children: [new PageBreak()] }),

        // ===== 1. GENEL BAKIS =====
        heading("1. Genel Bak\u0131\u015f", HeadingLevel.HEADING_1),
        para("Bu dok\u00fcman, meltemtanik.com web sitesinin admin panelinin teknik mimarisini, veritaban\u0131 yap\u0131s\u0131n\u0131, kullan\u0131c\u0131 aray\u00fcz\u00fc bile\u015fenlerini ve entegrasyon detaylar\u0131n\u0131 kapsaml\u0131 bi\u00e7imde a\u00e7\u0131klamaktad\u0131r."),
        para("Proje, Meltem Tan\u0131k\u2019\u0131n fonksiyonel beslenme dan\u0131\u015fmanl\u0131\u011f\u0131, Herbalife \u00fcr\u00fcn sat\u0131\u015f\u0131 ve b\u00fct\u00fcnsel sa\u011fl\u0131k hizmetlerini dijital ortama ta\u015f\u0131yan modern bir web uygulamas\u0131d\u0131r. Admin paneli, t\u00fcm i\u00e7erik ve sipari\u015f y\u00f6netimini tek noktadan kontrol etmeyi sa\u011flar."),

        heading("1.1 Projenin Amac\u0131", HeadingLevel.HEADING_2),
        bulletItem("\u00dcr\u00fcn katalo\u011fu y\u00f6netimi (Herbalife \u00fcr\u00fcnleri)"),
        bulletItem("Blog i\u00e7erik y\u00f6netimi (TR/EN \u00e7ok dilli)"),
        bulletItem("Sipari\u015f takibi ve durum y\u00f6netimi"),
        bulletItem("M\u00fc\u015fteri ileti\u015fim mesajlar\u0131n\u0131n izlenmesi"),
        bulletItem("VK\u0130 hesaplay\u0131c\u0131 \u00fczerinden gelen potansiyel m\u00fc\u015fteri leadlerinin takibi"),
        bulletItem("B\u00fclten abone y\u00f6netimi"),
        bulletItem("Kullan\u0131c\u0131 ve yetki y\u00f6netimi"),

        // ===== 2. TEKNOLOJI YIGINI =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("2. Teknoloji Y\u0131\u011f\u0131n\u0131", HeadingLevel.HEADING_1),
        para("Projede kullan\u0131lan ana teknolojiler ve kullan\u0131m ama\u00e7lar\u0131:"),
        techTable,
        new Paragraph({ spacing: { after: 200 } }),

        heading("2.1 Marka Renkleri", HeadingLevel.HEADING_2),
        bulletItem("Ana Ye\u015fil (emerald-500): #2ECC71 \u2014 Ba\u015far\u0131, CTA butonlar\u0131"),
        bulletItem("Turuncu: #E67E22 \u2014 Vurgu, dikkat \u00e7ekme"),
        bulletItem("Koyu Lacivert: #1A1A2E \u2014 Admin sidebar, ba\u015fl\u0131klar"),

        heading("2.2 Rotalama Yap\u0131s\u0131", HeadingLevel.HEADING_2),
        bulletItem("Genel site: /[locale]/... (TR/EN \u00e7ok dilli, next-intl ile)"),
        bulletItem("Admin paneli: /admin/... (i18n d\u0131\u015f\u0131nda, middleware atlat\u0131r)"),
        bulletItem("API rotalar\u0131: /api/... (Next.js Route Handlers)"),

        // ===== 3. GELISTIRME FAZLARI =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("3. Geli\u015ftirme Fazlar\u0131", HeadingLevel.HEADING_1),
        para("Proje 4 ana fazda geli\u015ftirilmi\u015ftir:"),
        phaseTable,
        new Paragraph({ spacing: { after: 200 } }),

        heading("3.1 Faz 1: Veritaban\u0131 & Kimlik Do\u011frulama", HeadingLevel.HEADING_2),
        para("Supabase \u00fczerinde PostgreSQL veritaban\u0131, Row Level Security (RLS) politikalar\u0131, Auth sistemi ve Storage bucket\u2019lar\u0131n\u0131n kurulumunu kapsar."),
        bulletItem("8 ana tablo olu\u015fturuldu (products, blog_posts, orders, vb.)"),
        bulletItem("RLS politikalar\u0131 ile veri eri\u015fim kontrol\u00fc sa\u011fland\u0131"),
        bulletItem("Supabase Auth ile e-posta/\u015fifre do\u011frulama entegre edildi"),
        bulletItem("product-images ve blog-images Storage bucket\u2019lar\u0131 olu\u015fturuldu"),
        bulletItem("profiles tablosu ile admin rol y\u00f6netimi yap\u0131land\u0131r\u0131ld\u0131"),

        heading("3.2 Faz 2: Admin Panel Aray\u00fcz\u00fc", HeadingLevel.HEADING_2),
        para("T\u00fcm admin sayfalar\u0131n\u0131n kullan\u0131c\u0131 aray\u00fcz\u00fc geli\u015ftirmesini kapsar. Responsive tasar\u0131m, mobil sidebar, auth guard mekanizmas\u0131 uyguland\u0131."),
        bulletItem("Sidebar navigasyon ile 8 ana b\u00f6l\u00fcm"),
        bulletItem("Mobil uyumlu overlay sidebar"),
        bulletItem("Client-side auth guard (useEffect ile kontrol)"),
        bulletItem("Her sayfada CRUD i\u015flemleri i\u00e7in formlar ve tablolar"),

        heading("3.3 Faz 3: Frontend Supabase Entegrasyonu", HeadingLevel.HEADING_2),
        para("Frontend sayfalar\u0131n\u0131n Supabase veritaban\u0131na ba\u011flanmas\u0131n\u0131 kapsar."),
        bulletItem("Blog listesi ve detay sayfalar\u0131 Supabase\u2019den veri \u00e7ekiyor"),
        bulletItem("\u0130leti\u015fim formu /api/iletisim \u00fczerinden Supabase\u2019e yaz\u0131yor"),
        bulletItem("Sepet y\u00f6netimi Zustand + localStorage ile"),
        bulletItem("\u00d6deme sayfas\u0131 /api/siparis ile sipari\u015f olu\u015fturuyor"),

        heading("3.4 Faz 4: Build Do\u011frulama", HeadingLevel.HEADING_2),
        para("T\u00fcm derleme hatalar\u0131n\u0131n giderilmesini ve uygulamam\u0131n hatas\u0131z derlenmesini kapsar."),
        bulletItem("9 admin dosyas\u0131nda yanl\u0131\u015f import d\u00fczeltildi"),
        bulletItem("Tip uyumsuzluklar\u0131 giderildi (cover_image, is_published, vb.)"),
        bulletItem("Layout hiyerar\u015fisi d\u00fczenlendi (i\u00e7 i\u00e7e <html> sorunu)"),
        bulletItem("Nullable alan kontrolleri eklendi"),
        bulletItem("next build ba\u015far\u0131yla tamamland\u0131"),

        // ===== 4. VERITABANI YAPISI =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("4. Veritaban\u0131 Yap\u0131s\u0131", HeadingLevel.HEADING_1),
        para("Supabase PostgreSQL \u00fczerinde 8 ana tablo bulunmaktad\u0131r:"),
        dbTable,
        new Paragraph({ spacing: { after: 200 } }),

        heading("4.1 Sipari\u015f Veri Yap\u0131s\u0131", HeadingLevel.HEADING_2),
        para("Sipari\u015fler tablosunda m\u00fc\u015fteri bilgileri shipping_address JSONB alan\u0131nda tutulur:"),
        bulletItem("fullName: M\u00fc\u015fteri ad\u0131 soyad\u0131"),
        bulletItem("email: E-posta adresi"),
        bulletItem("phone: Telefon numaras\u0131"),
        bulletItem("address: A\u00e7\u0131k adres"),
        bulletItem("city: \u015eehir"),
        bulletItem("district: \u0130l\u00e7e"),
        bulletItem("zipCode: Posta kodu"),

        heading("4.2 Sipari\u015f Durumlar\u0131", HeadingLevel.HEADING_2),
        para("Sipari\u015fler 5 farkl\u0131 durumda olabilir:"),
        orderStatusTable,

        // ===== 5. ADMIN PANEL SAYFALARI =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("5. Admin Panel Sayfalar\u0131", HeadingLevel.HEADING_1),
        para("Admin paneli 9 ana sayfadan olu\u015fur:"),
        adminTable,
        new Paragraph({ spacing: { after: 200 } }),

        heading("5.1 Kimlik Do\u011frulama Ak\u0131\u015f\u0131", HeadingLevel.HEADING_2),
        numberedItem("Kullan\u0131c\u0131 /admin/giris sayfas\u0131na y\u00f6nlendirilir"),
        numberedItem("E-posta ve \u015fifre ile Supabase Auth \u00fczerinden giri\u015f yap\u0131l\u0131r"),
        numberedItem("profiles tablosundan rol kontrol\u00fc yap\u0131l\u0131r (role === 'admin')"),
        numberedItem("Admin de\u011filse giri\u015f sayfas\u0131na geri y\u00f6nlendirilir"),
        numberedItem("Ba\u015far\u0131l\u0131 giri\u015fte Dashboard y\u00fcklenir"),

        heading("5.2 Sidebar Navigasyon", HeadingLevel.HEADING_2),
        bulletItem("Koyu lacivert (#1A1A2E) arka plan"),
        bulletItem("Aktif sayfa ye\u015fil vurgu ile belirtilir"),
        bulletItem("Mobilde hamburger men\u00fc ile a\u00e7\u0131l\u0131r/kapan\u0131r"),
        bulletItem("Alt k\u0131s\u0131mda 'Siteye Git' ve '\u00c7\u0131k\u0131\u015f Yap' ba\u011flant\u0131lar\u0131"),

        heading("5.3 \u00dcr\u00fcn Y\u00f6netimi", HeadingLevel.HEADING_2),
        para("\u00d6nemli Not: \u00dcr\u00fcnler siteye eklenirken mutlaka kullan\u0131c\u0131 onay\u0131 al\u0131nmal\u0131d\u0131r. Admin panelinden \u00fcr\u00fcn ekleme/d\u00fczenleme yap\u0131labilir ancak canlıya alma öncesi onay süreci uygulanır.", { bold: false }),
        bulletItem("\u00dcr\u00fcn ekleme: Ad (TR/EN), a\u00e7\u0131klama, fiyat, kategori, g\u00f6rsel"),
        bulletItem("\u00dcr\u00fcn d\u00fczenleme: Mevcut bilgileri g\u00fcncelleme"),
        bulletItem("G\u00f6rsel y\u00fckleme: Supabase Storage (product-images bucket)"),
        bulletItem("Kategori filtreleme ve arama"),

        // ===== 6. API ROTALARI =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("6. API Rotalar\u0131", HeadingLevel.HEADING_1),
        para("Backend i\u015flemleri Next.js Route Handler\u2019lar\u0131 ile ger\u00e7ekle\u015ftirilir:"),

        heading("6.1 POST /api/siparis", HeadingLevel.HEADING_2),
        para("Yeni sipari\u015f olu\u015fturma endpoint\u2019i:"),
        bulletItem("M\u00fc\u015fteri bilgilerini shipping_address JSONB olarak kaydeder"),
        bulletItem("order_items tablosuna sipari\u015f kalemlerini ekler"),
        bulletItem("Zorunlu alanlar: customer_name, customer_email, customer_phone, shipping_address, items"),

        heading("6.2 POST /api/iletisim", HeadingLevel.HEADING_2),
        para("\u0130leti\u015fim formu mesaj\u0131 kaydetme:"),
        bulletItem("contact_messages tablosuna yazar"),
        bulletItem("Alanlar: name, email, phone, message"),

        // ===== 7. STORAGE =====
        heading("7. Dosya Depolama (Storage)", HeadingLevel.HEADING_1),
        para("Supabase Storage ile iki ana bucket kullan\u0131l\u0131r:"),
        bulletItem("product-images: \u00dcr\u00fcn g\u00f6rselleri (public eri\u015fim)"),
        bulletItem("blog-images: Blog kapak g\u00f6rselleri (public eri\u015fim)"),
        para("Her iki bucket da public olarak yap\u0131land\u0131r\u0131lm\u0131\u015ft\u0131r. Admin kullan\u0131c\u0131lar upload i\u015flemi yapabilir."),

        // ===== 8. GUVENLIK =====
        heading("8. G\u00fcvenlik", HeadingLevel.HEADING_1),
        heading("8.1 Row Level Security (RLS)", HeadingLevel.HEADING_2),
        bulletItem("Her tabloda RLS aktif"),
        bulletItem("\u00dcr\u00fcnler ve yay\u0131nlanm\u0131\u015f blog yaz\u0131lar\u0131: Herkese okuma izni"),
        bulletItem("Sipari\u015fler, profiller: Yaln\u0131zca admin eri\u015fimi"),
        bulletItem("\u0130leti\u015fim, b\u00fclten, VK\u0130: Herkes ekleme yapabilir, yaln\u0131zca admin okur"),

        heading("8.2 Auth Guard", HeadingLevel.HEADING_2),
        bulletItem("Admin layout\u2019ta useEffect ile oturum kontrol\u00fc"),
        bulletItem("Oturum yoksa /admin/giris\u2019e y\u00f6nlendirme"),
        bulletItem("profiles tablosundan role kontrol\u00fc (admin olmal\u0131)"),
        bulletItem("Giri\u015f sayfas\u0131 sidebar olmadan render edilir"),

        // ===== 9. DERLEME VE DEPLOY =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("9. Derleme ve Yay\u0131nlama", HeadingLevel.HEADING_1),

        heading("9.1 Ortam De\u011fi\u015fkenleri", HeadingLevel.HEADING_2),
        para(".env.local dosyas\u0131nda a\u015fa\u011f\u0131daki de\u011fi\u015fkenler tan\u0131mlanmal\u0131d\u0131r:"),
        bulletItem("NEXT_PUBLIC_SUPABASE_URL: Supabase proje URL\u2019i"),
        bulletItem("NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase anonim anahtar"),
        bulletItem("SUPABASE_SERVICE_ROLE_KEY: Supabase servis rol\u00fc anahtar\u0131 (sunucu taraf\u0131)"),

        heading("9.2 Derleme Komutlar\u0131", HeadingLevel.HEADING_2),
        bulletItem("npm run dev: Geli\u015ftirme sunucusu (port 3000)"),
        bulletItem("npx next build: \u00dcretim derlemesi"),
        bulletItem("npm start: \u00dcretim sunucusu"),

        heading("9.3 Dosya Yap\u0131s\u0131", HeadingLevel.HEADING_2),
        para("Projenin ana dizin yap\u0131s\u0131:"),
        bulletItem("app/layout.tsx \u2014 K\u00f6k layout (html/body)"),
        bulletItem("app/[locale]/layout.tsx \u2014 Dil layout\u2019u (Header, Footer, i18n)"),
        bulletItem("app/admin/layout.tsx \u2014 Admin layout (sidebar, auth guard)"),
        bulletItem("app/admin/*/page.tsx \u2014 Admin sayfalar\u0131"),
        bulletItem("app/api/*/route.ts \u2014 API endpoint\u2019leri"),
        bulletItem("components/ \u2014 Yeniden kullan\u0131labilir bile\u015fenler"),
        bulletItem("lib/supabase/ \u2014 Supabase istemci yap\u0131land\u0131rmas\u0131"),
        bulletItem("i18n/ \u2014 \u00c7ok dilli yap\u0131land\u0131rma"),
        bulletItem("messages/ \u2014 \u00c7eviri dosyalar\u0131 (tr.json, en.json)"),
        bulletItem("supabase/migrations/ \u2014 Veritaban\u0131 \u015femas\u0131"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("C:/Dev/Meltemtanik/meltem-tanik/docs/admin-panel-plan.docx", buffer);
  console.log("Document created successfully!");
});
