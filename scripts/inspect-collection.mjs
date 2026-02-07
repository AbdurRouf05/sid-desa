
import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!POCKETBASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Missing env vars.");
    process.exit(1);
}

const pb = new PocketBase(POCKETBASE_URL);
pb.autoCancellation(false);

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

        console.log("Fetching hero_banners...");
        const collection = await pb.collections.getOne("hero_banners");
        // console.log("Collection Object Keys:", Object.keys(collection));
        console.log("View Rule:", collection.viewRule);
        console.log("List Rule:", collection.listRule);

        // Print fields to see 'protected' status
        if (collection.fields) {
            collection.fields.forEach(f => {
                if (f.type === 'file') {
                    console.log(`Field ${f.name} protected:`, f.protected);
                }
            });
        }

        // console.log("Full Collection:", JSON.stringify(collection, null, 2));

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
