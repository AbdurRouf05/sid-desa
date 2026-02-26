import { MetadataRoute } from 'next';
import { pb } from '@/lib/pb';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://sumberanyar.local:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/tentang-kami`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/tentang-kami`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/berita`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/kontak`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    // Dynamic Routes from PocketBase
    let newsRoutes: MetadataRoute.Sitemap = [];

    try {
        // Fetch all published news
        const news = await pb.collection('news').getFullList({
            filter: 'published = true',
            fields: 'slug,updated',
        });

        newsRoutes = news.map((item) => ({
            url: `${BASE_URL}/berita/${item.slug}`,
            lastModified: new Date(item.updated),
            changeFrequency: 'daily',
            priority: 0.8,
        }));
    } catch (error) {
        console.error('Error fetching news for sitemap:', error);
    }

    return [...staticRoutes, ...newsRoutes];
}
