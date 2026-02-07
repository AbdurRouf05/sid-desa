
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
const pb = new PocketBase(pbUrl);

const TEST_SLIDE = {
    title: "Test Banner Image",
    subtitle: "Testing upload with image",
    image_url: "https://scontent.fmlg8-1.fna.fbcdn.net/v/t39.30808-6/494441207_1487429096033258_4854043116706845221_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH5QB2roFbLq5mjxeEL0je0K4Mmzi45ySArgybOLjnJIDS4-HyiGUPYRu7SRSvpvX8FMn2hnn3gQrgXEpocDzi4&_nc_ohc=dQASYFY0oKoQ7kNvwFCicnj&_nc_oc=AdkZF1xHSUIfAeU_9oU4IyixMDTH0oIjuLUkfSRbj6hH7MyOYu9Y2M4Ee03q5bYovS0&_nc_zt=23&_nc_ht=scontent.fmlg8-1.fna&_nc_gid=AJ55hKXDvgtwYTVBTrRnhQ&oh=00_AftLZq_1xqEs4bmh_UqxBfccJuQ-p-AldTdcR2iGNw2A5Q&oe=6985D9E4"
};

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL!, process.env.POCKETBASE_ADMIN_PASSWORD!);
        console.log("Auth success.");

        console.log("Fetching image...", TEST_SLIDE.image_url);
        const res = await fetch(TEST_SLIDE.image_url);
        console.log("Fetch status:", res.status);
        if (!res.ok) throw new Error("Fetch failed: " + res.statusText);

        const blob = await res.blob();
        console.log("Blob size:", blob.size);
        console.log("Blob type:", blob.type);

        const formData = new FormData();
        formData.append("title", TEST_SLIDE.title);
        formData.append("subtitle", TEST_SLIDE.subtitle);
        formData.append("active", "true");
        // Ensure filename sends correctly
        formData.append("image", blob, "test-image.jpg");

        console.log("Creating record with image...");
        const record = await pb.collection('hero_banners').create(formData);
        console.log("Created:", record.id);

    } catch (e: any) {
        console.error("DEBUG ERROR:", e);
    }
}

main();
