
import { pb } from "../lib/pb";

async function checkNewsData() {
    console.log("Checking News Data Structure...");
    try {
        // use public fetch first to simulate homepage
        // Try to reproduce the fallback logic (published=true, no sort if needed)

        console.log("Attempt 1: With Sort");
        try {
            const list = await pb.collection('news').getList(1, 3, {
                sort: '-created',
                filter: 'published = true'
            });
            console.log(`Success With Sort. Found ${list.items.length} items.`);
            if (list.items.length > 0) {
                logItem(list.items[0]);
            }
        } catch (e: any) {
            console.log("Sort failed (" + e.status + "). Attempt 2: No Sort");
            const list = await pb.collection('news').getList(1, 3, {
                filter: 'published = true'
            });
            console.log(`Success No Sort. Found ${list.items.length} items.`);
            if (list.items.length > 0) {
                logItem(list.items[0]);
            }
        }

    } catch (e) {
        console.error("Script Error:", e);
    }
}

function logItem(item: any) {
    console.log("ID:", item.id);
    console.log("Created:", item.created, "Type:", typeof item.created);
    console.log("Thumbnail:", item.thumbnail, "Type:", typeof item.thumbnail);
    console.log("Full Keys:", Object.keys(item));
}

checkNewsData();
