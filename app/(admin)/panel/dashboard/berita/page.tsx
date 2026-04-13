"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    Loader2,
    Calendar,
    Tag,
    Newspaper,
    ExternalLink
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
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin.replace("cp.", ""));
        }
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const queryOptions: any = {
                sort: '-created',
                requestKey: null
            };
            if (search && search.trim() !== "") {
                queryOptions.filter = `judul ~ "${search}"`;
            }

            const result = await pb.collection('berita_desa').getList(page, 10, queryOptions);
            setNews(result.items);
            setTotalPages(result.totalPages);
        } catch (e: any) {
            console.error("Error fetching news details:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchNews();
        }, 300);
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

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Manajemen Berita</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola konten berita, pengumuman, dan artikel edukasi desa.</p>
                </div>
                <Link href="/panel/dashboard/berita/baru" className="w-full md:w-auto">
                    <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm w-full md:w-auto">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Buat Berita Baru
                    </button>
                </Link>
            </div>

            {/* Toolbar Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:shadow-md">
                <div className="relative group flex-1 max-w-xl">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari judul berita..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-700 text-sm"
                    />
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16 text-center">No</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kabar & Artikel</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Klasifikasi</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visibilitas</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Menyelaraskan konten...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : news.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-200">
                                            <Newspaper className="w-12 h-12" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center leading-relaxed">
                                                {search ? "Hasil pencarian nihil." : "Halaman ini akan menampilkan tulisan berita Anda."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                news.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-[10px] font-black text-slate-300 font-mono">
                                                {((page - 1) * 10 + index + 1).toString().padStart(2, '0')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm truncate max-w-md uppercase tracking-tight">
                                                {item.judul}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="w-3 h-3 text-slate-300" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                    Dibuat {formatDate(item.created)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200 shadow-sm">
                                                <Tag className="w-2.5 h-2.5" />
                                                {item.kategori}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.is_published ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                    V3 Website
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-400 border border-slate-200">
                                                    Manual Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <div className="flex gap-2 justify-end opacity-40 group-hover:opacity-100 transition-all">
                                                <Link
                                                    href={origin ? `${origin}/v3?view=berita-detail&slug=${item.slug}` : `/v3?view=berita-detail&slug=${item.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                                                    title="Lihat Website"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/panel/dashboard/berita/${item.id}`}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                                    title="Edit Konten"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-center">
                        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all disabled:opacity-20"
                            >
                                Prev
                            </button>
                            <span className="px-4 py-2 text-[10px] font-black text-slate-300 uppercase tracking-widest border-x border-slate-100">
                                {page} / {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all disabled:opacity-20"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
