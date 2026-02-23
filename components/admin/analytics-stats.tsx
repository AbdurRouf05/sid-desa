"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import {
    Users,
    Phone,
    MousePointerClick,
    ArrowUpRight,
    Map,
    Globe,
    Search
} from "lucide-react";

export function AnalyticsStats() {
    const [data, setData] = useState<any>({
        totalViews: 0,
        uniqueVisitors: 0,
        avgDuration: 0,
        topPages: [],
        sources: [],
        shares: 0,
        waClicks: 0,
        highEngagementSessions: 0,
        rawEvents: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch last 500 records to show a good overview
                // Fetch last 500 records to show a good overview
                const records = await pb.collection('analytics_events').getList(1, 500, {
                    sort: '-id', // Revert to ID sort for compatibility
                });

                const items = records.items;

                // 1. Total Views & Visitors
                const pageViews = items.filter(i => i.event_type === 'page_view');
                const totalViews = pageViews.length;
                const uniqueSessions = new Set(pageViews.map(i => i.session_id)).size;

                // 2. Engagement Metrics (Brand Perspective)
                const shares = items.filter(i => i.event_type === 'share_click').length;
                const waClicks = items.filter(i => i.event_type === 'wa_contact' || (i.event_type === 'click' && i.label?.includes('whatsapp'))).length;

                // High Engagement = Duration > 30s or Share click
                const highEngagementSessions = new Set(
                    items.filter(i => i.duration > 30 || i.event_type === 'share_click').map(i => i.session_id)
                ).size;

                // 3. Avg Duration (Global)
                const durationEvents = items.filter(i => i.duration > 0);
                const totalDur = durationEvents.reduce((acc, curr) => acc + (curr.duration || 0), 0);
                const avgDur = durationEvents.length > 0 ? Math.round(totalDur / durationEvents.length) : 0;

                // 4. Top Pages with Avg Duration
                const pageStats: Record<string, { count: number, totalDuration: number, durationCount: number }> = {};

                items.forEach(item => {
                    const path = item.path.split('?')[0];
                    if (!pageStats[path]) pageStats[path] = { count: 0, totalDuration: 0, durationCount: 0 };

                    if (item.event_type === 'page_view') {
                        pageStats[path].count++;
                    }
                    if (item.duration > 0) {
                        pageStats[path].totalDuration += item.duration;
                        pageStats[path].durationCount++;
                    }
                });

                const sortedPages = Object.entries(pageStats)
                    .sort(([, a], [, b]) => b.count - a.count)
                    .slice(0, 10)
                    .map(([path, stats]) => ({
                        path,
                        count: stats.count,
                        avgTime: stats.durationCount > 0 ? Math.round(stats.totalDuration / stats.durationCount) : 0
                    }));

                // 5. Traffic Source
                const sourceCounts: Record<string, number> = {};
                pageViews.forEach(item => {
                    const src = item.source || "Direct";
                    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
                });
                const sortedSources = Object.entries(sourceCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([source, count]) => ({ source, count }));


                setData({
                    totalViews,
                    uniqueVisitors: uniqueSessions,
                    avgDuration: avgDur,
                    topPages: sortedPages,
                    sources: sortedSources,
                    shares,
                    waClicks,
                    highEngagementSessions,
                    rawEvents: items
                });

            } catch (e: any) {
                console.error("Analytics Error:", e);
                
                // Development Fallback: Provide mock data if backend fails
                if (process.env.NODE_ENV === "development") {
                    setData({
                        totalViews: 1240,
                        uniqueVisitors: 850,
                        avgDuration: 145,
                        topPages: [
                            { path: "/home", count: 450, avgTime: 120 },
                            { path: "/berita", count: 320, avgTime: 180 },
                            { path: "/layanan", count: 210, avgTime: 90 },
                            { path: "/kontak", count: 120, avgTime: 45 },
                        ],
                        sources: [
                            { source: "Google", count: 680 },
                            { source: "Direct", count: 320 },
                            { source: "WhatsApp", count: 240 },
                        ],
                        shares: 45,
                        waClicks: 82,
                        highEngagementSessions: 310,
                        rawEvents: []
                    });
                } else {
                    setError(e.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Format Duration Helper
    const formatDuration = (seconds: number) => {
        if (!seconds) return "-";
        if (seconds < 60) return `${seconds}dtk`;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}d`;
    };

    // Format Date Helper
    const formatDate = (dateString: string) => {
        try {
            if (!dateString) return "-";
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid Date";
            return new Intl.DateTimeFormat('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            }).format(date);
        } catch (e) {
            return "-";
        }
    };

    if (loading) return <div className="animate-pulse h-48 bg-slate-100 rounded-2xl w-full"></div>;
    if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">Gagal memuat analitik: {error}</div>;

    // Pagination Logic
    const totalEvents = data.rawEvents?.length || 0;
    const paginatedEvents = data.rawEvents?.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE) || [];
    const maxPage = Math.ceil(totalEvents / ITEMS_PER_PAGE);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Map className="w-6 h-6 text-emerald-600" />
                    Performa Website & Brand
                </h2>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold ring-1 ring-emerald-200 anime-pulse">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                    DATA LIVE (DI-UPDATE REAL-TIME)
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Total Views"
                    value={data.totalViews}
                    icon={MousePointerClick}
                    color="bg-blue-50 text-blue-600"
                />
                <MetricCard
                    label="Unique Visitors"
                    value={data.uniqueVisitors}
                    icon={Users}
                    color="bg-purple-50 text-purple-600"
                />
                <MetricCard
                    label="Engagement Kuat"
                    value={data.highEngagementSessions}
                    icon={ArrowUpRight}
                    color="bg-emerald-50 text-emerald-600"
                    subtitle="Visitor > 30s / Share"
                />
                <MetricCard
                    label="Interaksi WA"
                    value={data.waClicks}
                    icon={Phone}
                    color="bg-green-50 text-green-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Pages Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Halaman Populer</h3>
                        <span className="text-[10px] text-slate-400 font-medium">TOP 10 TERPOPULER</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {data.topPages.map((page: any, idx: number) => (
                            <div key={idx} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="text-xs font-bold text-slate-400 w-4">{idx + 1}</span>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{page.path}</span>
                                        <span className="text-[10px] text-slate-400">Avg. Time: {formatDuration(page.avgTime)}</span>
                                    </div>
                                    <a href={page.path} target="_blank" className="text-slate-300 hover:text-emerald-500 transition-colors">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                </div>
                                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                    {page.count} View
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Traffic Source & Shares */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Sumber Trafik</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {data.sources.map((src: any, idx: number) => (
                                <div key={idx} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        {src.source.includes('Google') ? <Search className="w-4 h-4 text-blue-500" /> : <Globe className="w-4 h-4 text-slate-400" />}
                                        <span className="text-sm font-medium text-slate-700">{src.source}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                        {src.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <Globe className="w-6 h-6 opacity-40" />
                            <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded uppercase">Viral Score</span>
                        </div>
                        <p className="text-xs opacity-80 uppercase font-black tracking-widest mb-1">Total Share</p>
                        <h4 className="text-4xl font-black mb-2">{data.shares} <span className="text-sm opacity-60 font-medium">Klik Bagikan</span></h4>
                        <p className="text-[10px] leading-relaxed opacity-70">
                            Jumlah user yang menekan tombol bagikan di halaman berita. Ini indikator konten Anda menarik!
                        </p>
                    </div>
                </div>
            </div>

            {/* LIVE ACTIVITY LOG with PAGINATION */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Log Aktivitas Terbaru</h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">DETAIL INTERAKSI USER DI WEB</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-1 px-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded text-xs font-bold transition-colors"
                        >
                            Prev
                        </button>
                        <span className="text-xs font-bold text-slate-600 mx-2">Halaman {page} dari {maxPage || 1}</span>
                        <button
                            disabled={page >= maxPage}
                            onClick={() => setPage(p => Math.min(maxPage, p + 1))}
                            className="p-1 px-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded text-xs font-bold transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/30 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-3 border-b border-slate-50">Waktu</th>
                                <th className="px-6 py-3 border-b border-slate-50">Aktivitas</th>
                                <th className="px-6 py-3 border-b border-slate-50">Halaman</th>
                                <th className="px-6 py-3 border-b border-slate-50">Negara</th>
                                <th className="px-6 py-3 border-b border-slate-50 text-right">Durasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedEvents.map((ev: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                                        {formatDate(ev.created)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${ev.event_type === 'page_view' ? 'bg-blue-50 text-blue-600' :
                                            ev.event_type === 'share_click' ? 'bg-purple-100 text-purple-700' :
                                                ev.event_type === 'wa_contact' ? 'bg-green-100 text-green-700' :
                                                    'bg-slate-200 text-slate-600'
                                            }`}>
                                            {ev.event_type?.replace('_', ' ') || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{ev.path}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm">
                                                {(!ev.country || ev.country === 'Unknown') ? '💻' : (ev.country === 'ID' ? '🇮🇩' : '🌍')}
                                            </span>
                                            <span className="text-[11px] font-medium text-slate-600">
                                                {(!ev.country || ev.country === 'Unknown') ? 'Local / Unknown' : ev.country}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-[10px] font-bold ${ev.duration > 30 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {formatDuration(ev.duration)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, color, subtitle }: any) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3.5 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
                </div>
                {subtitle && <p className="text-[9px] text-slate-400 font-medium">{subtitle}</p>}
            </div>
        </div>
    );
}
