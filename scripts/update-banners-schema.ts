
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
const pb = new PocketBase(pbUrl);

async function main() {
    try {
        console.log("Authenticating as Admin...");
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL!, process.env.POCKETBASE_ADMIN_PASSWORD!);

        console.log("Fetching hero_banners collection...");
        const collection = await pb.collections.getOne("hero_banners");

        // Check if bg_class exists
        const hasBgClass = collection.fields?.some((f: any) => f.name === 'bg_class');

        if (!hasBgClass) {
            console.log("Adding bg_class field...");
            // PB v0.23+ uses 'fields' array for updates
            collection.fields.push({
                id: `field_${Date.now()}`, // Generate a temporary ID
                name: "bg_class",
                type: "text",
                required: false,
                presentable: false,
                system: false,
                hidden: false
            });

            await pb.collections.update("hero_banners", collection);
            console.log("Schema updated with bg_class.");
        } else {
            console.log("bg_class field already exists.");
        }

    } catch (e) {
        console.error("Error updating schema:", e);
    }
}

main();
