import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ['ik.imagekit.io', 'raw.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
