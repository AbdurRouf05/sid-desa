import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/panel/',
        },
        sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'http://sumberanyar.local:3000'}/sitemap.xml`,
    };
}
