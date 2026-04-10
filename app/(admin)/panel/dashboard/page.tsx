"use client";

import React, { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import {
    Users,
    FileText,
    Eye,
    TrendingUp,
    AlertCircle,
    MessageSquare,
    Image as ImageIcon,
    Settings
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import Link from "next/link";
import { AnalyticsStats } from "@/components/admin/analytics-stats";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        newsCount: 0,
        pengaduanCount: 0,
        membersCount: "0",
        suratMenunggu: 0
    });

    const [health, setHealth] = useState({
        db: "Checking...",
        storage: "Checking...",
        public: "Checking..."
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const newsPromise = pb.collection('berita_desa').getList(1, 1, { filter: 'is_published=true' }).catch(() => ({ totalItems: 0 }));
                const pengaduanPromise = pb.collection('pengaduan_warga').getList(1, 1, { filter: 'status="Menunggu"' }).catch(() => ({ totalItems: 0 }));
                const pendudukPromise = pb.collection('penduduk').getList(1, 1).catch(() => ({ totalItems: 0 }));
                const suratPromise = pb.collection('permohonan_surat_online').getList(1, 1, { filter: 'status="Menunggu"' }).catch(() => ({ totalItems: 0 }));
                
                const [news, pengaduan, penduduk, surat] = await Promise.all([
                    newsPromise, pengaduanPromise, pendudukPromise, suratPromise
                ]);

                setStats({
                    newsCount: news?.totalItems || 0,
                    pengaduanCount: pengaduan?.totalItems || 0,
                    membersCount: penduduk?.totalItems?.toString() || "0",
                    suratMenunggu: surat?.totalItems || 0
                });

                // Check PocketBase Health explicitly
                try {
                    await pb.health.check();
                    setHealth({
                        db: "Connected",
                        storage: "Active",
                        public: "Live"
                    });
                } catch(e) {
                    setHealth({
                        db: "Disconnected",
                        storage: "Offline",
                        public: "Down"
                    });
                }
            } catch (e) {
                console.error("Failed to fetch stats", e);
                setHealth({ db: "Error", storage: "Error", public: "Error" });
            }
        }
        fetchStats();
    }, []);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return "Selamat Pagi";
        if (hour < 15) return "Selamat Siang";
        if (hour < 19) return "Selamat Sore";
        return "Selamat Malam";
    };

    return (
        <main>
            <div className="mb-8 p-8 flex flex-col md:flex-row md:items-center justify-between rounded-3xl bg-emerald-600 text-white relative overflow-hidden shadow-lg border border-emerald-500/50">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10">
                    <h1 className="text-3xl font-black font-display tracking-tight text-white mb-2 drop-shadow-md">
                        {greeting()}, <span className="text-emerald-50">{pb.authStore.model?.name || pb.authStore.model?.email?.split('@')[0] || "Admin"}</span>
                    </h1>
                    <p className="text-emerald-50 font-medium drop-shadow-sm">Berikut ringkasan statistik & aktivitas sistem hari ini.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                    icon={FileText}
                    label="Surat Masuk"
                    value={stats.suratMenunggu.toString()}
                    color={stats.suratMenunggu > 0 ? "bg-red-100 text-red-700 animate-pulse border-red-200" : "bg-slate-100 text-slate-700"}
                />
                <StatCard
                    icon={Users}
                    label="Jumlah Anggota"
                    value={stats.membersCount}
                    color="bg-blue-100 text-blue-700"
                />
                <StatCard
                    icon={FileText}
                    label="Berita Terpublikasi"
                    value={stats.newsCount.toString()}
                    color="bg-purple-100 text-purple-700"
                />
                <StatCard
                    icon={MessageSquare}
                    label="Pengaduan Aktif"
                    value={stats.pengaduanCount.toString()}
                    color={stats.pengaduanCount > 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}
                />
            </div>

            {/* Analytics Section */}
            <div className="mb-12">
                <AnalyticsStats />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-gold-500" />
                        Status Website
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-600">Database</span>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${health.db === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {health.db}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-600">Storage Drive</span>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${health.storage === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {health.storage}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-600">Public Access</span>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${health.public === 'Live' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {health.public}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Shortcut Cepat</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <ShortcutBtn
                            href="/panel/dashboard/surat-online"
                            icon={FileText}
                            label="Lihat Surat"
                            color="bg-red-100 text-red-600"
                            hover="group-hover:bg-red-200"
                        />
                        <ShortcutBtn
                            href="/panel/dashboard/bansos"
                            icon={Users}
                            label="Kelola Bansos"
                            color="bg-blue-100 text-blue-600"
                            hover="group-hover:bg-blue-200"
                        />
                        <ShortcutBtn
                            href="/panel/dashboard/inquiries"
                            icon={MessageSquare}
                            label="Cek Laporan"
                            color="bg-amber-100 text-amber-600"
                            hover="group-hover:bg-amber-200"
                        />
                        <ShortcutBtn
                            href="/panel/dashboard/berita/baru"
                            icon={ImageIcon}
                            label="Tulis Berita"
                            color="bg-emerald-100 text-emerald-600"
                            hover="group-hover:bg-emerald-200"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

function StatCard({ icon: Icon, label, value, color }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function ShortcutBtn({ href, icon: Icon, label, color, hover }: any) {
    return (
        <Link href={href} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group border border-slate-100 hover:border-slate-200 hover:shadow-sm">
            <div className={`p-3 rounded-full transition-transform group-hover:scale-110 ${color} ${hover}`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-700 text-center">{label}</span>
        </Link>
    );
}
