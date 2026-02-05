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

// --- PROVEN SCHEMA (Text for product_type) ---
const provenSchema = [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, options: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" } },
    { name: "product_type", type: "text", required: false },
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
    { name: "published", type: "bool" },
    // EXPLICITLY ADD SYSTEM FIELDS
    { name: "created", type: "autodate", onCreate: true, onUpdate: false },
    { name: "updated", type: "autodate", onCreate: true, onUpdate: true }
];

async function main() {
    try {
        console.log("🚀 STARTING PROVEN RESTORATION...");
        console.log("🔌 Auth:", process.env.POCKETBASE_ADMIN_EMAIL);
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        // 1. DELETE CLEANUP
        console.log("\n🗑️ [Step 1] Cleanup 'products'...");
        try {
            const old = await pb.collections.getOne("products");
            await pb.collections.delete(old.id);
            console.log("   ✅ Deleted old/partial collection.");
        } catch (e) {
            console.log("   ℹ️ Clean slate.");
        }

        // 2. CREATE SHELL
        console.log("\n🏗️ [Step 2] Create Shell...");
        let col = await pb.collections.create({ name: "products", type: "base" });
        console.log("   ✅ Created ID:", col.id);

        // 3. SET FIELDS (Full Batch - Proven to work)
        console.log("\n📐 [Step 3] Setting Schema...");
        await pb.collections.update(col.id, { fields: provenSchema });
        console.log("   ✅ Schema updated.");

        // 4. APPLY RULES
        console.log("\n🛡️ [Step 4] Applying API Rules...");
        await pb.collections.update(col.id, {
            listRule: "published = true",
            viewRule: "published = true",
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        });
        console.log("   ✅ Rules applied.");

        // 5. SEED DATA
        console.log("\n🌱 [Step 5] Seeding 11 Products...");
        for (const p of productsData) {
            try {
                // MAP DATA: type -> product_type
                const payload = {
                    ...p,
                    product_type: p.type // Mapping here
                };
                delete payload.type; // Remove old key to avoid confusion (tho PB ignores extras)

                await pb.collection("products").create(payload);
                process.stdout.write(".");
            } catch (e) {
                console.error(`\n   ❌ Failed ${p.name}:`, e.message);
                if (e.response) console.dir(e.response.data, { depth: null });
            }
        }
        console.log("\n   ✅ Seeding completed.");

        // 6. RELATION
        console.log("\n🔗 [Step 6] Restoring 'news' Relation...");
        try {
            const news = await pb.collections.getOne("news");
            const fields = news.fields || news.schema || [];
            // Remove old if exists
            const cleanFields = fields.filter(f => f.name !== 'related_products');

            // Add new Relation
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
            console.error("   ⚠️ Warning on News Relation:", e.message);
        }

        console.log("\n🎉 FULL SYSTEM RESTORED & ONLINE!");

    } catch (e) {
        console.error("\n🔥 FATAL:", e.message);
        if (e.response) console.dir(e.response.data, { depth: null });
    }
}

main();
