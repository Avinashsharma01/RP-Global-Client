import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  experimental: {
    agentFeedback: true,
    agentUpgrade: "security",
  },
  images: {
    qualities: [60, 75, 80, 85, 90],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.INTERNAL_API_URL || "http://localhost:5000"}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
