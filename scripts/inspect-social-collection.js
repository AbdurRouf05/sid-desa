const PocketBase = require('pocketbase/cjs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
const envConfig = dotenv.config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const adminEmail = envConfig.POCKETBASE_ADMIN_EMAIL;
    const adminPassword = process.argv[2] || envConfig.POCKETBASE_ADMIN_PASSWORD;

    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    try {
        console.log(`🔌 Connecting to ${pbUrl}...`);
        await pb.admins.authWithPassword(adminEmail, adminPassword);

        const collection = await pb.collections.getOne('social_feeds');
        console.log("Current System Fields:", collection.system);

        // Try to enable system fields
        if (collection.system === false) {
            console.log("🛠️ Attempting to enable system fields...");
            collection.system = true;
            try {
                await pb.collections.update('social_feeds', collection);
                console.log("✅ System fields enabled!");
            } catch (e) {
                console.error("❌ Failed to enable system fields:", e.message);
                // If this fails, we might need to recreate the collection
            }
        }

        // 2. Test Fetch (Anonymous first, simulating public access if applicable, or Admin if that's how dashboard works)
        // Dashboard uses Admin auth usually (since it's /panel).
        // But the previous error was ClientResponseError.

        console.log("\n🧪 Testing Fetch with sort: '-created'...");
        try {
            const result = await pb.collection('social_feeds').getList(1, 10, {
                sort: '-created'
            });
            console.log("✅ Fetch Success! Items:", result.totalItems);
        } catch (e) {
            console.error("❌ Fetch Failed (Admin):", e.statusCode, e.message);
            if (e.response) console.log("   Details:", JSON.stringify(e.response, null, 2));
        }

    } catch (e) {
        console.error("❌ General Error:", e);
    }
}

main();
