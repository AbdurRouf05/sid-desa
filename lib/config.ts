import { pb } from "./pb";

export interface SiteConfig {
    id: string;
    company_name: string;
    address: string;
    phone_wa: string;
    email_official: string;
    total_assets: string;
    total_members: string;
    total_branches: string;
    map_embed_url: string;
    logo_primary?: string; // Filename/ID
    logo_secondary?: string;
    favicon?: string;
    og_image?: string;
    meta_description?: string;
    favicon_url?: string;
    kontak_telp?: string;
    kontak_email?: string;
    alamat_lengkap?: string;
    kecamatan?: string;
    kabupaten?: string;
    kode_pos?: string;
    social_links?: any;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
    id: "default",
    company_name: "Pemerintah Desa Sumberanyar",
    address: "Jl. Raya Sumberanyar No. 1, Sumberanyar, Pasuruan",
    phone_wa: "+62-812-3456-7890",
    email_official: "desa@sumberanyar.id",
    total_assets: "Rp 2,5 M+", // Realisasi APBDes
    total_members: "4.500+", // Jumlah Penduduk
    total_branches: "4 Dusun", // Struktur Wilayah
    map_embed_url: "",
    logo_primary: "",
    logo_secondary: "",
    favicon: "",
    og_image: "",
    social_links: {}
};

import { unstable_cache } from "next/cache";

// Cache for 60 seconds to improve performance significantly
export const getSiteConfig = unstable_cache(
    async (): Promise<SiteConfig> => {
        try {
            // Fetch with a timeout to prevent build hangs
            // Reduced timeout to 3s because config should be fast
            const fetchPromise = pb.collection('profil_desa').getFirstListItem("");
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), 3000)
            );

            const record = await Promise.race([fetchPromise, timeoutPromise]) as any;

            // Map database fields to application interface
            const config: SiteConfig = {
                ...DEFAULT_SITE_CONFIG,
                id: record.id,
                company_name: record.company_name || record.nama_desa || DEFAULT_SITE_CONFIG.company_name,
                address: record.alamat_lengkap || DEFAULT_SITE_CONFIG.address,
                phone_wa: record.kontak_telp || DEFAULT_SITE_CONFIG.phone_wa,
                email_official: record.kontak_email || DEFAULT_SITE_CONFIG.email_official,
                logo_primary: record.logo_url || record.logo_primary,
                favicon: record.favicon_url || record.favicon,
                // Pass-through other fields
                ...record 
            };

            // Map map_embed_url from social_links if not present in root (Schema workaround)
            if (!config.map_embed_url && record.social_links && record.social_links.map_embed_url) {
                config.map_embed_url = record.social_links.map_embed_url;
            }

            // Ensure JSON serializable (PB returns some non-serializable methods/properties sometimes, but raw JSON should be fine)
            return JSON.parse(JSON.stringify(config));
        } catch (error: any) {
            // Silently return default if fetch fails (timeout, 404, or network error during build)
            // Log only if it's not a standard 404 or a build-time connection issue
            if (error.status !== 404 && error.message !== "Timeout" && error.status !== 0) {
                console.error("Failed to fetch site config:", error);
            }
            return DEFAULT_SITE_CONFIG;
        }
    },
    ['site-config-v2'], // Cache Key
    {
        revalidate: 60, // 60 Seconds
        tags: ['profil_desa']
    }
);
