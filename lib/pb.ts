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
