import type { NextConfig } from "next";
const backendInternalUrl = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8081";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [{ source: "/api/public/assets/:path*", destination: `${backendInternalUrl}/api/public/assets/:path*` }];
  },
};

export default nextConfig;
