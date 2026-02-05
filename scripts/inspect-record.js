const PocketBase = require('pocketbase/cjs');
const path = require('path');
const fs = require('fs');

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

async function inspect() {
    console.log("🕵️ INSPECTING RECORD STRUCTURE...");
    try {
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        // Fetch 1 record
        const list = await pb.collection('products').getList(1, 1);
        if (list.items.length > 0) {
            const item = list.items[0];
            console.log("✅ Record Found. Keys:");
            console.log(Object.keys(item));
            console.log("---");
            console.log("Created:", item.created);
            console.log("Updated:", item.updated);
        } else {
            console.log("⚠️ No records found to inspect.");
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

inspect();
