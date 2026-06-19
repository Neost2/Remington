import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Allow the logo served from the same origin
    unoptimized: true,
  },
  // Silence the build-time warning about missing NEXT_PUBLIC_ vars in CI
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
  },
};

export default nextConfig;
