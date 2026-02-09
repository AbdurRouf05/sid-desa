"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { ArabesqueCard } from "@/components/ui/arabesque-card";
import { TactileButton } from "@/components/ui/tactile-button";
import { formatRupiah } from "@/lib/number-utils";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { pb } from "@/lib/pb";

type Category = "simpanan" | "pembiayaan";

// Helper to strip HTML
const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '');
};

// Helper to get Icon
const getIcon = (product: any) => {
    if (product.icon) {
        return (
            <img
                src={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${product.collectionId}/${product.id}/${product.icon}`}
                alt={product.name}
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

export default function ProdukPage() {
    const [activeTab, setActiveTab] = useState<Category>("simpanan");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch only published products, sort by name or created
                // Note: 'product_type' is the field name in DB (text)
                const result = await pb.collection('products').getList(1, 50, {
                    filter: 'published = true',
                    sort: 'created'
                });
                setProducts(result.items);
            } catch (e) {
                console.error("Failed to fetch products", e);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => {
        // DB field is 'product_type'
        return (p.product_type || "").toLowerCase() === activeTab;
    });

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />

            {/* Dynamic SEO Schema for Products */}
            {filteredProducts.map((p) => (
                <JsonLd
                    key={`schema-${p.id}`}
                    type="FinancialProduct"
                    data={{
                        name: p.name,
                        description: p.description ? p.description.replace(/<[^>]*>/g, '') : "Produk BMT NU Lumajang",
                        provider: {
                            "@type": "Organization",
                            name: "BMT NU Lumajang"
                        },
                        amount: {
                            "@type": "MonetaryAmount",
                            currency: "IDR",
                            value: p.min_deposit ? p.min_deposit.replace(/\D/g, '') : "0"
                        },
                        category: p.product_type === 'simpanan' ? "SavingsAccount" : "LoanOrCredit"
                    }}
                />
            ))}


            {/* Hero Header */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-bmt-green-700 to-primary-dark text-white text-center px-4 relative overflow-hidden">
                {/* Arabesque Pattern Overlay */}
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>

                {/* Decorative Bottom Arch */}
                <div className="absolute -bottom-16 left-0 right-0 h-16 bg-slate-50 rounded-t-[50%] scale-x-150"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200">
                        Produk Layanan
                    </h1>
                    <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
                        Solusi keuangan syariah untuk kebutuhan masa depan dunia dan akhirat Anda.
                    </p>
                </div>
            </section>

            {/* Tab Navigation */}
            <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center">
                        <div className="flex gap-8">
                            <button
                                onClick={() => setActiveTab("simpanan")}
                                className={cn(
                                    "py-4 px-2 text-sm md:text-base font-semibold border-b-2 transition-colors",
                                    activeTab === "simpanan"
                                        ? "border-emerald-600 text-emerald-800"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                )}
                            >
                                Simpanan (Savings)
                            </button>
                            <button
                                onClick={() => setActiveTab("pembiayaan")}
                                className={cn(
                                    "py-4 px-2 text-sm md:text-base font-semibold border-b-2 transition-colors",
                                    activeTab === "pembiayaan"
                                        ? "border-emerald-600 text-emerald-800"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                )}
                            >
                                Pembiayaan (Financing)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-20 text-slate-500">Memuat produk...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <p>Belum ada produk untuk kategori ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((item) => (
                            <div key={item.id} className="h-full flex flex-col">
                                <ArabesqueCard
                                    variant="interactive"
                                    cardColor={getCardColor(item)}
                                    title={item.name}
                                    icon={getIcon(item)}
                                    className="h-full flex flex-col"
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex-grow">
                                            <p className="text-slate-900 mb-6 text-sm md:text-base font-medium line-clamp-3 leading-relaxed">
                                                {stripHtml(item.description)}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Info Badge - Refined Logic */}
                                            <div className={cn(
                                                "p-3 rounded-xl border border-dashed",
                                                getCardColor(item) === 'emerald' ? "bg-emerald-50/50 border-emerald-200" :
                                                    getCardColor(item) === 'blue' ? "bg-blue-50/50 border-blue-200" :
                                                        "bg-amber-50/50 border-amber-200"
                                            )}>
                                                <p className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-70",
                                                    getCardColor(item) === 'emerald' ? "text-emerald-700" :
                                                        getCardColor(item) === 'blue' ? "text-blue-700" :
                                                            "text-amber-700"
                                                )}>
                                                    {item.product_type === 'simpanan' ? "Min. Setoran" : "Akad Utama"}
                                                </p>
                                                <p className={cn(
                                                    "text-sm font-bold",
                                                    getCardColor(item) === 'emerald' ? "text-emerald-900" :
                                                        getCardColor(item) === 'blue' ? "text-blue-900" :
                                                            "text-amber-900"
                                                )}>
                                                    {item.product_type === 'simpanan'
                                                        ? (item.min_deposit && item.min_deposit !== "0" ? formatRupiah(item.min_deposit) : "Sesuai Ketentuan")
                                                        : (item.sharia_contract || "Syariah")
                                                    }
                                                </p>
                                            </div>

                                            <TactileButton
                                                as="a"
                                                href={`/produk/${item.slug}`}
                                                fullWidth
                                                className={cn(
                                                    "text-white shadow-lg border-b-4",
                                                    getCardColor(item) === "emerald" ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-900 shadow-emerald-900/10" :
                                                        getCardColor(item) === "blue" ? "bg-blue-600 hover:bg-blue-700 border-blue-900 shadow-blue-900/10" :
                                                            getCardColor(item) === "gold" ? "bg-amber-500 hover:bg-amber-600 border-amber-800 shadow-amber-900/10" :
                                                                "bg-emerald-700 hover:bg-emerald-800 border-emerald-900"
                                                )}
                                            >
                                                Lihat Detail
                                            </TactileButton>

                                            {item.thumbnail && (
                                                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-inner border border-slate-100 group-hover:shadow-md transition-shadow duration-500 mt-4">
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${item.collectionId}/${item.id}/${item.thumbnail}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
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
                )
                }
            </div>

            <ModernFooter />

        </main>
    );
}

