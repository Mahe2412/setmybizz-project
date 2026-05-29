import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/os/'],
    },
    sitemap: 'https://setmybizz.com/sitemap.xml',
  };
}
