import type { NextConfig } from "next";
const assetOrigin = process.env.NEXT_PUBLIC_ASSET_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";
const nextConfig: NextConfig = { output: "standalone", images: { remotePatterns: [new URL(assetOrigin + "/**")] } };
export default nextConfig;
