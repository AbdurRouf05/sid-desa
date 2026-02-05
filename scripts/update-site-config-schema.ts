
import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
try {
    const envConfig = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '.env.local')));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} catch (e) {
    console.error("Error loading .env.local", e);
}

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://db-bmtnulmj.sagamuda.cloud";
const pb = new PocketBase(pbUrl);

const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Missing admin credentials");
}

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword(ADMIN_EMAIL!, ADMIN_PASSWORD!);

        const collection = await pb.collections.getOne("site_config");
        console.log("Found site_config. Updating schema...");

        // We need to ADD file fields.
        // PocketBase v0.23+ uses 'fields' array.
        // We will append file fields if they don't exist.

        const newFields = [
            {
                name: "logo_primary",
                type: "file",
                maxSelect: 1,
                maxSize: 5242880, // 5MB
                mimeTypes: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
                thumbs: [],
                protected: false
            },
            {
                name: "logo_secondary", // White version usually
                type: "file",
                maxSelect: 1,
                maxSize: 5242880,
                mimeTypes: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
                thumbs: [],
                protected: false
            },
            {
                name: "favicon",
                type: "file",
                maxSelect: 1,
                maxSize: 1048576, // 1MB
                mimeTypes: ["image/png", "image/x-icon", "image/svg+xml"],
                thumbs: [],
                protected: false
            },
            {
                name: "og_image", // Social Share Image
                type: "file",
                maxSelect: 1,
                maxSize: 5242880,
                mimeTypes: ["image/png", "image/jpeg", "image/webp"],
                thumbs: [],
                protected: false
            }
        ];

        // Check which fields already exist
        const existingFieldNames = new Set(collection.fields?.map((f: any) => f.name) || []);
        const fieldsToAdd = newFields.filter(f => !existingFieldNames.has(f.name));

        if (fieldsToAdd.length === 0) {
            console.log("All logo/asset fields already exist.");
        } else {
            console.log(`Adding fields: ${fieldsToAdd.map(f => f.name).join(", ")}`);

            // Merge existing fields with new fields
            const updatedFields = [...(collection.fields || []), ...fieldsToAdd];

            await pb.collections.update(collection.id, {
                fields: updatedFields
            });
            console.log("Schema updated successfully!");
        }

    } catch (e: any) {
        console.error("Error:", e);
        if (e.data) console.error("Data:", JSON.stringify(e.data, null, 2));
    }
}

main();
