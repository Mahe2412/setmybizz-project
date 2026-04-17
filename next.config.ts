import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {
      root: path.resolve(__dirname),
    },
  },
  async redirects() {
    return [
      { source: '/dashboard',   destination: '/os', permanent: false },
      { source: '/dashboard-a', destination: '/os', permanent: false },
      { source: '/workspace',   destination: '/os', permanent: false },
    ];
  },
};

export default nextConfig;