
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

async function main() {
    try {
        const email = process.env.POCKETBASE_ADMIN_EMAIL;
        const password = process.env.POCKETBASE_ADMIN_PASSWORD;

        if (!email || !password) throw new Error("Missing admin credentials");

        await pb.admins.authWithPassword(email, password);
        const collection = await pb.collections.getOne("hero_banners");
        console.log("FIELDS:", JSON.stringify(collection.fields, null, 2));
    } catch (e) {
        console.error(e);
    }
}

main();
