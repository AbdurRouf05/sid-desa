"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { InventarisDesa } from "@/types";
import { 
    Plus, Trash2, Edit2, Package, Tag, Layers, 
    Activity, Search, Filter, ShieldCheck,
    CheckCircle2, AlertTriangle, XCircle,
    Archive, Box, Calendar
} from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export default function InventarisDesaPage() {
    const [data, setData] = useState<InventarisDesa[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterKondisi, setFilterKondisi] = useState<string>("Semua");

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("inventaris_desa").getFullList<InventarisDesa>({ sort: "-created" });
            setData(records);
        } catch (error) {
            console.error("Error fetching", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Statistics Calculation (Bansos Inspired)
    const stats = useMemo(() => {
        const total = data.length;
        const baik = data.filter(i => i.kondisi === "Baik").length;
        const rusakRingan = data.filter(i => i.kondisi === "Rusak Ringan").length;
        const rusakBerat = data.filter(i => i.kondisi === "Rusak Berat").length;
        return { total, baik, rusakRingan, rusakBerat };
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  item.kategori.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesKondisi = filterKondisi === "Semua" || item.kondisi === filterKondisi;
            return matchesSearch && matchesKondisi;
        });
    }, [data, searchQuery, filterKondisi]);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Hapus data aset ${name}? Log sejarah akan hilang.`)) return;
        try {
            await pb.collection("inventaris_desa").delete(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-700">
            {/* Header Section (Bansos Inspired) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Inventaris Aset Desa</h1>
                    <p className="text-sm text-slate-500 mt-1">Sistem manajemen barang, gedung, dan sarana prasarana pemerintah desa.</p>
                </div>
                <Link href="/panel/dashboard/aset/inventaris/baru">
                    <button className="h-10 px-5 flex items-center gap-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-200 group">
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Tambah Barang
                    </button>
                </Link>
            </div>

            {/* Quick Stats Grid (Bansos Inspired) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                            <Box className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Item</p>
                    </div>
                    <p className="text-xl font-black text-slate-900 tracking-tight font-mono">{stats.total} <span className="text-[10px] text-slate-400">UNIT</span></p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kondisi Baik</p>
                    </div>
                    <p className="text-xl font-black text-emerald-600 tracking-tight font-mono">{stats.baik}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:rotate-12 transition-transform">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rusak Ringan</p>
                    </div>
                    <p className="text-xl font-black text-amber-600 tracking-tight font-mono">{stats.rusakRingan}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:animate-bounce transition-transform">
                            <XCircle className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rusak Berat</p>
                    </div>
                    <p className="text-xl font-black text-rose-600 tracking-tight font-mono">{stats.rusakBerat}</p>
                </div>
            </div>

            {/* Content Table Card (Bansos Reference) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                {/* Search & Tabs Toolbar */}
                <div className="p-6 border-b border-slate-100 space-y-6">
                    <div className="relative group max-w-xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari kode barang atau nama aset..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-6 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {["Semua", "Baik", "Rusak Ringan", "Rusak Berat"].map((kondisi) => (
                            <button
                                key={kondisi}
                                onClick={() => setFilterKondisi(kondisi)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border outline-none flex items-center gap-2",
                                    filterKondisi === kondisi
                                        ? "bg-emerald-800 border-emerald-800 text-white shadow-lg shadow-emerald-900/10"
                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                {kondisi}
                                {filterKondisi === kondisi && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-white text-[9px]">
                                        {filteredData.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/30 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-48 font-black">Informasi Aset</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-40 font-black">Klasifikasi</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-40 font-black">Kuantitas</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-40 font-black">Kondisi Fisik</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-10 font-black">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={5} rows={8} />
                            ) : filteredData.length === 0 ? (
                                <EmptyState colSpan={5} icon={Archive} title="Aset Nihil" description="Belum ada pencatatan barang dalam sistem." />
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-700 transition-colors truncate mb-1" title={item.nama_barang}>
                                                    {item.nama_barang}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <span className="text-[8px] font-black text-slate-400 font-mono uppercase tracking-widest">ID: {item.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border bg-slate-50 text-slate-500 border-slate-100 shadow-sm">
                                                <Tag className="w-3.5 h-3.5" /> {item.kategori}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight font-mono">
                                                    {item.kuantitas} <span className="text-[8px] text-slate-400">UNIT</span>
                                                </span>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Calendar className="w-3 h-3 text-slate-300" />
                                                    <span className="text-[8px] font-black text-slate-400 font-mono uppercase tracking-widest">
                                                        TH {item.tahun_perolehan}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                                item.kondisi === "Baik" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                item.kondisi === "Rusak Ringan" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                item.kondisi === "Rusak Berat" ? "bg-rose-50 text-rose-700 border-rose-100" :
                                                "bg-slate-50 text-slate-500 border-slate-100"
                                            )}>
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full animate-pulse",
                                                    item.kondisi === "Baik" ? "bg-emerald-500" :
                                                    item.kondisi === "Rusak Ringan" ? "bg-amber-500" : "bg-rose-500"
                                                )} />
                                                {item.kondisi}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-10">
                                            <div className="flex gap-1.5 justify-end items-center opacity-40 group-hover:opacity-100 transition-all">
                                                <Link href={`/panel/dashboard/aset/inventaris/${item.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100" title="Edit Aset">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </Link>
                                                <button onClick={() => handleDelete(item.id, item.nama_barang)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100" title="Hapus Aset">
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
            </div>

            {/* Verification Footer (Bansos Inspired) */}
            <div className="flex items-center gap-4 p-5 bg-emerald-950 text-white rounded-[2rem] shadow-xl shadow-emerald-950/10 group relative overflow-hidden border border-white/5">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                    <ShieldCheck className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="relative">
                        <Activity className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-emerald-400/20 blur-lg rounded-full animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Audit Integritas Aset</p>
                        <p className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest opacity-60">
                            Inventarisasi otomatis yang terintegrasi dengan laporan belanja modal desa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
