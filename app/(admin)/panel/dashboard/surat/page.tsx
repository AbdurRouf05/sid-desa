"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { SuratKeluar } from "@/types";
// import { SectionHeading } from "@/components/ui/section-heading"; // Removed for layout consistency
import { Plus, Search, Trash2, Edit2, FileText, Download, Printer, Calendar, MapPin, FolderOpen } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
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
            case "Pengantar": return "bg-blue-100 text-blue-800 border-blue-200";
            case "SKTM": return "bg-orange-100 text-orange-800 border-orange-200";
            case "Domisili": return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "Keterangan Usaha": return "bg-purple-100 text-purple-800 border-purple-200";
            default: return "bg-slate-100 text-slate-800 border-slate-200";
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
        <main className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Buku Agenda Surat Keluar</h1>
                    <p className="text-sm text-slate-500 mt-1">Manajemen pendataan nomor registrasi surat layanan desa.</p>
                </div>
                <Link href="/panel/dashboard/surat/baru">
                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Tambah Surat
                    </button>
                </Link>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                    { label: "Total Surat", value: stats.Semua, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "SKTM", value: stats.SKTM, icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
                    { label: "Domisili", value: stats.Domisili, icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Pengantar", value: stats.Pengantar, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Lainnya", value: stats.Lainnya, icon: FolderOpen, color: "text-slate-600", bg: "bg-slate-50" },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className={cn("p-2.5 rounded-xl", s.bg)}>
                            <s.icon className={cn("w-5 h-5", s.color)} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                            <p className="text-lg font-black text-slate-800 leading-none mt-0.5">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                {/* Search & Tabs Toolbar */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-center">
                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari Nomor, NIK, atau Nama..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-medium"
                            />
                        </div>
                        
                        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit self-start lg:self-auto overflow-x-auto max-w-full no-scrollbar">
                            {["Semua", "Pengantar", "SKTM", "Domisili", "Keterangan Usaha", "Lainnya"].map((jenis) => (
                                <button
                                    key={jenis}
                                    onClick={() => setFilterJenis(jenis)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2",
                                        filterJenis === jenis 
                                            ? "bg-white text-emerald-700 shadow-sm border border-emerald-100"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {jenis}
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded-md text-[10px]",
                                        filterJenis === jenis ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-500"
                                    )}>
                                        {stats[jenis] || 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">No. Agenda & Tgl</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">Pemohon (Warga)</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">Klasifikasi</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <TableSkeleton columns={4} rows={6} />
                            ) : filteredData.length === 0 ? (
                                <EmptyState
                                    colSpan={4}
                                    icon={FileText}
                                    title="Pencatatan Tidak Ditemukan"
                                    description={searchQuery ? "Coba kata kunci lain atau pilih kategori lain." : "Halaman ini akan menampilkan daftar surat yang keluar."}
                                />
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-emerald-50/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-[11px] font-black text-slate-400 group-hover:text-emerald-700 transition-colors mb-1 uppercase">
                                                {item.nomor_agenda}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(item.tanggal_dibuat, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800 text-sm group-hover:text-emerald-900 transition-colors">{item.nama_pemohon}</div>
                                            <div className="text-[11px] text-slate-400 font-mono mt-0.5 tracking-tight">NIK {item.nik_pemohon}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight border",
                                                getJenisBadgeColor(item.jenis_surat)
                                            )}>
                                                {item.jenis_surat}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 justify-end">
                                                <Link href={`/panel/dashboard/surat/${item.id}/cetak`} target="_blank">
                                                    <button 
                                                        title="Cetak Blangko"
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <Link href={`/panel/dashboard/surat/${item.id}`}>
                                                    <button 
                                                        title="Edit Data"
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Hapus"
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
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
                
                {/* Table Footer / Info */}
                {!loading && filteredData.length > 0 && (
                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                        <span>Menampilkan {filteredData.length} dari {data.length} total surat</span>
                    </div>
                )}
            </div>
        </main>
    );
}
