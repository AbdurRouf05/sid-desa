"use client";

import React, { useState, useEffect } from "react";
import { ModernNavbar } from "@/components/layout/modern-navbar";
import { ModernFooter } from "@/components/layout/modern-footer";
import { AccessibilityWidget } from "@/components/layout/accessibility-widget";
import { StickyActionBar } from "@/components/layout/sticky-action-bar";
import { FormDrawer } from "@/components/portal/form-drawer";

// Home Components
import { ModernHero } from "@/components/home/modern-hero";
import { ModernQuickHub } from "@/components/home/modern-quick-hub";
import { ModernApbdes } from "@/components/home/modern-apbdes";
import { ModernAparatur } from "@/components/home/modern-aparatur";
import { NewsFeed } from "@/components/home/news-feed";
import { LocationsMap } from "@/components/home/locations-map";

import { useUiLabels } from "@/components/providers/ui-labels-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function HomeV2() {
    const [news, setNews] = useState<any[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [stats, setStats] = useState({ assets: "0", members: "0", branches: "0" });
    const [mapUrl, setMapUrl] = useState("");
    const [locationsConfig, setLocationsConfig] = useState<any>(null);

    // Form Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState<string>('pengaduan'); // 'pengaduan', 'cek-bansos', etc.

    const openDrawer = (type: string) => {
        setDrawerType(type);
        setDrawerOpen(true);
    };

    useEffect(() => {
        // Fetch news and stats as done in original home, slightly simplified for V2 prototype
        import("@/lib/pb").then(async ({ pb }) => {
            try {
                const configPromise = pb.collection('profil_desa').getFirstListItem("");
                const newsPromise = pb.collection('berita_desa').getList(1, 4, { sort: '-created', filter: 'is_published = true' });
                const [config, newsResult] = await Promise.all([configPromise.catch(() => null), newsPromise.catch(() => null)]);

                if (config) {
                    setStats({
                        assets: config.total_assets || "Rp 2,5 M+",
                        members: config.total_members || "4.500+",
                        branches: config.total_branches || "4 Dusun"
                    });
                     setMapUrl(config.map_embed_url || config.social_links?.map_embed_url || "");
                     setLocationsConfig({
                        title: config.locations_title, description: config.locations_description,
                        feature1_text: config.locations_feature1_text, feature1_icon: config.locations_feature1_icon,
                        feature2_text: config.locations_feature2_text, feature2_icon: config.locations_feature2_icon
                    });
                }
                setNews(newsResult?.items || []);
            } catch (e) {
                console.error("Home fetch error:", e);
            } finally {
                setNewsLoading(false);
            }
        });
    }, []);

    const renderDrawerForm = () => {
        if (drawerType === 'pengaduan') {
            return (
                <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-sm text-red-800 mb-2">
                        Silakan lengkapi form di bawah ini untuk menyampaikan laporan. Laporan Anda akan dijaga kerahasiaannya.
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Nama Lengkap *</label>
                        <Input placeholder="Nama Anda" className="bg-slate-50" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Nomor HP/WA *</label>
                        <Input placeholder="Contoh: 081234..." type="tel" className="bg-slate-50" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Kategori Laporan</label>
                        <select className="w-full h-10 px-3 rounded-md border border-input bg-slate-50 text-sm">
                            <option>Infrastruktur & Jalan</option>
                            <option>Pelayanan Pemerintahan</option>
                            <option>Keamanan & Ketertiban</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Detail Laporan *</label>
                        <Textarea placeholder="Jelaskan secara rinci..." className="bg-slate-50 min-h-[120px]" />
                    </div>
                    <Button type="submit" className="w-full bg-desa-primary hover:bg-desa-primary-dark mt-4">Kirim Laporan</Button>
                </form>
            );
        } else if (drawerType === 'cek-bansos') {
            return (
                <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 mb-2">
                        Masukkan NIK Kepala Keluarga untuk mengecek status dan jadwal penerimaan bantuan sosial.
                    </div>
                     <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Nomor Induk Kependudukan (NIK) *</label>
                        <Input placeholder="16 Digit NIK" type="number" className="bg-slate-50" />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-4">Cek Data Sekarang</Button>
                </form>
            );
        }
        return <div className="text-center text-slate-500 py-10">Layanan tidak ditemukan.</div>;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 md:pb-0 relative">
            <ModernNavbar />
            
            {/* Global Features */}
            <AccessibilityWidget />
            <StickyActionBar onReportClick={() => openDrawer('pengaduan')} />
            
            {/* Slide-over Drawer for Forms */}
            <FormDrawer 
                isOpen={drawerOpen} 
                onClose={() => setDrawerOpen(false)} 
                title={drawerType === 'pengaduan' ? 'Ruang Lapor' : (drawerType === 'cek-bansos' ? 'Cek Bansos' : 'Layanan')}
                description={drawerType === 'pengaduan' ? 'Sistem Pelaporan Mandiri Desa' : 'Cek Status Bantuan Anda'}
            >
                {renderDrawerForm()}
            </FormDrawer>

            <main>
                <ModernHero />
                <ModernQuickHub onActionClick={(type) => openDrawer(type)} />
                <ModernApbdes />
                <ModernAparatur />
                <NewsFeed news={news} loading={newsLoading} />
                <LocationsMap stats={stats} mapUrl={mapUrl} config={locationsConfig} />
            </main>

            <ModernFooter />
        </div>
    );
}
