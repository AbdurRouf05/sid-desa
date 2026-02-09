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

        console.log("🛠️ Upgrading 'analytics_events' schema...");

        try {
            const collection = await pb.collections.getOne('analytics_events');

            // Helper to check if field exists
            const hasField = (name) => collection.fields.some(f => f.name === name);

            const newFields = [];

            if (!hasField('referrer')) {
                newFields.push({
                    name: "referrer",
                    type: "text",
                    required: false,
                    presentable: false,
                    system: false
                });
            }

            if (!hasField('user_agent')) {
                newFields.push({
                    name: "user_agent",
                    type: "text",
                    required: false,
                    presentable: false,
                    system: false
                });
            }

            if (!hasField('source')) {
                newFields.push({
                    name: "source", // e.g. "google", "direct", "facebook"
                    type: "text",
                    required: false,
                    presentable: false,
                    system: false
                });
            }

            if (!hasField('country')) {
                newFields.push({
                    name: "country",
                    type: "text",
                    required: false,
                    presentable: false,
                    system: false
                });
            }

            if (newFields.length > 0) {
                collection.fields.push(...newFields);
                await pb.collections.update('analytics_events', collection);
                console.log(`✅ Added ${newFields.length} new fields:`, newFields.map(f => f.name).join(', '));
            } else {
                console.log("✅ Schema already up to date.");
            }

        } catch (e) {
            console.error("❌ Failed to update collection:", e.message);
        }

    } catch (e) {
        console.error("❌ Error:", e);
    }
}

main();
