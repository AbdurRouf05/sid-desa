"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, FolderOpen, Clock, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { pb } from "@/lib/pb";

interface RightSidebarProps {
    onArticleClick?: (slug: string) => void;
}

function getGreeting(): { text: string; emoji: string } {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return { text: "Selamat pagi", emoji: "🌅" };
    if (hour >= 11 && hour < 15) return { text: "Selamat siang", emoji: "☀️" };
    if (hour >= 15 && hour < 18) return { text: "Selamat sore", emoji: "🌇" };
    return { text: "Selamat malam", emoji: "🌙" };
}

export function DashboardRightSidebar({ onArticleClick }: RightSidebarProps) {
    const [activeTab, setActiveTab] = useState<'populer' | 'terbaru'>('populer');
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState(getGreeting());
    const [stats, setStats] = useState<any>(null);

    // Update greeting every minute
    useEffect(() => {
        const interval = setInterval(() => setGreeting(getGreeting()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Fetch Public Analytics 
    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/analytics/stats/public');
                const data = await res.json();
                setStats(data);
            } catch (e) {
                // soft fail
            }
        }
        fetchStats();
    }, []);

    // Fetch real articles from berita_desa
    useEffect(() => {
        async function fetchArticles() {
            try {
                const res = await pb.collection('berita_desa').getList(1, 5, {
                    filter: 'is_published = true',
                    sort: activeTab === 'populer' ? '-created' : '-created',
                });
                setArticles(res.items.map(item => ({
                    id: item.id,
                    title: item.judul,
                    date: new Date(item.created).toLocaleDateString('id-ID'),
                    kategori: item.kategori,
                    image: item.thumbnail ? pb.files.getURL(item, item.thumbnail, { thumb: '100x100' }) : null,
                    slug: item.slug,
                })));
            } catch (e) {
                // Fallback if no articles
                setArticles([]);
            } finally {
                setLoading(false);
            }
        }
        setLoading(true);
        fetchArticles();
    }, [activeTab]);

    const categories = [
        { label: "Berita Desa", filter: "Berita" },
        { label: "Pengumuman", filter: "Pengumuman" },
        { label: "Kegiatan", filter: "Kegiatan" }
    ];

    return (
        <aside className="flex flex-col gap-4 pb-10">
            
            {/* Widget: Greeting Dinamis */}
            <div className="bg-gradient-to-br from-[#15803d] to-[#0f5c2c] rounded-lg p-4 text-white shadow-sm hover:shadow-md transition-shadow cursor-default relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl translate-x-1/2 -translate-y-1/2"></div>
                <p className="text-sm font-medium leading-relaxed z-10 relative">
                    {greeting.text}, semoga semua kegiatan berjalan lancar. Sukses dan berkah selalu, Salam SEHAT!
                </p>
                <div className="absolute bottom-2 right-2 text-lg opacity-80 group-hover:rotate-12 transition-transform">
                    {greeting.emoji}
                </div>
            </div>

            {/* Widget: Kategori Berita */}
            <div className="bg-white border text-slate-800 border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-[#15803d] text-white p-3 flex items-center gap-2 border-b border-[#0f5c2c]">
                    <Clock className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wide text-sm">Kategori Berita</h3>
                </div>
                <div className="flex flex-col">
                    {categories.map((cat, i) => (
                        <button 
                            key={i}
                            onClick={() => {/* Could filter articles by category */}}
                            className="flex items-center text-left py-2.5 px-4 text-sm font-medium text-slate-600 hover:text-[#15803d] hover:bg-emerald-50 transition-colors border-b border-slate-100 last:border-0"
                        >
                            <ChevronRight className="w-4 h-4 mr-1 text-slate-400" />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Widget: Arsip Artikel (REAL DATA) */}
            <div className="bg-white border text-slate-800 border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-[#15803d] text-white p-3 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wide text-sm">Arsip Artikel</h3>
                </div>
                
                {/* Tabs */}
                <div className="flex bg-slate-100 border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('populer')}
                        className={cn("flex-1 py-2.5 text-sm font-bold text-center transition-colors relative", activeTab === 'populer' ? "text-slate-800 bg-white" : "text-slate-500 hover:text-slate-700")}
                    >
                        Terbaru
                        {activeTab === 'populer' && <div className="absolute -top-1 w-full h-[2px] bg-[#15803d] left-0"></div>}
                    </button>
                    <div className="w-px bg-slate-200"></div>
                    <button 
                        onClick={() => setActiveTab('terbaru')}
                         className={cn("flex-1 py-2.5 text-sm font-bold text-center transition-colors relative", activeTab === 'terbaru' ? "text-slate-800 bg-white" : "text-slate-500 hover:text-slate-700")}
                    >
                        Semua
                        {activeTab === 'terbaru' && <div className="absolute -top-1 w-full h-[2px] bg-[#15803d] left-0"></div>}
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col p-3 gap-4">
                    {loading ? (
                        // Loading skeleton
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-16 h-16 rounded-md bg-slate-200 shrink-0"></div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))
                    ) : articles.length > 0 ? (
                        articles.map((article) => (
                            <div 
                                key={article.id} 
                                className="flex gap-3 group cursor-pointer" 
                                onClick={() => {
                                    if (onArticleClick) onArticleClick(article.slug);
                                }}
                            >
                                <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                                    {article.image ? (
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">
                                            {article.kategori?.[0] || 'B'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 mb-0.5">{article.date} • {article.kategori}</span>
                                    <h4 className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-[#15803d] transition-colors line-clamp-3">
                                        {article.title}
                                    </h4>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-sm text-slate-400 italic">Belum ada artikel diterbitkan.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Widget: Statistik Pengunjung */}
            <div className="bg-white border text-slate-800 border-slate-200 rounded-lg shadow-sm overflow-hidden mt-2">
                <div className="bg-[#59a826] text-white p-3 flex items-center gap-2 border-b border-[#4d9420]">
                    <BarChart2 className="w-5 h-5" />
                    <h3 className="font-bold tracking-wide text-sm">STATISTIK PENGUNJUNG</h3>
                </div>
                <div className="p-4 space-y-3">
                    {stats ? (
                        <div className="grid grid-cols-[110px_10px_1fr] text-sm text-slate-600 font-medium">
                            <div>Hari ini</div><div>:</div><div className="font-bold text-slate-800">{stats.hari_ini}</div>
                            <div>Kemarin</div><div>:</div><div className="font-bold text-slate-800">{stats.kemarin}</div>
                            <div className="pt-2">Total</div><div className="pt-2">:</div><div className="font-bold text-[#15803d] pt-2">{stats.total}</div>
                            <div className="col-span-3 border-t border-dashed border-slate-200 my-2"></div>
                            <div className="text-xs">Sistem Operasi</div><div className="text-xs">:</div><div className="text-xs text-slate-800">{stats.top_os}</div>
                            <div className="text-xs">Browser</div><div className="text-xs">:</div><div className="text-xs text-slate-800">{stats.top_browser}</div>
                        </div>
                    ) : (
                        <div className="animate-pulse space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                        </div>
                    )}
                </div>
            </div>

        </aside>
    );
}
