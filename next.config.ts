import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "toyzzbox.s3.eu-north-1.amazonaws.com",
      },
    ],
  },

  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
