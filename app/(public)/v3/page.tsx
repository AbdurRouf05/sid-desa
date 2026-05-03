"use client";

import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Building2, ChevronLeft, ChevronRight, ShieldAlert, Search, Clock } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DashboardInner() {
    const searchParams = useSearchParams();
    const [activeView, setActiveView] = useState("identitas");
    const [activeParams, setActiveParams] = useState<any>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [drawerType, setDrawerType] = useState<string | null>(null);

    // Deep Linking Handler
    useEffect(() => {
        const view = searchParams.get('view');
        const slug = searchParams.get('slug');
        const serviceId = searchParams.get('serviceId');

        if (view) {
            setActiveView(view);
            if (slug) setActiveParams({ slug });
            if (serviceId) setActiveParams({ serviceId });
        }
    }, [searchParams]);

    // Data States
    const [perangkat, setPerangkat] = useState<any[]>([]);
    const [profil, setProfil] = useState<any>(null);
    const [news, setNews] = useState<any[]>([]);
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Slider State
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroFallbacks = [
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

    const slideCount = banners.length > 0 ? banners.length : heroFallbacks.length;

    useEffect(() => {
        if (activeView !== 'identitas') return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideCount);
        }, 6000);
        return () => clearInterval(timer);
    }, [activeView, slideCount]);

    // Fetch Dynamic Data from PocketBase
    useEffect(() => {
        async function loadData() {
            try {
                const [perangkatRes, profilRes, newsRes, bannersRes] = await Promise.all([
                    pb.collection('perangkat_desa').getList(1, 20, { filter: 'is_aktif = true', sort: 'created' }).catch(() => null),
                    pb.collection('profil_desa').getFirstListItem("").catch(() => null),
                    pb.collection('berita_desa').getList(1, 5, { filter: 'is_published = true', sort: '-created' }).catch(() => null),
                    pb.collection('hero_banners').getList(1, 10, { filter: 'active = true', sort: 'order' }).catch(() => null)
                ]);

                if (perangkatRes?.items) setPerangkat(perangkatRes.items);
                if (profilRes) setProfil(profilRes);
                if (newsRes?.items) setNews(newsRes.items);
                if (bannersRes?.items) setBanners(bannersRes.items);
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

        // Handle surat online still as drawer for now or as per future request
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
                {/* HERO SLIDER - Simplified & Dynamic */}
                <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl group border border-slate-200 bg-slate-900 shrink-0">
                    
                    {/* Background Slides */}
                    {banners.length > 0 ? (
                        banners.map((item, idx) => {
                            const imageUrl = item.image_desktop ? pb.files.getURL(item, item.image_desktop) : (item.image ? pb.files.getURL(item, item.image) : "");

                            return (
                                <div key={item.id} className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${currentSlide === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}>
                                    {/* Primary Image */}
                                    <img 
                                        src={imageUrl} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent flex items-end p-6 md:p-12 lg:px-16 lg:pb-20">
                                        <div className={cn(
                                            "max-w-4xl transition-all duration-1000 delay-300 transform",
                                            currentSlide === idx ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
                                        )}>
                                            <div className="flex flex-col items-start text-left gap-2 md:gap-3">
                                                <div className="w-12 md:w-14 mb-2">
                                                    <img src="/logo3-removebg-preview.png" alt="Logo" className="drop-shadow-2xl brightness-110" />
                                                </div>
                                                <h2 className="text-3xl md:text-5xl lg:text-5xl font-black text-white drop-shadow-2xl uppercase tracking-tighter leading-[0.9]">
                                                    {item.title}
                                                </h2>
                                                {item.subtitle && (
                                                    <p className="text-sm md:text-base lg:text-base font-medium text-emerald-50/90 max-w-xl drop-shadow-md leading-relaxed line-clamp-3">
                                                        {item.subtitle}
                                                    </p>
                                                )}
                                                
                                                {item.cta_text && (
                                                    <div className="mt-4 md:mt-6">
                                                        <button 
                                                            onClick={() => {
                                                                if (item.cta_link) {
                                                                    if (item.cta_link.startsWith('/')) {
                                                                        window.location.href = item.cta_link;
                                                                    } else {
                                                                        window.open(item.cta_link, '_blank');
                                                                    }
                                                                }
                                                            }}
                                                            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2 group/btn"
                                                        >
                                                            {item.cta_text}
                                                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* Fallback Slides (Standard Village Identity) */
                        heroFallbacks.map((src, idx) => (
                            <div key={idx} className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${currentSlide === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}>
                                <img 
                                    src={src} 
                                    alt={`Slide ${idx + 1}`} 
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-900/90 via-slate-900/30 to-transparent flex flex-col justify-end items-start p-6 md:p-12 lg:px-16 lg:pb-20">
                                    <div className="w-14 md:w-16 mb-4">
                                        <img src="/logo3-removebg-preview.png" alt="Logo" className="drop-shadow-lg" />
                                    </div>
                                    <h2 className="text-3xl md:text-5xl lg:text-5xl font-black mb-2 text-white drop-shadow-md uppercase tracking-tight">
                                        {profil?.nama_desa ? `DESA ${profil.nama_desa}` : 'PORTAL RESMI DESA'}
                                    </h2>
                                    <p className="text-sm md:text-base font-medium text-emerald-50 max-w-2xl drop-shadow-sm leading-relaxed opacity-90">
                                        Selamat datang di pusat informasi dan layanan digital terpadu masyarakat desa.
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    
                    {/* Global Slider Controls */}
                    <div className="absolute inset-x-0 bottom-0 z-30 p-8 flex items-center justify-between pointer-events-none">
                        {/* Progress Dots */}
                        <div className="flex gap-2.5 pointer-events-auto">
                            {Array.from({ length: slideCount }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-10 bg-emerald-500' : 'w-4 bg-white/20 hover:bg-white/50'}`}
                                />
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-2 pointer-events-auto">
                            <button 
                                onClick={() => setCurrentSlide((prev) => prev === 0 ? slideCount - 1 : prev - 1)}
                                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition border border-white/10 group active:scale-95"
                            >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <button 
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % slideCount)}
                                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition border border-white/10 group active:scale-95"
                            >
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>


                {/* CONTENT BELOW HERO: Split into Main (Sejarah, Visi, Berita) & Right Sidebar */}
                <div className="flex flex-col xl:flex-row gap-6 w-full">
                    
                    {/* Main Content (Sejarah & Visi side by side, then News) */}
                    <div className="flex-1 min-w-0 flex flex-col gap-6">
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

                        {/* Kumpulan Berita di Bawah - Horizontal Scroll */}
                        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <h3 className="text-xl md:text-2xl font-black border-b border-emerald-600 pb-3 mb-6 text-slate-800 flex items-center justify-between uppercase tracking-tight">
                                <span className="flex items-center gap-3">Kabar Berita Desa</span>
                                <button 
                                    onClick={() => handleNavigation('berita')} 
                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 transition-all hover:bg-emerald-100"
                                >
                                    LIHAT SEMUA →
                                </button>
                            </h3>
                            
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
                                {news.length > 0 ? news.slice(0, 5).map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => handleNavigation('berita-detail', { slug: item.slug })} 
                                        className="w-64 md:w-72 shrink-0 snap-start group cursor-pointer flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="w-full aspect-video bg-slate-100 overflow-hidden relative">
                                            {item.thumbnail ? (
                                                <img 
                                                    src={pb.files.getURL(item, item.thumbnail)} 
                                                    alt={item.judul} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                                    <BookOpen className="w-8 h-8 opacity-20" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 left-2">
                                                <span className="text-[9px] font-black text-white bg-emerald-600/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm border border-emerald-400/30 uppercase tracking-widest">
                                                    {item.kategori || "Berita"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 mb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.created).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <h4 className="font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 text-sm md:text-base">
                                                {item.judul}
                                            </h4>
                                            <div className="mt-3 flex items-center text-emerald-600 font-bold text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">
                                                Lanjut Baca
                                                <ChevronRight className="w-3 h-3 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="w-full py-16 text-center text-slate-400 italic border-2 border-dashed rounded-2xl border-slate-100 bg-slate-50/50">
                                        Belum ada berita terbaru untuk ditampilkan.
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
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-0 md:p-1 w-full h-full flex-1 overflow-hidden transition-all duration-500">
                        <NewsFeed 
                            news={news} 
                            loading={loading} 
                            onViewDetail={(slug: string) => handleNavigation("berita-detail", { slug })} 
                            onBack={() => handleNavigation("identitas")}
                        />
                    </div>
                );
            case "berita-detail":
                return <ModernArticleReader slug={activeParams?.slug} onBack={() => handleNavigation('berita')} />;
            case "transparansi-detail":
                return <ModernApbdesFull onBack={() => handleNavigation('apbdes')} />;
            case "pengaduan":
                return (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden w-full flex-1">
                        <div className="p-6 md:p-10 max-w-2xl mx-auto">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldAlert className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Layanan Pengaduan Warga</h2>
                                <p className="text-sm text-slate-500 mt-2 font-medium">Sampaikan keluhan, aspirasi, atau laporan Anda secara langsung kepada pemerintah desa.</p>
                            </div>
                            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-2 md:p-4">
                                <FormLapor />
                            </div>
                        </div>
                    </div>
                );
            case "cek-bansos":
                return (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden w-full flex-1">
                        <div className="p-6 md:p-10 max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Sistem Cek Bansos Desa</h2>
                                <p className="text-sm text-slate-500 mt-2 font-medium">Transparansi data penerima dukungan sosial untuk masyarakat Desa Sumberanyar.</p>
                            </div>
                            <div className="bg-slate-50/50 rounded-2xl border border-slate-100">
                                <FormBansos />
                            </div>
                        </div>
                    </div>
                );
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
            <div className={`flex-1 flex overflow-hidden w-full relative max-w-[1920px] mx-auto ${activeView === 'berita-detail' ? 'gap-0 p-0' : 'gap-4 px-3 md:px-5 py-2 md:py-4'}`}>
                {/* 1. Left Sidebar */}
                <div 
                    className={`
                        absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out w-[280px] lg:w-[320px] shrink-0 h-full
                        ${activeView === 'berita-detail' ? 'hidden' : 'lg:relative lg:translate-x-0'}
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
                <main ref={mainRef} className={`flex-1 overflow-y-auto custom-scrollbar relative h-full md:h-[calc(100vh-80px)] flex flex-col scroll-smooth ${activeView === 'berita-detail' ? 'bg-white' : 'bg-slate-50'}`}>
                    {activeView === 'identitas' ? (
                        /* Identitas Layout: Full width slider, then split */
                        renderIdentitasContent()
                    ) : (
                        /* Other Layout: Middle Wrapper + Right Sidebar */
                        <div className={`flex flex-col xl:flex-row h-full flex-1 ${activeView === 'berita-detail' ? 'gap-0' : 'gap-4 w-full'}`}>
                            <div className="flex-1 min-w-0 flex flex-col h-full gap-4">
                                {/* Title Bar */}
                                {activeView !== 'berita-detail' && activeView !== 'transparansi-detail' && (
                                    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur rounded-xl shadow-sm border border-slate-200 p-4 shrink-0 flex items-center justify-between">
                                        <h1 className="text-lg font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-desa-primary rounded-full"></span> 
                                            {{
                                                'aparatur': 'Perangkat Desa',
                                                'apbdes': 'Transparansi APBDes',
                                                'layanan-terpadu': 'Pusat Layanan Terpadu',
                                                'kelembagaan': 'Kelembagaan Desa',
                                                'peta': 'Peta Desa',
                                                'berita': 'Info & Berita',
                                                'berita-detail': 'Baca Artikel',
                                                'pengaduan': 'Ruang Lapor & Aduan',
                                                'cek-bansos': 'Cek Status Bansos',
                                                'transparansi-detail': 'Detail Transparansi APBDes'
                                            }[activeView] || activeView}
                                        </h1>
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col relative">
                                    {renderOtherContent()}
                                </div>
                            </div>

                            {/* Standard Right Sidebar for non-identitas views */}
                            {['aparatur', 'apbdes', 'kelembagaan', 'peta', 'berita', 'pengaduan', 'cek-bansos'].includes(activeView) && activeView !== 'berita-detail' && (
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

export default function V3DashboardPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Memuat Panel...</p>
                </div>
            </div>
        }>
            <DashboardInner />
        </Suspense>
    );
}
