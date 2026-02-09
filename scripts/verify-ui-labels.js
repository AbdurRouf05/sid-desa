const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');

// --- ENV PARSER ---
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

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(pbUrl);

async function main() {
    console.log("🔍 Verifying 'ui_labels' Schema...");

    // AUTH
    try {
        if (process.env.POCKETBASE_ADMIN_EMAIL && process.env.POCKETBASE_ADMIN_PASSWORD) {
            await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
        } else {
            console.error("❌ No credentials found in .env.local");
            process.exit(1);
        }
    } catch (e) {
        console.error("❌ Auth Failed:", e.message);
        process.exit(1);
    }

    try {
        const collection = await pb.collections.getOne('ui_labels');
        console.log(`\n✅ Collection Found: ${collection.name}`);
        console.log("--- SCHEMA (Fields) ---");

        // PocketBase v0.26+ uses 'fields'
        const fields = collection.fields || collection.schema || [];

        console.table(fields.map(f => ({
            name: f.name,
            type: f.type,
            required: f.required,
            unique: f.unique,
            values: f.values ? f.values.join(', ') : '-'
        })));

        const recordCount = await pb.collection('ui_labels').getList(1, 1);
        console.log(`\n📊 Total Records: ${recordCount.totalItems}`);

    } catch (e) {
        console.error("❌ Failed to fetch collection:", e.message);
    }
}

main();
