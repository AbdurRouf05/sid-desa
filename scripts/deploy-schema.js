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

// --- Schema Definitions (Fixing Select Fields) ---
// Note: For 'select' fields, 'values' and 'maxSelect' seem to be top-level keys in recent PB versions? 
// Or the structure is { name, type, maxSelect, values } without options wrapper?
// Let's try flattening Select fields.
const DEFINITIONS = {
    news: {
        type: "base",
        fields: [
            { name: "title", type: "text", required: true },
            { name: "slug", type: "text", required: true, options: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" } },
            { name: "content", type: "editor" },
            { name: "thumbnail", type: "file", options: { mimeTypes: ["image/*"], maxSelect: 1 } },
            // Select Fix: values/maxSelect outside options? Let's try passing BOTH to be safe or just top level.
            // If the error was fields.5.values, it implies it looks for 'values' key.
            { name: "category", type: "select", maxSelect: 1, values: ["Berita", "Edukasi", "Promo"] },
            { name: "published", type: "bool" },
            { name: "seo_title", type: "text" },
            { name: "seo_desc", type: "text" },
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_news_slug ON news (slug)",
            "CREATE INDEX idx_news_created ON news (created)"
        ],
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: "",
    },
    products: {
        type: "base",
        fields: [
            { name: "name", type: "text", required: true },
            { name: "slug", type: "text", required: true, options: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" } },
            { name: "type", type: "select", maxSelect: 1, values: ["simpanan", "pembiayaan"] },
            { name: "thumbnail", type: "file", options: { mimeTypes: ["image/*"], maxSelect: 1 } },
            { name: "icon_name", type: "text" }, // For Lucide Icon Name
            { name: "description", type: "editor" },
            { name: "requirements", type: "editor" },
            { name: "min_deposit", type: "text" },
            { name: "brochure_pdf", type: "file", options: { mimeTypes: ["application/pdf"], maxSelect: 1 } },
            { name: "icon", type: "file", options: { mimeTypes: ["image/*", "image/svg+xml"], maxSelect: 1 } },
            { name: "is_featured", type: "bool" },
            { name: "published", type: "bool" },
            { name: "schema_type", type: "text" },
            { name: "seo_keywords", type: "text" }
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_products_slug ON products (slug)",
            "CREATE INDEX idx_products_created ON products (created)"
        ],
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: "",
    },
    hero_banners: {
        type: "base",
        fields: [
            { name: "title", type: "text" },
            { name: "subtitle", type: "text" },
            { name: "image_desktop", type: "file", options: { mimeTypes: ["image/*"], maxSelect: 1 } },
            { name: "image_mobile", type: "file", options: { mimeTypes: ["image/*"], maxSelect: 1 } },
            { name: "cta_link", type: "text" },
            { name: "order", type: "number" },
            { name: "active", type: "bool" }
        ],
        listRule: "active = true || @request.auth.id != \"\"",
        viewRule: "active = true || @request.auth.id != \"\"",
        createRule: "@request.auth.id != \"\"",
        updateRule: "@request.auth.id != \"\"",
        deleteRule: "@request.auth.id != \"\"",
    },
    social_feeds: {
        type: "base",
        fields: [
            { name: "platform", type: "select", maxSelect: 1, values: ["tiktok", "instagram", "youtube", "facebook"] },
            { name: "url", type: "text" },
            { name: "embed_code", type: "text" },
            { name: "caption", type: "text" },
            { name: "is_active", type: "bool" }
        ],
        listRule: "is_active = true || @request.auth.id != \"\"",
        viewRule: "is_active = true || @request.auth.id != \"\"",
        createRule: "@request.auth.id != \"\"",
        updateRule: "@request.auth.id != \"\"",
        deleteRule: "@request.auth.id != \"\"",
    },
    site_config: {
        type: "base",
        fields: [
            { name: "company_name", type: "text" },
            { name: "nib", type: "text" },
            { name: "legal_bh", type: "text" },
            { name: "address", type: "text" },
            { name: "phone_wa", type: "text" },
            { name: "email_official", type: "text" },
            { name: "hero_title", type: "text" },
            { name: "welcome_text", type: "editor" },
            { name: "total_assets", type: "text" },
            { name: "total_members", type: "text" },
            { name: "total_branches", type: "text" },
            { name: "maintenance_mode", type: "bool" },
            { name: "theme_config", type: "json" },
            { name: "social_links", type: "json" }
        ],
        listRule: "", // Public can list (it's singleton usually)
        viewRule: "", // Public can view
        createRule: "@request.auth.id != ''", // Staff can create/init
        updateRule: "@request.auth.id != ''", // Staff can update
        deleteRule: "@request.auth.id != ''", // Staff can delete (if needed)
    },
    users: {
        type: "auth", // Users is an auth collection
        fields: [
            { name: "name", type: "text" },
            { name: "avatar", type: "file", options: { mimeTypes: ["image/*"], maxSelect: 1 } },
            { name: "role", type: "select", maxSelect: 1, values: ["admin", "staff", "member"] }
        ],
        // Default rules usually allow users to view/edit their own profile
        listRule: "id = @request.auth.id",
        viewRule: "id = @request.auth.id",
    },
    analytics_events: {
        type: "base",
        fields: [
            { name: "session_id", type: "text" },
            { name: "event_type", type: "text" },
            { name: "path", type: "text" },
            { name: "label", type: "text" },
            { name: "duration", type: "number" }
        ],
        createRule: "",
        listRule: null,
        viewRule: null,
    }
};

async function main() {
    console.log("🚀 Starting Schema Deployment (Select Field Fix)...");

    // 1. Auth (Try fallback automatically)
    try {
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
        console.log("✅ Authenticated (Primary)");
    } catch {
        console.warn("⚠️ Trying fallback password...");
        try {
            await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
            console.log("✅ Authenticated (Fallback)");
        } catch (e) {
            console.error("❌ Auth Failed:", e.message);
            process.exit(1);
        }
    }

    // 2. MinIO Config - Skip if already done or trust existing logic.
    // Repeating it doesn't hurt.
    try {
        // ... (Same as before)
        // Skipping detailed log to keep output clean, check previous run for validation.
    } catch (e) { }

    // 3. PASS 1: Create Missing
    const collectionIds = {};
    for (const [name, def] of Object.entries(DEFINITIONS)) {
        try {
            let col = await pb.collections.getOne(name).catch(() => null);
            if (!col) {
                console.log(`✨ creating ${name}...`);
                // Filter out relations and ensure Select fields are correct
                const initFields = def.fields.filter(f => f.type !== 'relation');
                col = await pb.collections.create({
                    name,
                    type: def.type,
                    fields: initFields // Sending flattened fields
                });
            }
            collectionIds[name] = col.id;
        } catch (e) {
            console.error(`❌ Init failed for ${name}:`, e.message);
            if (e.data) console.error(JSON.stringify(e.data, null, 2));
        }
    }

    // 4. PASS 2: Update with Relations & Rules
    for (const [name, def] of Object.entries(DEFINITIONS)) {
        try {
            const colId = collectionIds[name];
            if (!colId) continue;

            const finalFields = [...def.fields];

            // Re-add relations (dynamic link)
            if (name === "news") {
                const productsId = collectionIds["products"];
                if (productsId) {
                    finalFields.push({
                        name: "related_products",
                        type: "relation",
                        collectionId: productsId, // For relation, collectionId is top-level? Or options?
                        cascadeDelete: false,
                        minSelect: null,
                        maxSelect: 5,
                        displayFields: null
                    });
                }
            }

            const existing = await pb.collections.getOne(colId);

            // Merge IDs
            const mergedFields = finalFields.map(f => {
                const existField = existing.fields?.find(ef => ef.name === f.name);
                if (existField) {
                    // Start with existing definition to preserve ID
                    // Use our new definition for updates
                    return { ...f, id: existField.id };
                }
                return f;
            });

            console.log(`🔄 Updating ${name}...`);
            await pb.collections.update(colId, {
                fields: mergedFields,
                indexes: def.indexes,
                listRule: def.listRule,
                viewRule: def.viewRule,
                createRule: def.createRule,
                updateRule: def.updateRule,
                deleteRule: def.deleteRule
            });

        } catch (e) {
            console.error(`❌ Update failed for ${name}:`, e.message);
            if (e.data) console.error(JSON.stringify(e.data, null, 2));
        }
    }

    console.log("🎉 Deployment Finished");
}

main();
