
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
const pb = new PocketBase(pbUrl);

const HERO_SLIDES = [
    {
        title: "Mitra Keuangan Syariah Terpercaya",
        subtitle: "Mudah, Murah, Berkah dengan cara Syariah. Mengelola dana umat dengan prinsip kehati-hatian untuk kemandirian ekonomi.",
        cta_text: "Bergabung Sekarang",
        cta_link: "/kontak",
        bg_class: "bg-emerald-900",
        order: 1,
        // Fallback: Green/Islamic architecture or abstract
        image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=60&w=1200"
    },
    {
        title: "Tabungan SIRELA",
        subtitle: "Simpanan Sukarela yang likuid, bisa disetor dan ditarik kapan saja. Pilihan tepat untuk dana cadangan harian Anda.",
        cta_text: "Buka Tabungan",
        cta_link: "/produk/sirela",
        bg_class: "bg-emerald-800",
        order: 2,
        // Fallback: Savings/Coins
        image_url: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=60&w=600"
    },
    {
        title: "Digital & Transparan",
        subtitle: "Nikmati kemudahan notifikasi WhatsApp Real-time setiap transaksi. Aman, Cepat, dan Nyaman di mana saja.",
        cta_text: "Coba Layanan Digital",
        cta_link: "/layanan",
        bg_class: "bg-slate-900",
        order: 3,
        // Fallback: Digital/Phone
        image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=60&w=600"
    }
];

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL!, process.env.POCKETBASE_ADMIN_PASSWORD!);

        for (const slide of HERO_SLIDES) {
            console.log(`Processing: ${slide.title}`);
            try {
                const existing = await pb.collection('hero_banners').getList(1, 1, {
                    filter: `title = "${slide.title}"`
                });

                if (existing.items.length > 0) {
                    console.log(`- Exists, skipping.`);
                    continue;
                }

                console.log(`- Downloading image... ${slide.image_url}`);
                const res = await fetch(slide.image_url);
                if (!res.ok) throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
                const blob = await res.blob();
                console.log(`- Blob size: ${blob.size}`);

                // Create a File object from blob (Mocking browser API or using FormData in Node)
                const formData = new FormData();
                formData.append("title", slide.title);
                formData.append("subtitle", slide.subtitle);
                formData.append("cta_text", slide.cta_text);
                formData.append("cta_link", slide.cta_link);
                formData.append("bg_class", slide.bg_class);
                formData.append("order", slide.order.toString());
                formData.append("active", "true");
                formData.append("image", blob, `banner-${slide.order}.jpg`);

                console.log("- Creating record...");
                await pb.collection('hero_banners').create(formData);
                console.log("- Created!");
            } catch (err) {
                console.error(`ERROR processing ${slide.title}:`, err);
            }
        }

    } catch (e) {
        console.error("GLOBAL ERROR:", e);
    }
}

main();
