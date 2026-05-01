import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://desasumberanyar.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/panel/', '/api/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
