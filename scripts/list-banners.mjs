
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
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

        const records = await pb.collection('hero_banners').getFullList();
        console.log("Found records:", records.length);

        const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;

        records.forEach(r => {
            console.log(`\nID: ${r.id}`);
            console.log(`Collection ID: ${r.collectionId}`);
            console.log(`Active: ${r.active}`);
            console.log(`Title: ${r.title}`);
            console.log(`Image Desktop: ${r.image_desktop}`);
            console.log(`Image Mobile: ${r.image_mobile}`);
            console.log(`Foreground: ${r.foreground_image}`);

            if (r.foreground_image) {
                const url = `${pbUrl}/api/files/${r.collectionId}/${r.id}/${r.foreground_image}`;
                console.log(`Foreground Direct URL: ${url}`);
            }
            if (r.image_desktop) {
                const url = `${pbUrl}/api/files/${r.collectionId}/${r.id}/${r.image_desktop}`;
                console.log(`Desktop Direct URL: ${url}`);
            }

            console.log("-----------------------------------");
        });

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
