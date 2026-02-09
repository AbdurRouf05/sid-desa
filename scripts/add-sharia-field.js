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

async function addShariaField() {
    try {
        console.log("🔌 Connecting to:", process.env.NEXT_PUBLIC_POCKETBASE_URL);
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
        console.log("✅ Authenticated as Admin");

        const collection = await pb.collections.getOne('products');

        // Use 'fields' if 'schema' is not available (PB v0.20+)
        const fields = collection.fields || collection.schema;

        if (!fields) {
            console.error("❌ Neither 'fields' nor 'schema' found in collection object.");
            return;
        }

        // Check if sharia_contract already exists
        const exists = fields.find(f => f.name === 'sharia_contract');
        if (exists) {
            console.log("ℹ️ 'sharia_contract' already exists.");
            return;
        }

        console.log("🆕 Adding 'sharia_contract' field to 'products' collection...");
        fields.push({
            name: "sharia_contract",
            type: "text",
            required: false,
        });

        const updateData = {};
        if (collection.fields) updateData.fields = fields;
        else updateData.schema = fields;

        await pb.collections.update(collection.id, updateData);
        console.log("✅ Field 'sharia_contract' added successfully!");

    } catch (e) {
        console.error("❌ Error:", e.message || e);
    }
}

addShariaField();
