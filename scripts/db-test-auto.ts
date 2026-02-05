
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { pb } from '../lib/pb';

async function testAuto() {
    if (process.env.NEXT_PUBLIC_POCKETBASE_URL) {
        pb.baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    }

    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    try {
        await pb.admins.authWithPassword(email!, password!);
        console.log("Authenticated.");

        try {
            await pb.collections.delete(await pb.collections.getOne('test_auto').then(c => c.id));
        } catch (e) { }

        console.log("Creating bare collection 'test_auto'...");
        const collection = await pb.collections.create({
            name: 'test_auto',
            type: 'base',
        });

        console.log("Collection created. Fields:");
        console.log(JSON.stringify(collection.fields, null, 2));

    } catch (e: any) {
        console.error("Error:", e.message, e.response || "");
    }
}

testAuto();
