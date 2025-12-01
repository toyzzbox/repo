import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ✅ Google login avatarları
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

      // ✅ Cloudflare CDN → S3
      {
        protocol: "https",
        hostname: "cdn.toyzzbox.com",
        pathname: "/**",
      },

      // ✅ GEÇİCİ: Eski S3 URL'ler hata vermesin diye (birazdan bunu kaldıracağız)
      {
        protocol: "https",
        hostname: "toyzzbox.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],

    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
