import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/hakkimda": {
      tr: "/hakkimda",
      en: "/about",
    },
    "/magaza": {
      tr: "/magaza",
      en: "/shop",
    },
    "/magaza/[slug]": {
      tr: "/magaza/[slug]",
      en: "/shop/[slug]",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/vki-analiz": {
      tr: "/vki-analiz",
      en: "/bmi-analysis",
    },
    "/iletisim": {
      tr: "/iletisim",
      en: "/contact",
    },
    "/sepet": {
      tr: "/sepet",
      en: "/cart",
    },
    "/odeme": {
      tr: "/odeme",
      en: "/checkout",
    },
    "/hesabim": {
      tr: "/hesabim",
      en: "/my-account",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
