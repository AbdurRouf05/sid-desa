const PocketBase = require('pocketbase/cjs');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env and .env.local
const envPath = path.resolve(__dirname, '../.env');
const envLocalPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
if (fs.existsSync(envLocalPath)) dotenv.config({ path: envLocalPath, override: true });

if (!fs.existsSync(envPath) && !fs.existsSync(envLocalPath)) {
    console.warn("⚠️  No .env or .env.local file found.");
}

const PB_URL = process.env.PB_URL || process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://db-bmtnulmj.sagamuda.cloud";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("❌ ERROR: PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD not set in .env");
    process.exit(1);
}

const COLLECTION = 'news'; // Target collection for testing

async function runAudit() {
    console.log(`\n🔒 STARTING SECURITY & USABILITY AUDIT`);
    console.log(`target: ${PB_URL} [${COLLECTION}]`);
    console.log(`---------------------------------------------------\n`);

    // --- SCENARIO A: THE HACKER (Anonymous) ---
    console.log(`🕵️  SCENARIO A: ANONYMOUS "HACKER" TEST`);
    const publicPb = new PocketBase(PB_URL);
    publicPb.autoCancellation(false);

    // 1. READ (Should Succeed if public, fail if private - usually public read is YES)
    try {
        await publicPb.collection(COLLECTION).getList(1, 1);
        console.log(`   ✅ READ (Anonymous): ALLOWED (Public Access OK)`);
    } catch (e) {
        console.log(`   ℹ️  READ (Anonymous): DENIED (Status ${e.status}) - Note: Check if this was intended.`);
    }

    // 2. CREATE (Should FAIL)
    try {
        await publicPb.collection(COLLECTION).create({
            title: "HACKED TITLE",
            content: "Hacked content",
            slug: "hacked-slug-" + Date.now(),
            published: true
        });
        console.error(`   ❌ CREATE (Anonymous): FAILED! (Operation SUCCEEDED but should have been BLOCKED)`);
    } catch (e) {
        if (e.status === 400 || e.status === 403) {
            console.log(`   ✅ CREATE (Anonymous): BLOCKED (Status ${e.status})`);
        } else {
            console.log(`   ⚠️  CREATE (Anonymous): Error ${e.status} (Unexpected)`);
        }
    }

    // Attempt to find a record to try hacking updates on (using public read)
    let targetId = null;
    try {
        const list = await publicPb.collection(COLLECTION).getList(1, 1);
        if (list.items.length > 0) {
            targetId = list.items[0].id;
        }
    } catch (e) { }

    if (targetId) {
        // 3. UPDATE (Should FAIL)
        try {
            await publicPb.collection(COLLECTION).update(targetId, {
                title: "HACKED UPDATE"
            });
            console.error(`   ❌ UPDATE (Anonymous): FAILED! (Operation SUCCEEDED but should have been BLOCKED)`);
        } catch (e) {
            if (e.status === 400 || e.status === 403 || e.status === 404) {
                console.log(`   ✅ UPDATE (Anonymous): BLOCKED (Status ${e.status})`);
            } else {
                console.log(`   ⚠️  UPDATE (Anonymous): Error ${e.status} (Unexpected)`);
            }
        }

        // 4. DELETE (Should FAIL)
        try {
            await publicPb.collection(COLLECTION).delete(targetId);
            console.error(`   ❌ DELETE (Anonymous): FAILED! (Operation SUCCEEDED but should have been BLOCKED)`);
        } catch (e) {
            if (e.status === 400 || e.status === 403 || e.status === 404) {
                console.log(`   ✅ DELETE (Anonymous): BLOCKED (Status ${e.status})`);
            } else {
                console.log(`   ⚠️  DELETE (Anonymous): Error ${e.status} (Unexpected)`);
            }
        }
    } else {
        console.log(`   ℹ️  Skipping Update/Delete Anonymous tests (No public records found to target)`);
    }

    console.log(`\n---------------------------------------------------\n`);

    // --- SCENARIO B: THE CLIENT (Authenticated Admin) ---
    console.log(`👔  SCENARIO B: AUTHENTICATED "CLIENT" TEST (Admin)`);
    const adminPb = new PocketBase(PB_URL);
    adminPb.autoCancellation(false);

    try {
        await adminPb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log(`   ✅ Login: SUCCESS`);
    } catch (e) {
        console.error(`   ❌ Login: FAILED! Check credentials in .env`);
        console.error(e.originalError || e);
        process.exit(1);
    }

    let testRecordId = null;

    // 1. CREATE (Should SUCCEED)
    try {
        const record = await adminPb.collection(COLLECTION).create({
            title: "TEST_RECORD_DO_NOT_DELETE",
            slug: "test-record-" + Date.now(),
            content: "<p>This is a temporary audit record.</p>",
            published: false,
            category: "Berita" // Ensure schema compliance
        });
        testRecordId = record.id;
        console.log(`   ✅ CREATE (Admin): SUCCESS (ID: ${testRecordId})`);
    } catch (e) {
        console.error(`   ❌ CREATE (Admin): FAILED! (Status ${e.status})`);
        console.error(`      CRITICAL WARNING: CLIENT LOCKED OUT! CHECK API RULES.`);
        console.error(e.response);
    }

    if (testRecordId) {
        // 2. UPDATE (Should SUCCEED)
        try {
            await adminPb.collection(COLLECTION).update(testRecordId, {
                title: "TEST_RECORD_UPDATED"
            });
            console.log(`   ✅ UPDATE (Admin): SUCCESS`);
        } catch (e) {
            console.error(`   ❌ UPDATE (Admin): FAILED! (Status ${e.status})`);
            console.error(`      CRITICAL WARNING: CLIENT LOCKED OUT! CHECK API RULES.`);
        }

        // 3. DELETE (Should SUCCEED)
        try {
            await adminPb.collection(COLLECTION).delete(testRecordId);
            console.log(`   ✅ DELETE (Admin): SUCCESS`);
        } catch (e) {
            console.error(`   ❌ DELETE (Admin): FAILED! (Status ${e.status})`);
            console.error(`      CRITICAL WARNING: CLIENT UNABLE TO DELETE! CHECK API RULES.`);
        }
    }

    console.log(`\n---------------------------------------------------`);
    console.log(`🏁 AUDIT COMPLETE`);
}

runAudit().catch(err => {
    console.error("Fatal Error:", err);
});
