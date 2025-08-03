import type { NextConfig } from "next";
import { HOST, PORT } from "./src/utils/constants";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: HOST,
        port: PORT,
        pathname: '/api/**',
      },
      {
        protocol: 'http',
        hostname: HOST,
        port: PORT,
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
