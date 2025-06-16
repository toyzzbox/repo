// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Giriş yapılmamışsa veya admin değilse yönlendir
  if (!session || session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  // Giriş yapılmış ve admin ise → devam et
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/administor/:path*"], // ➕ Admin route'ları da eklendi
};
