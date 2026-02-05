
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { pb } from '../lib/pb';

async function verifyFinal() {
    if (process.env.NEXT_PUBLIC_POCKETBASE_URL) {
        pb.baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    }

    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    try {
        await pb.admins.authWithPassword(email!, password!);
        console.log("Authenticated.");

        console.log("Testing getList with sort: -sent_at...");
        try {
            const list = await pb.collection('inquiries').getList(1, 10, {
                sort: '-sent_at'
            });
            console.log("SUCCESS! getList works with sort: -sent_at.");
            console.log("Items count:", list.totalItems);
        } catch (err: any) {
            console.error("FAILED! getList still returns error:", err.status, err.message);
        }

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

verifyFinal();
