import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'zs52xq5p-3000.inc1.devtunnels.ms'
      ]
    }
  }
};

export default nextConfig;
