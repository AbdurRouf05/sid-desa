
import { pb } from "../lib/pb";

async function checkSchema() {
    console.log("Checking News Collection Schema...");
    try {
        // Authenticate as admin to see schema
        const email = process.env.POCKETBASE_ADMIN_EMAIL;
        const password = process.env.POCKETBASE_ADMIN_PASSWORD;
        if (!email || !password) throw new Error("Missing admin credentials in env");

        await pb.admins.authWithPassword(email, password);

        try {
            const collection = await pb.collections.getOne("news");
            console.log("Collection 'news' found.");
            console.log("Schema:", JSON.stringify(collection.schema, null, 2));
        } catch (e: any) {
            console.error("Error fetching 'news' collection:", e.status, e.message);
        }

    } catch (e) {
        console.error("Authentication failed:", e);
    }
}

checkSchema();
