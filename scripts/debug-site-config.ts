import { pb } from '../lib/pb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function debugSiteConfig() {
    console.log("Debugging Site Config Collection...");

    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    if (!email || !password) {
        console.error("Missing admin credentials");
        return;
    }

    try {
        await pb.admins.authWithPassword(email, password);
        console.log("Authenticated as Admin.");

        const records = await pb.collection('site_config').getFullList({
            sort: '-created',
        });

        console.log(`Found ${records.length} records in site_config.`);
        records.forEach((r) => {
            console.log(`ID: ${r.id} | Created: ${r.created} | Company: ${r.company_name}`);
            console.log(`   Logo Primary: ${r.logo_primary}`);
            console.log(`   Logo Secondary: ${r.logo_secondary}`);
            console.log(`   Favicon: ${r.favicon}`);
        });

    } catch (e) {
        console.error("Error:", e);
    }
}

debugSiteConfig();
