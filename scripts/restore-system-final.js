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

// --- DATA ---
const productsData = [
    {
        name: "Tabungan Anggota",
        slug: "tabungan-anggota",
        type: "simpanan",
        icon_name: "IdCard",
        description: "<p>Simpanan identitas keanggotaan dan investasi.</p>",
        requirements: "<ul><li>FC Identitas</li><li>Mengisi Formulir</li></ul>",
        min_deposit: "Rp 25.000 / bulan",
        seo_keywords: "tabungan anggota, simpanan pokok",
        schema_type: "SavingsAccount",
        published: true,
        is_featured: false
    },
    {
        name: "Tabungan Sukarela (SIRELA)",
        slug: "tabungan-sukarela-sirela",
        type: "simpanan",
        icon_name: "Wallet",
        description: "<p>Simpanan likuid yang bisa disetor dan ditarik kapan saja.</p>",
        requirements: "<ul><li>FC Identitas</li></ul>",
        min_deposit: "Rp 5.000",
        seo_keywords: "sirela, tabungan harian",
        schema_type: "SavingsAccount",
        published: true,
        is_featured: true
    },
    {
        name: "Tabungan Haji & Umroh",
        slug: "tabungan-haji-umroh",
        type: "simpanan",
        icon_name: "Plane",
        description: "<p>Perencanaan ibadah ke tanah suci.</p>",
        requirements: "<ul><li>FC Identitas</li></ul>",
        min_deposit: "Rp 50.000",
        seo_keywords: "haji, umroh",
        schema_type: "SavingsAccount",
        published: true,
        is_featured: false
    },
    {
        name: "Tabungan Qurban",
        slug: "tabungan-qurban",
        type: "simpanan",
        icon_name: "Beef",
        description: "<p>Persiapan pembelian hewan Qurban.</p>",
        requirements: "<ul><li>FC Identitas</li></ul>",
        min_deposit: "Rp 100.000",
        seo_keywords: "qurban, idul adha",
        schema_type: "SavingsAccount",
        published: true,
        is_featured: false
    },
    {
        name: "Tabungan Pendidikan",
        slug: "tabungan-pendidikan",
        type: "simpanan",
        icon_name: "GraduationCap",
        description: "<p>Merencanakan biaya pendidikan.</p>",
        requirements: "<ul><li>FC Identitas</li></ul>",
        min_deposit: "Bebas",
        seo_keywords: "pendidikan, sekolah",
        schema_type: "SavingsAccount",
        published: true,
        is_featured: false
    },
    {
        name: "Sukarela Berjangka (Deposito)",
        slug: "sukarela-berjangka-deposito",
        type: "simpanan",
        icon_name: "Landmark",
        description: "<p>Investasi berjangka dengan bagi hasil.</p>",
        requirements: "<ul><li>Min Rp 5 Juta</li></ul>",
        min_deposit: "Rp 5.000.000",
        seo_keywords: "deposito, investasi",
        schema_type: "DepositAccount",
        published: true,
        is_featured: true
    },
    {
        name: "Pembiayaan Produktif",
        slug: "pembiayaan-produktif",
        type: "pembiayaan",
        icon_name: "Briefcase",
        description: "<p>Untuk pengembangan modal usaha.</p>",
        requirements: "<p>Hubungi Kantor</p>",
        min_deposit: "-",
        seo_keywords: "modal usaha, mudharabah",
        schema_type: "LoanOrCredit",
        published: true,
        is_featured: false
    },
    {
        name: "Pembiayaan Konsumtif",
        slug: "pembiayaan-konsumtif",
        type: "pembiayaan",
        icon_name: "ShoppingBag",
        description: "<p>Kebutuhan pribadi/elektronik.</p>",
        requirements: "<p>Hubungi Kantor</p>",
        min_deposit: "-",
        seo_keywords: "kredit elektronik, renovasi",
        schema_type: "LoanOrCredit",
        published: true,
        is_featured: false
    },
    {
        name: "Pembiayaan Musiman",
        slug: "pembiayaan-musiman",
        type: "pembiayaan",
        icon_name: "Sprout",
        description: "<p>Untuk Petani/Nelayan.</p>",
        requirements: "<p>Hubungi Kantor</p>",
        min_deposit: "-",
        seo_keywords: "pertanian, nelayan",
        schema_type: "LoanOrCredit",
        published: true,
        is_featured: false
    },
    {
        name: "Pembiayaan KUN (UMKM)",
        slug: "pembiayaan-kun",
        type: "pembiayaan",
        icon_name: "Store",
        description: "<p>Khusus UMKM Binaan.</p>",
        requirements: "<p>Rekomendasi Lazisnu</p>",
        min_deposit: "-",
        seo_keywords: "umkm, lazisnu",
        schema_type: "LoanOrCredit",
        published: true,
        is_featured: true
    },
    {
        name: "Pembiayaan KUNU (Lembaga)",
        slug: "pembiayaan-kunu",
        type: "pembiayaan",
        icon_name: "Building2",
        description: "<p>Pengembangan usaha Lembaga NU.</p>",
        requirements: "<p>SK Lembaga</p>",
        min_deposit: "-",
        seo_keywords: "banom nu, lembaga",
        schema_type: "LoanOrCredit",
        published: true,
        is_featured: false
    }
];

