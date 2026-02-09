const PocketBase = require('pocketbase/cjs');
const PocketBaseUrl = 'https://db-bmtnulmj.sagamuda.cloud';

async function main() {
    const pb = new PocketBase(PocketBaseUrl);
    try {
        const collection = await pb.collections.getOne('analytics_events');
        console.log(`Collection ${collection.name} found.`);
        console.log(`Fields: ${collection.schema.map(f => f.name).join(', ')}`);

        const records = await pb.collection('analytics_events').getList(1, 1);
        console.log(`Record success. Found ${records.totalItems} records.`);
    } catch (e) {
        console.error("Analytics check failed:", e.message);
    }
}

main();
