import type { MetadataRoute } from 'next';

const publicRoutes = [
  '/',
  '/about',
  '/cocteleria',
  '/contact',
  '/condiciones-de-servicio',
  '/cotizador',
  '/locations',
  '/order-online',
  '/pasteleria',
  '/politica-de-privacidad',
  '/tortas',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `https://pasteleriahijitos.cl${route}`,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route.includes('politica') || route.includes('condiciones') ? 0.3 : 0.7,
  }));
}
