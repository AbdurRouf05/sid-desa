
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

        const users = await pb.collections.getOne('users');
        const timestamps = users.fields.filter((f: any) => f.type === 'autodate' || f.name === 'created' || f.name === 'updated');
        console.log("\nTIMESTAMP FIELDS in 'users':");
        console.log(JSON.stringify(timestamps, null, 2));

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

verifyFields();
