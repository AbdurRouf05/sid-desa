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
        if (IconComponent) return <IconComponent className="w-8 h-8 text-emerald-700" />;

        return <span className="text-2xl">✨</span>;
    };

    // Helper to get Card Color
    const getCardColor = (product: any) => {
        const type = (product.product_type || "").toLowerCase();
        const schema = (product.schema_type || "");
        const slug = (product.slug || "").toLowerCase();
        const name = (product.name || "").toLowerCase();

        // 1. Deposito / Investment (Gold)
        if (schema === "DepositAccount" || slug.includes('deposito') || name.includes('deposito') || name.includes('berjangka')) {
            return "gold";
        }

        // 2. Pembiayaan / Financing (Blue)
        if (type === "pembiayaan" || schema === "LoanOrCredit" || slug.includes('pembiayaan') || name.includes('pembiayaan')) {
            return "blue";
        }

        // 3. Simpanan / Savings (Emerald)
        if (type === "simpanan" || schema === "SavingsAccount" || slug.includes('tabungan') || name.includes('tabungan')) {
            return "emerald";
        }

        return "emerald"; // Default to Emerald as it's the primary brand color
    };

    // Default products if none provided
    const displayProducts = products.length > 0 ? products : [
        {
            name: 'Tabungan SIRELA',
            icon_name: '💰',
            product_type: 'simpanan',
            schema_type: 'SavingsAccount',
            description: 'Simpanan Sukarela yang likuid, setor dan tarik kapan saja.',
            cta: 'Buka Rekening'
        },
        {
            name: 'Pembiayaan Produktif',
            icon_name: '📈',
            product_type: 'pembiayaan',
            schema_type: 'LoanOrCredit',
            description: 'Tambahan modal usaha dengan akad adil dan bebas riba.',
            cta: 'Ajukan Modal'
        }
    ];

    return (
        <section className="py-20 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 mb-12">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-emerald-950">{getLabel('section_products_title', 'Produk Unggulan')}</h2>
                    <p className="text-slate-600 mt-2">{getLabel('section_products_subtitle', 'Solusi keuangan terbaik pilihan anggota.')}</p>
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
                                            getCardColor(product) === 'emerald' ? "bg-emerald-50/50 border-emerald-200" :
                                                getCardColor(product) === 'blue' ? "bg-blue-50/50 border-blue-200" :
                                                    "bg-amber-50/50 border-amber-200"
                                        )}>
                                            <p className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-70",
                                                getCardColor(product) === 'emerald' ? "text-emerald-700" :
                                                    getCardColor(product) === 'blue' ? "text-blue-700" :
                                                        "text-amber-700"
                                            )}>
                                                {product.product_type === 'simpanan' ? "Min. Setoran" : "Akad Utama"}
                                            </p>
                                            <p className={cn(
                                                "text-sm font-bold",
                                                getCardColor(product) === 'emerald' ? "text-emerald-900" :
                                                    getCardColor(product) === 'blue' ? "text-blue-900" :
                                                        "text-amber-900"
                                            )}>
                                                {product.product_type === 'simpanan'
                                                    ? (product.min_deposit && product.min_deposit !== "0" ? formatRupiah(product.min_deposit) : "Ringan & Mudah")
                                                    : (product.sharia_contract || "Syariah")
                                                }
                                            </p>
                                        </div>

                                        <TactileButton
                                            as="a"
                                            href={product.slug ? `/produk/${product.slug}` : "/produk"}
                                            fullWidth
                                            className={cn(
                                                "text-white shadow-lg border-b-4",
                                                getCardColor(product) === "emerald" ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-900 shadow-emerald-900/10" :
                                                    getCardColor(product) === "blue" ? "bg-blue-600 hover:bg-blue-700 border-blue-900 shadow-blue-900/10" :
                                                        getCardColor(product) === "gold" ? "bg-amber-500 hover:bg-amber-600 border-amber-800 shadow-amber-900/10" :
                                                            "bg-emerald-700 hover:bg-emerald-800 border-emerald-900"
                                            )}
                                        >
                                            {getLabel('btn_view_detail', 'Lihat Detail')}
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
