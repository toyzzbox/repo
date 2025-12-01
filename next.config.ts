import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ✅ Google login avatarları için kalsın
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

      // ✅ ARTIK GÖRSELLER BURADAN GELECEK (Cloudflare CDN → S3)
      {
        protocol: "https",
        hostname: "cdn.toyzzbox.com", // 🔴 BURAYI KENDİ DOMAIN'İN İLE DEĞİŞTİR
        pathname: "/**",
      },
    ],

    // ✅ EN MODERN FORMATLAR
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
