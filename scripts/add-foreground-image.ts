
import { pb } from "../lib/pb"; // Adjust path as needed for script execution context, likely needs full config or env
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!POCKETBASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Missing environment variables. Please check .env.local");
    process.exit(1);
}

// Override pb base url for script
pb.baseUrl = POCKETBASE_URL;
pb.autoCancellation(false);

async function addForegroundImageField() {
    try {
        console.log("Authenticating as admin...");
        await pb.admins.authWithPassword(ADMIN_EMAIL!, ADMIN_PASSWORD!);
        console.log("Authenticated.");

        const collection = await pb.collections.getOne("hero_banners");
        console.log(`Found collection: ${collection.name}`);

        // Check if field already exists
        const fieldExists = collection.schema.some((f: any) => f.name === "foreground_image");
        if (fieldExists) {
            console.log("Field 'foreground_image' already exists. Skipping.");
            return;
        }

        console.log("Adding 'foreground_image' field...");

        // Add new field to schema
        // Note: PocketBase schema update requires sending the FULL schema back, 
        // effectively replacing it. We push to the existing schema array.
        const newField = {
            system: false,
            id: `field_${Date.now()}`,
            name: "foreground_image",
            type: "file",
            required: false,
            presentable: false,
            unique: false,
            options: {
                maxSelect: 1,
                maxSize: 5242880, // 5MB
                mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"],
                thumbs: [],
                protected: false
            }
        };

        collection.schema.push(newField);

        await pb.collections.update("hero_banners", collection);
        console.log("Schema updated successfully! 'foreground_image' added.");

    } catch (error: any) {
        console.error("Error updating schema:", error.message);
        if (error.data) {
            console.error("Details:", JSON.stringify(error.data, null, 2));
        }
    }
}

addForegroundImageField();
