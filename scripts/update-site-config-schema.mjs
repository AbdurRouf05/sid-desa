import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

async function updateSchema() {
    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    if (!email || !password) {
        console.error("Error: POCKETBASE_ADMIN_EMAIL or POCKETBASE_ADMIN_PASSWORD not set in .env.local");
        process.exit(1);
    }

    try {
        console.log("Authenticating as admin...");
        await pb.admins.authWithPassword(email, password);
        console.log("Authenticated.");

        console.log("Fetching site_config collection...");
        const collection = await pb.collections.getOne('site_config');

        const newFields = [
            {
                name: 'locations_title',
                type: 'text',
                required: false,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    pattern: ""
                }
            },
            {
                name: 'locations_description',
                type: 'text',
                required: false,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    pattern: ""
                }
            },
            {
                name: 'locations_feature1_text',
                type: 'text',
                required: false,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    pattern: ""
                }
            },
            {
                name: 'locations_feature1_icon',
                type: 'text',
                required: false,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    pattern: ""
                }
            },
            {
                name: 'locations_feature2_text',
                type: 'text',
                required: false,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    pattern: ""
                }
            },
            {
                name: 'locations_feature2_icon',
                type: 'text',
                required: false,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    pattern: ""
                }
            },
            {
                name: 'legal_bh',
                type: 'text',
                required: false,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    pattern: ""
                }
            },
            {
                name: 'nib',
                type: 'text',
                required: false,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    pattern: ""
                }
            }
        ];

        let schemaChanged = false;
        // Handle both old schema and new fields structure
        let currentFields = collection.fields || collection.schema || [];

        // If it's a new structure, fields is an array of objects
        // If it's old, it's also array of objects but under 'schema' key

        for (const field of newFields) {
            const exists = currentFields.find(f => f.name === field.name);
            if (!exists) {
                console.log(`Adding field: ${field.name}`);
                currentFields.push(field);
                schemaChanged = true;
            } else {
                console.log(`Field already exists: ${field.name}`);
            }
        }

        if (schemaChanged) {
            console.log("Updating collection schema...");
            // valid for both? No, for new PB we update 'fields'
            if (collection.fields) {
                await pb.collections.update(collection.id, { fields: currentFields });
            } else {
                await pb.collections.update(collection.id, { schema: currentFields });
            }
            console.log("Schema updated successfully!");
        } else {
            console.log("No schema changes needed.");
        }

        // SEED DATA
        console.log("Seeding data...");
        try {
            const records = await pb.collection('site_config').getList(1, 1);
            if (records.items.length > 0) {
                const item = records.items[0];
                const updateData = {
                    locations_title: "Kami Hadir Lebih Dekat",
                    locations_description: "Dengan 16 titik layanan yang tersebar di wilayah Lumajang, kami siap melayani kebutuhan transaksi keuangan Anda dengan keramahan dan profesionalisme.",
                    locations_feature1_text: "Kantor Pusat & Cabang Strategis",
                    locations_feature1_icon: "MapPin", // Lucide icon name
                    locations_feature2_text: "Layanan Senin - Sabtu (07.30 - 15.00)",
                    locations_feature2_icon: "Clock"   // Lucide icon name
                };
                await pb.collection('site_config').update(item.id, updateData);
                console.log("Data seeded successfully!");
            } else {
                console.log("No site_config record found to seed.");
            }
        } catch (seedError) {
            console.error("Error seeding data:", seedError);
        }

    } catch (error) {
        console.error("Error updating schema:", error);
        // process.exit(1); // Don't exit with error, let's see output
    }
}

updateSchema();
