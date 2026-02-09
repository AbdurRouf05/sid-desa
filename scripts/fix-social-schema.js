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

        console.log("🛠️ Checking 'social_feeds' schema...");

        try {
            const collection = await pb.collections.getOne('social_feeds');

            const hasField = (name) => collection.fields.some(f => f.name === name);
            const newFields = [];

            if (!hasField('is_pinned')) {
                newFields.push({
                    name: "is_pinned",
                    type: "bool",
                    required: false,
                    presentable: false,
                    system: false
                });
            }

            if (!hasField('is_active')) {
                newFields.push({
                    name: "is_active",
                    type: "bool",
                    required: false,
                    presentable: false,
                    system: false
                });
            }

            if (!hasField('embed_code')) {
                newFields.push({
                    name: "embed_code",
                    type: "text", // Large text for HTML
                    required: false,
                    presentable: false,
                    system: false
                });
            }

            // Ensure platform exists
            if (!hasField('platform')) {
                newFields.push({
                    name: "platform",
                    type: "text",
                    required: false,
                    presentable: false,
                    system: false
                });
            }

            if (newFields.length > 0) {
                collection.fields.push(...newFields);
                await pb.collections.update('social_feeds', collection);
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
