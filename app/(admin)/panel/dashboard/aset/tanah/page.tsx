"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { TanahDesa } from "@/lib/validations/aset";
import { 
    Plus, Trash2, Edit2, Map, Search, Filter, 
    Activity, Calculator, ShieldCheck,
    Maximize, Compass, Landmark,
    GripVertical, MapPin
} from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export default function TanahDesaPage() {
    const [data, setData] = useState<(TanahDesa & { id: string, created: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("tanah_desa").getFullList({ sort: "-created" });
            setData(records as any);
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
        const totalBidang = data.length;
        const totalLuas = data.reduce((acc, curr) => acc + (curr.luas_m2 || 0), 0);
        const rataRata = totalBidang > 0 ? (totalLuas / totalBidang) : 0;
        
        return { totalBidang, totalLuas, rataRata };
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter(item => 
            (item.lokasi || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.peruntukan || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Hapus data tanah di lokasi ${name}? Tindakan ini permanen.`)) return;
        try {
            await pb.collection("tanah_desa").delete(id);
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
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Aset Tanah Desa</h1>
                    <p className="text-sm text-slate-500 mt-1">Sistem informasi geografis & inventarisasi lahan pemerintah desa.</p>
                </div>
                <Link href="/panel/dashboard/aset/tanah/baru">
                    <button className="h-10 px-5 flex items-center gap-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-200 group">
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Tambah Data Lahan
                    </button>
                </Link>
            </div>

            {/* Quick Stats Grid (Bansos Inspired) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                            <Compass className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Bidang Tanah</p>
                    </div>
                    <p className="text-2xl font-black text-slate-900 tracking-tight font-mono">{stats.totalBidang} <span className="text-xs text-slate-400 uppercase tracking-widest">LOKASI</span></p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:rotate-12 transition-transform">
                            <Maximize className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Akumulasi Luas Lahan</p>
                    </div>
                    <p className="text-2xl font-black text-emerald-600 tracking-tight font-mono">{stats.totalLuas.toLocaleString('id-ID')} <span className="text-xs text-emerald-400 uppercase tracking-widest">m²</span></p>
                </div>

                <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 rounded-3xl shadow-xl shadow-emerald-900/20 group relative overflow-hidden text-white">
                    <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                        <Landmark className="w-16 h-16 text-white" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/10 text-emerald-400 rounded-xl border border-white/5 backdrop-blur-md">
                                <Calculator className="w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Rata-rata Luas / Bidang</p>
                        </div>
                        <p className="text-2xl font-black text-white tracking-tight font-mono">{stats.rataRata.toLocaleString('id-ID', { maximumFractionDigits: 1 })} <span className="text-xs text-emerald-500 uppercase tracking-widest">m²</span></p>
                    </div>
                </div>
            </div>

            {/* Content Table Card (Bansos Reference) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                {/* Search Toolbar */}
                <div className="p-6 border-b border-slate-100">
                    <div className="relative group max-w-xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari lokasi, dusun, atau peruntukan tanah..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-6 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/30 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-56">Bidang & Peta Lokasi</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-40">Luas Tanah</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status Penggunaan</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Legalitas / Hak</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-10">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={5} rows={6} />
                            ) : filteredData.length === 0 ? (
                                <EmptyState colSpan={5} icon={Map} title="Land Record Nihil" description="Belum ada pencatatan lahan dalam modul ini." />
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-700 transition-colors truncate mb-1" title={item.lokasi}>
                                                    {item.lokasi}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-2.5 h-2.5 text-slate-300" />
                                                    <span className="text-[8px] font-black text-slate-400 font-mono uppercase tracking-widest leading-none">ID: {item.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg shadow-sm">
                                                    <Maximize className="w-3 h-3 text-slate-400" />
                                                </div>
                                                <span className="text-[12px] font-black text-slate-800 tracking-tight font-mono">
                                                    {(item.luas_m2 || 0).toLocaleString('id-ID')} <span className="text-[9px] text-slate-400 ml-0.5">m²</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm">
                                                <Activity className="w-3.5 h-3.5" />
                                                {item.peruntukan || 'Belum Ditentukan'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight leading-tight max-w-[150px] truncate" title={item.pemegang_hak}>
                                                    {item.pemegang_hak || '-'}
                                                </span>
                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em] mt-0.5 italic">Bukti Kepemilikan</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-10">
                                            <div className="flex gap-1.5 justify-end items-center opacity-40 group-hover:opacity-100 transition-all">
                                                <Link href={`/panel/dashboard/aset/tanah/${item.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100" title="Edit Data Lahan">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </Link>
                                                <button onClick={() => handleDelete(item.id, item.lokasi)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100" title="Hapus Permanen">
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

            {/* Strategic Map Hint (Bansos Inspired) */}
            <div className="flex items-center gap-4 p-5 bg-emerald-950 text-white border border-white/5 rounded-[2rem] group transition-all hover:bg-black hover:border-emerald-500/30 shadow-2xl shadow-emerald-950/20">
                <div className="p-3 bg-white/10 rounded-2xl shadow-sm border border-white/5 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 backdrop-blur-md">
                    <Map className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1 leading-none font-mono">Monitoring Tata Ruang Wilayah</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-80 leading-relaxed">
                        Seluruh bidang tanah aset desa wajib sinkron dengan peta pertanahan nasional (BPN) untuk menghindari sengketa lahan di masa depan.
                    </p>
                </div>
                <div className="hidden lg:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 shadow-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Audit</span>
                </div>
            </div>
        </div>
    );
}
