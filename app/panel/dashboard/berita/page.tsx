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
    MoreHorizontal
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
                    queryOptions.filter = `title ~ "${search}"`;
                }

                // Use authenticated client
                const result = await pb.collection('news').getList(page, 10, queryOptions);
                setNews(result.items);
                setTotalPages(result.totalPages);
            } catch (sortError: any) {
                // Fallback if missing index
                if (sortError.status === 400) {
                    console.warn("News sort failed, retrying without sort...");
                    const fallbackOptions: any = { requestKey: null };
                    if (search && search.trim() !== "") {
                        fallbackOptions.filter = `title ~ "${search}"`;
                    }
                    const result = await pb.collection('news').getList(page, 10, fallbackOptions);
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
            await pb.collection('news').delete(id);
            fetchNews();
        } catch (e) {
            alert("Gagal menghapus berita");
        }
    };

    return (
        <main>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Berita & Artikel</h1>
                    <p className="text-slate-500">Kelola konten berita dan artikel edukasi.</p>
                </div>
                <Link
                    href="/panel/dashboard/berita/baru"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/10"
                >
                    <Plus className="w-5 h-5" />
                    Buat Berita Baru
                </Link>
            </div>

            {/* Filter / Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari judul berita..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 font-bold text-slate-700 text-sm w-16">No</th>
                            <th className="px-6 py-4 font-bold text-slate-700 text-sm">Judul Berita</th>
                            <th className="px-6 py-4 font-bold text-slate-700 text-sm w-32">Kategori</th>
                            <th className="px-6 py-4 font-bold text-slate-700 text-sm w-32">Status</th>
                            <th className="px-6 py-4 font-bold text-slate-700 text-sm w-32 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    Memuat data...
                                </td>
                            </tr>
                        ) : news.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    Belum ada berita. Silakan buat baru.
                                </td>
                            </tr>
                        ) : (
                            news.map((item, index) => (
                                <tr key={item.id} className={cn(
                                    "transition-colors group",
                                    item.published ? "hover:bg-slate-50/50" : "bg-slate-50/80 grayscale-[0.5] hover:bg-slate-100/80"
                                )}>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{(page - 1) * 10 + index + 1}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">/{item.slug}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.published ? (
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                                Published
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={origin ? `${origin}/berita/${item.slug}` : `/berita/${item.slug}`}
                                                target="_blank"
                                                className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                title="Lihat di Website"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/panel/dashboard/berita/${item.id}`}
                                                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

            {/* Pagination Controls could be added here */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-50 text-sm font-medium hover:bg-slate-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-slate-500">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-50 text-sm font-medium hover:bg-slate-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </main>
    );
}
