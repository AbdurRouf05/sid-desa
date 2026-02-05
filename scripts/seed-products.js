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

const products = [
    // === SIMPANAN ===
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

    // === PEMBIAYAAN ===
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
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function seed() {
    try {
        console.log("🔌 Connecting to:", process.env.NEXT_PUBLIC_POCKETBASE_URL);
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

        console.log("🌱 Starting Seeding Process...");

        for (const product of products) {
            const slug = slugify(product.name);
            const data = { ...product, slug };

            try {
                // Try create
                await pb.collection('products').create(data);
                console.log(`✅ Created: ${product.name}`);
            } catch (createError) {
                // If slug collision, try appending timestamp
                if (createError.status === 400 && createError.response?.data?.slug) {
                    const newSlug = slug + '-' + Date.now();
                    const newData = { ...product, slug: newSlug };
                    await pb.collection('products').create(newData);
                    console.log(`✅ Created (slug adjusted): ${product.name}`);
                } else {
                    console.error(`❌ Failed to create ${product.name}:`, createError.message);
                }
            }
        }

        console.log("\n🎉 Seeding Completed!");

    } catch (e) {
        console.error("❌ Seeding Error:", e.originalError || e.message);
    }
}

seed();
