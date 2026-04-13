"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { SuratKeluar } from "@/types";
import { Plus, Search, Trash2, Edit2, FileText, Download, Printer, Calendar, MapPin, FolderOpen, Mail, Send, Inbox, Tag } from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/number-utils";
import { cn } from "@/lib/utils";

export default function SuratKeluarPage() {
    const [data, setData] = useState<SuratKeluar[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterJenis, setFilterJenis] = useState<string>("Semua");

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("surat_keluar").getFullList<SuratKeluar>({
                sort: "-tanggal_dibuat",
            });
            setData(records);
        } catch (error) {
            console.error("Error fetching surat_keluar", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Hapus catatan surat keluar ini dari sistem?")) return;
        try {
            await pb.collection("surat_keluar").delete(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Gagal menghapus data.");
        }
    };

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = 
                item.nama_pemohon.toLowerCase().includes(searchQuery.toLowerCase()) || 
                item.nomor_agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.nik_pemohon.includes(searchQuery);
            const matchesFilter = filterJenis === "Semua" || item.jenis_surat === filterJenis;
            return matchesSearch && matchesFilter;
        });
    }, [data, searchQuery, filterJenis]);

    const getJenisBadgeColor = (jenis: string) => {
        switch (jenis) {
            case "Pengantar": return "bg-blue-50 text-blue-600 border-blue-100";
            case "SKTM": return "bg-orange-50 text-orange-600 border-orange-100";
            case "Domisili": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Keterangan Usaha": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };

    const stats = useMemo(() => {
        const categories = ["Pengantar", "SKTM", "Domisili", "Keterangan Usaha"];
        const counts: Record<string, number> = { Semua: data.length };
        categories.forEach(cat => {
            counts[cat] = data.filter(d => d.jenis_surat === cat).length;
        });
        counts["Lainnya"] = data.filter(d => !categories.includes(d.jenis_surat)).length;
        return counts;
    }, [data]);

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Agenda Surat Keluar</h1>
                    <p className="text-sm text-slate-500 mt-1">Manajemen pendataan nomor registrasi surat layanan desa.</p>
                </div>
                <Link href="/panel/dashboard/surat/baru" className="w-full md:w-auto">
                    <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm w-full md:w-auto">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Tambah Surat
                    </button>
                </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                    { label: "Total Surat", value: stats.Semua, icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "SKTM", value: stats.SKTM, icon: Send, color: "text-orange-600", bg: "bg-orange-50" },
                    { label: "Domisili", value: stats.Domisili, icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Pengantar", value: stats.Pengantar, icon: Inbox, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Lainnya", value: stats.Lainnya, icon: FolderOpen, color: "text-slate-600", bg: "bg-slate-50" },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-slate-200 group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={cn("p-2 rounded-lg transition-all", s.bg)}>
                                <s.icon className={cn("w-4 h-4", s.color)} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</p>
                        </div>
                        <p className="text-xl font-black text-slate-900 tracking-tight">{s.value}</p>
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
                            placeholder="Cari Nomor, NIK, atau Nama..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {["Semua", "Pengantar", "SKTM", "Domisili", "Keterangan Usaha", "Lainnya"].map((jenis) => (
                            <button
                                key={jenis}
                                onClick={() => setFilterJenis(jenis)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 outline-none",
                                    filterJenis === jenis 
                                        ? "bg-emerald-800 border-emerald-800 text-white shadow-md shadow-emerald-900/10"
                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                {jenis}
                                <span className={cn(
                                    "ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black",
                                    filterJenis === jenis ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                                )}>
                                    {stats[jenis] || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No. Agenda & Tgl</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pemohon (Warga)</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Klasifikasi Surat</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Memuat data agenda...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-200">
                                            <FileText className="w-12 h-12" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                                {searchQuery ? "Surat tidak ditemukan." : "Halaman ini akan menampilkan daftar surat keluar."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-[10px] font-black text-slate-400 group-hover:text-emerald-700 transition-colors mb-1 uppercase tracking-tighter">
                                                {item.nomor_agenda}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                                <Calendar className="w-3 h-3 text-slate-300" />
                                                {formatDate(item.tanggal_dibuat, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800 text-sm">{item.nama_pemohon}</div>
                                            <div className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-tight uppercase">NIK {item.nik_pemohon}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                                                getJenisBadgeColor(item.jenis_surat)
                                            )}>
                                                {item.jenis_surat}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <div className="flex gap-2 justify-end">
                                                <Link href={`/panel/dashboard/surat/${item.id}/cetak`} target="_blank">
                                                    <button 
                                                        title="Cetak Blangko"
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <Link href={`/panel/dashboard/surat/${item.id}`}>
                                                    <button 
                                                        title="Edit Data"
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Hapus"
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
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
