import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import trMessages from "@/messages/tr.json";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "60 Günde Hayalini Kurduğun Bedene | Meltem Tanık",
  description:
    "60 Gün VIP Birebir Danışmanlık — Kampanyaya özel 9.900 ₺. Tahlil bazlı, kişiye özel fonksiyonel beslenme programı. Meltem Tanık ile dönüşümünüzü başlatın.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "60 Günde Hayalini Kurduğun Bedene",
    description:
      "Kampanyaya özel 9.900 ₺ — 60 gün boyunca birebir VIP danışmanlık.",
    type: "website",
  },
};

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider locale="tr" messages={trMessages}>
      <div
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
