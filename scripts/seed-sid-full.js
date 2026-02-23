const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');

// --- 1. Load Environment Variables ---
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
        console.log("✅ .env.local loaded");
    }
} catch (e) {
    console.warn("⚠️ Could not read .env.local", e.message);
}

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://sid-magang.sagamuda.cloud';
const pb = new PocketBase(PB_URL.includes('colud') ? PB_URL.replace('colud', 'cloud') : PB_URL);

// --- 2. Definition of Collections & Fields (PB v0.25+ 'fields' format) ---
const DEFINITIONS = {
    site_config: {
        fields: [
            { name: "company_name", type: "text", required: true, presentable: true },
            { name: "address", type: "text" },
            { name: "phone_wa", type: "text" },
            { name: "email_official", type: "email" },
            { name: "hero_title", type: "text" },
            { name: "welcome_text", type: "editor" },
            { name: "total_members", type: "text" },
            { name: "total_assets", type: "text" },
            { name: "maintenance_mode", type: "bool" }
        ],
        data: [
            {
                company_name: "Pemerintah Desa Sumberanyar",
                address: "Jl. Raya Sumberanyar No. 1, Kec. Nguling, Kab. Pasuruan",
                phone_wa: "081234567890",
                email_official: "pemdes@sumberanyar.id",
                hero_title: "Selamat Datang di SID Sumberanyar",
                welcome_text: "<p>Sistem Informasi Desa (SID) Sumberanyar hadir sebagai wujud transparansi dan inovasi pelayanan publik untuk seluruh warga.</p>",
                total_members: "4.500+",
                total_assets: "Rp 2,5 M+",
                maintenance_mode: false
            }
        ]
    },
    perangkat_desa: {
        fields: [
            { name: "nama", type: "text", required: true, presentable: true },
            { name: "jabatan", type: "text", required: true },
            { name: "nip", type: "text" },
            { name: "is_active", type: "bool" }
        ],
        data: [
            { nama: "H. Suyanto", jabatan: "Kepala Desa", nip: "-", is_active: true },
            { nama: "M. Abdul Rozaq", jabatan: "Sekretaris Desa", nip: "19850101...", is_active: true },
            { nama: "Siti Aminah", jabatan: "Bendahara", nip: "-", is_active: true }
        ]
    },
    news: {
        fields: [
            { name: "title", type: "text", required: true, presentable: true },
            { name: "slug", type: "text", required: true, unique: true },
            { name: "content", type: "editor" },
            { name: "published", type: "bool" },
            { name: "category", type: "select", options: { values: ["Warta Desa", "Pembangunan", "Kegiatan"] } }
        ],
        data: [
            { 
                title: "Rapat Musyawarah Desa 2026", 
                slug: "rapat-musdes-2026", 
                content: "<p>Agenda tahunan untuk menentukan prioritas pembangunan desa tahun anggaran mendatang.</p>", 
                published: true, 
                category: "Warta Desa" 
            },
            { 
                title: "Perbaikan Jalan Dusun Krajan", 
                slug: "perbaikan-jalan-krajan", 
                content: "<p>Pengerjaan aspal jalan sepanjang 500m di wilayah Dusun Krajan telah selesai.</p>", 
                published: true, 
                category: "Pembangunan" 
            }
        ]
    },
    hero_banners: {
        fields: [
            { name: "title", type: "text", required: true, presentable: true },
            { name: "subtitle", type: "text" },
            { name: "active", type: "bool" },
            { name: "order", type: "number" }
        ],
        data: [
            { title: "Membangun Mandiri", subtitle: "Bersama warga mewujudkan desa digital.", active: true, order: 1 }
        ]
    },
    tanah_desa: {
        fields: [
            { name: "lokasi", type: "text", required: true, presentable: true },
            { name: "luas_m2", type: "number" },
            { name: "peruntukan", type: "text" },
            { name: "pemegang_hak", type: "text" }
        ],
        data: [
            { lokasi: "Blok Sawah Lor", luas_m2: 5000, peruntukan: "Tanah Kas Desa (TKD)", pemegang_hak: "Pemerintah Desa" }
        ]
    },
    bku_transaksi: {
        fields: [
            { name: "type", type: "select", options: { values: ["masuk", "keluar", "pindah"] } },
            { name: "amount", type: "number" },
            { name: "tanggal", type: "date" },
            { name: "uraian", type: "text" }
        ],
        data: [
            { type: "masuk", amount: 500000000, tanggal: new Date().toISOString(), uraian: "Penerimaan Dana Desa Tahap 1 2026" },
            { type: "keluar", amount: 15000000, tanggal: new Date().toISOString(), uraian: "Penyaluran BLT-DD Bulan Januari" }
        ]
    }
};

async function main() {
    console.log("🚀 Starting Full Seeding Process...");

    // 1. Auth as Admin
    try {
        await pb.admins.authWithPassword(
            process.env.POCKETBASE_ADMIN_EMAIL || process.env.ADMIN_EMAIL, 
            process.env.POCKETBASE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD
        );
        console.log("✅ Authenticated as Admin");
    } catch (e) {
        console.error("❌ Auth Failed:", e.message);
        process.exit(1);
    }

    // 2. Collections & Records Creation
    for (const [name, def] of Object.entries(DEFINITIONS)) {
        try {
            console.log(`--- Processing Collection: ${name} ---`);
            
            // a. Create/Update Collection
            let collection = await pb.collections.getOne(name).catch(() => null);
            if (!collection) {
                console.log(`✨ Creating collection: ${name}`);
                collection = await pb.collections.create({
                    name,
                    type: 'base',
                    fields: def.fields,
                    listRule: "",
                    viewRule: "",
                    createRule: "@request.auth.id != ''",
                    updateRule: "@request.auth.id != ''"
                });
            } else {
                console.log(`🔄 Collection ${name} already exists. Updating fields...`);
                // Merging existing fields with new ones (avoiding ID conflicts)
                const mergedFields = def.fields.map(f => {
                    const existing = collection.fields.find(ef => ef.name === f.name);
                    return existing ? { ...f, id: existing.id } : f;
                });
                await pb.collections.update(collection.id, { fields: mergedFields });
            }

            // b. Check if records already exist
            const existingRecords = await pb.collection(name).getList(1, 1);
            if (existingRecords.totalItems === 0) {
                console.log(`📥 Seeding records for ${name}...`);
                for (const item of def.data) {
                    await pb.collection(name).create(item);
                    console.log(`   + Added record: ${item.title || item.nama || item.company_name || item.lokasi}`);
                }
            } else {
                console.log(`ℹ️ Records already exist in ${name}, skipping record seeding.`);
            }

        } catch (e) {
            console.error(`❌ Error processing ${name}:`, e.message);
            if (e.data) console.error(JSON.stringify(e.data, null, 2));
        }
    }

    console.log("🎉 Full Seeding Finished Successfully!");
}

main();
