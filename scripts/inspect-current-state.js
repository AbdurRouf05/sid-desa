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

async function inspect() {
    try {
        console.log("🔌 Connecting to:", process.env.NEXT_PUBLIC_POCKETBASE_URL);
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        console.log("\n🔍 INSPECTING COLLECTION: products");
        try {
            const p = await pb.collections.getOne('products');
            console.log("ID:", p.id);
            console.log("Name:", p.name);
            console.log("Fields (New):", JSON.stringify(p.fields || [], null, 2));
            console.log("Schema (Old):", JSON.stringify(p.schema || [], null, 2));
        } catch (e) {
            console.log("❌ Products collection NOT FOUND or Error:", e.message);
        }

        console.log("\n🔍 INSPECTING COLLECTION: news");
        try {
            const n = await pb.collections.getOne('news');
            console.log("ID:", n.id);
            const fields = n.fields || n.schema || [];
            console.log("Fields count:", fields.length);
            const rel = fields.find(f => f.type === 'relation');
            if (rel) {
                console.log("Found Relation Field:", JSON.stringify(rel, null, 2));
            } else {
                console.log("⚠️ No relation field found in news.");
            }
        } catch (e) {
            console.log("❌ News collection NOT FOUND or Error:", e.message);
        }

    } catch (e) {
        console.error("Auth Fail:", e.message);
    }
}

inspect();
