const PocketBase = require('pocketbase/cjs');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    console.log("🛠️  UI LABELS SCHEMA FIXER (V2 - Auto Auth)");
    console.log("=========================================");

    // --- 2. AUTHENTICATION ---
    let isAuthenticated = false;

    // Try Auto-Login first
    if (process.env.POCKETBASE_ADMIN_EMAIL && process.env.POCKETBASE_ADMIN_PASSWORD) {
        console.log(`🔄 Attempting auto-login as ${process.env.POCKETBASE_ADMIN_EMAIL}...`);
        try {
            await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
            console.log("✅ Auto-Login Successful!");
            isAuthenticated = true;
        } catch (e) {
            console.log("❌ Auto-Login Failed:", e.message);
        }
    }

    // Manual Login Fallback
    if (!isAuthenticated) {
        console.log("\n🔑 Manual Login Required");
        const email = await askQuestion("Admin Email: ");
        const password = await askQuestion("Admin Password: ");
        try {
            await pb.admins.authWithPassword(email, password);
            console.log("✅ Login Successful!");
        } catch (e) {
            console.error("❌ Login Failed. Check credentials or server status.");
            console.error("   Error details:", e.data || e.message);
            process.exit(1);
        }
    }

    // --- 3. DELETE EXISTING COLLECTION ---
    try {
        console.log("\n🔍 Checking for existing 'ui_labels' collection...");
        try {
            const existing = await pb.collections.getOne('ui_labels');
            console.log(`🗑️  Found existing '${existing.name}' (${existing.id}). Deleting...`);
            await pb.collections.delete(existing.id);
            console.log("✅ Deleted successfuly.");
        } catch (e) {
            if (e.status === 404) {
                console.log("ℹ️  Collection 'ui_labels' not found. Creating fresh.");
            } else {
                throw e;
            }
        }
    } catch (e) {
        console.error("❌ Failed to check/delete:", e.message);
        process.exit(1);
    }

    // --- 4. CREATE NEW SCHEMA ---
    console.log("\n✨ Creating new 'ui_labels' collection...");
    try {
        await pb.collections.create({
            name: 'ui_labels',
            type: 'base',
            fields: [
                {
                    name: "label_key",
                    type: "text",
                    required: true,
                    unique: true,
                    options: { min: null, max: null, pattern: "" }
                },
                {
                    name: "label",
                    type: "text",
                    required: true,
                    unique: false,
                    options: { min: null, max: null, pattern: "" }
                },
                {
                    name: "section",
                    type: "select",
                    required: false,
                    maxSelect: 1,
                    values: ["Navbar", "Footer", "Homepage", "General"]
                },
                {
                    name: "is_visible",
                    type: "bool",
                    required: false
                }
            ],
            // Use native unique constraint
            indexes: [],
            listRule: "",
            viewRule: ""
        });
        console.log("✅ Collection 'ui_labels' created successfully!");
    } catch (e) {
        console.error("❌ Failed to create:", e.message);
        if (e.data) console.error("   Data:", JSON.stringify(e.data, null, 2));
        process.exit(1);
    }

    // --- 5. SEED DATA ---
    console.log("\n🌱 Seeding default labels...");
    const defaults = [
        { label_key: "nav_home", label: "Beranda", section: "Navbar", is_visible: true },
        { label_key: "nav_products", label: "Produk", section: "Navbar", is_visible: true },
        { label_key: "nav_services", label: "Layanan", section: "Navbar", is_visible: true },
        { label_key: "nav_news", label: "Berita", section: "Navbar", is_visible: true },
        { label_key: "nav_about", label: "Tentang Kami", section: "Navbar", is_visible: true },
        { label_key: "nav_contact", label: "Kontak", section: "Navbar", is_visible: true },
        { label_key: "section_why_us", label: "Kenapa Memilih Kami?", section: "Homepage", is_visible: true },
        { label_key: "section_products_title", label: "Produk Unggulan", section: "Homepage", is_visible: true },
        { label_key: "section_news_title", label: "Kabar Pesantren", section: "Homepage", is_visible: true },
    ];

    for (const item of defaults) {
        try {
            await pb.collection('ui_labels').create(item, { requestKey: null });
            console.log(`   + Created: ${item.label_key}`);
        } catch (e) {
            // Check if error is validation error (duplicate)
            console.log(`   - Skipped: ${item.label_key} (${e.message})`);
        }
    }

    console.log("\n🎉 DONE! All systems go.");
    rl.close();
}

main();
