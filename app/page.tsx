"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { TactileButton } from "@/components/ui/tactile-button";
import { ArabesqueCard } from "@/components/ui/arabesque-card";
import { StatsWidget } from "@/components/widgets/stats-widget";
import { JsonLd } from "@/components/seo/json-ld";
import {
    ArrowRight, ShieldCheck, Banknote, Users,
    Play, Instagram, Video, ChevronRight, Calendar, ExternalLink, MapPin, Clock
} from "lucide-react";
import { pb } from "@/lib/pb";
import { getAssetUrl } from "@/lib/cdn";

// --- HERO SLIDE DATA ---
// --- HERO SLIDE DATA (Static Fallback) ---
const HERO_SLIDES = [
    {
        id: 1,
        title: "Mitra Keuangan Syariah Terpercaya",
        subtitle: "Mudah, Murah, Berkah dengan cara Syariah. Mengelola dana umat dengan prinsip kehati-hatian untuk kemandirian ekonomi.",
        cta: "Bergabung Sekarang",
        cta_link: "/kontak",
        bgClass: "bg-emerald-900",
        image: "https://images.unsplash.com/photo-1577083639236-0f52ba0b5273?q=60&w=1200" // Unsplash Fallback
    },
    {
        id: 2,
        title: "Tabungan SIRELA",
        subtitle: "Simpanan Sukarela yang likuid, bisa disetor dan ditarik kapan saja. Pilihan tepat untuk dana cadangan harian Anda.",
        cta: "Buka Tabungan",
        cta_link: "/produk/sirela",
        bgClass: "bg-emerald-800",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=60&w=1200" // Unsplash Fallback
    },
    {
        id: 3,
        title: "Digital & Transparan",
        subtitle: "Nikmati kemudahan notifikasi WhatsApp Real-time setiap transaksi. Aman, Cepat, dan Nyaman di mana saja.",
        cta: "Coba Layanan Digital",
        cta_link: "/layanan",
        bgClass: "bg-slate-900",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=60&w=1200" // Unsplash Fallback
    }
];

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroData, setHeroData] = useState<any[]>(HERO_SLIDES);
    const [stats, setStats] = useState({
        assets: "Loading...",
        members: "Loading...",
        branches: "16"
    });
    const [news, setNews] = useState<any[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [mapUrl, setMapUrl] = useState("");

    useEffect(() => {
        // Fetch dynamic stats, news, and banners
        import("@/lib/pb").then(async ({ pb }) => {
            try {
                // 1. Config
                const configPromise = pb.collection('site_config').getFirstListItem("");

                // 2. Banners
                const bannersPromise = pb.collection('hero_banners').getList(1, 10, {
                    sort: 'order',
                    filter: 'active = true'
                });

                // 3. News
                // Try sorting by created descending
                let newsResult;
                try {
                    newsResult = await pb.collection('news').getList(1, 3, {
                        sort: '-created',
                        filter: 'published = true'
                    });
                } catch (e: any) {
                    if (e.status === 400) {
                        // Fallback no sort if index missing
                        newsResult = await pb.collection('news').getList(1, 3, {
                            filter: 'published = true'
                        });
                    }
                }

                // Resolve promises
                const [config, banners] = await Promise.all([
                    configPromise.catch(() => null),
                    bannersPromise.catch(() => null)
                ]);

                if (config) {
                    setStats({
                        assets: config.total_assets || "28 M+",
                        members: config.total_members || "6.000+",
                        branches: config.total_branches || "16"
                    });
                    setMapUrl(config.map_embed_url || config.social_links?.map_embed_url || "");
                }

                if (banners && banners.items.length > 0) {
                    // Map DB records to Hero Slide format
                    const mappedBanners = banners.items.map((b: any) => ({
                        id: b.id,
                        title: b.title,
                        subtitle: b.subtitle,
                        cta: b.cta_text || "Lihat Detail",
                        cta_link: b.cta_link || "#",
                        bgClass: b.bg_class || "bg-emerald-900", // Dynamic class
                        image: b.image_desktop ? getAssetUrl(b, b.image_desktop) : (b.image ? getAssetUrl(b, b.image) : "https://images.unsplash.com/photo-1577083639236-0f52ba0b5273?q=60&w=1200"),
                        mobile_image: b.image_mobile ? getAssetUrl(b, b.image_mobile) : null,
                        foreground_image: b.foreground_image, // Pass raw filename, getAssetUrl handles record linking in map
                        collectionId: b.collectionId, // Needed for getAssetUrl

                    }));
                    setHeroData(mappedBanners);
                }

                setNews(newsResult?.items || []);

            } catch (e) {
                console.error("Home fetch error:", e);
            } finally {
                setNewsLoading(false);
            }
        });
    }, []);

    // ... (schemas and auto-slide logic remain same) ...
    // --- SEO: STRUCTURED DATA ---
    const sirelaSchema = {
        name: "Tabungan SIRELA (Simpanan Sukarela)",
        description: "Simpanan Sukarela yang likuid, bisa disetor dan ditarik kapan saja.",
        provider: { "@type": "Organization", name: "BMT NU Lumajang" },
        areaServed: "Lumajang, Jawa Timur",
        serviceType: "Savings Account",
        offers: {
            "@type": "Offer",
            price: "20000",
            priceCurrency: "IDR",
            description: "Setoran awal minimal Rp 20.000"
        }
    };

    const hajiSchema = {
        name: "Simpanan Haji & Umroh",
        description: "Tabungan perencanaan ibadah Haji dan Umroh yang aman dan sesuai syariah.",
        provider: { "@type": "Organization", name: "BMT NU Lumajang" },
        serviceType: "Hajj Savings",
        offers: {
            "@type": "Offer",
            price: "100000",
            priceCurrency: "IDR",
            description: "Setoran awal minimal Rp 100.000"
        }
    };

    const financingSchema = {
        name: "Pembiayaan Produktif (Modal Usaha)",
        description: "Pembiayaan modal usaha syariah dengan akad Mudharabah dan Musyarokah.",
        provider: { "@type": "Organization", name: "BMT NU Lumajang" },
        serviceType: "Business Loan",
        currency: "IDR"
    };

    // Auto-slide logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroData.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-display text-slate-800 antialiased overflow-x-hidden">
            <JsonLd type="FinancialProduct" data={sirelaSchema} />
            <JsonLd type="FinancialProduct" data={hajiSchema} />
            <JsonLd type="FinancialProduct" data={financingSchema} />

            <ModernNavbar />

            {/* 1. CINEMATIC HERO SLIDER */}
            <section className="relative h-[650px] md:h-[800px] w-full overflow-hidden bg-emerald-950 text-white">
                <AnimatePresence mode="popLayout">
                    {heroData.map((slide, index) => {
                        const isOriginal = slide.bgClass === "original";
                        // Prepare Foreground URL if exists
                        const foregroundUrl = slide.foreground_image ? getAssetUrl(slide, slide.foreground_image) : null;

                        return (
                            index === currentSlide && (
                                <motion.div
                                    key={slide.id}
                                    className={`absolute inset-0 ${isOriginal ? 'bg-slate-900' : slide.bgClass} flex items-center justify-center overflow-hidden`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                >
                                    {/* LAYER 1A: Desktop Background (Hidden on Mobile if Mobile Image exists) */}
                                    <motion.div
                                        className={`absolute inset-0 ${isOriginal ? 'opacity-100' : 'opacity-40'} bg-cover bg-center ${slide.mobile_image ? 'hidden md:block' : ''}`}
                                        style={{ backgroundImage: `url('${slide.image}')` }}
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 10, ease: "linear" }}
                                    />

                                    {/* LAYER 1B: Mobile Background (Visible only on Mobile if exists) */}
                                    {slide.mobile_image && (
                                        <motion.div
                                            className={`absolute inset-0 ${isOriginal ? 'opacity-100' : 'opacity-40'} bg-cover bg-center md:hidden`}
                                            style={{ backgroundImage: `url('${slide.mobile_image}')` }}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 10, ease: "linear" }}
                                        />
                                    )}

                                    {/* LAYER 2: Gradient Overlay (Only if not original) */}
                                    {!isOriginal && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent" />
                                    )}

                                    {/* LAYER 3: Arabesque Grid (Optional) */}
                                    <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-20 pointer-events-none" />

                                    {/* LAYER 4: Foreground Image (Character/Floating Object) - If exists */}
                                    {foregroundUrl && (
                                        <motion.div
                                            className="absolute inset-0 z-10 pointer-events-none flex items-end justify-end md:justify-end md:pr-12 lg:pr-32 pb-0"
                                            initial={{ opacity: 0, x: 50, y: 50 }}
                                            animate={{ opacity: 1, x: 0, y: 0 }}
                                            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                        >
                                            <img
                                                src={foregroundUrl}
                                                alt=""
                                                className="h-[60%] md:h-[85%] object-contain object-bottom drop-shadow-2xl mr-0 mb-0 pointer-events-none"
                                            />
                                        </motion.div>
                                    )}

                                    {/* LAYER 5: Text Content (Highest Z-Index) */}
                                    <div className="container relative z-20 px-4 md:px-8 h-full flex flex-col justify-center">
                                        <div className={`space-y-6 ${foregroundUrl ? 'max-w-[75%] sm:max-w-[80%] md:max-w-xl lg:max-w-3xl' : 'max-w-3xl'}`}>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5, duration: 0.8 }}
                                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-gold text-sm font-bold tracking-wide"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                                                BMT NU LUMAJANG
                                            </motion.div>

                                            <motion.h1
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.7, duration: 0.8 }}
                                                className={`${foregroundUrl ? 'text-3xl' : 'text-4xl'} md:text-6xl lg:text-7xl font-black leading-tight tracking-tight drop-shadow-lg`}
                                            >
                                                {slide.title}
                                            </motion.h1>

                                            <motion.p
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.9, duration: 0.8 }}
                                                className="text-lg md:text-xl text-emerald-100/90 leading-relaxed max-w-2xl drop-shadow-md"
                                            >
                                                {slide.subtitle}
                                            </motion.p>

                                            <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 1.1, duration: 0.8 }}
                                                className="pt-4"
                                            >
                                                <TactileButton variant={index === 0 ? "secondary" : "primary"} className="text-lg h-14 px-8 shadow-2xl">
                                                    {slide.cta} <ArrowRight className="ml-2 w-5 h-5" />
                                                </TactileButton>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        );
                    })}
                </AnimatePresence>

                {/* Slide Indicators */}
                <div className="absolute bottom-24 md:bottom-32 left-0 w-full z-20">
                    <div className="container px-4 md:px-8 flex gap-3">
                        {heroData.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-12 bg-gold' : 'w-3 bg-white/30 hover:bg-white/50'}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. TRUST STATS (Floating Widget) */}
            <section className="relative z-30 -mt-24 px-4 pb-12">
                <div className="container mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-b-4 border-gold">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                            <div className="flex items-center gap-4 px-4">
                                <div className="p-3 rounded-full bg-emerald-50 text-emerald-700">
                                    <Banknote className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Titik Layanan</p>
                                    <h3 className="text-3xl font-black text-gray-900">{stats.branches} Kantor</h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-4 pt-4 md:pt-0">
                                <div className="p-3 rounded-full bg-emerald-50 text-emerald-700">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Anggota</p>
                                    <h3 className="text-3xl font-black text-gray-900">{stats.members} Orang</h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-4 pt-4 md:pt-0">
                                <div className="p-3 rounded-full bg-emerald-50 text-emerald-700">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Aset</p>
                                    <h3 className="text-3xl font-black text-gray-900">{stats.assets}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. VALUE PROPOSITION */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6">Kenapa Memilih BMT NU?</h2>
                    <p className="text-lg text-slate-600 mb-12">
                        Kami menggabungkan nilai-nilai luhur keislaman dengan profesionalisme manajemen modern untuk memberikan layanan finansial yang menenteramkan.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-emerald-700">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Bebas Riba</h3>
                            <p className="text-sm text-slate-500">Semua produk menggunakan akad yang jelas sesuai syariah (Mudharabah, Musyarokah, dll).</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="mx-auto w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-4 text-amber-600">
                                <Banknote className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Tanpa Potongan</h3>
                            <p className="text-sm text-slate-500">Tabungan Anda utuh tanpa potongan administrasi bulanan sedikitpun.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Milik Umat</h3>
                            <p className="text-sm text-slate-500">Berdiri di bawah komando PCNU Lumajang untuk kemandirian ekonomi warga Nahdliyin.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. SOCIAL MEDIA HUB (Bento Grid) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-emerald-950">Terhubung Dengan Kami</h2>
                            <p className="text-slate-500 mt-2">Ikuti aktivitas terbaru BMT NU di sosial media.</p>
                        </div>
                        <TactileButton variant="ghost">Lihat Semua Galeri</TactileButton>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] md:h-[500px]">
                        {/* Main Video (YouTube Placeholder) */}
                        <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden relative group cursor-pointer">
                            <div className="absolute inset-0 bg-slate-900 border-b-4 border-red-600"></div>
                            {/* Placeholder Content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/80 to-transparent">
                                <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-bold rounded mb-2">YOUTUBE</span>
                                <h3 className="text-white font-bold text-xl">Profil BMT NU Lumajang 2025</h3>
                            </div>
                        </div>

                        {/* Instagram Tile */}
                        <div className="md:col-span-1 md:row-span-2 bg-gradient-to-br from-purple-600 to-orange-500 rounded-2xl p-6 relative overflow-hidden group border-b-4 border-purple-800">
                            <Instagram className="text-white w-10 h-10 mb-4" />
                            <h3 className="text-white font-bold text-lg mb-2">Instagram Feeds</h3>
                            <p className="text-white/80 text-sm">Dokumentasi kegiatan, event, dan edukasi harian.</p>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                            <TactileButton variant="ghost" className="absolute bottom-4 left-4 text-white border-white/30 hover:bg-white/20">Follow</TactileButton>
                        </div>

                        {/* TikTok Tile 1 */}
                        <div className="bg-black rounded-2xl p-4 flex flex-col justify-end relative overflow-hidden group border-b-4 border-gray-800">
                            <div className="absolute inset-0 bg-slate-800"></div>
                            <div className="relative z-10">
                                <Video className="text-white w-6 h-6 mb-2" />
                                <p className="text-white font-bold text-sm line-clamp-2">Tips Mengatur Keuangan Syariah ala BMT NU</p>
                            </div>
                        </div>

                        {/* TikTok Tile 2 */}
                        <div className="bg-emerald-800 rounded-2xl p-4 flex flex-col justify-end relative overflow-hidden group border-b-4 border-emerald-950">
                            <div className="relative z-10">
                                <span className="inline-block px-2 py-0.5 bg-gold text-emerald-950 text-[10px] font-bold rounded mb-2">VIRAL</span>
                                <p className="text-white font-bold text-sm">Keseruan Event Jalan Sehat Harlah NU</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. PRODUCT HIGHLIGHTS */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-emerald-950">Produk Unggulan</h2>
                        <p className="text-slate-600 mt-2">Solusi keuangan terbaik pilihan anggota.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ArabesqueCard variant="interactive" title="Tabungan SIRELA" icon={<span className="text-2xl">💰</span>}>
                            <p className="text-slate-600 mb-6 text-sm">Simpanan Sukarela yang likuid, setor dan tarik kapan saja. Setoran awal sangat ringan mulai Rp 20.000.</p>
                            <TactileButton fullWidth>Buka Rekening</TactileButton>
                        </ArabesqueCard>
                        <ArabesqueCard variant="interactive" title="Haji & Umroh" icon={<span className="text-2xl">🕋</span>}>
                            <p className="text-slate-600 mb-6 text-sm">Rencanakan ibadah suci Anda. Dana aman terkunci hingga cukup untuk keberangkatan. Setoran awal Rp 100.000.</p>
                            <TactileButton fullWidth>Daftar Haji</TactileButton>
                        </ArabesqueCard>
                        <ArabesqueCard variant="interactive" title="Pembiayaan Produktif" icon={<span className="text-2xl">📈</span>}>
                            <p className="text-slate-600 mb-6 text-sm">Tambahan modal usaha dengan akad Mudharabah/Musyarokah yang adil dan bebas riba untuk majukan bisnis Anda.</p>
                            <TactileButton fullWidth>Ajukan Modal</TactileButton>
                        </ArabesqueCard>
                    </div>
                </div>
            </section>

            {/* 6. NEWS & UDPATES */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-bold text-emerald-950">Kabar Terbaru</h2>
                        <TactileButton variant="ghost" onClick={() => window.location.href = '/berita'}>Lihat Berita Lainnya</TactileButton>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {newsLoading ? (
                            // Loading Skeleton
                            [1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
                                    <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                                    <div className="h-6 w-full bg-slate-200 rounded mb-2"></div>
                                    <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                                </div>
                            ))
                        ) : news.length > 0 ? (
                            news.map((item: any) => (
                                <div key={item.id} className="group cursor-pointer" onClick={() => window.location.href = `/berita/${item.slug}`}>
                                    <div className="h-48 bg-gray-200 rounded-xl mb-4 overflow-hidden relative">
                                        {item.thumbnail ? (
                                            <img
                                                src={getAssetUrl(item, item.thumbnail)}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                                                <span className="text-emerald-300">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        <span className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-xs font-bold text-emerald-800">
                                            {item.category || "BERITA"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                            {(() => {
                                                try {
                                                    const dateStr = item.created || item.updated;
                                                    if (!dateStr) return "Tanggal tidak tersedia";
                                                    const date = new Date(dateStr);
                                                    return !isNaN(date.getTime())
                                                        ? date.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })
                                                        : "Tanggal tidak tersedia";
                                                } catch (e) {
                                                    return "Tanggal tidak tersedia";
                                                }
                                            })()}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                                        {item.title}
                                    </h3>
                                    <p
                                        className="text-sm text-slate-500 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: item.content ? item.content.replace(/<[^>]*>/g, '') : "" }}
                                    />
                                </div>
                            ))
                        ) : (
                            // Empty State
                            <div className="col-span-3 text-center py-10 text-slate-500">
                                <p>Belum ada kabar terbaru.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 6.5. SERVICE NETWORK / BRANCH LOCATOR */}
            <section className="py-20 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2 block">Jaringan Kantor</span>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Kami Hadir Lebih Dekat</h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Dengan {stats.branches} titik layanan yang tersebar di wilayah Lumajang, kami siap melayani kebutuhan transaksi keuangan Anda dengan keramahan dan profesionalisme.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Kantor Pusat & Cabang Strategis</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Layanan Senin - Sabtu (07.30 - 15.00)</span>
                                </li>
                            </ul>

                            <TactileButton onClick={() => window.location.href = '/kontak'} className="bg-emerald-600 text-white hover:bg-emerald-700">
                                Cari Kantor Terdekat <ArrowRight className="ml-2 w-4 h-4" />
                            </TactileButton>
                        </div>

                        <div className="relative">
                            <div className="bg-white p-2 rounded-2xl shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => window.location.href = '/kontak'}>
                                    {mapUrl ? (
                                        <iframe
                                            src={mapUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="w-full h-full"
                                        ></iframe>
                                    ) : (
                                        <>
                                            <img
                                                src="https://images.unsplash.com/photo-1577083639236-0f52ba0b5273?q=60&w=1200"
                                                alt="Kantor BMT NU"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                                <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full font-bold text-emerald-950 shadow-lg flex items-center gap-2">
                                                    <MapPin className="w-5 h-5 text-red-500 animate-bounce" />
                                                    Lihat di Peta
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* Decorative blobs */}
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-100/50 rounded-full blur-3xl opacity-50"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FINAL CTA */}
            <section className="py-24 bg-gradient-to-br from-gold to-yellow-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-20 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10 text-center text-emerald-950">
                    <h2 className="text-3xl md:text-5xl font-black mb-6">Siap Menjadi Bagian Dari Kami?</h2>
                    <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
                        Mulai langkah kebaikan finansial Anda hari ini. Bersama BMT NU Lumajang, ekonomi kuat, umat bermartabat.
                    </p>
                    <TactileButton className="bg-emerald-900 text-white border-emerald-950 hover:bg-emerald-800 px-10 h-16 text-lg shadow-2xl">
                        Hubungi via WhatsApp <ExternalLink className="ml-2 w-5 h-5" />
                    </TactileButton>
                </div>
            </section>

            <ModernFooter />
        </div >
    );
}
