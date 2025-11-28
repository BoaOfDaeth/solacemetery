import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    PORT: '2888',
  },
  output: 'standalone',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
