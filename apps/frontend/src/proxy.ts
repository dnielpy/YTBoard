import createMiddleware from "next-intl/middleware";
import { routing } from "./app/i18n/routing";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const publicRoutes = ["/auth"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isPublic = publicRoutes.some((route) => pathname.includes(route));

  if (!isPublic && !req.auth) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
