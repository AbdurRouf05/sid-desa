const PocketBase = require('pocketbase/cjs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
const envConfig = require('dotenv').config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const adminEmail = envConfig.POCKETBASE_ADMIN_EMAIL;
    const adminPassword = envConfig.POCKETBASE_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error("❌ Admin credentials missing.");
        process.exit(1);
    }

    const pb = new PocketBase(pbUrl);

    try {
        console.log(`🔌 Connecting to ${pbUrl}...`);
        await pb.admins.authWithPassword(adminEmail, adminPassword);

        console.log("🛠️ Adding 'thumbnail_url' to 'social_feeds'...");
        const collection = await pb.collections.getOne('social_feeds');

        const hasField = collection.fields.some(f => f.name === 'thumbnail_url');
        if (!hasField) {
            collection.fields.push({
                name: "thumbnail_url",
                type: "url",
                required: false,
                system: false
            });
            await pb.collections.update('social_feeds', collection);
            console.log("✅ Field 'thumbnail_url' added.");
        } else {
            console.log("✅ Field already exists.");
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

main();
