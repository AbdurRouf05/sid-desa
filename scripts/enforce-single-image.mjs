
import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
pb.autoCancellation(false);

async function update() {
    try {
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
        const collection = await pb.collections.getOne("hero_banners");

        let changed = false;
        collection.fields.forEach(f => {
            if ((f.name === 'image_desktop' || f.name === 'image_mobile') && f.maxSelect !== 1) {
                console.log(`Updating ${f.name} maxSelect from ${f.maxSelect} to 1`);
                f.maxSelect = 1;
                changed = true;
            }
        });

        if (changed) {
            await pb.collections.update("hero_banners", collection);
            console.log("Schema updated successfully.");
        } else {
            console.log("Schema already correct.");
        }

    } catch (e) {
        console.error(e);
    }
}

update();
