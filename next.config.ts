import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
