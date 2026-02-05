"use client";

import React, { useState, useEffect } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { NewsCard } from "@/components/news/news-card";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { pb } from "@/lib/pb";

const CATEGORIES = ["Semua", "Berita", "Edukasi", "Promo"];

export default function BeritaPage() {
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                // Construct filter
                // TODO: Re-enable published filter once schema is confirmed (currently causing 400)
                let filterExpr = ''; // 'published = true';
                if (activeCategory !== "Semua") {
                    filterExpr += filterExpr ? ` && category = "${activeCategory}"` : `category = "${activeCategory}"`;
                }
                if (searchQuery) {
                    filterExpr += filterExpr ? ` && title ~ "${searchQuery}"` : `title ~ "${searchQuery}"`;
                }

                // Log query for debug
                console.log("Fetching news with filter:", filterExpr);

                const result = await pb.collection('news').getList(1, 50, {
                    filter: filterExpr,
                    sort: '-created',
                });
                console.log("News Result:", result.items);

                // Transform data to match NewsCard props if necessary
                // DB fields: title, slug, thumbnail, category, content, created
                // NewsCard expects: id, title, slug, thumbnail (url), date, category, author, excerpt
                const mappedItems = result.items.map(record => ({
                    id: record.id,
                    title: record.title,
                    slug: record.slug,
                    thumbnail: record.thumbnail ? pb.files.getUrl(record, record.thumbnail) : "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070", // Fallback
                    date: new Date(record.created).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }),
                    category: record.category,
                    author: "Admin", // Default author
                    excerpt: record.content.replace(/<[^>]*>/g, '').substring(0, 150) + "..." // Strip HTML
                }));

                setNewsItems(mappedItems);
            } catch (e) {
                console.error("Failed to fetch news", e);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search slightly
        const timeout = setTimeout(() => {
            fetchNews();
        }, 300);

        return () => clearTimeout(timeout);
    }, [activeCategory, searchQuery]);

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            <ModernNavbar />

            {/* Header */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-bmt-green-700 to-primary-dark text-white text-center px-4 relative overflow-hidden">
                {/* Arabesque Pattern Overlay */}
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>

                {/* Decorative Bottom Arch */}
                <div className="absolute -bottom-16 left-0 right-0 h-16 bg-slate-50 rounded-t-[50%] scale-x-150"></div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <SectionHeading
                        title="Kabar & Artikel"
                        subtitle="Informasi terbaru seputar kegiatan, edukasi keuangan syariah, dan promo menarik dari BMT NU Lumajang."
                        lightMode
                    />

                    {/* Search Bar */}
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

            {/* Category Tabs */}
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

            {/* News Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Memuat berita...</div>
                    ) : newsItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {newsItems.map((item) => (
                                <NewsCard
                                    key={item.id}
                                    {...item}
                                />
                            ))}
                        </div>
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

