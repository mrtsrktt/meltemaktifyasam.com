import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://meltemaktifyasam.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "Meltem Tanık — Functional Nutrition Expert"
    : "Meltem Tanık — Fonksiyonel Beslenme Uzmanı & Beden Dönüşümü";

  const description = isEn
    ? "Functional nutrition consulting, Herbalife products and holistic health programs. Personalized nutrition plans for body & life transformation."
    : "Fonksiyonel beslenme danışmanlığı, Herbalife ürünleri ve bütünsel sağlık programları. Kişiye özel beslenme planları ile sağlıklı yaşamınıza bugün başlayın.";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: "%s | Meltem Tanık",
      default: title,
    },
    description,
    keywords: [
      "fonksiyonel beslenme",
      "diyetisyen",
      "herbalife",
      "kilo verme",
      "kişisel beslenme planı",
      "vki hesaplama",
      "bmi",
      "beslenme danışmanlığı",
      "sağlıklı yaşam",
      "Meltem Tanık",
    ],
    authors: [{ name: "Meltem Tanık" }],
    creator: "Meltem Tanık",
    publisher: "Meltem Tanık",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "tr-TR": `${baseUrl}/tr`,
        "en-US": `${baseUrl}/en`,
        "x-default": `${baseUrl}/tr`,
      },
    },
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "tr_TR",
      alternateLocale: isEn ? "tr_TR" : "en_US",
      url: `${baseUrl}/${locale}`,
      siteName: "Meltem Tanık",
      title,
      description,
      images: [
        {
          url: "/images/profilfoto-1.png",
          width: 1200,
          height: 1600,
          alt: "Meltem Tanık - Fonksiyonel Beslenme Uzmanı",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/profilfoto-1.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "tr" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
      <NextIntlClientProvider messages={messages}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#065f46",
              color: "white",
              border: "none",
              fontSize: "14px",
              fontWeight: "500",
            },
            duration: 2000,
          }}
        />
      </NextIntlClientProvider>
    </div>
  );
}
