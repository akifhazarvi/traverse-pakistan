import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/traverse-pakistan",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "traversepakistan.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.traversepakistan.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "www.traversepakistan.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "traversepakistan.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
    // Use unoptimized for external WordPress images to avoid SSL cert issues
    // In production with proper SSL, remove this and let Next.js optimize
    unoptimized: true,
  },
};

export default nextConfig;
