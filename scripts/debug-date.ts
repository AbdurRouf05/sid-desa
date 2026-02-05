
import { pb } from "../lib/pb";

async function debugDates() {
    console.log("Fetching latest news dates...");
    try {
        const list = await pb.collection('news').getList(1, 5, {
            sort: '-created', // Try sort first
            // filter: 'published = true' 
            // Remove filter to see RAW data just in case
        });

        list.items.forEach((item, index) => {
            console.log(`Item ${index}:`);
            console.log(`  Title: ${item.title}`);
            console.log(`  Created: '${item.created}' (${typeof item.created})`);
            console.log(`  Updated: '${item.updated}' (${typeof item.updated})`);

            // Test parsing
            try {
                const d1 = new Date(item.created);
                console.log(`  Parsed Created: ${d1.toString()} (Valid: ${!isNaN(d1.getTime())})`);
            } catch (e) { console.log("  Created Parse Error"); }
        });

    } catch (e) {
        console.log("Fetch error (attempting without sort):");
        try {
            const list = await pb.collection('news').getList(1, 5);
            list.items.forEach((item, index) => {
                console.log(`Item ${index} (No Sort):`);
                console.log(`  Title: ${item.title}`);
                console.log(`  Created: '${item.created}' (Type: ${typeof item.created})`);
                console.log(`  Updated: '${item.updated}' (Type: ${typeof item.updated})`);
            });
        } catch (err2) {
            console.error(err2);
        }
    }
}

debugDates();
