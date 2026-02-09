const PocketBase = require('pocketbase/cjs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '../.env.local');
const envConfig = dotenv.config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    console.log(`🔌 Connecting to ${pbUrl}...`);

    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    try {
        console.log("🛠️ Fetching ALL site_config records...");

        // Authenticate as admin to see everything
        const adminEmail = envConfig.POCKETBASE_ADMIN_EMAIL;
        const adminPassword = process.argv[2] || envConfig.POCKETBASE_ADMIN_PASSWORD;

        if (adminEmail && adminPassword) {
            await pb.admins.authWithPassword(adminEmail, adminPassword);
        } else {
            console.log("⚠️ No Admin credentials found, trying public fetch...");
        }

        const records = await pb.collection('site_config').getFullList({
            sort: '-created',
        });

        console.log(`✅ Found ${records.length} records.`);
        records.forEach((r, i) => {
            console.log(`\n[${i}] ID: ${r.id} | Created: ${r.created}`);
            console.log(`    Social Links:`, JSON.stringify(r.social_links));
        });

    } catch (e) {
        console.error("❌ Error:", e);
    }
}

main();
