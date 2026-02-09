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
        console.log("🛠️ Fetching site_config (Public/Anonymous)...");
        // Try anonymous first (some configs might be public)
        try {
            const result = await pb.collection('site_config').getList(1, 1);
            console.log("✅ Anonymous Fetch Success! Items:", result.totalItems);
        } catch (e) {
            console.log("⚠️ Anonymous Fetch Failed:", e.status);
        }

        // Try Admin
        const adminEmail = envConfig.POCKETBASE_ADMIN_EMAIL;
        const adminPassword = process.argv[2] || envConfig.POCKETBASE_ADMIN_PASSWORD;
        if (adminEmail && adminPassword) {
            console.log("\n🔐 Authenticating as Admin...");
            await pb.admins.authWithPassword(adminEmail, adminPassword);
            const result = await pb.collection('site_config').getList(1, 1);
            console.log("✅ Admin Fetch Success! Items:", result.totalItems);
            if (result.items.length > 0) {
                console.log("   Data:", JSON.stringify(result.items[0], null, 2));
            }
        }

    } catch (e) {
        console.error("❌ General Error:", e);
    }
}

main();
