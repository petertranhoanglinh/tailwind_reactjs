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
};

module.exports = nextConfig;
