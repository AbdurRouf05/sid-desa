
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
    // Handle both direct record objects and expanded ones
    const collectionId = record.collectionId || record.collectionName; // collectionName fallback if id missing (rare)
    const recordId = record.id;

    if (!collectionId || !recordId) return "";

    return getSecureAssetUrl(collectionId, recordId, filename);
}
