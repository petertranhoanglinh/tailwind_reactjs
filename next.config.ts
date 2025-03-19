import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.IS_OUTPUT_EXPORT ? "export" : "standalone",
  basePath: "", // Đặt về gốc
  async redirects() {
    return [];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.justboil.me",
      },
    ],
  },
};

export default nextConfig;
