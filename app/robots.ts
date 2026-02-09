import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/panel/',
        },
        sitemap: 'https://bmtnulumajang.id/sitemap.xml',
    };
}
