import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['ts', 'tsx'],
  async rewrites() {
    if (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL) return [];
    return [{ source: '/api/:path*', destination: 'http://127.0.0.1:5001/api/:path*' }];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
