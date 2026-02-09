const PocketBase = require('pocketbase/cjs');
const PocketBaseUrl = 'https://db-bmtnulmj.sagamuda.cloud'; // Use the cloud URL as in next.config.ts

async function main() {
    const pb = new PocketBase(PocketBaseUrl);
    try {
        const records = await pb.collection('social_feeds').getList(1, 10, {
            sort: '-id'
        });
        console.log(`Found ${records.items.length} public records.`);
        records.items.forEach(r => {
            console.log(`ID: ${r.id}, Platform: ${r.platform}, Active: ${r.is_active}, Pinned: ${r.is_pinned}`);
        });
    } catch (e) {
        console.error("Public fetch failed:", e.message);
    }
}

main();
