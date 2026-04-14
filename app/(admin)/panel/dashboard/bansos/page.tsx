"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { PenerimaBansos } from "@/types";
import { Plus, Search, Trash2, Edit2, Users, FileText, Calendar, ShieldCheck, Activity, FileSpreadsheet } from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { ImportBansosDialog } from "@/components/admin/bansos/import-dialog";

export default function BansosPage() {
    const [data, setData] = useState<PenerimaBansos[]>([]);
    const [kategori, setKategori] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterJenis, setFilterJenis] = useState<string>("Semua");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bansosRecords, kategoriRecords] = await Promise.all([
                pb.collection("penerima_bansos").getFullList<PenerimaBansos>({
                    sort: "-created",
                    expand: "jenis_bantuan",
                }),
                pb.collection("kategori_bantuan").getFullList({
                    sort: "nama",
                })
            ]);
            
            setData(bansosRecords);
            setKategori(kategoriRecords);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data penerima bansos ini?")) return;
        try {
            await pb.collection("penerima_bansos").delete(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Gagal menghapus data.");
        }
    };

    const allCategories = useMemo(() => {
        const fromDB = kategori.map(k => k.nama);
        return ["Semua", ...fromDB];
    }, [kategori]);

    const stats = useMemo(() => {
        const total = data.length;
        const breakdown = data.reduce((acc: any, curr) => {
            const namaBantuan = curr.expand?.jenis_bantuan?.nama || "Lainnya";
            acc[namaBantuan] = (acc[namaBantuan] || 0) + 1;
            return acc;
        }, {});
        return { total, breakdown };
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                   (item.nik && item.nik.includes(searchQuery));
            const matchesFilter = filterJenis === "Semua" || 
                                   (item.expand?.jenis_bantuan?.nama === filterJenis);
            return matchesSearch && matchesFilter;
        });
    }, [data, searchQuery, filterJenis]);

    const getJenisBadgeColor = (jenis: string) => {
        if (!jenis) return "bg-slate-50 text-slate-400 border-slate-100";
        const colors = [
            "bg-blue-50 text-blue-600 border-blue-100",
            "bg-emerald-50 text-emerald-600 border-emerald-100",
            "bg-amber-50 text-amber-600 border-amber-100",
            "bg-rose-50 text-rose-600 border-rose-100",
            "bg-emerald-50 text-emerald-600 border-emerald-100"
        ];
        let hash = 0;
        for (let i = 0; i < jenis.length; i++) hash = jenis.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Penerima Bansos</h1>
                    <p className="text-sm text-slate-500 mt-1">Pusat pengelolaan data bantuan sosial warga desa.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <ImportBansosDialog onComplete={fetchData} />
                    
                    <Link href="/panel/dashboard/bansos/baru" className="w-full md:w-auto">
                        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm w-full md:w-auto">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            Tambah Penerima
                        </button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-slate-200 group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Users className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Penerima</p>
                    </div>
                    <p className="text-xl font-black text-emerald-700 tracking-tight">{stats.total}</p>
                </div>

                {kategori.slice(0, 3).map((cat, idx) => (
                    <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-slate-200 group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={cn(
                                "p-2 rounded-lg",
                                idx === 0 ? "bg-emerald-50 text-emerald-600" : 
                                idx === 1 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                                <Activity className="w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] line-clamp-1">{cat.nama}</p>
                        </div>
                        <p className="text-xl font-black text-emerald-700 tracking-tight">{stats.breakdown[cat.nama] || 0}</p>
                    </div>
                ))}
            </div>

            {/* Content Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                {/* Search & Tabs Toolbar */}
                <div className="p-5 border-b border-slate-100 space-y-6">
                    <div className="relative group max-w-xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari NIK atau Nama Lengkap..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {allCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilterJenis(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 outline-none",
                                    filterJenis === cat
                                        ? "bg-emerald-800 border-emerald-800 text-white shadow-md shadow-emerald-900/10"
                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                {cat}
                                {filterJenis === cat && <span className="ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-white/20 text-white">{filteredData.length}</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Informasi Penerima</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jenis Bantuan</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Periode</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Sinkronisasi data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-200">
                                            <Users className="w-12 h-12" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Penerima tidak ditemukan.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 uppercase tracking-tight text-sm mb-0.5 group-hover:text-emerald-700 transition-colors">{item.nama}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                NIK: {item.nik}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                                                getJenisBadgeColor(item.expand?.jenis_bantuan?.nama || "")
                                            )}>
                                                {item.expand?.jenis_bantuan?.nama || "Umum"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-600 shadow-sm">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                Tahun {item.tahun_penerimaan}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <div className="flex gap-2 justify-end items-center opacity-40 group-hover:opacity-100 transition-all">
                                                <Link href={`/panel/dashboard/bansos/${item.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100" title="Edit Data">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                    title="Hapus Data"
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
