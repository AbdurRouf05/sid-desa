const PocketBase = require('pocketbase/cjs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
const envConfig = dotenv.config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    console.log(`🔌 Connecting to ${pbUrl}...`);

    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    try {
        console.log("🛠️ Testing getFirstListItem('') (Anonymous)...");
        try {
            const record = await pb.collection('site_config').getFirstListItem('', {
                sort: '-created',
            });
            console.log("✅ getFirstListItem Success!");
            console.log("Social Links:", record.social_links);
        } catch (e) {
            console.log("❌ getFirstListItem Failed:", e.message, e.status);
        }

    } catch (e) {
        console.error("❌ General Error:", e);
    }
}

main();
