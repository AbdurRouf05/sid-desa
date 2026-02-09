
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
const pb = new PocketBase(pbUrl);

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        console.log("Searching for 'section_news_title' label...");
        const result = await pb.collection('ui_labels').getList(1, 1, {
            filter: 'label_key = "section_news_title"'
        });

        if (result.items.length > 0) {
            const item = result.items[0];
            console.log(`Found label: ${item.label} (ID: ${item.id})`);

            console.log("Updating to 'Berita dan Artikel'...");
            await pb.collection('ui_labels').update(item.id, {
                label: "Berita dan Artikel"
            });
            console.log("✅ Update successful!");
        } else {
            console.log("⚠️ Label 'section_news_title' not found. Creating it...");
            await pb.collection('ui_labels').create({
                label_key: "section_news_title",
                label: "Berita dan Artikel",
                section: "Homepage",
                is_visible: true
            });
            console.log("✅ Created new label!");
        }

    } catch (e) {
        console.error("❌ Error:", e);
    }
}

main();
