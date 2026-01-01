import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // eslint configuration moved to separate config file
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
