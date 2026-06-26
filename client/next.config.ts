import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/home',
        permanent: true,
      },
      {
        source: '/counsellor/dashboard',
        destination: '/overview',
        permanent: true,
      },
      {
        source: '/chat',
        destination: '/buddy',
        permanent: true,
      },
      {
        source: '/mood',
        destination: '/journey',
        permanent: true,
      },
      {
        source: '/assessment',
        destination: '/journey',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
