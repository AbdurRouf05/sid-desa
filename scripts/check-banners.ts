
import PocketBase from 'pocketbase';
// import { getErrorMessage } from './utils'; 

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
if (!pbUrl) throw new Error("NEXT_PUBLIC_POCKETBASE_URL not defined in .env");
const pb = new PocketBase(pbUrl);

async function main() {
    try {
        console.log("Authenticating as Admin...");
        const email = process.env.POCKETBASE_ADMIN_EMAIL;
        const password = process.env.POCKETBASE_ADMIN_PASSWORD;

        if (!email || !password) throw new Error("Missing admin credentials");

        await pb.admins.authWithPassword(email, password);
        console.log("Auth successful.");

        try {
            const collection = await pb.collections.getOne("hero_banners");
            console.log("Collection 'hero_banners' ALREADY EXISTS.");
            console.log(JSON.stringify(collection.schema, null, 2));
        } catch (e: any) {
            if (e.status === 404) {
                console.log("Collection 'hero_banners' NOT FOUND. Creating...");
                await pb.collections.create({
                    name: "hero_banners",
                    type: "base",
                    schema: [
                        { name: "title", type: "text", required: true },
                        { name: "subtitle", type: "text", required: false },
                        { name: "image", type: "file", options: { mimeTypes: ["image/*"], maxSize: 5242880 } },
                        { name: "desktop_image", type: "file", options: { mimeTypes: ["image/*"], maxSize: 5242880 } },
                        { name: "mobile_image", type: "file", options: { mimeTypes: ["image/*"], maxSize: 5242880 } },
                        { name: "cta_text", type: "text" },
                        { name: "cta_link", type: "text" },
                        { name: "bg_class", type: "text" },
                        { name: "order", type: "number" },
                        { name: "published", type: "bool" }
                    ]
                });
                console.log("Collection 'hero_banners' CREATED.");
            } else {
                throw e;
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
