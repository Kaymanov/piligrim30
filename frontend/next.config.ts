import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  images: {
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
