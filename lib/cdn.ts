
/**
 * Generates a "Secure" CDN URL for an asset.
 * This proxies the request through our Next.js server to hide the upstream PocketBase URL.
 * 
 * Format: /cdn/secure/[collectionId]/[recordId]/[filename]
 */
export function getSecureAssetUrl(collectionId: string, recordId: string, filename: string): string {
    if (!filename) return "";
    return `/cdn/secure/${collectionId}/${recordId}/${filename}`;
}

/**
 * Helper to get URL from a PocketBase RecordModel (or any object with id/collectionId)
 */
export function getAssetUrl(record: any, filename: string): string {
    if (!record || !filename) return "";

    // 1. Defensive Interceptor: Check for broken Unsplash URL
    const brokenId = "photo-1577083639236-0f52ba0b5273";
    const workingFallback = "https://images.pexels.com/photos/34528447/pexels-photo-34528447.jpeg";

    if (filename.includes(brokenId)) {
        return workingFallback;
    }

    // 2. If it's already an absolute URL (not from PB), return it directly
    if (filename.startsWith('http')) {
        return filename;
    }

    // Handle both direct record objects and expanded ones
    const collectionId = record.collectionId || record.collectionName; // collectionName fallback if id missing (rare)
    const recordId = record.id;

    if (!collectionId || !recordId) return "";

    return getSecureAssetUrl(collectionId, recordId, filename);
}
