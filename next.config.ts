import type { NextConfig } from "next";
  /** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
