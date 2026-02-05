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

async function fixRules() {
    console.log("🛡️ UPDATING API RULES for Admin Visibility...");
    console.log("🔌 Auth:", process.env.POCKETBASE_ADMIN_EMAIL);

    try {
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        const col = await pb.collections.getOne("products");

        // ALLOW Public to see Published OR Admin to see ALL
        const newRule = "published = true || @request.auth.id != ''";

        await pb.collections.update(col.id, {
            listRule: newRule,
            viewRule: newRule
        });

        console.log(`✅ Rules Updated Successfully!`);
        console.log(`   listRule: "${newRule}"`);
        console.log(`   viewRule: "${newRule}"`);
        console.log("\n👉 Please refresh your Admin Dashboard now.");

    } catch (e) {
        console.error("❌ Failed to update rules:", e.message);
    }
}

fixRules();
