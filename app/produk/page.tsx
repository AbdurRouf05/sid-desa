"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ArabesqueCard } from "@/components/ui/arabesque-card";
import {
    Wallet,
    Briefcase,
    HeartHandshake,
    School,
    Plane,
    Package,
    Clock,
    ShieldCheck,
    Sprout,
    Store,
    Landmark,
    Banknote,
    PiggyBank, CreditCard, Coins, DollarSign,
    TrendingUp, Building, Home, Car, GraduationCap,
    Umbrella, Vote, Users, ShoppingBag, Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { pb } from "@/lib/pb";

type Category = "simpanan" | "pembiayaan";

// Icon Mapper
const IconMap: any = {
    PiggyBank, CreditCard, Wallet, Banknote, Landmark, Coins, DollarSign,
    TrendingUp, ShieldCheck, Briefcase, Building, Home, Car, GraduationCap,
    Plane, Umbrella, Vote, Users, ShoppingBag, Smartphone,
    HeartHandshake, School, Package, Clock, Sprout, Store
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {filteredProducts.map((item, index) => {
                            // Resolve Icon
                            const IconComponent = item.icon_name && IconMap[item.icon_name]
                                ? IconMap[item.icon_name]
                                : (item.product_type === "simpanan" ? PiggyBank : Briefcase);

                            // Resolve Variant (default to simple if not specified)
                            // Logic: Featured = interactive, specific names = gold-border/etc
                            let variant: "simple" | "gold-border" | "interactive" = "simple";
                            if (item.is_featured) variant = "interactive";
                            else if (item.schema_type === "LoanOrCredit") variant = "gold-border";

                            return (
                                <Link href={`/produk/${item.slug}`} key={item.id} className="block h-full transition-transform hover:-translate-y-1">
                                    <ArabesqueCard
                                        title={item.name}
                                        icon={<IconComponent className="w-6 h-6" />}
                                        variant={variant}
                                        className={cn("h-full", item.is_featured ? "ring-2 ring-yellow-400 ring-offset-2" : "")}
                                    >
                                        <div className="flex flex-col h-full justify-between">
                                            <div
                                                className="text-slate-600 mb-6 prose prose-sm max-w-none line-clamp-3"
                                                dangerouslySetInnerHTML={{ __html: item.description || "" }}
                                            />

                                            <div className={cn(
                                                "p-3 rounded-lg border",
                                                item.product_type === 'simpanan'
                                                    ? "bg-emerald-50/50 border-emerald-100"
                                                    : "bg-blue-50/50 border-blue-100"
                                            )}>
                                                <p className={cn(
                                                    "text-xs font-bold uppercase tracking-wider mb-1",
                                                    item.product_type === 'simpanan' ? "text-emerald-600" : "text-blue-600"
                                                )}>
                                                    {item.product_type === 'simpanan' ? "Min. Setoran / Syarat" : "Akad / Skema"}
                                                </p>
                                                <p className={cn(
                                                    "text-sm font-medium",
                                                    item.product_type === 'simpanan' ? "text-emerald-900" : "text-blue-900"
                                                )}>
                                                    {item.min_deposit ? `Rp ${item.min_deposit}` : (item.schema_type || "-")}
                                                </p>
                                            </div>
                                        </div>
                                    </ArabesqueCard>
                                </Link>

                            );
                        })}
                    </div>
                )}
            </div>

        </main>
    );
}

