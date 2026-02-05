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

// PRODUCT DATA
const productsData = [
    {
        name: "Tabungan Anggota",
        type: "simpanan",
        icon_name: "IdCard",
        description: "<p>Simpanan identitas keanggotaan dan investasi. Mendapatkan SHU (Sisa Hasil Usaha) di akhir tahun.</p>",
        requirements: "<ul><li>FC Identitas (KTP/KK/SIM)</li><li>Mengisi Formulir</li></ul>",
        min_deposit: "Rp 25.000 / bulan",
        seo_keywords: "tabungan anggota, simpanan pokok, simpanan wajib, bmt nu lumajang",
        published: true
    },
    {
        name: "Tabungan Sukarela (SIRELA)",
        type: "simpanan",
        icon_name: "Wallet",
        description: "<p>Simpanan likuid yang bisa disetor dan ditarik kapan saja.</p>",
        requirements: "<ul><li>FC Identitas</li><li>Mengisi Formulir</li></ul>",
        min_deposit: "Rp 5.000",
        seo_keywords: "tabungan sukarela, sirela, tabungan harian",
        published: true
    },
    {
        name: "Tabungan Haji & Umroh",
        type: "simpanan",
        icon_name: "Plane",
        description: "<p>Perencanaan ibadah ke tanah suci. Tidak bisa diambil sewaktu-waktu sampai saldo mencapai Rp 25.000.000.</p>",
        requirements: "<ul><li>FC Identitas</li><li>Mengisi Formulir</li></ul>",
        min_deposit: "Rp 50.000",
        seo_keywords: "tabungan haji, tabungan umroh, bmt nu lumajang",
        published: true
    },
    {
        name: "Tabungan Qurban",
        type: "simpanan",
        icon_name: "Beef",
        description: "<p>Persiapan pembelian hewan Qurban Idul Adha.</p>",
        requirements: "<ul><li>FC Identitas</li><li>Mengisi Formulir</li></ul>",
        min_deposit: "Rp 100.000 (Awal)",
        seo_keywords: "tabungan qurban, idul adha, sapi, kambing",
        published: true
    },
    {
        name: "Tabungan Pendidikan",
        type: "simpanan",
        icon_name: "GraduationCap",
        description: "<p>Merencanakan biaya pendidikan anak/diri sendiri.</p>",
        requirements: "<ul><li>FC Identitas</li><li>Mengisi Formulir</li></ul>",
        min_deposit: "Tanpa Batas Minimal",
        seo_keywords: "tabungan pendidikan, biaya sekolah, kuliah",
        published: true
    },
    {
        name: "Sukarela Berjangka (Deposito)",
        type: "simpanan",
        icon_name: "Landmark",
        description: "<p>Investasi berjangka dengan sistem bagi hasil. Tempo 3 - 60 Bulan.</p>",
        requirements: "<ul><li>FC Identitas</li><li>Mengisi Formulir</li><li>Minimal Setoran Rp 5.000.000</li></ul>",
        min_deposit: "Rp 5.000.000",
        seo_keywords: "deposito syariah, investasi berjangka, bagi hasil",
        published: true,
        is_featured: true
    },
    {
        name: "Pembiayaan Produktif",
        type: "pembiayaan",
        icon_name: "Briefcase",
        description: "<p>Untuk pengembangan modal usaha. Menggunakan akad Mudharabah & Musyarokah.</p>",
        requirements: "<p>Hubungi kantor cabang terdekat untuk persyaratan lengkap.</p>",
        min_deposit: "-",
        seo_keywords: "modal usaha, pembiayaan produktif, mudharabah",
        published: true
    },
    {
        name: "Pembiayaan Konsumtif",
        type: "pembiayaan",
        icon_name: "ShoppingBag",
        description: "<p>Untuk kebutuhan pribadi, renovasi rumah, pendidikan, atau pembelian elektronik.</p>",
        requirements: "<p>Hubungi kantor cabang terdekat untuk persyaratan lengkap.</p>",
        min_deposit: "-",
        seo_keywords: "kredit elektronik, renovasi rumah, pembiayaan syariah",
        published: true
    },
    {
        name: "Pembiayaan Musiman",
        type: "pembiayaan",
        icon_name: "Sprout",
        description: "<p>Disesuaikan siklus pendapatan (Petani/Nelayan/Pedagang Musiman).</p>",
        requirements: "<p>Khusus Petani/Nelayan.</p>",
        min_deposit: "-",
        seo_keywords: "kredit tani, pertanian, nelayan, musiman",
        published: true
    },
    {
        name: "Pembiayaan KUN (Kredit Usaha Nahdliyyin)",
        type: "pembiayaan",
        icon_name: "Store",
        description: "<p>Khusus UMKM binaan atau afiliasi LAZISNU.</p>",
        requirements: "<p>Rekomendasi LAZISNU.</p>",
        min_deposit: "-",
        seo_keywords: "lazisnu, umkm nu, kredit usaha nahdliyyin",
        published: true,
        is_featured: true
    },
    {
        name: "Pembiayaan KUNU",
        type: "pembiayaan",
        icon_name: "Building2",
        description: "<p>Kredit Usaha Nahdlatul Ulama. Khusus pengembangan usaha Lembaga/Banom NU.</p>",
        requirements: "<p>SK Lembaga/Banom NU.</p>",
        min_deposit: "-",
        seo_keywords: "usaha banom nu, lembaga nu, kunu",
        published: true
    }
];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function fixAndReset() {
    try {
        console.log("🔌 Connecting to:", process.env.NEXT_PUBLIC_POCKETBASE_URL);
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        // 1. REMOVE DEPENDENCY FROM NEWS
        console.log("🔧 Checking 'news' collection for current dependencies...");
        const newsCollection = await pb.collections.getOne('news');
        let newsFields = newsCollection.fields || newsCollection.schema || [];

        // Find existing related_products field to back it up (or define it fresh later)
        const relFieldIdx = newsFields.findIndex(f => f.name === 'related_products');
        let removedRelField = null;

        if (relFieldIdx !== -1) {
            console.log("⚠️ Found dependency 'related_products' in news. Removing temporarily...");
            removedRelField = newsFields[relFieldIdx];
            newsFields.splice(relFieldIdx, 1);

            // Validate that we are removing content
            // Update News Schema
            await pb.collections.update('news', { fields: newsFields });
            console.log("✅ Dependency removed from 'news'.");
        } else {
            console.log("ℹ️ No dependency found in 'news'. Proceeding...");
        }

        // 2. DELETE PRODUCTS COLLECTION
        let oldProductsId = null;
        try {
            const oldCollection = await pb.collections.getOne('products');
            oldProductsId = oldCollection.id;
            console.log(`✅ Found existing 'products' collection (ID: ${oldProductsId})`);

            console.log("🗑️ Deleting 'products' collection...");
            await pb.collections.delete(oldProductsId);
            console.log("✅ 'products' collection deleted.");
        } catch (e) {
            console.log("ℹ️ 'products' collection not found or already deleted.");
        }

        // 3. CREATE PRODUCTS COLLECTION
        console.log("🆕 Creating NEW 'products' collection with FIXED Schema...");
        const productSchema = [
            { name: "name", type: "text", required: true },
            { name: "slug", type: "text", required: true, unique: true, options: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" } },
            { name: "type", type: "select", options: { maxSelect: 1, values: ["simpanan", "pembiayaan"] } },
            { name: "description", type: "editor" },
            { name: "requirements", type: "editor" },
            { name: "min_deposit", type: "text" },
            { name: "thumbnail", type: "file", options: { maxSelect: 1, mimeTypes: ["image/*"] } },
            { name: "icon", type: "file", options: { maxSelect: 1, mimeTypes: ["image/*", "image/svg+xml"] } },
            { name: "icon_name", type: "text" },
            { name: "brochure_pdf", type: "file", options: { maxSelect: 1, mimeTypes: ["application/pdf"] } },
            { name: "seo_keywords", type: "text" },
            { name: "is_featured", type: "bool" },
            { name: "published", type: "bool" },
            { name: "schema_type", type: "text" }
        ];

        const createData = {
            name: "products",
            type: "base",
            schema: productSchema
        };
        // Reuse ID if we had one, to keep external IDs consistent (though relation was broken)
        // Actually, if we reuse ID, maybe verifying relations is easier.
        // But we removed relation from news, so we can use ANY ID.
        // Let's reuse for consistency if we can.
        if (oldProductsId) {
            createData.id = oldProductsId;
        }

        const newCollection = await pb.collections.create(createData);
        console.log(`✅ Collection 'products' created! (ID: ${newCollection.id})`);


        // 4. RESTORE DEPENDENCY TO NEWS
        if (removedRelField) {
            console.log("🔗 Restoring 'related_products' relation to 'news'...");
            // Need to verify collectionId matches new collection (if we reused ID it matches, if not we must update)
            removedRelField.options.collectionId = newCollection.id;

            // Add back
            newsFields.push(removedRelField);
            await pb.collections.update('news', { fields: newsFields });
            console.log("✅ Relation restored in 'news'.");
        } else {
            // If it didn't exist, maybe we should add it? 
            // Logic in schema says referencing 'products'.
            console.log("ℹ️ Adding 'related_products' relation to 'news' (fresh)...");
            const newRelField = {
                "system": false,
                "name": "related_products",
                "type": "relation",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "collectionId": newCollection.id,
                    "cascadeDelete": false,
                    "minSelect": null,
                    "maxSelect": 5,
                    "displayFields": null
                }
            };
            newsFields.push(newRelField);
            await pb.collections.update('news', { fields: newsFields });
            console.log("✅ Relation created in 'news'.");
        }

        // 5. SEED PRODUCTS
        console.log("🌱 Seeding product data...");
        for (const product of productsData) {
            const slug = slugify(product.name);
            const data = { ...product, slug };
            try {
                await pb.collection('products').create(data);
                console.log(`   ✅ Created: ${product.name}`);
            } catch (e) {
                if (e.status === 400 && e.response?.data?.slug) {
                    data.slug = slug + '-' + Date.now();
                    await pb.collection('products').create(data);
                    console.log(`   ✅ Created (slug fix): ${product.name}`);
                } else {
                    console.error(`   ❌ Failed: ${product.name}`, e.message);
                }
            }
        }

        console.log("\n🎉 MISSION COMPLETE: Schema Dependency Fixed & Data Restored!");

    } catch (e) {
        console.error("❌ Fatal Error:", e.originalError || e.message || e);
        if (e.data) console.error("Details:", JSON.stringify(e.data, null, 2));
    }
}

fixAndReset();
