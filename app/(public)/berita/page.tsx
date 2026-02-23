"use client";

import React, { useState, useEffect } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { NewsCard } from "@/components/news/news-card";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { pb } from "@/lib/pb";
import { getAssetUrl } from "@/lib/cdn";
import { formatDate } from "@/lib/number-utils";

const CATEGORIES = ["Semua", "Berita", "Edukasi", "Promo"];

export default function BeritaPage() {
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 9;

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                let filterExpr = 'published = true';
                if (activeCategory !== "Semua") {
                    filterExpr += ` && category = "${activeCategory}"`;
                }
                if (searchQuery) {
                    filterExpr += ` && title ~ "${searchQuery}"`;
                }

                const result = await pb.collection('news').getList(currentPage, ITEMS_PER_PAGE, {
                    filter: filterExpr,
                    sort: '-created',
                });

                setTotalPages(result.totalPages);

                const mappedItems = result.items.map(record => ({
                    id: record.id,
                    title: record.title,
                    slug: record.slug,
                    thumbnail: record.thumbnail ? getAssetUrl(record, record.thumbnail) : "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070",
                    date: formatDate(record.created || record.updated),
                    category: record.category,
                    author: "Admin",
                    excerpt: record.content.replace(/<[^>]*>/g, '').substring(0, 150) + "..."
                }));

                setNewsItems(mappedItems);
            } catch (e) {
                console.error("Failed to fetch news", e);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(() => {
            fetchNews();
        }, 300);

        return () => clearTimeout(timeout);
    }, [activeCategory, searchQuery, currentPage]);

    // Reset page when category or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, searchQuery]);

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />

            {/* Header */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-bmt-green-700 to-primary-dark text-white text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="absolute -bottom-16 left-0 right-0 h-16 bg-slate-50 rounded-t-[50%] scale-x-150"></div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <SectionHeading
                        title="Kabar & Artikel"
                        subtitle="Informasi terbaru seputar kegiatan, edukasi keuangan syariah, dan promo menarik dari BMT NU Lumajang."
                        lightMode
                    />

                    <div className="mt-8 max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Cari berita..."
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white/20 transition-all font-sans"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-400" />
                    </div>
                </div>
            </section>

            <section className="sticky top-[72px] z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="container mx-auto px-4 overflow-x-auto">
                    <div className="flex justify-center min-w-max">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap",
                                    activeCategory === cat
                                        ? "border-emerald-600 text-emerald-800"
                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Memuat berita...</div>
                    ) : newsItems.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                                {newsItems.map((item) => (
                                    <NewsCard
                                        key={item.id}
                                        {...item}
                                    />
                                ))}
                            </div>

                            {/* Pagination UI */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex justify-center items-center gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                    >
                                        Prev
                                    </button>

                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setCurrentPage(p)}
                                                className={cn(
                                                    "w-10 h-10 rounded-lg text-sm font-bold transition-all",
                                                    currentPage === p
                                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                )}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 text-slate-500">
                            <p className="text-lg mb-2">Tidak ada berita ditemukan.</p>
                            {searchQuery || activeCategory !== "Semua" ? (
                                <button
                                    onClick={() => { setSearchQuery(""); setActiveCategory("Semua"); }}
                                    className="text-emerald-600 hover:underline font-medium"
                                >
                                    Reset Pencarian
                                </button>
                            ) : null}
                        </div>
                    )}
                </div>
            </section>

            <ModernFooter />
        </main>
    );
}

