import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Turbopack is used in dev, webpack config is ignored or causes warnings.
  // If you need to ignore files in Turbopack, use appropriate turbo config.
  // For now, removing webpack config to resolve conflicts.
};

export default nextConfig;
