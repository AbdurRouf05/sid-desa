
import { pb } from "../lib/pb";

async function checkNewsSchema() {
    console.log("Checking News Collection Schema...");
    try {
        const email = process.env.POCKETBASE_ADMIN_EMAIL;
        const password = process.env.POCKETBASE_ADMIN_PASSWORD;
        if (!email || !password) throw new Error("Missing admin credentials in env");

        await pb.admins.authWithPassword(email, password);
        const collection = await pb.collections.getOne("news");
        console.log("Collection 'news' found.");
        console.log("Schema:", JSON.stringify(collection.schema, null, 2));

        // Check first record to see actual values
        const records = await pb.collection('news').getList(1, 1);
        if (records.items.length > 0) {
            console.log("Sample Record:", JSON.stringify(records.items[0], null, 2));
        }
    } catch (e: any) {
        console.error("Error:", e);
    }
}

checkNewsSchema();
