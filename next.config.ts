/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.IS_OUTPUT_EXPORT ? "export" : "standalone",
  basePath: "",
  async redirects() {
    return [];
  },
  images: {
    unoptimized: true, // ✅ Bỏ qua tối ưu hóa ảnh khi export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.justboil.me",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 Tắt ESLint khi build
  },
  env: {
    NEXT_PUBLIC_URL_API: process.env.NEXT_PUBLIC_URL_API,
  },
};

module.exports = nextConfig;
