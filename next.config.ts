import type { NextConfig } from 'next';
// import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.blogs.es',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imagenes.pasteleriahijitos.cl',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default async function config() {
  // Use setupDevPlatform for local development with Cloudflare bindings
  if (process.env.NODE_ENV === 'development') {
    const { setupDevPlatform } = await import('@cloudflare/next-on-pages/next-dev');
    await setupDevPlatform();
  }
  return nextConfig;
}
