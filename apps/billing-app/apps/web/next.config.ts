import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@billease/db", "@billease/shared"],
  experimental: {
    externalDir: true,
    optimizePackageImports: ["lucide-react"],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@billease/db": path.resolve(__dirname, "../../packages/db/src"),
      "@billease/shared": path.resolve(__dirname, "../../packages/shared/src"),
    };
    return config;
  },
};

export default nextConfig;
