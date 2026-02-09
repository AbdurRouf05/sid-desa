const PocketBase = require('pocketbase/cjs');
const path = require('path');
const fs = require('fs');

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
const envConfig = require('dotenv').config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const adminEmail = envConfig.POCKETBASE_ADMIN_EMAIL;
    const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD || envConfig.POCKETBASE_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error("❌ Admin credentials missing in .env.local or environment variables.");
        console.error("   Need POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD.");
        process.exit(1);
    }

    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    try {
        console.log(`🔌 Connecting to ${pbUrl}...`);
        await pb.admins.authWithPassword(adminEmail, adminPassword);

        const collectionName = 'analytics_monthly';
        console.log(`🛠️  Checking collection '${collectionName}'...`);

        try {
            const collection = await pb.collections.getOne(collectionName);
            console.log(`⚠️ Collection '${collectionName}' exists. Deleting to ensure clean schema...`);
            await pb.collections.delete(collection.id);
            console.log(`✅ Deleted old collection.`);
        } catch (e) {
            // Not found, safe to proceed
        }

        console.log(`✨ Creating '${collectionName}' collection...`);

        const fieldDef = [
            {
                name: 'month_key',
                type: 'text',
                required: true,
                presentable: true,
                unique: true,
                options: {
                    min: 7,
                    max: 7, // YYYY-MM
                    pattern: ""
                }
            },
            {
                name: 'data',
                type: 'json',
                required: true,
                presentable: false,
                options: {
                    maxSize: 2000000 // 2MB
                }
            }
        ];

        await pb.collections.create({
            name: collectionName,
            type: 'base',
            fields: fieldDef,
            schema: fieldDef, // DOUBLE SEND for compatibility (v0.25+ uses fields, older uses schema)
            indexes: [],
            createRule: null,
            updateRule: null,
            deleteRule: null,
        });
        console.log(`✅ Collection '${collectionName}' created successfully with CORRECT schema.`);

    } catch (e) {
        console.error("❌ Error:", e.message);
        if (e.data) console.error("Data:", JSON.stringify(e.data, null, 2));
    }
}

main();
