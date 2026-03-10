import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meltem Tanık",
  description: "Fonksiyonel Beslenme Uzmanı & Bütünsel Sağlık / Yaşam Mentörü",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
