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
        membersCount: "loading...",
        assets: "loading..."
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const news = await pb.collection('news').getList(1, 1, { filter: 'published=true' });
                const pengaduan = await pb.collection('pengaduan_warga').getList(1, 1).catch(() => ({ totalItems: 0 }));
                // Config usually fetched from singleton
                const config = await pb.collection('profil_desa').getFirstListItem("").catch(() => null);

                setStats({
                    newsCount: news?.totalItems || 0,
                    pengaduanCount: pengaduan?.totalItems || 0,
                    membersCount: config?.total_members || "4.500+",
                    assets: config?.total_assets || "Rp 2,5 M+"
                });
            } catch (e) {
                console.error("Failed to fetch stats", e);
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
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-desa-primary to-desa-primary-dark text-white relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold font-display">
                        {greeting()}, {pb.authStore.model?.name || pb.authStore.model?.email?.split('@')[0] || "Admin"}.
                    </h1>
                    <p className="text-emerald-100 mt-2">Berikut adalah ringkasan aktivitas website Desa Sumberanyar.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                    icon={TrendingUp}
                    label="Total Aset"
                    value={stats.assets}
                    color="bg-emerald-100 text-emerald-700"
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
                    label="Pengaduan Masuk"
                    value={stats.pengaduanCount.toString()}
                    color="bg-amber-100 text-amber-700"
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
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Connected</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-600">Storage Drive</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-600">Public Access</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Live</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Shortcut Cepat</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <ShortcutBtn
                            href="/panel/dashboard/berita/baru"
                            icon={FileText}
                            label="Tulis Berita"
                            color="bg-emerald-100 text-emerald-600"
                            hover="group-hover:bg-emerald-200"
                        />
                        <ShortcutBtn
                            href="/panel/dashboard/surat/baru"
                            icon={FileText}
                            label="Buat Surat"
                            color="bg-blue-100 text-blue-600"
                            hover="group-hover:bg-blue-200"
                        />
                        <ShortcutBtn
                            href="/panel/dashboard/inquiries"
                            icon={MessageSquare}
                            label="Cek Pesan"
                            color="bg-amber-100 text-amber-600"
                            hover="group-hover:bg-amber-200"
                        />
                        <ShortcutBtn
                            href="/panel/dashboard/banners/baru"
                            icon={ImageIcon}
                            label="Upload Banner"
                            color="bg-purple-100 text-purple-600"
                            hover="group-hover:bg-purple-200"
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
