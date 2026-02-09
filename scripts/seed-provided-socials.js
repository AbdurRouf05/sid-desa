const PocketBase = require('pocketbase/cjs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
const envConfig = require('dotenv').config({ path: envPath }).parsed || {};

async function main() {
    const pbUrl = envConfig.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
    const adminEmail = envConfig.POCKETBASE_ADMIN_EMAIL;
    const adminPassword = process.argv[2] || envConfig.POCKETBASE_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error("❌ Admin credentials missing.");
        process.exit(1);
    }

    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    try {
        console.log(`🔌 Connecting to ${pbUrl}...`);
        await pb.admins.authWithPassword(adminEmail, adminPassword);

        // --- 1. Update Site Config (Social Accounts) ---
        console.log("⚙️ Updating 'site_config' with social accounts...");
        try {
            const config = await pb.collection('site_config').getFirstListItem('');
            await pb.collection('site_config').update(config.id, {
                social_links: {
                    facebook: "https://www.facebook.com/BMTNULUMAJANG/",
                    instagram: "https://www.instagram.com/BMTNU_LMJ",
                    tiktok: "https://www.tiktok.com/@BMTNU_LMJ",
                    youtube: "https://www.youtube.com/@NULumajang"
                },
                // We store the handles separately if we want to display "@BMTNU_LMJ" in text
                // But for now, let's just ensure links are correct.
            });
            console.log("   ✅ Site config updated.");
        } catch (e) {
            console.error("   ❌ Failed to update site_config:", e.message);
        }

        // --- 2. Seed Social Feeds (Fresh Start) ---
        console.log("🌱 Seeding 'social_feeds' with REAL data...");

        // Delete existing first to avoid duplicates/confusion
        const existing = await pb.collection('social_feeds').getFullList();
        for (const rec of existing) {
            await pb.collection('social_feeds').delete(rec.id);
        }
        console.log("   🧹 Cleared old feeds.");

        const seeds = [
            {
                platform: "youtube",
                url: "https://www.youtube.com/watch?v=Hu4Y3-5R-qU", // Real Video: Launching BMT NU
                caption: "Peresmian Gedung & Launching BMT NU Lumajang",
                is_active: true,
                is_pinned: true,
            },
            {
                platform: "facebook",
                url: "https://www.facebook.com/BMTNULUMAJANG/", // Page URL (Fallback)
                caption: "Kunjungi Halaman Facebook Resmi Kami",
                is_active: true,
                is_pinned: false
            },
            {
                platform: "instagram",
                url: "https://www.instagram.com/BMTNU_LMJ", // Profile URL (Fallback)
                caption: "Ikuti Update Terbaru di Instagram @BMTNU_LMJ",
                is_active: true,
                is_pinned: false
            },
            {
                platform: "tiktok",
                url: "https://www.tiktok.com/@BMTNU_LMJ", // Profile URL (Fallback)
                caption: "Tonton Video Singkat Kami di TikTok",
                is_active: true,
                is_pinned: false
            }
        ];

        for (const data of seeds) {
            await pb.collection('social_feeds').create(data);
            console.log(`   + Created: [${data.platform}] ${data.caption}`);
        }

        console.log("✨ Social Data refreshed!");

    } catch (e) {
        console.error("❌ Error:", e);
    }
}

main();
