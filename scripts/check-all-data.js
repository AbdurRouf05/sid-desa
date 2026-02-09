const PocketBase = require('pocketbase/cjs');
require('dotenv').config({ path: '.env.local' });

async function checkAllData() {
    const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
    const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

    if (!pbUrl || !adminEmail || !adminPassword) {
        console.error('❌ Missing environment variables. Please check .env.local');
        console.error('Required: NEXT_PUBLIC_POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD');
        process.exit(1);
    }

    console.log(`Connecting to PocketBase at ${pbUrl}...`);
    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    try {
        await pb.admins.authWithPassword(adminEmail, adminPassword);
        console.log('✅ Authenticated as Admin');
    } catch (e) {
        console.error('❌ Authentication failed:', e.message);
        process.exit(1);
    }

    const collections = [
        'site_config',
        'products',
        'news',
        'branches',
        'hero_banners',
        'inquiries',
        'social_feeds',
        'users',
        '_superusers'
    ];

    console.log('\n📊 STARTING DATA AUDIT...\n');

    const report = {};

    for (const collection of collections) {
        try {
            console.log(`Checking collection: ${collection}...`);
            const records = await pb.collection(collection).getFullList();
            report[collection] = {
                count: records.length,
                records: records.map(r => ({ id: r.id, ...r })) // Simplify structure for checking
            };
            console.log(`  -> Found ${records.length} records.`);
        } catch (e) {
            console.error(`  ❌ Error fetching ${collection}:`, e.message);
            report[collection] = { error: e.message };
        }
    }

    console.log('\n---------------------------------------------------');
    console.log('📑 AUDIT REPORT SUMMARY');
    console.log('---------------------------------------------------\n');

    // 1. Check Site Config
    const config = report.site_config?.records?.[0];
    if (!config) {
        console.log('❌ [site_config] MISSING! The site configuration record does not exist.');
    } else {
        console.log('✅ [site_config] Exists.');
        const missingConfigFields = [];
        if (!config.company_name) missingConfigFields.push('company_name');
        if (!config.address) missingConfigFields.push('address');
        if (!config.phone_wa) missingConfigFields.push('phone_wa');
        if (!config.email_official) missingConfigFields.push('email_official');

        if (missingConfigFields.length > 0) {
            console.log(`   ⚠️ Partial Data: Missing fields [${missingConfigFields.join(', ')}]`);
        } else {
            console.log('   ✅ All critical fields populated.');
        }
    }

    // 2. Check Products
    const products = report.products?.records || [];
    if (products.length === 0) {
        console.log('⚠️ [products] EMPTY! No products found.');
    } else {
        const publishedProducts = products.filter(p => p.published);
        console.log(`✅ [products] Found ${products.length} records (${publishedProducts.length} published).`);
    }

    // 3. Check News
    const news = report.news?.records || [];
    if (news.length === 0) {
        console.log('⚠️ [news] EMPTY! No news articles found.');
    } else {
        const publishedNews = news.filter(n => n.published);
        console.log(`✅ [news] Found ${news.length} records (${publishedNews.length} published).`);
    }

    // 4. Check Branches
    const branches = report.branches?.records || [];
    if (branches.length === 0) {
        console.log('⚠️ [branches] EMPTY! No branches found.');
    } else {
        console.log(`✅ [branches] Found ${branches.length} records.`);
    }

    // 5. Check Hero Banners
    const banners = report.hero_banners?.records || [];
    if (banners.length === 0) {
        console.log('⚠️ [hero_banners] EMPTY! No banners found.');
    } else {
        const activeBanners = banners.filter(b => b.active);
        console.log(`✅ [hero_banners] Found ${banners.length} records (${activeBanners.length} active).`);
    }

    // 6. Check Users
    const users = report.users?.records || [];
    console.log(`ℹ️ [users] Found ${users.length} users.`);

    // 7. Check Inquiries
    const inquiries = report.inquiries?.records || [];
    console.log(`ℹ️ [inquiries] Found ${inquiries.length} inquiries.`);

    console.log('\n---------------------------------------------------');
    console.log('🏁 AUDIT COMPLETE');
    console.log('---------------------------------------------------\n');
}

checkAllData().catch(console.error);
