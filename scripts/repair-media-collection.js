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

        console.log("🛠️ Repairing 'media' collection fields...");
        const collection = await pb.collections.getOne('media');

        // PB 0.22+ uses 'fields'
        const hasField = (name) => collection.fields.some(f => f.name === name);
        let needsUpdate = false;

        if (!hasField('file')) {
            collection.fields.push({
                name: 'file',
                type: 'file',
                required: true,
                options: {
                    maxSelect: 1,
                    maxSize: 5242880,
                    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
                    thumbs: [],
                    protected: false
                }
            });
            needsUpdate = true;
        }

        if (!hasField('title')) {
            collection.fields.push({
                name: 'title',
                type: 'text',
                required: false,
                options: { min: null, max: null, pattern: "" }
            });
            needsUpdate = true;
        }

        if (!hasField('alt')) {
            collection.fields.push({
                name: 'alt',
                type: 'text',
                required: false,
                options: { min: null, max: null, pattern: "" }
            });
            needsUpdate = true;
        }

        if (needsUpdate) {
            await pb.collections.update(collection.id, collection);
            console.log("✅ 'media' fields updated successfully.");
        } else {
            console.log("✅ 'media' fields already initialized.");
            console.log("Found fields:", collection.fields.map(f => f.name));
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

main();
