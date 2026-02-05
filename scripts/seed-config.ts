
import { pb } from "../lib/pb";
import { DEFAULT_SITE_CONFIG } from "../lib/config";

async function seed() {
    console.log("Seeding Site Config...");
    try {
        // Authenticate
        // Using credentials from .env.local
        const email = process.env.POCKETBASE_ADMIN_EMAIL;
        const password = process.env.POCKETBASE_ADMIN_PASSWORD;

        if (!email || !password) throw new Error("Missing admin credentials in env");

        await pb.admins.authWithPassword(email, password);

        // Check if exists
        try {
            await pb.collection('site_config').getFirstListItem("");
            console.log("Site Config already exists. Skipping.");
            return;
        } catch (e: any) {
            if (e.status !== 404) throw e;
        }

        // Create
        await pb.collection('site_config').create({
            company_name: DEFAULT_SITE_CONFIG.company_name,
            address: DEFAULT_SITE_CONFIG.address,
            phone_wa: DEFAULT_SITE_CONFIG.phone_wa,
            email_official: DEFAULT_SITE_CONFIG.email_official,
            total_assets: DEFAULT_SITE_CONFIG.total_assets,
            total_members: DEFAULT_SITE_CONFIG.total_members,
            total_branches: DEFAULT_SITE_CONFIG.total_branches,
            map_embed_url: DEFAULT_SITE_CONFIG.map_embed_url,
            social_links: DEFAULT_SITE_CONFIG.social_links
        });
        console.log("Site Config created successfully.");

    } catch (e) {
        console.error("Failed to seed:", e);
    }
}

seed();
