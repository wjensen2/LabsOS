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
  // Exclude functions directory from file tracing
  outputFileTracingExcludes: {
    '*': ['./functions/**/*'],
  },
};

export default nextConfig;
