
import PocketBase from 'pocketbase';

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
if (!pbUrl) throw new Error("NEXT_PUBLIC_POCKETBASE_URL not defined");
const pb = new PocketBase(pbUrl);

async function main() {
    try {
        const email = process.env.POCKETBASE_ADMIN_EMAIL;
        const password = process.env.POCKETBASE_ADMIN_PASSWORD;
        if (!email || !password) throw new Error("Missing admin credentials in env");

        await pb.admins.authWithPassword(email, password);
        const collection = await pb.collections.getOne("branches");
        console.log("Collection 'branches' EXISTS.");
        console.log("Fields:", JSON.stringify(collection.schema, null, 2));

        // Check data count
        const result = await pb.collection('branches').getList(1, 1);
        console.log(`Total Branches Data: ${result.totalItems}`);
    } catch (e: any) {
        if (e.status === 404) {
            console.log("Collection 'branches' NOT FOUND.");
        } else {
            console.error("Error:", e);
        }
    }
}

main();
