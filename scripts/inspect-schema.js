const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');

// Env Parser
try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            let cleanLine = line.trim();
            if (!cleanLine || cleanLine.startsWith('#')) return;
            const match = cleanLine.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
    }
} catch (e) { }

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

async function main() {
    console.log("🚀 Inspecting Schema...");

    try {
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
        console.log("✅ Authenticated as Admin");
    } catch (e) {
        try {
            await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
            console.log("✅ Authenticated as Admin (Fallback)");
        } catch (err) {
            console.error("❌ Auth Failed:", err.message);
            process.exit(1);
        }
    }

    try {
        const news = await pb.collections.getOne('news');
        console.log(`\n--- NEWS Collection ---`);
        console.log(`listRule: "${news.listRule}"`);
        console.log(`viewRule: "${news.viewRule}"`);

        const products = await pb.collections.getOne('products');
        console.log(`\n--- PRODUCTS Collection ---`);
        console.log(`listRule: "${products.listRule}"`);
        console.log(`viewRule: "${products.viewRule}"`);

    } catch (e) {
        console.error("Error fetching collections:", e.message);
    }
}

main();
