
import PocketBase from 'pocketbase';

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
if (!pbUrl) throw new Error("NEXT_PUBLIC_POCKETBASE_URL not defined");
const pb = new PocketBase(pbUrl);

// Admin Auth
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Missing POCKETBASE_ADMIN_EMAIL or POCKETBASE_ADMIN_PASSWORD in environment variables");
}

const BRANCHES_DATA = [
    { name: "Kantor Pusat", address: "Jl. Alun-alun Timur No. 3, Jogotrunan, Lumajang", phone_wa: "0812-3456-7890", type: "Pusat", map_link: "https://goo.gl/maps/xyz" },
    { name: "Cabang Yosowilangun", address: "Jl. Raya Yosowilangun No. 45", phone_wa: "0812-3456-7891", type: "Cabang" },
    { name: "Cabang Kunir", address: "Jl. Raya Kunir, Pasar Kunir", phone_wa: "0812-3456-7892", type: "Cabang" },
    { name: "Cabang Pasirian", address: "Jl. Raya Pasirian No. 12", phone_wa: "0812-3456-7893", type: "Cabang" },
    { name: "Cabang Senduro", address: "Jl. Raya Senduro, Depan Masjid Jami", phone_wa: "0812-3456-7894", type: "Cabang" },
    { name: "Cabang Tempeh", address: "Jl. Raya Tempeh", phone_wa: "0812-3456-7895", type: "Cabang" },
    { name: "Cabang Klakah", address: "Jl. Raya Klakah (Dekat Stasiun)", phone_wa: "0812-3456-7896", type: "Cabang" },
    { name: "Cabang Randuagung", address: "Jl. Raya Randuagung", phone_wa: "0812-3456-7897", type: "Cabang" },
    { name: "Cabang Sukodono", address: "Jl. Gatot Subroto, Sukodono", phone_wa: "0812-3456-7898", type: "Cabang" },
    { name: "Cabang Padang", address: "Jl. Raya Padang", phone_wa: "0812-3456-7899", type: "Cabang" },
    { name: "Cabang Candipuro", address: "Jl. Raya Candipuro", phone_wa: "0812-3456-7900", type: "Cabang" },
    { name: "Cabang Pronojiwo", address: "Jl. Raya Pronojiwo", phone_wa: "0812-3456-7901", type: "Cabang" },
    { name: "Cabang Tekung", address: "Jl. Raya Tekung", phone_wa: "0812-3456-7902", type: "Cabang" },
    { name: "Cabang Rowokangkung", address: "Jl. Raya Rowokangkung", phone_wa: "0812-3456-7903", type: "Cabang" },
    { name: "Cabang Jatiroto", address: "Jl. Raya Jatiroto (Dekat PG)", phone_wa: "0812-3456-7904", type: "Cabang" },
    { name: "Cabang Kedungjajang", address: "Jl. Raya Kedungjajang", phone_wa: "0812-3456-7905", type: "Cabang" },
];

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword(ADMIN_EMAIL!, ADMIN_PASSWORD!);

        console.log("Checking collection 'branches'...");
        try {
            await pb.collections.getOne("branches");
            console.log("Collection already exists.");
        } catch (e: any) {
            if (e.status === 404) {
                console.log("Creating collection 'branches'...");
                await pb.collections.create({
                    name: "branches",
                    type: "base",
                    schema: [
                        { name: "name", type: "text", required: true },
                        { name: "address", type: "text" },
                        { name: "phone_wa", type: "text" },
                        { name: "map_link", type: "text" },
                        { name: "type", type: "select", options: { values: ["Pusat", "Cabang", "Kas"] } },
                        { name: "order", type: "number" },
                        { name: "is_active", type: "bool" }
                    ]
                });
                console.log("Collection created.");
            } else {
                throw e;
            }
        }

        console.log("Seeding data...");
        // List existing to prevent duplicates
        const existing = await pb.collection('branches').getFullList();
        const existingNames = new Set(existing.map((e: any) => e.name));

        for (let i = 0; i < BRANCHES_DATA.length; i++) {
            const b = BRANCHES_DATA[i];
            if (!existingNames.has(b.name)) {
                await pb.collection('branches').create({
                    ...b,
                    order: i + 1,
                    is_active: true
                });
                console.log(`Created: ${b.name}`);
            } else {
                console.log(`Skipped (Exists): ${b.name}`);
            }
        }
        console.log("Seeding Complete!");

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
