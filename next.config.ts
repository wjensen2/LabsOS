import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages compatible configuration
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
