const PocketBase = require('pocketbase/cjs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
const envConfig = require('dotenv').config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const adminEmail = envConfig.POCKETBASE_ADMIN_EMAIL;
    const adminPassword = process.argv[2] || envConfig.POCKETBASE_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error("❌ Admin credentials missing.");
        process.exit(1);
    }

    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    try {
        console.log(`🔌 Connecting to ${pbUrl}...`);
        await pb.admins.authWithPassword(adminEmail, adminPassword);

        console.log("🛠️ Updating 'social_feeds' rules...");

        try {
            const collection = await pb.collections.getOne('social_feeds');

            // Allow Public Listing and Viewing
            collection.listRule = ''; // Public
            collection.viewRule = ''; // Public
            collection.createRule = '@request.auth.id != ""'; // Admin only
            collection.updateRule = '@request.auth.id != ""'; // Admin only
            collection.deleteRule = '@request.auth.id != ""'; // Admin only

            await pb.collections.update('social_feeds', collection);
            console.log("✅ Rules updated successfully.");

        } catch (e) {
            console.error("❌ Failed to update collection:", e.message);
        }

    } catch (e) {
        console.error("❌ Error:", e);
    }
}

main();
