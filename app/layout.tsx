import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meltem Tanık",
  description: "Fonksiyonel Beslenme Uzmanı & Bütünsel Sağlık / Yaşam Mentörü",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
