
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
const pb = new PocketBase(pbUrl);

async function main() {
    try {
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL!, process.env.POCKETBASE_ADMIN_PASSWORD!);
        const result = await pb.collection('hero_banners').getList(1, 10, { sort: 'order' });
        console.log(`Found ${result.totalItems} banners.`);
        result.items.forEach(item => {
            console.log(`- ${item.title} (Order: ${item.order}, Active: ${item.active}, BG: ${item.bg_class})`);
        });
    } catch (e) {
        console.error(e);
    }
}

main();
