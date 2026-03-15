import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const intlMiddleware = createIntlMiddleware(routing);

async function refreshSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();
  return response;
}

export default async function middleware(request: NextRequest) {
  // Admin routes bypass i18n middleware
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const response = NextResponse.next();
    return refreshSession(request, response);
  }

  const response = intlMiddleware(request);
  return refreshSession(request, response);
}

export const config = {
  matcher: [
    "/",
    "/admin",
    "/admin/:path*",
    "/(tr|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)"],
};
