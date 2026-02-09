const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
const envConfig = require('dotenv').config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const adminEmail = envConfig.POCKETBASE_ADMIN_EMAIL;
    const adminPassword = process.argv[2] || envConfig.POCKETBASE_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error("❌ Admin credentials missing in .env.local");
        process.exit(1);
    }

    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    try {
        console.log(`🔌 Connecting to ${pbUrl}...`);
        await pb.admins.authWithPassword(adminEmail, adminPassword);
        console.log("✅ Authenticated as Admin\n");

        console.log("🔍 Fetching ALL collections...");
        const collections = await pb.collections.getFullList({ sort: 'name' });

        const fullAudit = {
            timestamp: new Date().toISOString(),
            totalCollections: collections.length,
            collections: []
        };

        for (const col of collections) {
            // Count records in each collection
            let recordCount = 0;
            try {
                // Get approximate count (or exact if few)
                const result = await pb.collection(col.name).getList(1, 1, { $autoCancel: false });
                recordCount = result.totalItems;
            } catch (e) {
                console.warn(`⚠️ Could not count records for ${col.name}: ${e.message}`);
                recordCount = "Error";
            }

            console.log(`📂 ${col.name} (${col.type}) - ${recordCount} records`);

            fullAudit.collections.push({
                name: col.name,
                type: col.type,
                id: col.id,
                recordCount: recordCount,
                fields: col.fields || col.schema, // v0.26+ uses fields, older might use schema
                listRule: col.listRule,
                viewRule: col.viewRule,
                createRule: col.createRule,
                updateRule: col.updateRule,
                deleteRule: col.deleteRule,
            });
        }

        const reportPath = path.join(__dirname, '../db-audit-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(fullAudit, null, 2));
        console.log(`\n💾 Full Audit Report saved to: ${reportPath}`);

    } catch (e) {
        console.error("❌ Audit Failed:", e.message);
        if (e.data) console.error(e.data);
    }
}

main();
