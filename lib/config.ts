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
    social_links?: any;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
    id: "default",
    company_name: "BMT NU Lumajang",
    address: "Jln. Alun-alun Timur No. 3, Jogotrunan, Lumajang",
    phone_wa: "+62-812-3456-7890",
    email_official: "info@bmtnu-lumajang.id",
    total_assets: "28 M+",
    total_members: "6.000+",
    total_branches: "16",
    map_embed_url: "",
    logo_primary: "",
    logo_secondary: "",
    favicon: "",
    og_image: "",
    social_links: {}
};

export async function getSiteConfig(): Promise<SiteConfig> {
    try {
        // Fetch the first record from site_config collection
        // Since it's a singleton concept, we just take the first one
        const record = await pb.collection('site_config').getFirstListItem("");

        // Map map_embed_url from social_links if not present in root (Schema workaround)
        const config = record as unknown as SiteConfig;
        if (!config.map_embed_url && record.social_links && record.social_links.map_embed_url) {
            config.map_embed_url = record.social_links.map_embed_url;
        }

        return config;
    } catch (error: any) {
        // If 404, it means no config exists yet. Return default.
        if (error.status !== 404) {
            console.error("Failed to fetch site config:", error);
        }
        return DEFAULT_SITE_CONFIG;
    }
}
