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

        console.log("🛠️ Verifying 'media' collection rules...");
        try {
            const collection = await pb.collections.getOne('media');
            let needsUpdate = false;

            if (collection.listRule === null || collection.listRule === "") {
                collection.listRule = ""; // Empty string means public in older PB, or use "@request.auth.id != ''" for private.
                // Actually, for public thumbnails, it should be "" (Public) or "@request.auth.id = ''" (Wait, "" is usually public list)
                // For PB, listRule: "" means anyone can list.
                collection.listRule = "";
                collection.viewRule = "";
                needsUpdate = true;
            }

            if (needsUpdate) {
                await pb.collections.update('media', collection);
                console.log("✅ 'media' rules updated to Public List/View.");
            } else {
                console.log("✅ 'media' rules already Public.");
            }
        } catch (e) {
            console.log("⚠️ 'media' collection not found. Creating it...");
            await pb.collections.create({
                name: 'media',
                type: 'base',
                schema: [
                    { name: 'file', type: 'file', required: true, maxSelect: 1 },
                    { name: 'title', type: 'text' },
                    { name: 'alt', type: 'text' }
                ],
                listRule: "",
                viewRule: "",
                createRule: "@request.auth.id != ''"
            });
            console.log("✅ 'media' collection created.");
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

main();
