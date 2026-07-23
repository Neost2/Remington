import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_CAREPATH_API_URL: process.env.NEXT_PUBLIC_CAREPATH_API_URL ?? "http://localhost:3000/api",
  },
};

export default nextConfig;