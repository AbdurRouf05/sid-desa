"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Search, Users } from "lucide-react";
import { pb } from "@/lib/pb";
import { cn } from "@/lib/utils";

export default function PerangkatDesaPage() {
    const [perangkat, setPerangkat] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchPerangkat = async () => {
        setLoading(true);
        try {
            const records = await pb.collection('perangkat_desa').getFullList({
                sort: '-created',
            });
            setPerangkat(records);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerangkat();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus perangkat desa ini?")) {
            try {
                await pb.collection('perangkat_desa').delete(id);
                fetchPerangkat();
            } catch (e) {
                alert("Gagal menghapus perangkat desa.");
            }
        }
    };

    const filtered = perangkat.filter(p =>
        (p.nama || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.jabatan || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Perangkat Desa</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola daftar perangkat desa dan staf pemerintahan.</p>
                </div>
                <Link
                    href="/panel/dashboard/perangkat-desa/baru"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Tambah Perangkat
                </Link>
            </div>

            {/* Search & Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                {/* Search */}
                <div className="p-5 border-b border-slate-100">
                    <div className="relative group max-w-xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama atau jabatan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jabatan</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NIP</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                                            <p className="text-sm text-slate-500 font-medium">Memuat data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Users className="w-12 h-12 text-slate-200" />
                                            <p className="text-sm text-slate-500 font-medium">Tidak ada data perangkat desa.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm text-slate-900">{item.nama}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{item.jabatan}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-mono">{item.nip || "-"}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border",
                                                item.is_aktif
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                    : "bg-red-50 text-red-700 border-red-100"
                                            )}>
                                                {item.is_aktif ? 'Aktif' : 'Non-Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/panel/dashboard/perangkat-desa/${item.id}`}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
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
        </div>
    );
}
