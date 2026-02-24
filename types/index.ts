export interface MetaConfig {
    id: string;
    site_name: string;
    address: string;
    phone: string;
    whatsapp_number: string;
    nib_number: string;
    social_links: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
        youtube?: string;
    };
}

export interface HeroBanner {
    id: string;
    title: string;
    image: string; // Filename
    cta_link: string;
    active: boolean;
    order: number;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    type: 'administrasi' | 'kesehatan' | 'pendidikan' | 'umum';
    description: string;
    brochure: string;
    icon: string;
    is_featured: boolean;
}

export interface News {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail: string;
    category: string;
    published: boolean;
    created: string; // ISO Date
}
