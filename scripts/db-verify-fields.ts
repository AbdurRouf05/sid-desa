
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { pb } from '../lib/pb';

async function verifyFields() {
    if (process.env.NEXT_PUBLIC_POCKETBASE_URL) {
        pb.baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    }

    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    try {
        await pb.admins.authWithPassword(email!, password!);
        console.log("Authenticated.");

        const inquiries = await pb.collections.getOne('inquiries');
        console.log("\nField Names in 'inquiries':");
        inquiries.fields.forEach((f: any) => {
            console.log(`- ${f.name} (${f.type})`);
        });

        // Try a test getList to see if it triggers 400
        console.log("\nTesting getList request...");
        try {
            const list = await pb.collection('inquiries').getList(1, 1, { sort: '-id' });
            console.log("getList successful with sort: -id. Items count:", list.totalItems);
        } catch (err: any) {
            console.error("getList FAILED with 400/error:", err.status, err.message);
            console.error("Response data:", JSON.stringify(err.response, null, 2));
        }

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

verifyFields();
