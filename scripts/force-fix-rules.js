const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');

// Env Parser
try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        console.log("Reading .env.local...");
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
} catch (e) {
    console.warn("Could not read .env.local", e);
}

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

async function fixRules(collectionName) {
    try {
        console.log(`\nChecking ${collectionName}...`);
        const col = await pb.collections.getOne(collectionName);
        console.log(`Current listRule: ${col.listRule}`);

        // Define correct rules with DOUBLE QUOTES
        const updates = {
            listRule: "",
            viewRule: "",
            createRule: "",
            updateRule: "",
            deleteRule: ""
        };

        // Special case for non-published collections if any, but news/products have published field
        if (collectionName === 'hero_banners') {
            updates.listRule = "active = true || @request.auth.id != \"\"";
            updates.viewRule = "active = true || @request.auth.id != \"\"";
        }
        if (collectionName === 'social_feeds') {
            updates.listRule = "is_active = true || @request.auth.id != \"\"";
            updates.viewRule = "is_active = true || @request.auth.id != \"\"";
        }

        await pb.collections.update(col.id, updates);

        const updatedCol = await pb.collections.getOne(collectionName);
        console.log(`✅ UPDATED listRule: ${updatedCol.listRule}`);

        if (updatedCol.listRule.includes("''")) {
            console.error("❌ FAILED: Still contains single quotes!");
        } else {
            console.log("MATCH: Double quotes confirmed.");
        }

    } catch (e) {
        console.error(`Error fixing ${collectionName}:`, e.message);
    }
}

async function main() {
    console.log("🚀 Starting Force Fix Rules Script...");

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

    await fixRules('news');
    await fixRules('products');
    await fixRules('hero_banners');
    await fixRules('social_feeds');

    console.log("\n🎉 Fix Script Finished");
}

main();
