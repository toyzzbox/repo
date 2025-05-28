// middleware.ts
export { auth as middleware } from "./auth";

// → Örneğin /dashboard route’unu korumak için ekle:
export const config = {
  matcher: ["/dashboard/:path*"],
};
