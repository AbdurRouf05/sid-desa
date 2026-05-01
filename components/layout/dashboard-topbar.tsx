"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Menu, X, Users, Compass, Newspaper, ArrowRight, Loader2, Link as LinkIcon, FileText } from "lucide-react";
import { pb } from "@/lib/pb";

interface DashboardTopbarProps {
    onMenuClick: () => void;
    onSettingsClick: () => void;
    onSearch: (query: string) => void;
    onNavigate?: (view: string, params?: any) => void; // New callback for direct navigation
}

export function DashboardTopbar({ onMenuClick, onSettingsClick, onSearch, onNavigate }: DashboardTopbarProps) {
    const [timeString, setTimeString] = useState("");
    const [dateString, setDateString] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [visitorCount, setVisitorCount] = useState<number | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Live Search States
    const [isSearching, setIsSearching] = useState(false);
    const [recommendations, setRecommendations] = useState<{berita: any[], layanan: any[]}>({ berita: [], layanan: [] });
    const [searchResults, setSearchResults] = useState<{berita: any[], layanan: any[]}>({ berita: [], layanan: [] });

    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
                searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Time update
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const optionsDate: Intl.DateTimeFormatOptions = { 
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
            };
            setDateString(now.toLocaleDateString('id-ID', optionsDate));
            setTimeString(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Initial Visitor & Recommendations Fetch
    useEffect(() => {
        async function fetchInitialData() {
            try {
                // 1. Visitors
                const res = await fetch('/api/analytics/stats/public');
                const data = await res.json();
                setVisitorCount(data.aktif || 0);

                // 2. Recommendations (Latest News & Services)
                const [newsRes, layRes] = await Promise.all([
                    pb.collection('berita_desa').getList(1, 3, { filter: 'is_published = true', sort: '-created' }),
                    pb.collection('layanan_desa').getList(1, 3, { filter: 'is_active = true', sort: 'urutan,created' }).catch(() => ({ items: [] }))
                ]);
                
                setRecommendations({
                    berita: newsRes.items || [],
                    layanan: layRes.items || []
                });

            } catch (err) {
                console.warn("Failed to load initial metrics", err);
            }
        }
        fetchInitialData();
    }, []);

    // Search Engine
    useEffect(() => {
        if (!searchQuery.trim().length) {
            setSearchResults({ berita: [], layanan: [] });
            return;
        }

        const runSearch = async () => {
            setIsSearching(true);
            try {
                const query = searchQuery.trim();
                const [newsRes, layRes] = await Promise.all([
                    pb.collection('berita_desa').getList(1, 5, { 
                        filter: `(judul ~ "${query}" || kategori ~ "${query}") && is_published = true`, 
                        sort: '-created' 
                    }),
                    pb.collection('layanan_desa').getList(1, 3, { 
                        filter: `(nama_layanan ~ "${query}" || deskripsi ~ "${query}") && is_active = true`, 
                        sort: 'urutan' 
                    }).catch(() => ({ items: [] }))
                ]);

                setSearchResults({
                    berita: newsRes.items || [],
                    layanan: layRes.items || []
                });
            } catch (e) {
                console.error(e);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(runSearch, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
            setSearchOpen(false);
        }
    };

    const handleDirectNavigate = (view: string, params?: any) => {
        if (onNavigate) {
            onNavigate(view, params);
        }
        setSearchOpen(false);
        setSearchQuery("");
    };

    const isTyping = searchQuery.trim().length > 0;
    const currentLayanan = isTyping ? searchResults.layanan : recommendations.layanan;
    const currentBerita = isTyping ? searchResults.berita : recommendations.berita;
    const hasResults = currentLayanan.length > 0 || currentBerita.length > 0;

    return (
        <header className="sticky top-0 z-[50] w-full bg-gradient-to-r from-[#15803d] to-[#14532d] text-white flex items-center justify-between px-4 h-[56px] shadow-md">
            
            {/* Left: Menu Toggle (Mobile) + Clock/Date */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
                >
                    <Menu className="w-5 h-5 text-white" />
                </button>

                <div className="hidden sm:flex items-center gap-4">
                    <div className="text-xl font-bold font-mono tracking-wider tabular-nums">{timeString}</div>
                    <div className="w-px h-6 bg-white/20"></div>
                    <div className="text-sm text-green-100 font-medium">{dateString}</div>
                </div>
                <div className="sm:hidden text-sm font-bold font-mono tabular-nums">{timeString}</div>
            </div>

            {/* Right: Visitor Count + Search */}
            <div className="flex items-center gap-2">
                {/* Live Visitor Badge */}
                {visitorCount !== null && !searchOpen && (
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium mr-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <Users className="w-3.5 h-3.5" />
                        <span>{visitorCount} aktif</span>
                    </div>
                )}

                {/* Search Interaction */}
                <div className="relative">
                    {!searchOpen ? (
                        <button 
                            onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-sm font-medium border border-transparent hover:border-white/20"
                        >
                            <Search className="w-4 h-4" />
                            <span className="hidden sm:inline">Pencarian</span>
                        </button>
                    ) : (
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-200 w-full sm:w-80 lg:w-96">
                            <div className="relative w-full">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-200">
                                    <Search className="w-4 h-4" />
                                </span>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ketik nama berita atau layanan..."
                                    className="w-full pl-9 pr-10 py-1.5 rounded-full bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner"
                                />
                                {isSearching ? (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </span>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={() => { setSearchOpen(false); setSearchQuery(""); }} 
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* Autocomplete Dropdown */}
                    {searchOpen && (
                        <div 
                            ref={dropdownRef}
                            className="absolute right-0 top-full mt-3 w-[calc(100vw-32px)] sm:w-96 max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 divide-y divide-slate-100/80 animate-in slide-in-from-top-4 fade-in duration-200 text-slate-800"
                        >
                            {!hasResults && !isSearching && isTyping ? (
                                <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                                    <Search className="w-10 h-10 text-slate-300 mb-3" />
                                    <p className="font-medium text-slate-700">Tidak ada yang cocok</p>
                                    <p className="text-sm">Coba kata kunci lain atau periksa ejaan.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Section 1: Layanan Cepat */}
                                    {currentLayanan.length > 0 && (
                                        <div className="p-2">
                                            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Compass className="w-3.5 h-3.5" /> {isTyping ? "Layanan Ditemukan" : "Rekomendasi Layanan"}
                                            </div>
                                            {currentLayanan.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        if (item.tipe === 'link_eksternal' && item.aksi_url) {
                                                            window.open(item.aksi_url, '_blank');
                                                        } else {
                                                            handleDirectNavigate('layanan-terpadu', { serviceId: item.id });
                                                        }
                                                    }}
                                                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors flex items-start gap-3 group"
                                                >
                                                    <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${item.tipe === 'link_eksternal' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                        {item.tipe === 'link_eksternal' ? <LinkIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors truncate">{item.nama_layanan}</h4>
                                                        <p className="text-xs text-slate-500 truncate">{item.deskripsi}</p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-2 -translate-x-2 group-hover:translate-x-0" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Section 2: Berita */}
                                    {currentBerita.length > 0 && (
                                        <div className="p-2">
                                            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Newspaper className="w-3.5 h-3.5" /> {isTyping ? "Kabar & Artikel" : "Berita Terbaru"}
                                            </div>
                                            {currentBerita.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleDirectNavigate('berita-detail', { slug: item.slug })}
                                                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors group border-none outline-none"
                                                >
                                                    <h4 className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-blue-600 mb-1">{item.title}</h4>
                                                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                                                        {item.category}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Total Search Button */}
                                    {isTyping && (
                                        <div className="p-2 bg-slate-50 rounded-b-2xl">
                                            <button 
                                                onClick={handleSearchSubmit}
                                                className="w-full py-2 text-center text-sm font-bold text-emerald-700 hover:text-emerald-800 flex justify-center items-center gap-1"
                                            >
                                                Lihat semua hasil pencarian <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
