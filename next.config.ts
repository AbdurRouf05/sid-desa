import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fmlg8-1.fna.fbcdn.net',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'cp.bmtnulmj.id'
      },
      {
        protocol: 'https',
        hostname: 'db-bmtnulmj.sagamuda.cloud'
      }
    ],
  },
};

export default nextConfig;
