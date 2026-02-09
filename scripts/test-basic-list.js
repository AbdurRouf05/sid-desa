const PocketBase = require('pocketbase/cjs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '../.env.local');
const envConfig = dotenv.config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    try {
        console.log("Testing getList(1, 1) without sort...");
        const r1 = await pb.collection('site_config').getList(1, 1);
        console.log("✅ Success! ID:", r1.items[0]?.id);
        console.log("Social:", JSON.stringify(r1.items[0]?.social_links));

        console.log("\nTesting getFirstListItem(id)...");
        // Try getting by ID if we found one
        if (r1.items.length > 0) {
            const id = r1.items[0].id;
            const r2 = await pb.collection('site_config').getOne(id);
            console.log("✅ Success! ID:", r2.id);
        }
    } catch (e) {
        console.error("❌ Error:", e.message, e.data);
    }
}

main();
