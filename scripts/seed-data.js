const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');

// Env Parser
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
} catch (e) { }

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

const DUMMY_NEWS = [
    {
        title: "BMT NU Lumajang Raih Penghargaan Koperasi Terbaik 2024",
        slug: "bmt-nu-lumajang-raih-penghargaan-2024",
        category: "Berita",
        content: "<p>Alhamdulillah, BMT NU Lumajang kembali menorehkan prestasi gemilang tingkat provinsi...</p>",
        published: true,
        seo_title: "Penghargaan Koperasi Terbaik 2024",
        seo_desc: "BMT NU Lumajang meraih penghargaan koperasi syariah terbaik."
    },
    {
        title: "Pentingnya Mengelola Keuangan Sejak Dini untuk Santri",
        slug: "pentingnya-mengelola-keuangan-santri",
        category: "Edukasi",
        content: "<p>Pendidikan literasi keuangan sangat penting diajarkan kepada para santri di pesantren...</p>",
        published: true,
        seo_title: "Edukasi Keuangan Santri",
        seo_desc: "Tips mengelola keuangan bagi santri pondok pesantren."
    },
    {
        title: "Program Pembiayaan UMKM Tanpa Agunan Resmi Diluncurkan",
        slug: "program-pembiayaan-umkm-tanpa-agunan",
        category: "Promo",
        content: "<p>Kabar gembira bagi pelaku usaha mikro! Kini tersedia pembiayaan khusus tanpa agunan...</p>",
        published: true,
        seo_title: "Pembiayaan UMKM Tanpa Agunan",
        seo_desc: "Solusi modal usaha syariah tanpa ribet."
    },
    {
        title: "Kajian Rutin Muamalah: Hukum Jual Beli Online",
        slug: "kajian-muamalah-jual-beli-online",
        category: "Edukasi",
        content: "<p>Ikuti kajian rutin bulanan membahas fiqih muamalah kontemporer...</p>",
        published: false, // DRAFT
        seo_title: "Hukum Jual Beli Online",
        seo_desc: "Kajian fiqih muamalah tentang transaksi digital."
    }
];

const DUMMY_PRODUCTS = [
    {
        name: "Simpanan Wadiah Yad Dhomanah",
        slug: "simpanan-wadiah",
        type: "simpanan",
        schema_type: "SavingsAccount",
        description: "<p>Simpanan dengan akad titipan murni yang aman dan barokah. Bebas biaya admin bulanan.</p>",
        requirements: "<ul><li>KTP/SIM</li><li>Setoran awal Rp 50.000</li></ul>",
        min_deposit: "50000",
        is_featured: true,
        published: true,
        seo_keywords: "simpanan, wadiah, tabungan syariah"
    },
    {
        name: "Simpanan Mudharabah Berjangka",
        slug: "simpanan-mudharabah",
        type: "simpanan",
        schema_type: "DepositAccount",
        description: "<p>Investasikan dana Anda dengan bagi hasil yang kompetitif dan sesuai syariah.</p>",
        requirements: "<ul><li>KTP</li><li>Minimal Rp 1.000.000</li></ul>",
        min_deposit: "1000000",
        is_featured: false,
        published: true,
        seo_keywords: "deposito, mudharabah, investasi syariah"
    },
    {
        name: "Pembiayaan Murabahah (Jual Beli)",
        slug: "pembiayaan-murabahah",
        type: "pembiayaan",
        schema_type: "LoanOrCredit",
        description: "<p>Solusi pembelian kendaraan, renovasi rumah, atau barang modal dengan skema jual beli.</p>",
        requirements: "<ul><li>Usaha berjalan 2 tahun</li><li>Laporan keuangan</li></ul>",
        min_deposit: "0",
        is_featured: true,
        published: true,
        seo_keywords: "pembiayaan, kredit syariah, murabahah"
    },
    {
        name: "Pembiayaan Musyarakah (Modal Kerja)",
        slug: "pembiayaan-musyarakah",
        type: "pembiayaan",
        schema_type: "LoanOrCredit",
        description: "<p>Kerjasama modal usaha dengan sistem bagi hasil keuntungan dan risiko.</p>",
        requirements: "<ul><li>Proposal usaha</li><li>Legalitas lengkap</li></ul>",
        min_deposit: "0",
        is_featured: false,
        published: true,
        seo_keywords: "modal kerja, syirkah, musyarakah"
    }
];

async function seed(collectionName, data) {
    console.log(`\n🌱 Seeding ${collectionName}...`);
    let count = 0;
    for (const item of data) {
        try {
            await pb.collection(collectionName).create(item);
            console.log(`   + Created: ${item.title || item.name}`);
            count++;
        } catch (e) {
            // Ignore duplicate errors (constraint validation)
            if (e.status === 400 && e.message.includes("slug")) {
                console.log(`   - Skipped (Exists): ${item.title || item.name}`);
            } else {
                console.error(`   x Error creating ${item.title || item.name}:`, e.message);
                if (e.data) console.error(JSON.stringify(e.data));
            }
        }
    }
    console.log(`✅ ${collectionName}: Added ${count} new records.`);
}

async function main() {
    console.log("🚀 Starting Data Seeding...");

    // Authenticate Admin
    try {
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
        console.log("✅ Authenticated as Admin");
    } catch (e) {
        try {
            await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
            console.log("✅ Authenticated as Admin (Fallback)");
        } catch (err) {
            console.error("❌ Auth Failed:", err.message);
            process.exit(1);
        }
    }

    await seed('news', DUMMY_NEWS);
    await seed('products', DUMMY_PRODUCTS);

    console.log("\n🎉 Seeding Finished!");
}

main();
