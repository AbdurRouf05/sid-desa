
import PocketBase from 'pocketbase';

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
if (!pbUrl) throw new Error("NEXT_PUBLIC_POCKETBASE_URL not defined");
const pb = new PocketBase(pbUrl);

// Admin Auth
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Missing POCKETBASE_ADMIN_EMAIL or POCKETBASE_ADMIN_PASSWORD in environment variables");
}

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword(ADMIN_EMAIL!, ADMIN_PASSWORD!);

        console.log("Fetching 'branches' collection...");
        const collection = await pb.collections.getOne("branches");

        console.log("Current Rules:", {
            listRule: collection.listRule,
            viewRule: collection.viewRule,
            createRule: collection.createRule,
            updateRule: collection.updateRule,
            deleteRule: collection.deleteRule
        });

        console.log("Updating Rules...");
        // Public List/View (so public page works)
        // Authenticated Manage (so admin panel works if using auth record)
        await pb.collections.update(collection.id, {
            listRule: "", // Public
            viewRule: "", // Public
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''",
        });

        console.log("Rules Updated Successfully!");

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
