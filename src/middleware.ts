import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Korunmasını istediğiniz route'lar
const protectedRoutes = ["/dashboard", "/profile", "/settings"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session")?.value;

  // Session token kontrolü
  let isAuthenticated = false;
  if (sessionToken) {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });

      if (session && session.expires > new Date()) {
        isAuthenticated = true;
      } else if (session) {
        // Süresi dolmuş session'ı temizle
        await prisma.session.delete({
          where: { sessionToken },
        });
      }
    } catch (error) {
      console.error("Session kontrolü hatası:", error);
      isAuthenticated = false;
    }
  }

  // Korunmuş route'lara erişim kontrolü
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Giriş yapmış kullanıcıların auth sayfalarına erişimini engelle
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};