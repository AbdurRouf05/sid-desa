"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { PbbWarga } from "@/types";
import { Plus, Search, Trash2, Edit2, Download, CheckCircle, Clock, PieChart, Target, Wallet, History, Loader2 as Spinner } from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { formatRupiah, formatDate } from "@/lib/number-utils";
import { toast } from "sonner";

export default function PbbPage() {
    const [data, setData] = useState<PbbWarga[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDusun, setFilterDusun] = useState<string>("Semua");

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("pbb_warga").getFullList<PbbWarga>({
                sort: "-created",
            });
            setData(records);
        } catch (error) {
            console.error("Error fetching PBB data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus catatan PBB ini?")) return;
        try {
            await pb.collection("pbb_warga").delete(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Gagal menghapus catatan PBB.");
        }
    };

    const handleMarkAsPaid = async (item: PbbWarga) => {
        setUpdatingId(item.id);
        try {
            await pb.collection("pbb_warga").update(item.id, {
                status_pembayaran: "Lunas",
                tanggal_bayar: new Date().toISOString()
            });
            toast.success(`PBB ${item.nama_wajib_pajak} berhasil ditandai LUNAS.`);
            fetchData();
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Gagal mengubah status pembayaran.");
        } finally {
            setUpdatingId(null);
        }
    };

    const uniqueDusun = useMemo(() => {
        const dusunList = data.map(item => item.dusun_koordinator);
        return ["Semua", ...Array.from(new Set(dusunList))];
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.nama_wajib_pajak.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                   (item.nop && item.nop.includes(searchQuery));
            const matchesFilter = filterDusun === "Semua" || item.dusun_koordinator === filterDusun;
            return matchesSearch && matchesFilter;
        });
    }, [data, searchQuery, filterDusun]);

    const handleExportCsv = () => {
        if (filteredData.length === 0) {
            alert("Tidak ada data untuk diekspor");
            return;
        }

        const headers = ["NOP", "Nama Wajib Pajak", "Dusun/Koordinator", "Status", "Tagihan Pokok", "Denda", "Total Setor", "Tanggal Bayar"];
        const rows = filteredData.map(item => {
            const total = item.nominal_tagihan + (item.denda || 0);
            return [
                `"${item.nop}"`,
                `"${item.nama_wajib_pajak}"`,
                `"${item.dusun_koordinator}"`,
                item.status_pembayaran,
                item.nominal_tagihan,
                item.denda || 0,
                item.status_pembayaran === "Lunas" ? total : 0,
                item.tanggal_bayar ? formatDate(item.tanggal_bayar) : "-"
            ].join(",");
        });

        const csvString = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Laporan_PBB_${filterDusun}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate Summary
    const summary = useMemo(() => {
        return filteredData.reduce((acc, curr) => {
            acc.totalTagihan += curr.nominal_tagihan;
            if (curr.status_pembayaran === "Lunas") {
                acc.totalSetor += curr.nominal_tagihan + (curr.denda || 0);
                acc.totalDenda += (curr.denda || 0);
                acc.countLunas += 1;
            } else {
                acc.sisaTagihan += curr.nominal_tagihan;
            }
            return acc;
        }, { totalTagihan: 0, totalSetor: 0, totalDenda: 0, sisaTagihan: 0, countLunas: 0 });
    }, [filteredData]);

    const progressPercent = filteredData.length > 0 ? Math.round((summary.countLunas / filteredData.length) * 100) : 0;

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Pajak Bumi & Bangunan (PBB)</h1>
                    <p className="text-sm text-slate-500 mt-1">Rekapitulasi setoran pajak warga per dusun.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button
                        onClick={handleExportCsv}
                        disabled={filteredData.length === 0}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl font-bold border border-slate-200 shadow-sm transition-all active:scale-95 disabled:opacity-50 text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export Laporan
                    </button>
                    <Link
                        href="/panel/dashboard/pbb/baru"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Catat Pajak
                    </Link>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:border-slate-200 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                            <Target className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target PBB</p>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{formatRupiah(summary.totalTagihan)}</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{filterDusun === "Semua" ? "Seluruh Desa" : `Koordinator ${filterDusun}`}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:border-emerald-100 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            <Wallet className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.2em]">Realisasi</p>
                    </div>
                    <h3 className="text-xl font-black text-emerald-700 tracking-tight">{formatRupiah(summary.totalSetor)}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-black text-emerald-500 uppercase">{progressPercent}%</span>
                        <div className="flex-1 h-1 bg-emerald-100 rounded-full overflow-hidden max-w-[60px]">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:border-orange-100 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-all">
                            <History className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-orange-600/60 uppercase tracking-[0.2em]">Sisa Tagihan</p>
                    </div>
                    <h3 className="text-xl font-black text-orange-700 tracking-tight">{formatRupiah(summary.sisaTagihan)}</h3>
                    <p className="text-[10px] font-bold text-orange-400 mt-1 uppercase tracking-wider">Belum Penagihan</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:border-emerald-100 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            <PieChart className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.2em]">Capaian</p>
                    </div>
                    <h3 className="text-xl font-black text-emerald-900 tracking-tight">{summary.countLunas} / {filteredData.length}</h3>
                    <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase tracking-wider">Wajib Pajak Lunas</p>
                </div>
            </div>

            {/* List Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                {/* Search & Tabs */}
                <div className="p-5 border-b border-slate-100 space-y-6">
                    <div className="relative group max-w-xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari NOP atau Nama Wajib Pajak..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {uniqueDusun.map((dusun) => (
                            <button
                                key={dusun}
                                onClick={() => setFilterDusun(dusun)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 outline-none",
                                    filterDusun === dusun 
                                        ? "bg-emerald-800 border-emerald-800 text-white shadow-md shadow-emerald-900/10"
                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                {dusun === "Semua" ? "Semua Dusun" : dusun}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NOP / Nama</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tagihan & Denda</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Koordinator</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Memuat data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Wallet className="w-12 h-12 text-slate-200" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                                {filterDusun !== "Semua" ? `Data untuk koordinator ${filterDusun} tidak ditemukan.` : "Belum ada catatan pajak."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm text-slate-900">{item.nama_wajib_pajak}</p>
                                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-wider uppercase">{item.nop}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.status_pembayaran === "Lunas" ? (
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Lunas
                                                    </span>
                                                    <p className="text-[9px] font-bold text-slate-400 tracking-wider">
                                                        {item.tanggal_bayar ? formatDate(item.tanggal_bayar, { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100">
                                                    <Clock className="w-3 h-3 mr-1" /> Tertunggak
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm text-slate-800">{formatRupiah(item.nominal_tagihan)}</p>
                                            {(item.denda || 0) > 0 && (
                                                <p className="text-[10px] font-black text-red-500/80 uppercase tracking-tighter mt-0.5 animate-pulse">
                                                    + Denda {formatRupiah(item.denda || 0)}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-100">
                                                {item.dusun_koordinator}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <div className="flex gap-2 justify-end items-center opacity-40 group-hover:opacity-100 transition-opacity">
                                                {item.status_pembayaran !== "Lunas" && (
                                                    <button
                                                        onClick={() => handleMarkAsPaid(item)}
                                                        disabled={updatingId === item.id}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                                                        title="Tandai Sudah Bayar (Lunas)"
                                                    >
                                                        {updatingId === item.id ? <Spinner className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/panel/dashboard/pbb/${item.id}`}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                                    title="Edit Data"
                                                >
                                                    <Edit2 className="w-4 h-4" />
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
