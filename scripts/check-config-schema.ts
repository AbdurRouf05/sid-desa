
import { pb } from "../lib/pb";

async function checkSiteConfigSchema() {
    console.log("Checking Site Config Collection Schema...");
    try {
        // Authenticate as admin to see schema
        const email = process.env.POCKETBASE_ADMIN_EMAIL;
        const password = process.env.POCKETBASE_ADMIN_PASSWORD;
        if (!email || !password) throw new Error("Missing admin credentials in env");

        await pb.admins.authWithPassword(email, password);

        try {
            const collection = await pb.collections.getOne("site_config");
            console.log("Collection 'site_config' found.");
            console.log("Schema:", JSON.stringify(collection.schema, null, 2));

            // Also check actual data
            const records = await pb.collection('site_config').getList(1, 5);
            console.log("\nRecords found:", records.totalItems);
            if (records.items.length > 0) {
                console.log("First Record Data:", JSON.stringify(records.items[0], null, 2));
            }

        } catch (e: any) {
            console.error("Error fetching 'site_config' collection:", e.status, e.message);
        }

    } catch (e) {
        console.error("Authentication failed:", e);
    }
}

checkSiteConfigSchema();
