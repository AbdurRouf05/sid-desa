"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import PocketBase from "pocketbase";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminNewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    const [origin, setOrigin] = useState("");

    useEffect(() => {
        // Capture origin and strip 'cp.' subdomain to get public origin
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin.replace("cp.", ""));
        }
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            // Strategy: Try fetching with SORT first
            try {
                const queryOptions: any = {
                    sort: '-created',
                    requestKey: null
                };
                if (search && search.trim() !== "") {
                    queryOptions.filter = `judul ~ "${search}"`;
                }

                // Use authenticated client
                const result = await pb.collection('berita_desa').getList(page, 10, queryOptions);
                setNews(result.items);
                setTotalPages(result.totalPages);
            } catch (sortError: any) {
                // Fallback if missing index
                if (sortError.status === 400) {
                    console.warn("News sort failed, retrying without sort...");
                    const fallbackOptions: any = { requestKey: null };
                    if (search && search.trim() !== "") {
                        fallbackOptions.filter = `judul ~ "${search}"`;
                    }
                    const result = await pb.collection('berita_desa').getList(page, 10, fallbackOptions);
                    setNews(result.items);
                    setTotalPages(result.totalPages);
                } else {
                    throw sortError;
                }
            }
        } catch (e: any) {
            console.error("Error fetching news details:", e.data || e.response || e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchNews();
        }, 300); // Debounce search
        return () => clearTimeout(timeout);
    }, [page, search]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Yakin ingin menghapus berita ini?")) return;
        try {
            await pb.collection('berita_desa').delete(id);
            fetchNews();
        } catch (e) {
            alert("Gagal menghapus berita");
        }
    };

    return (
        <main className="max-w-7xl mx-auto space-y-6 pb-20 px-4">
            {/* Standard Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Berita Desa</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola konten berita, pengumuman, dan artikel edukasi desa.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/panel/dashboard/berita/baru">
                        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            Buat Berita Baru
                        </button>
                    </Link>
                </div>
            </div>

            {/* Compact Search Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative group flex-1 max-w-xl">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari judul berita..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-600 text-sm"
                    />
                </div>
            </div>

            {/* Compact Table Section */}
            <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] w-16">No</th>
                            <th className="px-4 py-3 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Informasi Berita</th>
                            <th className="px-4 py-3 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] w-32">Kategori</th>
                            <th className="px-4 py-3 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] w-32">Status</th>
                            <th className="px-4 py-3 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] w-32 text-right">Opsi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin opacity-20" />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Menyelaraskan Data...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : news.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <div className="flex flex-col items-center gap-2">
                                        <MoreHorizontal className="w-8 h-8 text-slate-200" />
                                        <p className="text-sm font-bold text-slate-400">Belum ada berita. Silakan buat proyek tulisan baru.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            news.map((item, index) => (
                                <tr key={item.id} className="group hover:translate-x-1 transition-all">
                                    <td className="px-4 py-4 bg-slate-50/50 rounded-l-xl border-y border-l border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm text-[10px] font-black text-slate-400 font-mono">
                                        {((page - 1) * 10 + index + 1).toString().padStart(2, '0')}
                                    </td>
                                    <td className="px-4 py-4 bg-slate-50/50 border-y border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm">
                                        <p className="font-bold text-slate-800 uppercase tracking-tight text-xs mb-0.5 line-clamp-1">{item.judul}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            Slug: {item.slug}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4 bg-slate-50/50 border-y border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm">
                                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white border border-slate-100 text-slate-500 shadow-sm">
                                            {item.kategori}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 bg-slate-50/50 border-y border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm">
                                        {item.is_published ? (
                                            <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center w-fit gap-1.5 shadow-sm">
                                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                Live
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-400 border border-slate-200 flex items-center w-fit gap-1.5">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 bg-slate-50/50 rounded-r-xl border-y border-r border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm">
                                        <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-all">
                                            <Link
                                                href={origin ? `${origin}/v3?view=berita-detail&slug=${item.slug}` : `/v3?view=berita-detail&slug=${item.slug}`}
                                                target="_blank"
                                                className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-90"
                                                title="Lihat"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </Link>
                                            <Link
                                                href={`/panel/dashboard/berita/${item.id}`}
                                                className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90"
                                                title="Edit"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-90"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-1 p-1 bg-slate-100 w-fit mx-auto rounded-xl border border-slate-200">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1.5 rounded-lg border border-transparent bg-white shadow-sm disabled:opacity-30 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                    >
                        Prev
                    </button>
                    <div className="px-4 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                        {page} / {totalPages}
                    </div>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1.5 rounded-lg border border-transparent bg-white shadow-sm disabled:opacity-30 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                    >
                        Next
                    </button>
                </div>
            )}
        </main>

    );
}
