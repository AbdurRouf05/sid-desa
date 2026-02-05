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

// --- BATCH SCHEMAS ---
const schemaBatches = [
    {
        name: "Core Fields",
        fields: [
            { name: "name", type: "text", required: true },
            { name: "slug", type: "text", required: true, unique: true, options: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" } },
            // Be very explicit with Select
            { name: "type", type: "select", options: { maxSelect: 1, values: ["simpanan", "pembiayaan"] } }
        ]
    },
    {
        name: "Details",
        fields: [
            { name: "description", type: "editor" },
            { name: "requirements", type: "editor" },
            { name: "min_deposit", type: "text" }
        ]
    },
    {
        name: "Files",
        fields: [
            { name: "thumbnail", type: "file", options: { maxSelect: 1, mimeTypes: ["image/*"] } },
            { name: "icon", type: "file", options: { maxSelect: 1, mimeTypes: ["image/*", "image/svg+xml"] } },
            { name: "brochure_pdf", type: "file", options: { maxSelect: 1, mimeTypes: ["application/pdf"] } }
        ]
    },
    {
        name: "Meta",
        fields: [
            { name: "icon_name", type: "text" },
            { name: "schema_type", type: "text" },
            { name: "seo_keywords", type: "text" },
            { name: "is_featured", type: "bool" },
            { name: "published", type: "bool" }
        ]
    }
];

async function main() {
    try {
        console.log("🚀 STARTING GRANULAR RESTORATION...");
        console.log("🔌 Auth:", process.env.POCKETBASE_ADMIN_EMAIL);
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        // 1. DELETE
        console.log("\n🗑️ [Step 1] Delete 'products'...");
        try {
            const old = await pb.collections.getOne("products");
            await pb.collections.delete(old.id);
            console.log("   ✅ Deleted.");
        } catch (e) { }

        // 2. CREATE SHELL
        console.log("\n🏗️ [Step 2] Create Shell...");
        let col = await pb.collections.create({ name: "products", type: "base" });
        console.log("   ✅ Created ID:", col.id);

        // 3. APPLY BATCHES
        console.log("\n📐 [Step 3] Adding Fields sequentially...");
        let currentFields = []; // Start empty

        for (const batch of schemaBatches) {
            console.log(`   👉 Adding Batch: ${batch.name}`);
            try {
                // Combine current validated fields with new batch
                const nextFields = [...currentFields, ...batch.fields];

                // USE 'fields' KEY (v0.2x)
                await pb.collections.update(col.id, { fields: nextFields });

                // If success, update our local tracker
                currentFields = nextFields;
                console.log("      ✅ Success.");
            } catch (e) {
                console.error(`      ❌ FAILED Batch: ${batch.name}`);
                if (e.response) {
                    console.dir(e.response.data, { depth: null });
                }
                throw new Error("Schema Batch Failed");
            }
        }

        // 4. VERIFY PUBLISHED
        console.log("\n🧐 [Step 4] Verification...");
        col = await pb.collections.getOne(col.id);
        const hasPub = (col.fields || []).some(f => f.name === 'published');
        if (!hasPub) throw new Error("Published field missing after checks!");
        console.log("   ✅ Verified 'published' field.");

        // 5. RULES
        console.log("\n🛡️ [Step 5] Applying Rules...");
        await pb.collections.update(col.id, {
            listRule: "published = true",
            viewRule: "published = true",
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        });
        console.log("   ✅ Rules Applied.");

        // 6. SEED
        console.log("\n🌱 [Step 6] Seeding...");
        for (const p of productsData) {
            try {
                await pb.collection("products").create(p);
                process.stdout.write(".");
            } catch (e) {
                console.log("x");
            }
        }
        console.log("\n   ✅ Done.");

        // 7. RELATION
        console.log("\n🔗 [Step 7] Restoring Relation...");
        try {
            const news = await pb.collections.getOne("news");
            const nFields = (news.fields || []).filter(f => f.name !== 'related_products');
            nFields.push({
                name: "related_products",
                type: "relation",
                required: false,
                options: { collectionId: col.id, maxSelect: 5 }
            });
            await pb.collections.update("news", { fields: nFields });
            console.log("   ✅ Relation restored.");
        } catch (e) {
            console.log("   ⚠️ Non-fatal relation warning.");
        }

        console.log("\n🎉 SUCCESS!");

    } catch (e) {
        console.error("\n🔥 FATAL:", e.message);
    }
}

main();
