
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

async function inspect() {
    try {
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
        const collection = await pb.collections.getOne("hero_banners");

        console.log("Fields config:");
        collection.fields.forEach(f => {
            if (f.type === 'file') {
                console.log(`- ${f.name}: maxSelect=${f.maxSelect}`);
            }
        });

    } catch (e) {
        console.error(e);
    }
}

inspect();
