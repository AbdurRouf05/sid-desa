
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { pb } from '../lib/pb';

async function testFetch() {
    if (process.env.NEXT_PUBLIC_POCKETBASE_URL) {
        pb.baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    }

    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    try {
        await pb.admins.authWithPassword(email!, password!);
        console.log("Authenticated.");

        console.log("Creating test record...");
        const record = await pb.collection('inquiries').create({
            name: 'Diagnostic Tester',
            subject: 'Diagnostic Subject',
            message: 'This is a long enough message for diagnostic purposes.',
            status: 'new'
        });
        console.log("Test record created. ID:", record.id);
        console.log("Full Record Data:", JSON.stringify(record, null, 2));

        console.log("\nTrying getList WITHOUT sorting...");
        const list = await pb.collection('inquiries').getList(1, 1);
        console.log("List success. First item:", JSON.stringify(list.items[0], null, 2));

    } catch (e: any) {
        console.error("Error:", e.message, JSON.stringify(e.response, null, 2));
    }
}

testFetch();
