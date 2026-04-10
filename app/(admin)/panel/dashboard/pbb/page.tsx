"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { PbbWarga } from "@/types";
import { Plus, Search, Trash2, Edit2, Download, CheckCircle, Clock } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { formatRupiah, formatDate } from "@/lib/number-utils";

export default function PbbPage() {
    const [data, setData] = useState<PbbWarga[]>([]);
    const [loading, setLoading] = useState(true);
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pajak Bumi & Bangunan (PBB)</h1>
                    <p className="text-slate-500">Rekapitulasi setoran pajak warga per dusun.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <TactileButton variant="secondary" onClick={handleExportCsv} disabled={filteredData.length === 0}>
                        <Download className="w-5 h-5 mr-2" />
                        Export Laporan CSV
                    </TactileButton>
                    <Link href="/panel/dashboard/pbb/baru">
                        <TactileButton variant="primary">
                            <Plus className="w-5 h-5 mr-2" />
                            Catat Pajak
                        </TactileButton>
                    </Link>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Target PBB ({filterDusun})</p>
                    <h3 className="text-2xl font-bold text-slate-800">{formatRupiah(summary.totalTagihan)}</h3>
                </div>
                <div className="bg-emerald-50 p-5 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden">
                    <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">Total Terealisasi</p>
                    <h3 className="text-2xl font-bold text-emerald-700">{formatRupiah(summary.totalSetor)}</h3>
                </div>
                <div className="bg-orange-50 p-5 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden">
                    <p className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">Sisa Tagihan Belum Lunas</p>
                    <h3 className="text-2xl font-bold text-orange-700">{formatRupiah(summary.sisaTagihan)}</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Progres Pembayaran</p>
                     <h3 className="text-2xl font-bold text-slate-800">
                         {filteredData.length > 0 ? Math.round((summary.countLunas / filteredData.length) * 100) : 0}%
                     </h3>
                     <p className="text-xs text-slate-400">{summary.countLunas} dari {filteredData.length} Wajib Pajak</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                    <div className="relative w-full md:w-96 shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari NOP atau Nama Wajib Pajak..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>
                    
                    <div className="flex gap-2 self-start md:self-auto overflow-x-auto pb-2 md:pb-0 w-full custom-scrollbar">
                        {uniqueDusun.map((dusun) => (
                            <button
                                key={dusun}
                                onClick={() => setFilterDusun(dusun)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
                                    filterDusun === dusun 
                                        ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {dusun === "Semua" ? "Semua Dusun" : dusun}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">NOP / Nama</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Status</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Tagihan & Denda</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Koordinator</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={5} rows={4} />
                            ) : filteredData.length === 0 ? (
                                <EmptyState
                                    colSpan={5}
                                    title="Belum ada data PBB"
                                    description={filterDusun !== "Semua" ? `Data tagihan PBB untuk koordinator ${filterDusun} belum tercatat.` : "Mulai catat setoran PBB warga."}
                                />
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{item.nama_wajib_pajak}</div>
                                            <div className="text-sm text-slate-500 font-mono mt-1">
                                                {item.nop}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {item.status_pembayaran === "Lunas" ? (
                                                <div>
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200">
                                                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Lunas
                                                    </span>
                                                    <div className="text-[11px] text-slate-400 mt-1">
                                                        {item.tanggal_bayar ? formatDate(item.tanggal_bayar, { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-orange-100 text-orange-800 border-orange-200">
                                                    <Clock className="w-3.5 h-3.5 mr-1" /> Belum Lunas
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{formatRupiah(item.nominal_tagihan)}</div>
                                            {(item.denda || 0) > 0 && (
                                                <div className="text-xs text-red-500 font-medium mt-1">
                                                    + Denda: {formatRupiah(item.denda || 0)}
                                                </div>
                                            )}
                                            {item.status_pembayaran === "Lunas" && (
                                                <div className="text-[11px] font-bold text-emerald-600 mt-1">
                                                    Setor: {formatRupiah(item.nominal_tagihan + (item.denda || 0))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                                                {item.dusun_koordinator}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 justify-end">
                                                <Link href={`/panel/dashboard/pbb/${item.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Edit Data">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
