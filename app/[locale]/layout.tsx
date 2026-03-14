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

export const metadata: Metadata = {
  title: {
    template: "%s | Meltem Tanık",
    default: "Meltem Tanık — Beslenme & Dönüşüm Uzmanı",
  },
  description:
    "Fonksiyonel beslenme danışmanlığı, Herbalife ürünleri ve bütünsel sağlık programları. Girişimci zihinler için beden & yaşam dönüşümü.",
  robots: { index: true, follow: true },
};

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
