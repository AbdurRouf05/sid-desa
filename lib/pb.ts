import PocketBase from 'pocketbase';

// Singleton pattern to prevent multiple instances
let pb: PocketBase;

if (typeof window === "undefined") {
    // Server-side
    pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090");
} else {
    // Client-side
    if (!(window as any).pb) {
        (window as any).pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    }
    pb = (window as any).pb;
}

// Global Auth Store auto-sync
pb.autoCancellation(false);

export { pb };

export async function getSiteConfig(): Promise<any> {
    try {
        const records = await pb.collection('site_config').getList(1, 1);
        return records.items[0] || {};
    } catch (e) {
        // Fallback if no config exists yet (should be seeded though)
        console.warn("getSiteConfig failed", e);
        return {};
    }
}

export interface SearchResult {
    id: string;
    collectionId: string;
    title: string;
    description: string;
    thumbnail: string;
    type: 'produk' | 'berita';
    url: string;
    created: string;
}

export async function searchContent(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    try {
        const [products, news] = await Promise.all([
            pb.collection('products').getList(1, 10, {
                filter: `name ~ "${query}" || description ~ "${query}"`,
                sort: '-created'
            }),
            pb.collection('news').getList(1, 10, {
                filter: `title ~ "${query}" || content ~ "${query}"`,
                sort: '-created'
            })
        ]);

        const formatProduct = (item: any): SearchResult => ({
            id: item.id,
            collectionId: item.collectionId,
            title: item.name,
            description: item.description?.replace(/<[^>]*>/g, '').substring(0, 150) || "",
            thumbnail: item.icon ? item.icon : "", // Products might use 'icon' or 'image' depending on schema, usually 'icon' for BMT products
            type: 'produk',
            url: `/produk/${item.slug}`,
            created: item.created
        });

        const formatNews = (item: any): SearchResult => ({
            id: item.id,
            collectionId: item.collectionId,
            title: item.title,
            description: item.content?.replace(/<[^>]*>/g, '').substring(0, 150) || "",
            thumbnail: item.thumbnail,
            type: 'berita',
            url: `/berita/${item.slug}`,
            created: item.created
        });

        return [
            ...products.items.map(formatProduct),
            ...news.items.map(formatNews)
        ].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    } catch (e) {
        console.error("Search failed:", e);
        return [];
    }
}