// --- SCHEMA ---
const blueprintSchema = [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, options: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" } },
    { name: "type", type: "select", options: { values: ["simpanan", "pembiayaan"] } },
    { name: "description", type: "editor" },
    { name: "requirements", type: "editor" },
    { name: "min_deposit", type: "text" },
    { name: "thumbnail", type: "file", options: { mimeTypes: ["image/*"] } },
    { name: "icon", type: "file", options: { mimeTypes: ["image/*", "image/svg+xml"] } },
    { name: "icon_name", type: "text" },
    { name: "brochure_pdf", type: "file", options: { mimeTypes: ["application/pdf"] } },
    { name: "schema_type", type: "text" },
    { name: "seo_keywords", type: "text" },
    { name: "is_featured", type: "bool" },
    { name: "published", type: "bool" }
];

async function main() {
    try {
        console.log("🚀 STARTING GRANULAR RESTORATION (v3)...");
        console.log("🔌 Auth:", process.env.POCKETBASE_ADMIN_EMAIL);
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        // 1. DELETE
        console.log("\n🗑️ [Step 1] Delete 'products' collection...");
        try {
            const old = await pb.collections.getOne("products");
            await pb.collections.delete(old.id);
            console.log("   ✅ Deleted.");
        } catch (e) {
            console.log("   ℹ️ Collection not found.");
        }

        // 2. CREATE SHELL (No Schema, No Rules)
        console.log("\n🏗️ [Step 2] Create Collection SHELL...");
        let col = await pb.collections.create({
            name: "products",
            type: "base"
        });
        console.log("   ✅ Created ID:", col.id);

        // 3. ADD FIELDS (Schema)
        console.log("\n📐 [Step 3] Add Schema/Fields...");
        // Try 'fields' key first (newer PB), fallback handled by SDK?
        // We use explicit update.
        try {
            await pb.collections.update(col.id, {
                // Try passing both to be sure
                schema: blueprintSchema,
                fields: blueprintSchema
            });
            console.log("   ✅ Fields definition sent.");
        } catch (e) {
            console.error("   ❌ Failed setting fields:", e.message);
            if (e.response) console.dir(e.response.data, { depth: null });
            throw e;
        }

        // 3.5 VERIFY
        console.log("\n🧐 [Step 3.5] Verify Fields...");
        col = await pb.collections.getOne(col.id);
        const fields = col.fields || col.schema || [];
        const hasPublished = fields.some(f => f.name === 'published');

        if (!hasPublished) {
            console.error("   ❌ CRITICAL: 'published' field MISSING!");
            console.log("   Dumping fields:", JSON.stringify(fields, null, 2));
            throw new Error("Field creation failed.");
        }
        console.log("   ✅ Field 'published' OK.");

        // 4. ADD RULES
        console.log("\n🛡️ [Step 4] Apply API Rules...");
        try {
            await pb.collections.update(col.id, {
                listRule: "published = true",
                viewRule: "published = true",
                createRule: "@request.auth.id != ''",
                updateRule: "@request.auth.id != ''",
                deleteRule: "@request.auth.id != ''"
            });
            console.log("   ✅ Rules applied.");
        } catch (e) {
            console.error("   ❌ Failed setting rules:", e.message);
            if (e.response) console.dir(e.response.data, { depth: null });
            throw e;
        }

        // 5. SEED
        console.log("\n🌱 [Step 5] Seeding Data...");
        for (const p of productsData) {
            try {
                await pb.collection("products").create(p);
                process.stdout.write(".");
            } catch (e) {
                console.error(`\n   ❌ Seed Failed (${p.name}):`, e.message);
            }
        }
        console.log("\n   ✅ Seeding completed.");

        // 6. RELATION
        console.log("\n🔗 [Step 6] Restore 'news' Relation...");
        try {
            const news = await pb.collections.getOne("news");
            const nFields = news.fields || news.schema || [];
            // Remove old if exists
            const cleanFields = nFields.filter(f => f.name !== 'related_products');

            cleanFields.push({
                name: "related_products",
                type: "relation",
                required: false,
                options: {
                    collectionId: col.id,
                    cascadeDelete: false,
                    maxSelect: 5
                }
            });

            await pb.collections.update("news", { fields: cleanFields });
            console.log("   ✅ Relation restored.");
        } catch (e) {
            console.log("   ⚠️ News relation warning (non-fatal):", e.message);
        }

        console.log("\n🎉 FINAL RESTORATION SUCCESSFUL!");

    } catch (e) {
        console.error("\n🔥 SCRIPT FAILED:", e.originalError || e.message);
    }
}

main();
