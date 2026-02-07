
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
const pb = new PocketBase(pbUrl);

async function main() {
    try {
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL!, process.env.POCKETBASE_ADMIN_PASSWORD!);

        const records = await pb.collection('hero_banners').getList(1, 10, {
            filter: 'title = "Test Text Only" || title = "Test Banner Image"'
        });

        for (const item of records.items) {
            console.log(`Deleting ${item.title} (${item.id})...`);
            await pb.collection('hero_banners').delete(item.id);
            console.log("Deleted.");
        }

    } catch (e: any) {
        console.error(e);
    }
}

main();
