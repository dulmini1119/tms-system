// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:3001/auth/:path*",
      },
      {
        source: "/users/:path*",
        destination: "http://localhost:3001/users/:path*",
      },
      {
        source: "/roles/:path*",
        destination: "http://localhost:3001/roles/:path*",
      },
      {
        source: "/permissions/:path*",
        destination: "http://localhost:3001/permissions/:path*",
      },
      // Add more modules here later
      // { source: "/trips/:path*", destination: "http://localhost:3000/trips/:path*" },
    ];
  },

  // Optional: if you ever upload profile pictures or files to backend
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
  },
};

export default nextConfig;