
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { pb } from '../lib/pb';

async function checkDatabase() {
    console.log("Checking Database Connection and Schema...");

    if (process.env.NEXT_PUBLIC_POCKETBASE_URL) {
        pb.baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    }

    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    try {
        await pb.admins.authWithPassword(email!, password!);
        console.log("Authenticated successfully.");

        const inquiries = await pb.collections.getOne('inquiries');
        console.log("\nRAW COLLECTION DATA:");
        console.log(JSON.stringify(inquiries, null, 2));

    } catch (e: any) {
        console.error("Error checking database:", e.message);
    }
}

checkDatabase();
