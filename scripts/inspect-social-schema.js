const PocketBase = require('pocketbase/cjs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
const envConfig = require('dotenv').config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const adminEmail = envConfig.POCKETBASE_ADMIN_EMAIL;
    const adminPassword = envConfig.POCKETBASE_ADMIN_PASSWORD;

    const pb = new PocketBase(pbUrl);

    try {
        await pb.admins.authWithPassword(adminEmail, adminPassword);
        const collection = await pb.collections.getOne('social_feeds');
        console.log("Collection name:", collection.name);
        console.log("Fields:", JSON.stringify(collection.fields || collection.schema, null, 2));
    } catch (e) {
        console.error(e.message);
    }
}

main();
