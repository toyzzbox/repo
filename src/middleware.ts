import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Session token'ını cookie'den al
  const sessionToken = request.cookies.get('session')?.value;
  
  // Korunması gereken sayfalar
  const protectedPaths = ['/administor'];
  const authPaths = ['/login', '/register'];
  
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some(path => 
    pathname.startsWith(path)
  );
  
  // Korumalı sayfalarda session kontrolü
  if (isProtectedPath && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Auth sayfalarında session varsa ana sayfaya yönlendir
  if (isAuthPath && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Korumalı sayfalar
    '/administor/:path*',
    '/profile/:path*', 
    '/admin/:path*',
    // Auth sayfaları
    '/login',
    '/register'
  ]
};