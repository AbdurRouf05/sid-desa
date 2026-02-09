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

        console.log("🛠️ Updating 'analytics_events' rules...");

        try {
            const collection = await pb.collections.getOne('analytics_events');

            // Allow Admins/Data viewers to LIST and VIEW
            // Allow Public (or API) to CREATE
            // Allow Admins to DELETE

            collection.listRule = '@request.auth.id != ""';
            collection.viewRule = '@request.auth.id != ""';
            collection.createRule = ''; // Publicly createable
            collection.updateRule = null; // Immutable logs
            collection.deleteRule = '@request.auth.id != ""';

            await pb.collections.update('analytics_events', collection);
            console.log("✅ Rules updated successfully.");
            console.log("   - List/View: Authenticated Users");
            console.log("   - Create: Public");
            console.log("   - Delete: Authenticated Users");

        } catch (e) {
            console.error("❌ Failed to update collection:", e.message);
        }

    } catch (e) {
        console.error("❌ Error:", e);
    }
}

main();
