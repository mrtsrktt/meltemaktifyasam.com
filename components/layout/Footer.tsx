"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Instagram, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-heading text-white">
                Meltem
              </span>
              <span className="text-xl font-bold font-heading text-brand-green">
                Tanık
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-400">{t("description")}</p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://instagram.com/meltem.tanik"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-brand-green"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905412523421"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-brand-green"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href="mailto:info@meltemaktifyasam.com"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-brand-green"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-green">
              {t("quickLinks")}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {nav("home")}
                </Link>
              </li>
              <li>
                <Link href="/magaza" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {nav("shop")}
                </Link>
              </li>
              <li>
                <Link href="/hakkimda" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {nav("about")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {nav("blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-green">
              {t("support")}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/vki-analiz" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {nav("vki")}
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {nav("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-green">
              Yasal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/gizlilik-politikasi" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="text-sm text-gray-400 hover:text-white transition-colors">
                  KVKK
                </Link>
              </li>
              <li>
                <Link href="/iade-politikasi" className="text-sm text-gray-400 hover:text-white transition-colors">
                  İade Politikası
                </Link>
              </li>
              <li>
                <Link href="/teslimat-kosullari" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Teslimat Koşulları
                </Link>
              </li>
              <li>
                <Link href="/mesafeli-satis-sozlesmesi" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-green">
              {t("followUs")}
            </h3>
            <div className="mt-4">
              <a
                href="https://instagram.com/meltem.tanik"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-4 w-4" />
                @meltem.tanik
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Meltem Tanık. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
