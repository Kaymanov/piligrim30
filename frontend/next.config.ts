import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  images: {
    // The frontend container has restricted outbound network access, so the
    // built-in image optimizer (which fetches remote images server-side)
    // fails for most media URLs. Images are already optimized to WebP by
    // Django on upload, so we disable optimization and let the browser load
    // them directly from nginx.
    unoptimized: true,
    remotePatterns: [
      // Local Django dev server (media files)
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
        pathname: "/media/**",
      },
      // Production domains (media served via Nginx on same host)
      {
        protocol: "https",
        hostname: "test.piligrim30.ru",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "piligrim30.ru",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
