import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { pb } from '../lib/pb';

// Ensure pb uses the correct URL from env
if (process.env.NEXT_PUBLIC_POCKETBASE_URL) {
    pb.baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
}

async function createInquiriesCollection() {
    console.log("Creating 'inquiries' collection...");

    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    if (!email || !password) {
        console.error("Missing admin credentials");
        return;
    }

    try {
        await pb.admins.authWithPassword(email, password);
        console.log("Authenticated as Admin.");

        try {
            // Delete if exists for a clean start
            try {
                const existing = await pb.collections.getOne('inquiries');
                console.log("Deleting existing 'inquiries' collection for a clean start...");
                await pb.collections.delete(existing.id);
            } catch (e) {
                // Ignore if not found
            }

            console.log("Creating 'inquiries' collection with clean schema...");

            const collectionData = {
                name: 'inquiries',
                type: 'base',
                fields: [
                    {
                        name: 'name',
                        type: 'text',
                        required: true,
                        min: 2,
                        max: 100
                    },
                    {
                        name: 'email',
                        type: 'email',
                        required: false,
                    },
                    {
                        name: 'phone',
                        type: 'text',
                        required: false,
                        min: 8,
                        max: 20
                    },
                    {
                        name: 'subject',
                        type: 'text',
                        required: true,
                        min: 5,
                        max: 200
                    },
                    {
                        name: 'message',
                        type: 'text',
                        required: true,
                        min: 10,
                        max: 3000
                    },
                    {
                        name: 'status',
                        type: 'select',
                        values: ['new', 'contacted', 'resolved', 'archived'],
                        maxSelect: 1,
                        required: true,
                    },
                    {
                        name: 'ip_address',
                        type: 'text',
                        required: false,
                    },
                    {
                        name: 'sent_at',
                        type: 'date',
                        required: true,
                    }
                ],
                listRule: "@request.auth.id != ''",
                viewRule: "@request.auth.id != ''",
                createRule: "",
                updateRule: "@request.auth.id != ''",
                deleteRule: "@request.auth.id != ''",
            };

            await pb.collections.create(collectionData);
            console.log("Collection 'inquiries' created successfully.");
        } catch (e: any) {
            console.error("Error managing collection:", e.message, e.response || "");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

createInquiriesCollection();
