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

// REAL DATA MAPPING
const REAL_PRODUCTS = [
    // --- SIMPANAN ---
    {
        name: "Tabungan Anggota (Simpanan Pokok & Wajib)",
        slug: "tabungan-anggota",
        type: "simpanan",
        schema_type: "SavingsAccount",
        description: "<p>Simpanan identitas keanggotaan dan investasi. Anggota berhak mendapatkan SHU (Sisa Hasil Usaha) di akhir tahun tutup buku.</p>",
        requirements: "<ul><li>Fotocopy Identitas (KTP/KK/SIM)</li><li>Mengisi Formulir Keanggotaan</li><li>Setoran Awal (Pokok): Rp 250.000</li><li>Setoran Rutin (Wajib): Rp 25.000 / bulan</li></ul>",
        min_deposit: "250000",
        is_featured: true,
        published: true,
        seo_keywords: "simpanan pokok, simpanan wajib, anggota bmt nu, shu koperasi",
        sharia_contract: "Wadiah"
    },
    {
        name: "Tabungan Sukarela (SIRELA)",
        slug: "tabungan-sukarela-sirela",
        type: "simpanan",
        schema_type: "SavingsAccount",
        description: "<p>Simpanan likuid yang fleksibel, bisa disetor dan ditarik kapan saja sesuai kebutuhan anggota tanpa potongan administrasi bulanan.</p>",
        requirements: "<ul><li>Fotocopy Identitas</li><li>Mengisi Formulir</li><li>Setoran Awal: Rp 20.000</li><li>Setoran Berikutnya: Minimal Rp 5.000</li></ul>",
        min_deposit: "20000",
        is_featured: true,
        published: true,
        seo_keywords: "tabungan harian, simpanan cair, bmt nu lumajang, tanpa potongan",
        sharia_contract: "Wadiah"
    },
    {
        name: "Tabungan Haji & Umroh",
        slug: "tabungan-haji-umroh",
        type: "simpanan",
        schema_type: "SavingsAccount",
        description: "<p>Simpanan perencanaan khusus untuk mewujudkan niat suci beribadah ke tanah suci. Dana aman dan berkah.</p>",
        requirements: "<ul><li>Setoran Awal: Rp 100.000</li><li>Setoran Berikutnya: Minimal Rp 50.000</li><li>Ketentuan: Tidak bisa diambil sewaktu-waktu sampai saldo mencapai Rp 25.000.000 (Estimasi porsi haji).</li></ul>",
        min_deposit: "100000",
        is_featured: false,
        published: true,
        seo_keywords: "tabungan haji, tabungan umroh, simpanan haji bmt",
        sharia_contract: "Mudharabah"
    },
    {
        name: "Tabungan Qurban",
        slug: "tabungan-qurban",
        type: "simpanan",
        schema_type: "SavingsAccount",
        description: "<p>Persiapkan ibadah Qurban Idul Adha Anda dengan ringan melalui tabungan rutin.</p>",
        requirements: "<ul><li>Setoran Awal: Rp 100.000</li><li>Ketentuan: Dana mengendap hingga bulan Dzulhijjah/Idul Adha.</li></ul>",
        min_deposit: "100000",
        is_featured: false,
        published: true,
        seo_keywords: "tabungan qurban, simpanan kurban, idul adha",
        sharia_contract: "Mudharabah"
    },
    {
        name: "Tabungan Pendidikan",
        slug: "tabungan-pendidikan",
        type: "simpanan",
        schema_type: "SavingsAccount",
        description: "<p>Merencanakan biaya pendidikan anak atau diri sendiri untuk masa depan yang lebih cerah.</p>",
        requirements: "<ul><li>Setoran Awal: Rp 20.000</li><li>Setoran Berikutnya: Tanpa Batas Minimal</li><li>Ketentuan: Pengambilan dana khusus untuk pembayaran kebutuhan pendidikan.</li></ul>",
        min_deposit: "20000",
        is_featured: false,
        published: true,
        seo_keywords: "tabungan pendidikan, biaya sekolah, tabungan anak",
        sharia_contract: "Mudharabah"
    },
    {
        name: "Sukarela Berjangka (Deposito)",
        slug: "sukarela-berjangka-deposito",
        type: "simpanan",
        schema_type: "DepositAccount",
        description: "<p>Investasi berjangka syariah dengan sistem bagi hasil yang kompetitif dan pilihan hadiah menarik.</p>",
        requirements: "<ul><li>Minimal Setoran: Rp 5.000.000</li><li>Jangka Waktu: 3 - 60 Bulan</li><li>Opsi Bagi Hasil: Hadiah di Awal (Barang) atau Hadiah di Akhir (Uang).</li></ul>",
        min_deposit: "5000000",
        is_featured: true,
        published: true,
        seo_keywords: "deposito syariah, investasi bagi hasil, mudharabah berjangka",
        sharia_contract: "Mudharabah Berjangka"
    },

    // --- PEMBIAYAAN ---
    {
        name: "Pembiayaan Produktif",
        slug: "pembiayaan-produktif",
        type: "pembiayaan",
        schema_type: "LoanOrCredit",
        description: "<p>Solusi permodalan untuk pengembangan usaha mikro, kecil, dan menengah dengan akad Mudharabah (Bagi Hasil) atau Musyarokah (Kerjasama Modal).</p>",
        requirements: "<ul><li>Memiliki usaha berjalan</li><li>Proposal/Rencana Usaha</li><li>Legalitas Usaha</li></ul>",
        min_deposit: "0",
        is_featured: true,
        published: true,
        seo_keywords: "modal usaha, kredit usaha rakyat, mudharabah, musyarakah",
        sharia_contract: "Mudharabah/Musyarokah"
    },
    {
        name: "Pembiayaan Konsumtif",
        slug: "pembiayaan-konsumtif",
        type: "pembiayaan",
        schema_type: "LoanOrCredit",
        description: "<p>Pembiayaan untuk pembelian barang kebutuhan pribadi (Elektronik, Renovasi Rumah, Kendaraan) dengan akad jual beli (Murabahah).</p>",
        requirements: "<ul><li>Slip Gaji / Bukti Penghasilan</li><li>Rincian barang yang dibutuhkan</li></ul>",
        min_deposit: "0",
        is_featured: false,
        published: true,
        seo_keywords: "kredit elektronik, renovasi rumah, pembiayaan syariah, murabahah",
        sharia_contract: "Murabahah"
    },
    {
        name: "Pembiayaan Musiman",
        slug: "pembiayaan-musiman",
        type: "pembiayaan",
        schema_type: "LoanOrCredit",
        description: "<p>Pembiayaan dengan skema pembayaran tempo (yarnen - bayar panen) yang disesuaikan dengan siklus pendapatan Petani, Nelayan, atau Pedagang Musiman.</p>",
        requirements: "<ul><li>Siklus usaha musiman jelas</li><li>Estimasi panen/pendapatan</li></ul>",
        min_deposit: "0",
        is_featured: false,
        published: true,
        seo_keywords: "kredit tani, yarnen, modal pertanian, pembiayaan nelayan",
        sharia_contract: "Murabahah/Ijarah"
    },
    {
        name: "Pembiayaan KUN (Kredit Usaha Nahdliyyin)",
        slug: "pembiayaan-kun",
        type: "pembiayaan",
        schema_type: "LoanOrCredit",
        description: "<p>Program khusus pembiayaan untuk UMKM binaan atau yang berafiliasi dengan LAZISNU, dengan pendampingan usaha.</p>",
        requirements: "<ul><li>Rekomendasi LAZISNU/MWC NU</li><li>Usaha Mikro/Kecil</li></ul>",
        min_deposit: "0",
        is_featured: true,
        published: true,
        seo_keywords: "kredit nahdliyin, umkm nu, lazisnu",
        sharia_contract: "Murabahah"
    },
    {
        name: "Pembiayaan KUNU (Kredit Usaha NU)",
        slug: "pembiayaan-kunu",
        type: "pembiayaan",
        schema_type: "LoanOrCredit",
        description: "<p>Fasilitas pembiayaan khusus untuk pengembangan unit usaha milik Lembaga atau Badan Otonom (Banom) di lingkungan Nahdlatul Ulama.</p>",
        requirements: "<ul><li>SK Lembaga/Banom Aktif</li><li>Proposal Pengembangan Usaha Organisasi</li></ul>",
        min_deposit: "0",
        is_featured: true,
        published: true,
        seo_keywords: "pembiayaan lembaga nu, modal usaha banom, ekonomi umat",
        sharia_contract: "Murabahah"
    }
];

async function seed() {
    console.log("🚀 Seeding REAL Products...");

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

    // Optional: Delete existing dummy products first? 
    // Let's check if they exist by slug and update, or create new.

    let count = 0;
    for (const item of REAL_PRODUCTS) {
        try {
            // Check if exists
            try {
                const existing = await pb.collection('products').getFirstListItem(`slug="${item.slug}"`);
                console.log(`   🔄 Updating: ${item.name}`);
                await pb.collection('products').update(existing.id, item);
            } catch (err) {
                if (err.status === 404) {
                    console.log(`   + Creating: ${item.name}`);
                    await pb.collection('products').create(item);
                } else {
                    throw err;
                }
            }
            count++;
        } catch (e) {
            console.error(`   x Error processing ${item.name}:`, e.message);
        }
    }
    console.log(`\n🎉 Processed ${count} Records from "Data PPT BMTNU Lumajang.md"`);
}

seed();
