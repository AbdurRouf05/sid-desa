"use client";

import React from "react";
import { ArabesqueCard } from "@/components/ui/arabesque-card";
import Image from "next/image";
import { TactileButton } from "@/components/ui/tactile-button";
import { useUiLabels } from "@/components/providers/ui-labels-provider";
import { formatRupiah } from "@/lib/number-utils";
import { getAssetUrl } from "@/lib/cdn";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductsShowcaseProps {
    products?: any[];
}

export function ProductsShowcase({ products = [] }: ProductsShowcaseProps) {
    const { getLabel } = useUiLabels();

    // Helper to strip HTML
    const stripHtml = (html: string) => {
        if (!html) return "";
        return html.replace(/<[^>]*>?/gm, '');
    };

    // Helper to get Icon
    const getIcon = (product: any) => {
        if (product.icon) {
            return (
                <Image
                    src={getAssetUrl(product, product.icon)}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                />
            );
        }

        const iconName = product.icon_name;
        if (!iconName) return <span className="text-2xl">✨</span>;
        if (iconName.length < 4) return <span className="text-2xl">{iconName}</span>;

        const IconComponent = (LucideIcons as any)[iconName];
        if (IconComponent) return <IconComponent className="w-8 h-8 text-desa-primary" />;

        return <span className="text-2xl">✨</span>;
    };

    // Helper to get Card Color
    const getCardColor = (product: any) => {
        const type = (product.product_type || "").toLowerCase();
        
        if (type === "program" || type === "info") {
            return "gold"; // Accent
        }

        return "emerald"; // Primary
    };

    // Default products if none provided
    const displayProducts = products.length > 0 ? products : [
        {
            name: 'Surat Keterangan Mandiri',
            icon_name: 'FileText',
            product_type: 'layanan',
            description: 'Buat berbagai surat keterangan kependudukan secara mandiri melalui portal desa.',
            cta: 'Mulai Layanan'
        },
        {
            name: 'Penyaluran BLT-DD',
            icon_name: 'HeartHandshake',
            product_type: 'program',
            description: 'Transparansi data penerima bantuan langsung tunai dana desa (BLT-DD) bagi warga yang berhak.',
            cta: 'Cek Penerima'
        }
    ];

    return (
        <section className="py-20 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 mb-12">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-desa-primary-dark font-heading">{getLabel('section_products_title', 'Layanan & Program Desa')}</h2>
                    <p className="text-slate-600 mt-2">{getLabel('section_products_subtitle', 'Terus bergerak maju bersama seluruh warga Sumberanyar.')}</p>
                </div>
            </div>

            <div className="relative isolate group overflow-hidden">
                {/* Infinite Marquee Container */}
                <div
                    className="flex gap-8 w-max px-4 animate-marquee-right"
                >
                    {[...displayProducts, ...displayProducts].map((product, idx) => (
                        <div key={`${product.id || idx}-${idx}`} className="w-[320px] md:w-[400px] shrink-0">
                            <ArabesqueCard
                                variant="interactive"
                                cardColor={getCardColor(product)}
                                title={product.name}
                                icon={getIcon(product)}
                            >
                                <div className="flex flex-col h-full min-h-[140px]">
                                    <div className="flex-grow">
                                        <p className="text-slate-900 mb-6 text-sm md:text-base font-medium line-clamp-3 leading-relaxed">
                                            {stripHtml(product.description)}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Info Badge - Refined Logic */}
                                        <div className={cn(
                                            "p-3 rounded-xl border border-dashed",
                                            getCardColor(product) === 'emerald' ? "bg-desa-primary/5 border-desa-primary/20" :
                                                "bg-desa-accent/5 border-desa-accent/20"
                                        )}>
                                            <p className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-70",
                                                getCardColor(product) === 'emerald' ? "text-desa-primary" :
                                                    "text-desa-accent-dark"
                                            )}>
                                                {product.product_type === 'layanan' ? "Metode" : "Status Program"}
                                            </p>
                                            <p className={cn(
                                                "text-sm font-bold",
                                                getCardColor(product) === 'emerald' ? "text-desa-primary-dark" :
                                                    "text-desa-accent-dark"
                                            )}>
                                                {product.product_type === 'layanan'
                                                    ? "Layanan Digital / Tatap Muka"
                                                    : "Berjalan / Tahunan"
                                                }
                                            </p>
                                        </div>

                                        <TactileButton
                                            as="a"
                                            href={product.slug ? `/layanan/${product.slug}` : "/layanan"}
                                            fullWidth
                                            className={cn(
                                                "text-white shadow-lg border-b-4",
                                                getCardColor(product) === "emerald" 
                                                    ? "bg-desa-primary hover:bg-desa-primary-dark border-desa-primary-dark shadow-desa-primary/10" 
                                                    : "bg-desa-accent hover:bg-desa-accent-dark border-desa-accent-dark shadow-desa-accent/10"
                                            )}
                                        >
                                            {product.cta || getLabel('btn_view_detail', 'Lihat Detail')}
                                        </TactileButton>

                                        {product.thumbnail && (
                                            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-inner border border-slate-100 group-hover:shadow-md transition-shadow duration-500 mt-4">
                                                <Image
                                                    src={getAssetUrl(product, product.thumbnail)}
                                                    alt={product.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ArabesqueCard>
                        </div>
                    ))}
                </div>

                {/* Faded edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />
            </div >

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0%); }
                }
                .animate-marquee-right {
                    animation: marquee-right 60s linear infinite;
                }
                .group:hover .animate-marquee-right {
                    animation-play-state: paused;
                }
            `}} />
        </section >
    );
}
