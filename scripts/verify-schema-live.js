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

async function verify() {
    try {
        console.log("🔌 Connecting to:", process.env.NEXT_PUBLIC_POCKETBASE_URL);
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        const collection = await pb.collections.getOne('products');
        console.log("\n✅ Collection Found: products");

        // Inspect structure
        let fields = [];
        if (Array.isArray(collection.fields)) {
            console.log("Using 'fields' property");
            fields = collection.fields;
        } else if (Array.isArray(collection.schema)) {
            console.log("Using 'schema' property");
            fields = collection.schema;
        } else {
            console.log("⚠️ Unknown structure. Keys:", Object.keys(collection));
            console.log("Full Object:", JSON.stringify(collection, null, 2));
            return;
        }

        console.log(`📋 Found ${fields.length} fields:`);
        fields.forEach(f => console.log(`   - ${f.name} [${f.type}]`));

        const hasThumbnail = fields.some(f => f.name === 'thumbnail');
        const hasIconName = fields.some(f => f.name === 'icon_name');

        console.log("\n🔍 Verification Check:");
        console.log(`   Thumbnail: ${hasThumbnail ? '✅ OK' : '❌ MISSING'}`);
        console.log(`   Icon Name: ${hasIconName ? '✅ OK' : '❌ MISSING'}`);

    } catch (e) {
        console.error("❌ Error:", e.originalError || e.message);
    }
}

verify();
