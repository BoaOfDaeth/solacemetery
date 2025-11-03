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
    // Inline critical CSS to prevent white flash
    inlineCss: true,
  },

  // Environment variables that should be available at build time
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    BUILD_DATE: process.env.BUILD_DATE,
  },
};

export default nextConfig;
