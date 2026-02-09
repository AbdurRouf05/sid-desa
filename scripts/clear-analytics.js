const PocketBase = require('pocketbase/cjs');
const path = require('path');
const envPath = path.join(__dirname, '../.env.local');
const envConfig = require('dotenv').config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const adminEmail = envConfig.POCKETBASE_ADMIN_EMAIL;
    const adminPassword = process.argv[2] || envConfig.POCKETBASE_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error("❌ Admin credentials missing (check .env.local).");
        process.exit(1);
    }

    const pb = new PocketBase(pbUrl);

    try {
        await pb.admins.authWithPassword(adminEmail, adminPassword);
        console.log("🔓 Authenticated as admin.");

        const records = await pb.collection('analytics_events').getFullList({
            fields: 'id'
        });

        console.log(`🗑️ Deleting ${records.length} analytics records...`);
        for (const record of records) {
            await pb.collection('analytics_events').delete(record.id);
        }
        console.log("✅ Cleanup complete!");
    } catch (e) {
        console.error("❌ Failed:", e.message);
    }
}

main();
