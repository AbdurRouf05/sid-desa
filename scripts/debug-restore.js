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

// --- FIELDS DEFINITIONS (One by One) ---
const fieldsManifest = [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, options: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" } },
    {
        name: "product_type", // RENAMED to avoid potential 'type' keyword conflict
        type: "text", // FALLBACK to TEXT to unblock restoration
        required: false
    },
    { name: "description", type: "editor" },
    { name: "requirements", type: "editor" },
    { name: "min_deposit", type: "text" },
    { name: "thumbnail", type: "file", options: { maxSelect: 1, mimeTypes: ["image/*"] } },
    { name: "icon", type: "file", options: { maxSelect: 1, mimeTypes: ["image/*", "image/svg+xml"] } },
    { name: "icon_name", type: "text" },
    { name: "brochure_pdf", type: "file", options: { maxSelect: 1, mimeTypes: ["application/pdf"] } },
    { name: "schema_type", type: "text" },
    { name: "seo_keywords", type: "text" },
    { name: "is_featured", type: "bool" },
    { name: "published", type: "bool" }
];

async function main() {
    console.log("🛡️ DEBUG RESTORE: One-Field-At-A-Time Protocol (Renamed 'type' -> 'product_type')");
    console.log("🔌 Auth...");
    try {
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
    } catch (e) {
        console.error("❌ Auth Failed:", e.message);
        return;
    }

    // 1. DELETE
    console.log("\n[1] Deleting 'products'...");
    try {
        const old = await pb.collections.getOne("products");
        await pb.collections.delete(old.id);
        console.log("    ✅ Deleted.");
    } catch (e) {
        console.log("    ℹ️ Not found, skipping.");
    }

    // 2. CREATE EMPTY
    console.log("\n[2] Creating Base Collection...");
    let col;
    try {
        col = await pb.collections.create({
            name: "products",
            type: "base"
        });
        console.log("    ✅ Created ID:", col.id);
    } catch (e) {
        console.error("    ❌ Create Failed:", JSON.stringify(e.data));
        return;
    }

    // 3. ADD FIELDS INCREMENTALLY
    console.log("\n[3] Injecting Fields...");
    let currentSchema = [];

    for (const field of fieldsManifest) {
        process.stdout.write(`    👉 Adding [${field.name}]... `);

        // Prepare Payload
        // We append the new field to the existing ones
        const payloadFields = [...currentSchema, field];

        try {
            // Update
            await pb.collections.update(col.id, { fields: payloadFields });

            // Success
            console.log("OK ✅");
            currentSchema.push(field); // Confirm it stuck

        } catch (e) {
            console.log("FAILED ❌");
            console.error(`\n🔴 FATAL ERROR on field '${field.name}':`);
            console.error("Payload Options:", JSON.stringify(field.options));
            if (e.response && e.response.data) {
                console.dir(e.response.data, { depth: null, colors: true });
            } else {
                console.error(e.message);
            }
            return; // STOP MMEDIATELY
        }
    }

    // 4. RULES
    console.log("\n[4] Applying Rules...");
    try {
        await pb.collections.update(col.id, {
            listRule: "published = true",
            viewRule: "published = true",
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        });
        console.log("    ✅ Rules OK.");
    } catch (e) {
        console.error("    ❌ Rules Failed:", JSON.stringify(e.data));
        return;
    }

    console.log("\n✅✅ DEBUG RESTORE SUCCESSFUL ✅✅");
}

main();
