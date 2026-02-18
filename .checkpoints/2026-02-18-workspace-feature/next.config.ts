import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  // trailingSlash: true,
  // distDir: 'out',
  images: {
    unoptimized: true,
  },
  // Add this for better performance in shared hosting
  // assetPrefix: '/app', 
};

export default nextConfig;