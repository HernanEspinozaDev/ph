import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/ventas', '/api/'],
    },
    sitemap: 'https://pasteleriahijitos.cl/sitemap.xml',
    host: 'https://pasteleriahijitos.cl',
  };
}
