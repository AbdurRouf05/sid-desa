"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import { Calendar, CalendarDays, ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { TactileButton } from "@/components/ui/tactile-button";
import { useUiLabels } from "@/components/providers/ui-labels-provider";
import { getAssetUrl } from "@/lib/cdn";
import { formatDate } from "@/lib/number-utils";

interface NewsFeedProps {
    news?: any[];
    loading?: boolean;
    onViewDetail?: (slug: string) => void;
    onBack?: () => void;
}

export function NewsFeed({ news = [], loading = false, onViewDetail, onBack }: NewsFeedProps) {
    const { getLabel } = useUiLabels();
    const [activeTab, setActiveTab] = useState('Semua');

    const categories = ['Semua', 'Berita Utama', 'Edukasi & Literasi', 'Pengumuman Desa', 'Kegiatan Warga'];

    const filteredNews = activeTab === 'Semua' 
        ? news 
        : news.filter(item => item.kategori === activeTab);

    return (
        <section className="bg-white min-h-screen">
            {/* Header & Filter */}
            <div className="bg-slate-50 border-b border-slate-200 sticky top-0 z-20 px-6 py-6 ring-1 ring-slate-200/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight font-heading">
                                {getLabel('section_news_title', 'Kabar Desa Sumberanyar')}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">Informasi terkini mengenai kegiatan, pengumuman, dan literasi desa.</p>
                        </div>
                        <button 
                            onClick={onBack || (() => window.location.href = '/v3')}
                            className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-white px-4 py-2 rounded-xl border border-emerald-100 shadow-sm hover:bg-emerald-50 transition-all w-fit"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            KEMBALI KE BERANDA
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                    activeTab === cat 
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200" 
                                        : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        // Loading Skeleton
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-slate-100">
                                <div className="h-48 bg-slate-100 rounded-xl mb-4"></div>
                                <div className="h-3 w-24 bg-slate-100 rounded mb-3"></div>
                                <div className="h-6 w-full bg-slate-100 rounded mb-2"></div>
                                <div className="h-6 w-3/4 bg-slate-100 rounded"></div>
                            </div>
                        ))
                    ) : filteredNews.length > 0 ? (
                        filteredNews.map((item: any) => (
                            <div 
                                key={item.id} 
                                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className="h-52 bg-slate-100 relative overflow-hidden">
                                    {item.thumbnail ? (
                                        <Image
                                            src={getAssetUrl(item, item.thumbnail)}
                                            alt={item.judul}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                                            <CalendarDays className="w-12 h-12 text-emerald-200" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-600/90 backdrop-blur-sm rounded-lg text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                        {item.kategori || "KABAR DESA"}
                                    </span>
                                </div>
                                
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-wider">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{formatDate(item.created || item.updated)}</span>
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-3 leading-tight tracking-tight">
                                        {item.judul}
                                    </h3>
                                    <p
                                        className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: item.konten ? item.konten.replace(/<[^>]*>/g, '') : "" }}
                                    />
                                    
                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between group/btn">
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Baca Artikel</span>
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-all">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {onViewDetail ? (
                                        <button onClick={() => onViewDetail(item.slug)} className="absolute inset-0 z-10">
                                            <span className="sr-only">Baca {item.judul}</span>
                                        </button>
                                    ) : (
                                        <Link href={`/berita/${item.slug}`} className="absolute inset-0 z-10">
                                            <span className="sr-only">Baca {item.judul}</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        // Empty State
                        <div className="col-span-full py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700">Tidak ada berita ditemukan</h3>
                            <p className="text-sm text-slate-500 mt-1">Gunakan kategori lain atau kembali lagi nanti.</p>
                            <button 
                                onClick={() => setActiveTab('Semua')}
                                className="mt-6 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:underline"
                            >
                                Lihat Semua Berita
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
