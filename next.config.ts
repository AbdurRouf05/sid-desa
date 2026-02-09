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
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.ggpht.com',
      },
      {
        protocol: 'https',
        hostname: '**.tiktokcdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.instagram.com',
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
      },
      {
        protocol: 'https',
        hostname: 'bmtnulumajang.id'
      }

    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['bmtnulmj.local:3040', 'cp.bmtnulmj.local:3040', 'localhost:3040']
    }
  }
};

export default nextConfig;
