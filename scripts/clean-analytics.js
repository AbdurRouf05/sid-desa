const PocketBase = require('pocketbase/cjs');
const path = require('path');
const fs = require('fs');

// --- 1. ENV PARSER (Auto-load credentials) ---
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
} catch (e) {
    console.log("⚠️  Could not read .env.local");
}

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(pbUrl);

async function main() {
    console.log("🧹 CLEANING ANALYTICS DATA...");
    console.log(`🔌 Connecting to ${pbUrl}...`);

    try {
        // Auth
        if (process.env.POCKETBASE_ADMIN_EMAIL && process.env.POCKETBASE_ADMIN_PASSWORD) {
            await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
            console.log("✅ Admin Authenticated.");
        } else {
            console.error("❌ Missing Admin Credentials in .env.local");
            process.exit(1);
        }

        // Fetch all items (max 500 batches)
        const records = await pb.collection('analytics_events').getFullList();
        console.log(`📦 Found ${records.length} records to delete...`);

        if (records.length === 0) {
            console.log("✨ Collection is already empty.");
            return;
        }

        // Delete in chunks/parallel manually since SDK doesn't have batch delete
        console.log("⚠️  Deleting records (this might take a moment)...");

        let deleted = 0;
        for (const record of records) {
            await pb.collection('analytics_events').delete(record.id);
            deleted++;
            process.stdout.write(`\r🗑️  Deleted: ${deleted}/${records.length}`);
        }

        console.log("\n✅ CLEANUP COMPLETE. All analytics data wiped.");

    } catch (e) {
        console.error("\n❌ Error:", e.message);
    }
}

main();
