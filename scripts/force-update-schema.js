const PocketBase = require('pocketbase/cjs');
const path = require('path');
const fs = require('fs');

// Load Env
try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
        });
    }
} catch (e) { }

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

async function forceUpdate() {
    try {
        console.log("🔌 Connecting to:", process.env.NEXT_PUBLIC_POCKETBASE_URL);
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        const collection = await pb.collections.getOne('products');
        console.log("✅ Fetched 'products' collection.");

        let currentFields = collection.fields || collection.schema || [];
        console.log(`Current fields count: ${currentFields.length}`);

        // LIST OF ALL FIELDS THAT MUST EXIST
        const allFields = [
            {
                "name": "name",
                "type": "text",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": { "min": null, "max": null, "pattern": "" }
            },
            {
                "name": "slug",
                "type": "text",
                "required": true,
                "presentable": false,
                "unique": true,
                "options": { "min": null, "max": null, "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$" }
            },
            {
                "name": "type",
                "type": "select",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": { "maxSelect": 1, "values": ["simpanan", "pembiayaan"] }
            },
            {
                "name": "description",
                "type": "editor",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": { "convertUrls": false }
            },
            {
                "name": "requirements",
                "type": "editor",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": { "convertUrls": false }
            },
            {
                "name": "min_deposit",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": { "min": null, "max": null, "pattern": "" }
            },
            {
                "name": "thumbnail",
                "type": "file",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "mimeTypes": ["image/*"],
                    "thumbs": [],
                    "protected": false
                }
            },
            {
                "name": "icon",
                "type": "file",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "mimeTypes": ["image/*", "image/svg+xml"],
                    "thumbs": [],
                    "protected": false
                }
            },
            {
                "name": "icon_name",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": { "min": null, "max": null, "pattern": "" }
            },
            {
                "name": "brochure_pdf",
                "type": "file",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "mimeTypes": ["application/pdf"],
                    "thumbs": [],
                    "protected": false
                }
            },
            {
                "name": "seo_keywords",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": { "min": null, "max": null, "pattern": "" }
            },
            {
                "name": "is_featured",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            },
            {
                "name": "published",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            },
            {
                "name": "schema_type",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": { "min": null, "max": null, "pattern": "" }
            }
        ];

        let schemaChanged = false;

        allFields.forEach(nf => {
            const exists = currentFields.some(f => f.name === nf.name);
            if (!exists) {
                console.log(`➕ Adding field: ${nf.name}`);
                currentFields.push(nf);
                schemaChanged = true;
            } else {
                // Optional: Check if type matches, but for now just existence
                console.log(`✔ Field exists: ${nf.name}`);
            }
        });

        if (schemaChanged) {
            console.log("💾 Updating collection schema...");
            const data = {};
            if (collection.fields) {
                data.fields = currentFields;
            } else {
                data.schema = currentFields;
            }

            await pb.collections.update('products', data);
            console.log("✅ SUCCESS! Full Schema updated.");
        } else {
            console.log("👍 No changes needed.");
        }

    } catch (e) {
        console.error("❌ Error updating schema:", e.originalError || e.message || e);
    }
}

forceUpdate();
