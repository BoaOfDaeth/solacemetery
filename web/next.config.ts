import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Disable image optimization
  images: {
    unoptimized: true,
  },

  // Optimize for production
  experimental: {
    // Enable optimizations
    optimizePackageImports: [],
  },

  // Environment variables that should be available at build time
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
