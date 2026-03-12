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
    Users,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPendudukPage() {
    const [residents, setResidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    const fetchResidents = async () => {
        setLoading(true);
        try {
            const queryOptions: any = {
                sort: '-created',
                requestKey: null
            };
            if (search && search.trim() !== "") {
                queryOptions.filter = `nama_lengkap ~ "${search}" || nik ~ "${search}"`;
            }

            const result = await pb.collection('data_penduduk').getList(page, 20, queryOptions);
            setResidents(result.items);
            setTotalPages(result.totalPages);
        } catch (e: any) {
            console.error("Error fetching residents:", e.data || e.response || e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchResidents();
        }, 300);
        return () => clearTimeout(timeout);
    }, [page, search]);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Yakin ingin menghapus data penduduk "${name}"?`)) return;
        try {
            await pb.collection('data_penduduk').delete(id);
            fetchResidents();
        } catch (e) {
            alert("Gagal menghapus data penduduk");
        }
    };

    return (
        <main className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Data Induk Penduduk</h1>
                    <p className="text-slate-500">Kelola informasi dasar dan administrasi warga desa secara terpusat.</p>
                </div>
                <Link
                    href="/panel/dashboard/penduduk/baru"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/10"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Penduduk
                </Link>
            </div>

            {/* Filter / Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari Nama atau NIK..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <div className="text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                        Total: <span className="font-bold text-slate-900">{residents.length}</span> Warga
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm w-16 text-center">No</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm">NIK</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm">Nama Lengkap</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm">Jenis Kelamin</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm">Alamat</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm w-32 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                                            <p className="text-slate-500 font-medium">Memuat data penduduk...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : residents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <Users className="w-12 h-12 text-slate-200" />
                                            <p className="font-medium">Belum ada data penduduk. Silakan tambahkan data baru.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                residents.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-slate-400 text-sm text-center">{(page - 1) * 20 + index + 1}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-slate-700 text-sm">{item.nik}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <p className="font-bold text-slate-900">{item.nama_lengkap}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <span className={cn(
                                                "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                                item.jenis_kelamin === "Laki-laki" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-pink-50 text-pink-600 border border-pink-100"
                                            )}>
                                                {item.jenis_kelamin}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            <p className="line-clamp-1">{item.alamat || "-"}, RT {item.rt || "00"}/RW {item.rw || "00"}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/panel/dashboard/penduduk/${item.id}`}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
                                                    title="Detail & Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.nama_lengkap)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
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
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-slate-500">
                        Menampilkan halaman <span className="font-bold text-slate-900">{page}</span> dari <span className="font-bold text-slate-900">{totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-50 text-sm font-bold bg-white hover:bg-slate-50 transition-all"
                        >
                            Sebelumnya
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 rounded-lg border border-slate-200 disabled:opacity-50 text-sm font-bold bg-white hover:bg-slate-50 transition-all"
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
