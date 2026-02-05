
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL; // Using public URL
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

console.log(`Connecting to ${pbUrl}...`);

const pb = new PocketBase(pbUrl);

async function fixNewsCollection() {
    try {
        console.log("Authenticating as Admin...");
        await pb.admins.authWithPassword(adminEmail!, adminPassword!);

        console.log("Fetching 'news' collection...");
        const collection = await pb.collections.getOne('news');

        // Log Fields
        const fields = (collection as any).fields || [];
        console.log("Current Fields:", JSON.stringify(fields, null, 2));

        const hasCreated = fields.some((f: any) => f.name === 'created');
        const hasUpdated = fields.some((f: any) => f.name === 'updated');

        console.log(`Has 'created' field? ${hasCreated}`);
        console.log(`Has 'updated' field? ${hasUpdated}`);

        if (!hasCreated || !hasUpdated) {
            console.log("ATTEMPTING TO ADD MISSING FIELDS...");
            const newFields = [...fields];

            if (!hasCreated) {
                newFields.push({
                    name: "created",
                    type: "autodate",
                    onCreate: true,
                    onUpdate: false,
                    hidden: false
                });
            }
            if (!hasUpdated) {
                newFields.push({
                    name: "updated",
                    type: "autodate",
                    onCreate: true,
                    onUpdate: true,
                    hidden: false
                });
            }

            await pb.collections.update('news', {
                fields: newFields
            });
            console.log("SUCCESS: Added missing autodate fields!");

            // Re-fetch to confirm
            const list = await pb.collection('news').getList(1, 1);
            console.log("Verifying Item:", list.items[0]);

        } else {
            console.log("Fields already exist. The issue is likely deeper (DB corruption or ghost fields).");
        }

    } catch (e: any) {
        console.error("Error:", e.response?.data || e.message || e);
    }
}

fixNewsCollection();
