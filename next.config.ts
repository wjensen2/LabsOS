import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Exclude Cloudflare Functions from TypeScript checking
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Exclude functions directory
    outputFileTracingExcludes: {
      '*': ['./functions/**/*'],
    },
  },
};

export default nextConfig;
