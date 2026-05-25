import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  // Don't strip trailing slashes from URLs (Django needs them with APPEND_SLASH)
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : "http://backend:8000/api/:path*", // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
