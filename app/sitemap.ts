import { MetadataRoute } from 'next';
import { SERVICES } from '@/lib/services-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://setmybizz.com';

  // Core pages
  const routes = [
    '',
    '/platform',
    '/start-in-india',
    '/onboarding',
    '/incorporation',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic service pages for Pvt Ltd, GST, Trademark, MSME, etc.
  const serviceRoutes = SERVICES.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...serviceRoutes];
}
