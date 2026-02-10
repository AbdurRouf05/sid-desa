const PocketBase = require('pocketbase/cjs');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
const envLocalPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
if (fs.existsSync(envLocalPath)) dotenv.config({ path: envLocalPath, override: true });

const PB_URL = process.env.PB_URL || process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://db-bmtnulmj.sagamuda.cloud";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("❌ ERROR: PB_ADMIN_EMAIL/PASSWORD not set.");
    process.exit(1);
}

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

const PUBLIC_READ_ONLY = {
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
};

const PUBLIC_CREATE_ONLY = {
    listRule: null, // or admin only
    viewRule: null,
    createRule: "", // Public can create
    updateRule: null,
    deleteRule: null,
};

const COLLECTIONS_TO_SECURE = [
    'hero_banners',
    'news',
    'products',
    'social_feeds',
    'site_config',
    'branches',
    'ui_labels',
    'media'
];

async function secureApiRules() {
    console.log("🔐 SECURING API RULES...");
    console.log(`Target: ${PB_URL}`);

    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log("✅ Admin Authenticated");
    } catch (e) {
        console.error("❌ Auth Failed:", e.message);
        return;
    }

    // 1. Secure Content Collections (Read: Public, Write: Admin)
    for (const name of COLLECTIONS_TO_SECURE) {
        try {
            console.log(`\n👉 Securing [${name}]...`);
            // Update to Read-Only Public
            await pb.collections.update(name, {
                listRule: "",
                viewRule: "",
                createRule: null,
                updateRule: null,
                deleteRule: null,
            });
            console.log(`   ✅ [${name}] Locked down (Read: Public, Write: Admin)`);
        } catch (e) {
            console.error(`   ❌ Failed to update [${name}]:`, e.status || e.message);
        }
    }

    // 2. Secure Inquiries (Create: Public, Read: Admin)
    try {
        console.log(`\n👉 Securing [inquiries]...`);
        await pb.collections.update('inquiries', {
            listRule: null,   // Admin only
            viewRule: null,   // Admin only
            createRule: "",   // Public can create
            updateRule: null, // Admin only
            deleteRule: null, // Admin only
        });
        console.log(`   ✅ [inquiries] Configured (Create: Public, Read: Admin)`);
    } catch (e) {
        console.error(`   ❌ Failed to update [inquiries]:`, e.status || e.message);
    }

    // 3. Secure Analytics (If exists, usually Create: Public or Server Action, sticking to Admin only for now if not sure, but 'analytics_events' often needs public create)
    // Checking previous patterns: analytics usually via server action (admin client) or public.
    // Safest default for now: Admin Only (assuming backend logging). 
    // If client-side logging, it needs createRule: "".
    // Let's assume Admin Only for now to be safe, user can enable if broken.

    console.log("\n✨ API Rules Update Complete.");
}

secureApiRules();
