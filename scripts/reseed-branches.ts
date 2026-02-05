
import PocketBase from 'pocketbase';

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
if (!pbUrl) throw new Error("NEXT_PUBLIC_POCKETBASE_URL not defined in environment variables");
const pb = new PocketBase(pbUrl);

const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Missing POCKETBASE_ADMIN_EMAIL or POCKETBASE_ADMIN_PASSWORD in environment variables");
}

const BRANCHES_DATA = [
    { name: "Kantor Pusat", address: "Jl. Alun-alun Timur No. 3, Jogotrunan, Lumajang", phone_wa: "0812-3456-7890", type: "Pusat", map_link: "https://goo.gl/maps/xyz", is_active: true },
    { name: "Cabang Yosowilangun", address: "Jl. Raya Yosowilangun No. 45", phone_wa: "0812-3456-7891", type: "Cabang", is_active: true },
    { name: "Cabang Kunir", address: "Jl. Raya Kunir, Pasar Kunir", phone_wa: "0812-3456-7892", type: "Cabang", is_active: true },
    { name: "Cabang Pasirian", address: "Jl. Raya Pasirian No. 12", phone_wa: "0812-3456-7893", type: "Cabang", is_active: true },
    { name: "Cabang Senduro", address: "Jl. Raya Senduro, Depan Masjid Jami", phone_wa: "0812-3456-7894", type: "Cabang", is_active: true },
    { name: "Cabang Tempeh", address: "Jl. Raya Tempeh", phone_wa: "0812-3456-7895", type: "Cabang", is_active: true },
    { name: "Cabang Klakah", address: "Jl. Raya Klakah (Dekat Stasiun)", phone_wa: "0812-3456-7896", type: "Cabang", is_active: true },
    { name: "Cabang Randuagung", address: "Jl. Raya Randuagung", phone_wa: "0812-3456-7897", type: "Cabang", is_active: true },
    { name: "Cabang Sukodono", address: "Jl. Gatot Subroto, Sukodono", phone_wa: "0812-3456-7898", type: "Cabang", is_active: true },
    { name: "Cabang Padang", address: "Jl. Raya Padang", phone_wa: "0812-3456-7899", type: "Cabang", is_active: true },
    { name: "Cabang Candipuro", address: "Jl. Raya Candipuro", phone_wa: "0812-3456-7900", type: "Cabang", is_active: true },
    { name: "Cabang Pronojiwo", address: "Jl. Raya Pronojiwo", phone_wa: "0812-3456-7901", type: "Cabang", is_active: true },
    { name: "Cabang Tekung", address: "Jl. Raya Tekung", phone_wa: "0812-3456-7902", type: "Cabang", is_active: true },
    { name: "Cabang Rowokangkung", address: "Jl. Raya Rowokangkung", phone_wa: "0812-3456-7903", type: "Cabang", is_active: true },
    { name: "Cabang Jatiroto", address: "Jl. Raya Jatiroto (Dekat PG)", phone_wa: "0812-3456-7904", type: "Cabang", is_active: true },
    { name: "Cabang Kedungjajang", address: "Jl. Raya Kedungjajang", phone_wa: "0812-3456-7905", type: "Cabang", is_active: true },
];

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword(ADMIN_EMAIL!, ADMIN_PASSWORD!);

        // 1. Check if collection exists and delete it
        try {
            const collection = await pb.collections.getOne("branches");
            console.log("Deleting existing (broken) 'branches' collection...");
            await pb.collections.delete(collection.id);
            console.log("Deleted.");
        } catch (e: any) {
            if (e.status !== 404) throw e;
            console.log("Collection 'branches' not found (clean slate).");
        }

        // 2. Create Collection with CORRECT FIELDS structure
        console.log("Creating 'branches' collection...");
        await pb.collections.create({
            name: "branches",
            type: "base",
            listRule: "", // Public
            viewRule: "", // Public
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''",
            fields: [
                { name: "name", type: "text", required: true },
                { name: "address", type: "text" },
                { name: "phone_wa", type: "text" },
                { name: "map_link", type: "text" },
                { name: "type", type: "select", maxSelect: 1, values: ["Pusat", "Cabang", "Kas"] },
                { name: "sort_order", type: "number" },
                { name: "is_active", type: "bool" }
            ]
        });
        console.log("Collection created.");

        // 3. Seed Data
        console.log("Seeding data...");
        for (let i = 0; i < BRANCHES_DATA.length; i++) {
            const b = BRANCHES_DATA[i];
            await pb.collection('branches').create({
                ...b,
                sort_order: i + 1
            });
            console.log(`Created: ${b.name}`);
        }
        console.log("Reseeding Complete!");

    } catch (e: any) {
        console.error("Error:", e);
        if (e.response && e.response.data) {
            console.error("Validation Details:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

main();
