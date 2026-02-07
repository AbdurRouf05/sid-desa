
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
    console.error("Missing env vars. Please check .env.local");
    process.exit(1);
}

const pb = new PocketBase(POCKETBASE_URL);
pb.autoCancellation(false);

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log("Authenticated.");

        const collection = await pb.collections.getOne("hero_banners");
        console.log(`Initial Schema length: ${collection.schema.length}`);

        const fieldExists = collection.schema.some(f => f.name === "foreground_image");
        if (fieldExists) {
            console.log("'foreground_image' already exists in schema.");
            return;
        }

        console.log("Adding 'foreground_image'...");
        collection.schema.push({
            system: false,
            id: `field_${Date.now()}`,
            name: "foreground_image",
            type: "file",
            required: false,
            presentable: false,
            unique: false,
            options: {
                maxSelect: 1,
                maxSize: 5242880,
                mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"],
                thumbs: [],
                protected: false
            }
        });

        await pb.collections.update("hero_banners", collection);
        console.log("Schema UPDATED successfully!");

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
