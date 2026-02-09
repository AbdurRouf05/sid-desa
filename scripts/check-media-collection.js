const PocketBase = require('pocketbase');

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090");

async function checkCollections() {
    try {
        // Authenticate as Admin usually required to list collections
        // But we can try to list public ones or just guess.
        // Better: Try to authenticate with the credentials we know or just check if we can access 'media'.
        // Actually, for this script to run, I need admin auth.
        // Let's assume I can't easily auth as admin without creds.
        // But maybe I can check if 'media' is in the known schema files?

        console.log("Checking for 'media' collection...");
        // I will just print a warning that I can't verify easily without auth.
        // However, I can try to fetch a public record from 'media' and see if it 404s on collection or record.
        // Actually, if I use `pb.collection('media').getList(1,1)`, if it returns 404, it might mean collection doesn't exist OR 403.

        try {
            await pb.collection('media').getList(1, 1);
            console.log("Collection 'media' exists (or is accessible).");
        } catch (e) {
            console.log("Error accessing 'media':", e.status);
            if (e.status === 404) console.log("Collection might not exist.");
        }

    } catch (e) {
        console.error(e);
    }
}

checkCollections();
