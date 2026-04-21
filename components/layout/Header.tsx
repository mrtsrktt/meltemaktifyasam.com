"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Menu, X, ShoppingBag, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";

const navLinks = [
  { href: "/" as const, key: "home" },
  { href: "/magaza" as const, key: "shop" },
  { href: "/hakkimda" as const, key: "about" },
  { href: "/blog" as const, key: "blog" },
  { href: "/vki-analiz" as const, key: "vki" },
  { href: "/iletisim" as const, key: "contact" },
];

function CartIcon() {
  const totalItems = useCartStore((s) => s.totalItems());
  const [prevCount, setPrevCount] = useState(0);
  const [bump, setBump] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setPrevCount(totalItems);
      return;
    }
    if (totalItems > prevCount) {
      setBump(true);
      setTimeout(() => setBump(false), 600);
    }
    setPrevCount(totalItems);
  }, [totalItems]);

  return (
    <Link href="/sepet">
      <Button
        variant="ghost"
        size="icon"
        className="relative text-white/80 hover:text-white hover:bg-white/10"
      >
        <motion.div
          animate={bump ? { scale: [1, 1.4, 0.9, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <ShoppingBag className="h-4 w-4" />
        </motion.div>
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              key={totalItems}
              initial={{ scale: 0, y: 5 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-[10px] font-bold text-white shadow-md shadow-red-500/30 ring-2 ring-white"
            >
              {totalItems > 99 ? "99+" : totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </Link>
  );
}

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
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-brand-dark/95 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_transparent.png"
            alt="Meltem Tanık"
            width={180}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-brand-green ${
                pathname === link.href
                  ? "text-brand-green bg-white/10"
                  : "text-white/80"
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
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <CartIcon />
          <Link href="/hesabim">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
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
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <CartIcon />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle>
                <Image
                  src="/logo_transparent.png"
                  alt="Meltem Tanık"
                  width={150}
                  height={40}
                  className="h-9 w-auto"
                />
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
