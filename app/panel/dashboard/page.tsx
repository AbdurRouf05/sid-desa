"use client";

import React, { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import {
    Users,
    FileText,
    ShoppingBag,
    Eye,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import Link from "next/link";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        newsCount: 0,
        productsCount: 0,
        membersCount: "loading...",
        assets: "loading..."
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const news = await pb.collection('news').getList(1, 1, { filter: 'published=true' });
                const products = await pb.collection('products').getList(1, 1);
                // Config usually fetched from singleton
                const config = await pb.collection('site_config').getFirstListItem("").catch(() => null);

                setStats({
                    newsCount: news.totalItems,
                    productsCount: products.totalItems,
                    membersCount: config?.total_members || "-",
                    assets: config?.total_assets || "-"
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
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-bmt-green-700 to-primary-dark text-white relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-arabesque-grid bg-grid-24 opacity-10 pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold font-display">{greeting()}, Admin.</h1>
                    <p className="text-emerald-100 mt-2">Berikut adalah ringkasan aktivitas website BMT NU Lumajang.</p>
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
                    icon={ShoppingBag}
                    label="Produk Layanan"
                    value={stats.productsCount.toString()}
                    color="bg-gold-100 text-gold-700"
                />
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
                            <span className="text-sm font-medium text-slate-600">PocketBase Backend</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Connected</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-600">MinIO Storage</span>
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
                        <Link href="/panel/dashboard/berita/baru" className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-center transition-colors group">
                            <div className="w-10 h-10 mx-auto bg-emerald-200 text-emerald-800 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-emerald-900">Tulis Berita</span>
                        </Link>
                        <Link href="/panel/dashboard/settings" className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-center transition-colors group">
                            <div className="w-10 h-10 mx-auto bg-slate-200 text-slate-700 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Settings className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-900">Edit Aset/Anggota</span>
                        </Link>
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

// Import settings icon for shortcut
import { Settings } from "lucide-react";
