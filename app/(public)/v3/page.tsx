"use client";

import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { SplashScreen } from "@/components/home/splash-screen";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardRightSidebar } from "@/components/layout/dashboard-right-sidebar";

// Reused components for the center pane
import { ModernAparatur } from "@/components/home/modern-aparatur";
import { ModernApbdes } from "@/components/home/modern-apbdes";
import { ModernApbdesFull } from "@/components/home/modern-apbdes-full";
import { ModernArticleReader } from "@/components/home/modern-article-reader";
import { NewsFeed } from "@/components/home/news-feed";
import { AccessibilityWidget } from "@/components/layout/accessibility-widget";
import { FormDrawer } from "@/components/portal/form-drawer";
import { FormLapor } from "@/components/portal/form-lapor";
import { FormBansos } from "@/components/portal/form-bansos";
import { ModernPeta } from "@/components/home/modern-peta";
import { ModernKelembagaan } from "@/components/home/modern-kelembagaan";
import { ModernPusatLayanan } from "@/components/home/modern-pusat-layanan";
import { pb } from "@/lib/pb";

export default function V3DashboardPage() {
    const [activeView, setActiveView] = useState("identitas");
    const [activeParams, setActiveParams] = useState<any>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [drawerType, setDrawerType] = useState<string | null>(null);

    // Data States
    const [perangkat, setPerangkat] = useState<any[]>([]);
    const [profil, setProfil] = useState<any>(null);
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Slider State
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroImages = [
        "/desa/image copy 4.png",
        "/desa/image copy.png",
        "/desa/image.png",
        "/desa/image copy 3.png",
        "/desa/image copy 2.png",
    ];

    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLElement>(null);
    const [sidebarTop, setSidebarTop] = useState<number | string>(24);

    useEffect(() => {
        const updateSticky = () => {
            if (!sidebarRef.current || !mainRef.current) return;
            const offset = 24; 
            const mainH = mainRef.current.clientHeight;
            const sideH = sidebarRef.current.offsetHeight;
            
            if (sideH > mainH - offset) {
                setSidebarTop(mainH - sideH - offset); 
            } else {
                setSidebarTop(offset);
            }
        };
        
        updateSticky();
        
        const ResizeObserver = window.ResizeObserver;
        if (ResizeObserver) {
            const ro = new ResizeObserver(updateSticky);
            if (sidebarRef.current) ro.observe(sidebarRef.current);
            if (mainRef.current) ro.observe(mainRef.current);
            return () => ro.disconnect();
        } else {
            window.addEventListener('resize', updateSticky);
            return () => window.removeEventListener('resize', updateSticky);
        }
    }, [activeView, news, perangkat, currentSlide]);

    useEffect(() => {
        if (activeView !== 'identitas') return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeView, heroImages.length]);

    // Fetch Dynamic Data from PocketBase
    useEffect(() => {
        async function loadData() {
            try {
                const [perangkatRes, profilRes, newsRes] = await Promise.all([
                    pb.collection('perangkat_desa').getList(1, 20, { filter: 'is_aktif = true', sort: 'created' }).catch(() => null),
                    pb.collection('profil_desa').getFirstListItem("").catch(() => null),
                    pb.collection('berita_desa').getList(1, 5, { filter: 'is_published = true', sort: '-created' }).catch(() => null)
                ]);

                if (perangkatRes?.items) setPerangkat(perangkatRes.items);
                if (profilRes) setProfil(profilRes);
                if (newsRes?.items) setNews(newsRes.items);
            } catch (e) {
                console.error("Failed to load CP data", e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleNavigation = (view: string, params?: any) => {
        if (view.startsWith('drawer-')) {
            const type = view.replace('drawer-', '');
            setDrawerType(type);
            if (mobileMenuOpen) setMobileMenuOpen(false);
            return;
        }

        if (['form-surat-drawer'].includes(view)) {
            setDrawerType(view);
            if (mobileMenuOpen) setMobileMenuOpen(false);
            return;
        }

        setActiveView(view);
        setActiveParams(params || null);
        if (mobileMenuOpen) setMobileMenuOpen(false);
    };

    const renderIdentitasContent = () => {
        return (
            <div className="flex flex-col gap-6 w-full pb-8">
                {/* HERO SLIDER - Full width above the split content */}
                <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] rounded-xl overflow-hidden shadow-md group border border-slate-200 bg-slate-900 shrink-0">
                    {heroImages.map((src, idx) => (
                        <img 
                            key={idx}
                            src={src} 
                            alt={`Foto Desa ${idx + 1}`} 
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-in-out ${currentSlide === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
                        />
                    ))}
                    
                    {/* Dark gradient for text visibility */}
                    <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                        <div className="w-20 md:w-24 mb-4 pointer-events-auto">
                            <img src="/logo3-removebg-preview.png" alt="Logo" className="drop-shadow-lg" />
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 text-white drop-shadow-md uppercase tracking-tight">
                            {profil?.nama_desa ? `DESA ${profil.nama_desa}` : 'DESA SUMBERANYAR'}
                        </h2>
                        <p className="text-lg md:text-xl font-medium text-emerald-50 max-w-3xl drop-shadow-sm leading-relaxed opacity-90">
                            Selamat Datang di Portal Resmi Sistem Informasi dan Layanan Desa Terpadu. Menuju desa digital, tangguh, dan transparan untuk masyarakat.
                        </p>
                    </div>

                    {/* Controls */}
                    <button 
                        onClick={() => setCurrentSlide((prev) => prev === 0 ? heroImages.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button 
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
                        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-6 right-8 z-30 flex gap-2">
                        {heroImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-emerald-500' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* CONTENT BELOW HERO: Split into Main (Sejarah, Visi, Berita) & Right Sidebar */}
                <div className="flex flex-col xl:flex-row gap-6 w-full">
                    
                    {/* Main Content (Sejarah & Visi side by side, then News) */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Sejarah & Visi Misi bersabelahan */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                            <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition">
                                <h3 className="text-xl md:text-2xl font-bold border-b border-emerald-600 pb-3 mb-5 text-slate-800 flex items-center gap-3">
                                    <BookOpen className="w-6 h-6 text-emerald-600" /> Sejarah Desa
                                </h3>
                                <div className="prose prose-sm md:prose-base prose-slate max-w-none text-slate-600 flex-1">
                                    {profil?.sejarah_desa ? (
                                        <div dangerouslySetInnerHTML={{ __html: profil.sejarah_desa }} />
                                    ) : (
                                        <div className="flex h-full items-center justify-center py-6 text-slate-400 italic text-center text-sm">
                                            Data sejarah belum diatur oleh admin.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition">
                                <h3 className="text-xl md:text-2xl font-bold border-b border-emerald-600 pb-3 mb-5 text-slate-800 flex items-center gap-3">
                                    <Building2 className="w-6 h-6 text-emerald-600" /> Visi & Misi
                                </h3>
                                <div className="prose prose-sm md:prose-base prose-slate max-w-none text-slate-600 flex-1">
                                    {profil?.visi_misi ? (
                                        <div dangerouslySetInnerHTML={{ __html: profil.visi_misi }} />
                                    ) : (
                                        <div className="flex h-full items-center justify-center py-6 text-slate-400 italic text-center text-sm">
                                            Visi & Misi belum diatur oleh admin.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kumpulan Berita di Bawah */}
                        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                            <h3 className="text-xl md:text-2xl font-bold border-b border-emerald-600 pb-3 mb-5 text-slate-800 flex items-center justify-between">
                                <span className="flex items-center gap-3">Kabar Berita Desa</span>
                                <button onClick={() => handleNavigation('berita')} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Lihat Semua Berita →</button>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {news.length > 0 ? news.map((item, idx) => (
                                    <div key={idx} onClick={() => handleNavigation('berita-detail', { slug: item.slug })} className="group cursor-pointer flex flex-col">
                                        <div className="w-full aspect-[4/3] bg-slate-200 rounded-lg overflow-hidden relative mb-3">
                                            {item.thumbnail ? (
                                                <img src={pb.files.getURL(item, item.thumbnail)} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100"><BookOpen className="w-8 h-8 opacity-50" /></div>
                                            )}
                                        </div>
                                        <div className="mt-1 flex items-center gap-2 mb-1.5">
                                             <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">{item.category || "Berita"}</span>
                                             <span className="text-xs text-slate-500 font-medium">{new Date(item.created).toLocaleDateString('id-ID')}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">{item.title}</h4>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-10 text-center text-slate-400 italic border-2 border-dashed rounded-xl border-slate-200">
                                        Belum ada berita terbaru
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar appears alongside the content section */}
                    <div ref={sidebarRef} className="hidden xl:block w-[300px] shrink-0 sticky transition-all duration-300 h-fit self-start" style={{ top: typeof sidebarTop === 'number' ? `${sidebarTop}px` : sidebarTop }}>
                        <DashboardRightSidebar onArticleClick={(slug) => handleNavigation('berita-detail', { slug })} />
                    </div>

                </div>
            </div>
        );
    };

    const renderOtherContent = () => {
        switch (activeView) {
            case "aparatur":
                const mappedStaff = perangkat.length > 0 ? perangkat.map(p => ({
                    name: p.nama,
                    role: p.jabatan,
                    status: 'Di Kantor',
                    img: p.foto ? pb.files.getURL(p, p.foto) : `https://api.dicebear.com/7.x/initials/svg?seed=${p.nama}&backgroundColor=059669`,
                    sosmed_fb: p.sosmed_fb,
                    sosmed_ig: p.sosmed_ig,
                    sosmed_wa: p.sosmed_wa,
                    sosmed_x: p.sosmed_x
                })) : null;
                return (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-0 md:p-1 w-full h-full flex-1">
                        <ModernAparatur dynamicStaff={mappedStaff} />
                    </div>
                );
            case "apbdes":
                return (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-0 md:p-1 w-full h-full flex-1 overflow-x-hidden">
                        <ModernApbdes onViewDetails={() => handleNavigation("transparansi-detail")} />
                    </div>
                );
            case "layanan-terpadu":
                return <ModernPusatLayanan defaultServiceId={activeParams?.serviceId} />;
            case "kelembagaan":
                return (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-0 md:p-1 w-full h-full flex-1">
                        <ModernKelembagaan />
                    </div>
                );
            case "peta":
                return (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-0 md:p-1 w-full h-full flex-1 overflow-hidden">
                        <ModernPeta />
                    </div>
                );
            case "berita":
                return (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-0 md:p-1 w-full h-full flex-1 overflow-hidden">
                        <NewsFeed news={news} loading={loading} onViewDetail={(slug: string) => handleNavigation("berita-detail", { slug })} />
                    </div>
                );
            case "berita-detail":
                return <ModernArticleReader slug={activeParams?.slug} onBack={() => handleNavigation('berita')} />;
            case "transparansi-detail":
                return <ModernApbdesFull onBack={() => handleNavigation('apbdes')} />;
            case "pencarian":
                return (
                    <div className="animate-in fade-in h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1">
                        <h2 className="text-2xl font-bold border-b pb-4 mb-4">Hasil Pencarian: "{activeParams?.query}"</h2>
                        <iframe 
                            src={`/berita?search=${encodeURIComponent(activeParams?.query || '')}&hide_header=true`} 
                            className="w-full flex-1 border-none"
                            title="Pencarian"
                        />
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-400 p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200 flex-1">
                        <div className="w-24 h-24 mb-4 rounded-full bg-slate-100 flex items-center justify-center text-4xl">🚧</div>
                        <p className="text-lg font-medium">Dalam Pengembangan</p>
                    </div>
                );
        }
    };

    const renderDrawerForm = () => {
        if (!drawerType) return null;
        switch(drawerType) {
            case 'lapor': return <FormLapor />;
            case 'bansos': return <FormBansos />;
            default: return null;
        }
    };

    return (
        <div className="h-[100dvh] w-full flex flex-col bg-[#E9EEF1] font-sans overflow-hidden">
            <SplashScreen />
            <AccessibilityWidget />

            <FormDrawer 
                isOpen={!!drawerType} 
                onClose={() => setDrawerType(null)} 
                title={drawerType === 'bansos' ? 'Cek Bansos' : 'Ruang Lapor'}
            >
                {renderDrawerForm()}
            </FormDrawer>
            
            <DashboardTopbar 
                onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                onSettingsClick={() => {}}
                onSearch={(query) => handleNavigation('pencarian', { query })}
                onNavigate={(view, params) => handleNavigation(view, params)}
            />

            {/* Main Application Layout Canvas */}
            <div className="flex-1 flex overflow-hidden w-full gap-4 px-3 md:px-5 py-2 md:py-4 relative max-w-[1920px] mx-auto">
                {/* 1. Left Sidebar */}
                <div 
                    className={`
                        absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 w-[280px] lg:w-[320px] shrink-0 h-full
                        ${mobileMenuOpen ? 'translate-x-0 mx-3 my-2 shadow-2xl rounded-xl' : '-translate-x-[120%]'}
                    `}
                >
                    <div className="h-full md:h-[calc(100vh-80px)] bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                        <DashboardSidebar 
                            activeView={activeView} 
                            onNavigate={(str) => handleNavigation(str)} 
                        />
                    </div>
                </div>
                
                {mobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>
                )}

                {/* 2. Middle & Right Composition wrapper */}
                <main ref={mainRef} className="flex-1 overflow-y-auto custom-scrollbar relative h-full md:h-[calc(100vh-80px)] flex flex-col scroll-smooth">
                    {activeView === 'identitas' ? (
                        /* Identitas Layout: Full width slider, then split */
                        renderIdentitasContent()
                    ) : (
                        /* Other Layout: Middle Wrapper + Right Sidebar */
                        <div className="flex flex-col xl:flex-row gap-4 w-full h-full flex-1">
                            <div className="flex-1 flex flex-col h-full gap-4 max-w-full">
                                {/* Title Bar */}
                                <div className="sticky top-0 z-20 bg-white/90 backdrop-blur rounded-xl shadow-sm border border-slate-200 p-4 shrink-0 flex items-center justify-between">
                                    <h1 className="text-lg font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-desa-primary rounded-full"></span> 
                                        {{
                                            'aparatur': 'Perangkat Desa',
                                            'apbdes': 'Transparansi APBDes',
                                            'layanan-terpadu': 'Pusat Layanan Terpadu',
                                            'kelembagaan': 'Kelembagaan Desa',
                                            'peta': 'Peta Desa',
                                            'berita': 'Info & Berita'
                                        }[activeView] || activeView}
                                    </h1>
                                </div>
                                <div className="flex-1 flex flex-col relative">
                                    {renderOtherContent()}
                                </div>
                            </div>

                            {/* Standard Right Sidebar for non-identitas views */}
                            {['aparatur', 'apbdes', 'kelembagaan', 'peta', 'berita'].includes(activeView) && (
                                <div ref={sidebarRef} className="hidden xl:block w-[300px] shrink-0 sticky transition-all duration-300 h-fit self-start" style={{ top: typeof sidebarTop === 'number' ? `${sidebarTop}px` : sidebarTop }}>
                                    <div className="rounded-xl border border-slate-200 bg-white">
                                        <DashboardRightSidebar onArticleClick={(slug) => handleNavigation('berita-detail', { slug })} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8;
                }
            `}</style>
        </div>
    );
}
