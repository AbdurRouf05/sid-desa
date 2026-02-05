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

async function addIndex() {
    console.log("🛡️ ADDING INDEX 'created' to products...");
    console.log("🔌 Auth:", process.env.POCKETBASE_ADMIN_EMAIL);

    try {
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        const col = await pb.collections.getOne("products");
        const indexes = col.indexes || [];

        // Add index if not exists
        if (!indexes.includes("CREATE INDEX `idx_products_created` ON `products` (`created`)") &&
            !indexes.includes("CREATE INDEX idx_products_created ON products (created)")) {

            indexes.push("CREATE INDEX idx_products_created ON products (created)");

            await pb.collections.update(col.id, { indexes });
            console.log("✅ Index 'idx_products_created' ADDED.");
        } else {
            console.log("ℹ️ Index already exists.");
        }

    } catch (e) {
        console.error("❌ Failed to add index:", e.message);
        if (e.response) console.dir(e.response.data, { depth: null });
    }
}

addIndex();
