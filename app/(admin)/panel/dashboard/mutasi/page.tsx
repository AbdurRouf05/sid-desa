"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { MutasiPenduduk } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { Plus, Search, Trash2, Edit2, FileText, Download, Users } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/number-utils";
import { cn } from "@/lib/utils";

export default function MutasiPendudukPage() {
    const [data, setData] = useState<MutasiPenduduk[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterJenis, setFilterJenis] = useState<string>("Semua");

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("mutasi_penduduk").getFullList<MutasiPenduduk>({
                sort: "-tanggal_mutasi",
            });
            setData(records);
        } catch (error) {
            console.error("Error fetching mutasi_penduduk", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data mutasi ini?")) return;
        try {
            await pb.collection("mutasi_penduduk").delete(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Gagal menghapus data mutasi.");
        }
    };

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  (item.nik && item.nik.includes(searchQuery));
            const matchesFilter = filterJenis === "Semua" || item.jenis_mutasi === filterJenis;
            return matchesSearch && matchesFilter;
        });
    }, [data, searchQuery, filterJenis]);

    const getJenisBadgeColor = (jenis: string) => {
        switch (jenis) {
            case "Lahir": return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "Mati": return "bg-red-100 text-red-800 border-red-200";
            case "Datang": return "bg-blue-100 text-blue-800 border-blue-200";
            case "Pergi": return "bg-orange-100 text-orange-800 border-orange-200";
            default: return "bg-slate-100 text-slate-800 border-slate-200";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <SectionHeading title="Mutasi Penduduk" subtitle="Kelola riwayat kelahiran, kematian, kedatangan, dan kepindahan warga." />
                <div className="flex gap-2">
                    <Link href="/panel/dashboard/mutasi/baru">
                        <TactileButton variant="primary">
                            <Plus className="w-5 h-5 mr-2" />
                            Tambah Mutasi
                        </TactileButton>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari NIK atau Nama Lengkap..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>
                    
                    <div className="flex gap-2 self-start md:self-auto overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
                        {["Semua", "Lahir", "Mati", "Datang", "Pergi"].map((jenis) => (
                            <button
                                key={jenis}
                                onClick={() => setFilterJenis(jenis)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
                                    filterJenis === jenis 
                                        ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {jenis}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Tanggal</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Nama Lengkap & NIK</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Jenis Mutasi</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Dokumen</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={5} rows={4} />
                            ) : filteredData.length === 0 ? (
                                <EmptyState
                                    colSpan={5}
                                    icon={Users}
                                    title="Tidak ada data mutasi"
                                    description="Data mutasi yang direkam akan tampil di sini."
                                />
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 text-slate-600">
                                            {formatDate(item.tanggal_mutasi, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{item.nama_lengkap}</div>
                                            <div className="text-sm text-slate-500 flex justify-between items-center group-hover:text-slate-600">
                                                <span>NIK: {item.nik || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold border",
                                                getJenisBadgeColor(item.jenis_mutasi)
                                            )}>
                                                {item.jenis_mutasi}
                                            </span>
                                            {item.keterangan && (
                                                <p className="text-xs text-slate-500 mt-2 max-w-[200px] truncate" title={item.keterangan}>
                                                    {item.keterangan}
                                                </p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {item.dokumen_bukti ? (
                                                <a 
                                                    href={pb.files.getUrl(item, item.dokumen_bukti)} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors border border-blue-100"
                                                >
                                                    <FileText className="w-3.5 h-3.5" /> Lihat File
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 opacity-50" /> Tidak ada
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 justify-end">
                                                <Link href={`/panel/dashboard/mutasi/${item.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
