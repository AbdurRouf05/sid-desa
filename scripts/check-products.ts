
import PocketBase from 'pocketbase';

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
if (!pbUrl) throw new Error("NEXT_PUBLIC_POCKETBASE_URL not defined");
const pb = new PocketBase(pbUrl);

async function main() {
    try {
        const result = await pb.collection('products').getList(1, 1);
        if (result.items.length > 0) {
            const p = result.items[0];
            console.log("Full Object Keys:", Object.keys(p));
            console.log("Full Object:", JSON.stringify(p, null, 2));
        } else {
            console.log("No products found.");
        }
    } catch (e) {
        console.error("Error fetching products:", e);
    }
}

main();
