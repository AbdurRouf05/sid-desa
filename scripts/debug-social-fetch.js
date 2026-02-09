const PocketBase = require('pocketbase/cjs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
const envConfig = require('dotenv').config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    try {
        console.log(`🔌 Connecting to ${pbUrl}...`);

        // Try the exact query that failed
        console.log("1. Testing original query...");
        try {
            const records = await pb.collection('social_feeds').getList(1, 8, {
                sort: '-is_pinned,-created',
                filter: 'is_active = true',
            });
            console.log("   ✅ Original query SUCCESS:", records.items.length, "items");
        } catch (e) {
            console.error("   ❌ Original query FAILED:", e.response?.message || e.message);
        }

        // Try without is_pinned sort
        console.log("2. Testing without 'is_pinned' sort...");
        try {
            const records = await pb.collection('social_feeds').getList(1, 8, {
                sort: '-created',
                filter: 'is_active = true',
            });
            console.log("   ✅ Simple query SUCCESS:", records.items.length, "items");
        } catch (e) {
            console.error("   ❌ Simple query FAILED:", e.response?.message || e.message);
        }

    } catch (e) {
        console.error("❌ Error:", e);
    }
}

main();
