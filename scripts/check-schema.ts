
import { pb } from "../lib/pb";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

pb.baseUrl = POCKETBASE_URL;
pb.autoCancellation(false);

async function checkSchema() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL!, ADMIN_PASSWORD!);
        const collection = await pb.collections.getOne("hero_banners");
        console.log("Collection Name:", collection.name);
        console.log("Schema Fields:", collection.schema.map((f: any) => f.name));

        const fgField = collection.schema.find((f: any) => f.name === "foreground_image");
        if (fgField) {
            console.log("Foreground Image Field Found:", JSON.stringify(fgField, null, 2));
        } else {
            console.error("Foreground Image Field NOT FOUND!");
        }

        const imgField = collection.schema.find((f: any) => f.name === "image");
        console.log("Main Image Field Found:", JSON.stringify(imgField, null, 2));

    } catch (error: any) {
        console.error("Error:", error);
    }
}

checkSchema();
