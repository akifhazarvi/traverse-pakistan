import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isProd ? "export" : undefined,
  basePath: isProd ? "/traverse-pakistan" : "",
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
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    // Use unoptimized for external WordPress images to avoid SSL cert issues
    // In production with proper SSL, remove this and let Next.js optimize
    unoptimized: true,
  },
};

export default nextConfig;
