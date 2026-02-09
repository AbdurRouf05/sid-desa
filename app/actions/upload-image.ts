"use server";

import { cookies } from "next/headers";
import PocketBase from "pocketbase";

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

export async function uploadImage(formData: FormData): Promise<{ url: string } | null> {
    const pb = new PocketBase(POCKETBASE_URL);
    try {
        let file = formData.get("file") as File;
        const externalUrl = formData.get("url") as string;

        // 1. External Fetch (if needed)
        if (!file && externalUrl && externalUrl.startsWith("http")) {
            try {
                const res = await fetch(externalUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    next: { revalidate: 0 }
                });
                if (res.ok) {
                    const blob = await res.blob();
                    const fileName = externalUrl.split('/').pop()?.split('?')[0] || "scraped-image.jpg";
                    file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });

                }
            } catch (err) {
                console.warn("External image fetch failed for upload:", externalUrl, err);
            }
        }

        if (!file || file.size === 0) {
            console.warn("No valid file provided for upload");
            return null;
        }

        // 2. Authentication
        // Use Admin login if available for reliable background upload
        if (ADMIN_EMAIL && ADMIN_PASSWORD) {
            await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        } else {
            // Fallback to cookie
            const cookieStore = await cookies();
            const authCookie = cookieStore.get("pb_auth");
            if (authCookie) {
                pb.authStore.loadFromCookie(`${authCookie.name}=${authCookie.value}`);
            }
        }

        // 3. PB FormData Construction
        const pbFormData = new FormData();
        pbFormData.append("file", file);
        pbFormData.append("title", file.name || "Social Thumbnail");
        pbFormData.append("alt", "Social Thumbnail Upload");

        // 4. Upload to 'media' collection
        try {
            const record = await pb.collection("media").create(pbFormData);
            const url = `${POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${record.file}`;

            return { url };
        } catch (e: any) {
            console.error("PB Upload Exception:", e.message, e.data);
            return null;
        }

    } catch (e: any) {
        console.error("Critical Upload Error:", e.message);
        return null;
    }
}

