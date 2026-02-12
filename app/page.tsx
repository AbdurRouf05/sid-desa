"use client";

import React, { useState, useEffect } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { TactileButton } from "@/components/ui/tactile-button";
import { useUiLabels } from "@/components/providers/ui-labels-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { ExternalLink } from "lucide-react";

// Home Components
import { HeroSlider, HeroSlide } from "@/components/home/hero-slider";
import { StatsDashboard } from "@/components/home/stats-dashboard";
import { FeaturesGrid } from "@/components/home/features-grid";
import { ProductsShowcase } from "@/components/home/products-showcase";
import { SocialWall } from "@/components/home/social-wall";
import { NewsFeed } from "@/components/home/news-feed";
import { LocationsMap } from "@/components/home/locations-map";

import { getAssetUrl } from "@/lib/cdn";

import { HERO_SLIDES_FALLBACK } from "@/lib/fallback-data";

export default function Home() {
    const [heroData, setHeroData] = useState<HeroSlide[]>([]);
    const [stats, setStats] = useState({
        assets: "Loading...",
        members: "Loading...",
        branches: "16"
    });
    const [news, setNews] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [mapUrl, setMapUrl] = useState("");
    const [phone, setPhone] = useState("");
    const [locationsConfig, setLocationsConfig] = useState<any>(null);

    const { getLabel } = useUiLabels();

    useEffect(() => {
        // Fetch dynamic stats, news, and banners
        import("@/lib/pb").then(async ({ pb }) => {
            try {
                // 1. Config
                const configPromise = pb.collection('site_config').getFirstListItem("");

                // 2. Banners
                const bannersPromise = pb.collection('hero_banners').getList(1, 10, {
                    sort: 'order',
                    filter: 'active = true'
                });

                // 3. News
                const newsPromise = pb.collection('news').getList(1, 3, {
                    sort: '-created',
                    filter: 'published = true'
                });

                // 4. Products
                const productsPromise = pb.collection('products').getList(1, 6, {
                    sort: '-created',
                    filter: 'published = true && is_featured = true'
                });

                // Resolve promises
                const [config, banners, newsResult, productsResult] = await Promise.all([
                    configPromise.catch(() => null),
                    bannersPromise.catch(() => null),
                    newsPromise.catch(() => null),
                    productsPromise.catch(() => null)
                ]);

                if (config) {
                    setStats({
                        assets: config.total_assets || "28 M+",
                        members: config.total_members || "6.000+",
                        branches: config.total_branches || "16"
                    });
                    setMapUrl(config.map_embed_url || config.social_links?.map_embed_url || "");
                    setPhone(config.phone_wa || "");
                    setLocationsConfig({
                        title: config.locations_title,
                        description: config.locations_description,
                        feature1_text: config.locations_feature1_text,
                        feature1_icon: config.locations_feature1_icon,
                        feature2_text: config.locations_feature2_text,
                        feature2_icon: config.locations_feature2_icon
                    });
                }

                if (banners && banners.items.length > 0) {
                    const mappedBanners = banners.items.map((b: any) => ({
                        id: b.id,
                        title: b.title,
                        subtitle: b.subtitle,
                        cta: b.cta_text || "Lihat Detail",
                        cta_link: b.cta_link || "#",
                        bgClass: b.bg_class || "bg-emerald-900",
                        image: b.image_desktop ? getAssetUrl(b, b.image_desktop) : (b.image ? getAssetUrl(b, b.image) : " "),
                        mobile_image: b.image_mobile ? getAssetUrl(b, b.image_mobile) : null,
                        foreground_image: b.foreground_image,
                        collectionId: b.collectionId,
                        recordId: b.id
                    }));
                    setHeroData(mappedBanners);
                }

                setNews(newsResult?.items || []);
                setProducts(productsResult?.items || []);

            } catch (e) {
                console.error("Home fetch error:", e);
            } finally {
                setNewsLoading(false);
            }
        });
    }, []);

    // --- SEO: STRUCTURED DATA ---
    const websiteSchema = {
        name: "BMT NU Lumajang",
        url: "https://bmtnulumajang.id",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://bmtnulumajang.id/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-display text-slate-800 antialiased overflow-x-hidden">
            <JsonLd type="WebSite" data={websiteSchema} />

            <ModernNavbar />

            {/* 1. HERO SLIDER */}
            <HeroSlider slides={heroData} />

            {/* 2. STATS */}
            <StatsDashboard stats={stats} />

            {/* 3. FEATURES (Value Proposition) */}
            <FeaturesGrid />

            {/* 4. SOCIAL MEDIA HUB (Already extracted) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <SocialWall />
                </div>
            </section>

            {/* 5. PRODUCTS */}
            <ProductsShowcase products={products} />

            {/* 6. NEWS */}
            <NewsFeed news={news} loading={newsLoading} />

            {/* 7. LOCATIONS */}
            <LocationsMap stats={stats} mapUrl={mapUrl} config={locationsConfig} />

            {/* 8. FINAL CTA */}
            <section className="py-24 bg-gradient-to-br from-gold to-yellow-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-20 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10 text-center text-emerald-950">
                    <h2 className="text-3xl md:text-5xl font-black mb-6">
                        {getLabel('section_cta_title', 'Siap Menjadi Bagian Dari Kami?')}
                    </h2>
                    <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
                        {getLabel('section_cta_subtitle', 'Mulai langkah kebaikan finansial Anda hari ini. Bersama BMT NU Lumajang, ekonomi kuat, umat bermartabat.')}
                    </p>
                    <TactileButton
                        as="a"
                        href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        className="bg-emerald-900 text-white border-emerald-950 hover:bg-emerald-800 px-10 h-16 text-lg shadow-2xl"
                    >
                        Hubungi via WhatsApp <ExternalLink className="ml-2 w-5 h-5" />
                    </TactileButton>
                </div>
            </section>

            <ModernFooter />
        </div>
    );
}
