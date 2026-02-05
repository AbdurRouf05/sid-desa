
import PocketBase from 'pocketbase';

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
if (!pbUrl) throw new Error("NEXT_PUBLIC_POCKETBASE_URL not defined in environment variables");
const pb = new PocketBase(pbUrl);

const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Missing POCKETBASE_ADMIN_EMAIL or POCKETBASE_ADMIN_PASSWORD in environment variables");
}

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL!, ADMIN_PASSWORD!);
        const collection = await pb.collections.getOne("branches");

        console.log("Collection Found: branches");
        // Check for 'fields' property (PocketBase v0.23+)
        if (collection.fields) {
            console.log("Fields:", JSON.stringify(collection.fields, null, 2));
        } else if (collection.schema) {
            console.log("Schema:", JSON.stringify(collection.schema, null, 2));
        } else {
            console.log("No fields or schema found on collection object:", Object.keys(collection));
        }

        // Try a test list request
        try {
            console.log("Testing List with sort: 'order'...");
            await pb.collection('branches').getList(1, 1, { sort: 'order' });
            console.log("List request SUCCESS");
        } catch (listError: any) {
            console.error("List request FAILED:", listError.data);
        }

    } catch (e: any) {
        console.error("Error:", e);
    }
}

main();
