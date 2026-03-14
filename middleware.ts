import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Admin routes bypass i18n middleware
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/admin",
    "/admin/:path*",
    "/(tr|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)"],
};
