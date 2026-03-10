"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Menu, X, ShoppingBag, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/" as const, key: "home" },
  { href: "/magaza" as const, key: "shop" },
  { href: "/hakkimda" as const, key: "about" },
  { href: "/blog" as const, key: "blog" },
  { href: "/vki-analiz" as const, key: "vki" },
  { href: "/iletisim" as const, key: "contact" },
];

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const switchLocale = () => {
    const newLocale = locale === "tr" ? "en" : "tr";
    router.replace(pathname as "/", { locale: newLocale });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold font-heading text-brand-dark">
            Meltem
          </span>
          <span className="text-xl font-bold font-heading text-brand-green">
            Tanık
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-brand-green ${
                pathname === link.href
                  ? "text-brand-green bg-accent"
                  : "text-foreground/70"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={switchLocale}
            title={locale === "tr" ? "English" : "Türkçe"}
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Link href="/sepet">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/hesabim">
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/vki-analiz">
            <Button className="bg-brand-green hover:bg-brand-green-dark text-white">
              {t("vki")}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={switchLocale}
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Link href="/sepet">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-heading text-brand-dark">
                Meltem <span className="text-brand-green">Tanık</span>
              </SheetTitle>
              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent ${
                      pathname === link.href
                        ? "text-brand-green bg-accent"
                        : "text-foreground/70"
                    }`}
                  >
                    {t(link.key)}
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4">
                  <Link
                    href="/hesabim"
                                       onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-foreground/70 hover:bg-accent"
                  >
                    <User className="h-4 w-4" />
                    {t("account")}
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
