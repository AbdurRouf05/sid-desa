"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { BkuTransaksi } from "@/types";
import { 
    Plus, Trash2, ArrowDownCircle, ArrowUpCircle, 
    RefreshCw, FileText, Printer, 
    FileSpreadsheet, Activity, ChevronRight,
    Search, Wallet, TrendingUp, TrendingDown,
    Receipt, Calendar
} from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PajakLog } from "@/types";
import { exportBkuToXlsx } from "@/lib/export-bku-xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { cn } from "@/lib/utils";

export default function TransaksiBkuPage() {
    const [data, setData] = useState<BkuTransaksi[]>([]);
    const [pajakData, setPajakData] = useState<PajakLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // PDF Export & Filter State
    const currentDate = new Date();
    const [filterBulan, setFilterBulan] = useState(String(currentDate.getMonth() + 1).padStart(2, '0'));
    const [filterTahun, setFilterTahun] = useState(String(currentDate.getFullYear()));
    const [filterTipe, setFilterTipe] = useState<string>("Semua");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [records, pajakRecords] = await Promise.all([
                pb.collection("bku_transaksi").getFullList<BkuTransaksi>({
                    sort: "-tanggal,-created",
                    expand: "rekening_sumber_id,rekening_tujuan_id"
                }),
                pb.collection("pajak_log").getFullList<PajakLog>({
                    sort: "-created",
                    expand: "bku_id"
                })
            ]);
            
            setData(records);
            setPajakData(pajakRecords);
        } catch (error) {
            console.error("Error fetching bku_transaksi", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Statistics Calculation (Based on Bansos Reference)
    const stats = useMemo(() => {
        let totalSaldo = 0;
        let masukBulanIni = 0;
        let keluarBulanIni = 0;
        
        const now = new Date();
        const m = now.getMonth();
        const y = now.getFullYear();

        data.forEach(item => {
            const itemDate = new Date(item.tanggal);
            const isThisMonth = itemDate.getMonth() === m && itemDate.getFullYear() === y;

            if (item.tipe_transaksi === "Masuk") {
                totalSaldo += item.nominal;
                if (isThisMonth) masukBulanIni += item.nominal;
            } else if (item.tipe_transaksi === "Keluar") {
                totalSaldo -= item.nominal;
                if (isThisMonth) keluarBulanIni += item.nominal;
            }
        });

        const pajakUnpaid = pajakData.filter(p => p.status === "Belum Disetor").reduce((acc, curr) => acc + curr.nominal_pajak, 0);

        return { totalSaldo, masukBulanIni, keluarBulanIni, pajakUnpaid };
    }, [data, pajakData]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.uraian.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTipe = filterTipe === "Semua" || item.tipe_transaksi === filterTipe;
            
            // Apply Period Filter for Listing (Matches selects)
            const d = new Date(item.tanggal);
            const matchesMonth = filterBulan === "Semua" || String(d.getMonth() + 1).padStart(2, '0') === filterBulan;
            const matchesYear = filterTahun === "Semua" || String(d.getFullYear()) === filterTahun;

            return matchesSearch && matchesTipe && matchesMonth && matchesYear;

        });
    }, [data, searchQuery, filterTipe, filterBulan, filterTahun]);

    const handleDelete = async (id: string) => {
        if (!window.confirm(`Hapus permanen log transaksi ini? Data pajak terkait juga akan dihapus.`)) return;
        try {
            const relatedPajak = await pb.collection("pajak_log").getFullList({ filter: `bku_id = "${id}"` });
            await Promise.all(relatedPajak.map(p => pb.collection("pajak_log").delete(p.id)));
            await pb.collection("bku_transaksi").delete(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleExportPDF = () => {
        if (filteredData.length === 0) {
            alert("Tidak ada transaksi untuk periode ini.");
            return;
        }

        const doc = new jsPDF('p', 'pt', 'a4');
        const margin = 40;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("BUKU KAS UMUM (BKU)", doc.internal.pageSize.width / 2, margin, { align: "center" });
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const monthNames = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const periodText = (filterBulan === "Semua" && filterTahun === "Semua") 
            ? "Seluruh Periode" 
            : `${filterBulan === "Semua" ? "Semua Bulan" : monthNames[parseInt(filterBulan)]} ${filterTahun === "Semua" ? "Semua Tahun" : filterTahun}`;
        
        doc.text(`Periode: ${periodText}`, doc.internal.pageSize.width / 2, margin + 15, { align: "center" });

        let totalPenerimaan = 0;
        let totalPengeluaran = 0;

        const tableData = filteredData.map((item, index) => {
            const dateStr = new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
            let penerimaan = "-";
            let pengeluaran = "-";
            if (item.tipe_transaksi === "Masuk") { penerimaan = item.nominal.toLocaleString('id-ID'); totalPenerimaan += item.nominal; }
            else if (item.tipe_transaksi === "Keluar") { pengeluaran = item.nominal.toLocaleString('id-ID'); totalPengeluaran += item.nominal; }
            else if (item.tipe_transaksi === "Pindah Buku") { penerimaan = item.nominal.toLocaleString('id-ID'); pengeluaran = item.nominal.toLocaleString('id-ID'); }
            return [index + 1, dateStr, item.uraian, penerimaan, pengeluaran];
        });

        autoTable(doc, {
            startY: margin + 30,
            head: [['No.', 'Tanggal', 'Uraian Kas', 'Penerimaan (Rp)', 'Pengeluaran (Rp)']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [51, 65, 85], textColor: 255 },
            styles: { fontSize: 9, cellPadding: 5 },
            columnStyles: { 0: { cellWidth: 30, halign: 'center' }, 1: { cellWidth: 70 }, 2: { cellWidth: 'auto' }, 3: { cellWidth: 80, halign: 'right' }, 4: { cellWidth: 80, halign: 'right' } },
            foot: [['', '', 'TOTAL MUTASI', totalPenerimaan.toLocaleString('id-ID'), totalPengeluaran.toLocaleString('id-ID')]],
            footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold', halign: 'right' }
        });
        doc.save(`BKU_${monthNames[parseInt(filterBulan)]}_${filterTahun}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-700">
            {/* Header Section (Bansos Inspired) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Buku Kas Umum</h1>
                    <p className="text-sm text-slate-500 mt-1">Audit trail real-time untuk transparansi keuangan desa.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={handleExportPDF}
                        className="h-10 px-4 flex items-center gap-2 bg-emerald-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-sm border border-white/5"
                    >
                        <Printer className="w-4 h-4" /> Cetak PDF
                    </button>
                    <Link href="/panel/dashboard/bku/transaksi/baru">
                        <button className="h-10 px-5 flex items-center gap-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-200 group">
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Catat Transaksi
                        </button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid (Bansos Inspired) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="flex items-center gap-3 mb-3 relative z-10">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                            <Wallet className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Saldo Kas</p>
                    </div>
                    <p className="text-xl font-black text-slate-900 tracking-tight font-mono relative z-10">Rp {stats.totalSaldo.toLocaleString('id-ID')}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Masuk (Bulan Ini)</p>
                    </div>
                    <p className="text-xl font-black text-blue-600 tracking-tight font-mono">Rp {stats.masukBulanIni.toLocaleString('id-ID')}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
                            <TrendingDown className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Keluar (Bulan Ini)</p>
                    </div>
                    <p className="text-xl font-black text-rose-600 tracking-tight font-mono">Rp {stats.keluarBulanIni.toLocaleString('id-ID')}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-5 rounded-3xl shadow-xl shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all group relative overflow-hidden text-white">
                    <div className="absolute right-0 top-0 p-4">
                        <Activity className="w-8 h-8 text-emerald-400/20 group-hover:animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3 mb-3 relative z-10">
                        <div className="p-2.5 bg-white/10 text-emerald-400 rounded-xl">
                            <Receipt className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em]">Titipan Pajak (Pending)</p>
                    </div>
                    <p className="text-xl font-black text-white tracking-tight font-mono relative z-10">Rp {stats.pajakUnpaid.toLocaleString('id-ID')}</p>
                </div>
            </div>

            {/* Content Table Card (Bansos Reference) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                {/* Search & Tabs Toolbar */}
                <div className="p-6 border-b border-slate-100 space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="relative group flex-1 max-w-xl">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari uraian transaksi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Period Selectors (High Density) */}
                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 h-12 px-4 group">
                            <Calendar className="w-4 h-4 text-slate-400 mr-1" />
                            <select
                                value={filterBulan}
                                onChange={(e) => setFilterBulan(e.target.value)}
                                className="bg-transparent text-[11px] font-black uppercase tracking-tight text-slate-600 outline-none cursor-pointer"
                            >
                                <option value="Semua">Semua Bulan</option>
                                <option value="01">Januari</option><option value="02">Februari</option><option value="03">Maret</option><option value="04">April</option><option value="05">Mei</option><option value="06">Juni</option><option value="07">Juli</option><option value="08">Agustus</option><option value="09">September</option><option value="10">Oktober</option><option value="11">November</option><option value="12">Desember</option>
                            </select>
                            <div className="w-px h-4 bg-slate-200 mx-2" />
                            <select
                                value={filterTahun}
                                onChange={(e) => setFilterTahun(e.target.value)}
                                className="bg-transparent text-[11px] font-black uppercase tracking-tight text-slate-600 outline-none cursor-pointer"
                            >
                                <option value="Semua">Semua Tahun</option>
                                {[...Array(5)].map((_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <option key={year} value={year}>{year}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    
                    {/* Activity Tabs (Bansos Inspired) */}
                    <div className="flex flex-wrap gap-2">
                        {["Semua", "Masuk", "Keluar", "Pindah Buku"].map((tipe) => (
                            <button
                                key={tipe}
                                onClick={() => setFilterTipe(tipe)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border outline-none flex items-center gap-2",
                                    filterTipe === tipe
                                        ? "bg-emerald-800 border-emerald-800 text-white shadow-lg shadow-emerald-900/10"
                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                {tipe}
                                {filterTipe === tipe && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-white text-[9px]">
                                        {filteredData.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50/30 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32 font-black">Tanggal</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32 font-black">Ref Jurnal</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-black">Keterangan / Uraian Kas</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right font-black">Nominal</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-10 font-black">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={5} rows={8} />
                            ) : filteredData.length === 0 ? (
                                <EmptyState colSpan={5} icon={Receipt} title="Nihil Transaksi" description="Belum ada aktivitas kas pada periode ini." />
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                                                {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(item.created).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit",
                                                item.tipe_transaksi === 'Masuk' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                item.tipe_transaksi === 'Keluar' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                            )}>
                                                {item.tipe_transaksi === 'Masuk' && <ArrowDownCircle className="w-3 h-3" />}
                                                {item.tipe_transaksi === 'Keluar' && <ArrowUpCircle className="w-3 h-3" />}
                                                {item.tipe_transaksi === 'Pindah Buku' && <RefreshCw className="w-3 h-3" />}
                                                {item.tipe_transaksi}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col min-w-0">
                                                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-tight group-hover:text-emerald-700 transition-colors truncate mb-1">
                                                    {item.uraian}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {(item.tipe_transaksi === 'Keluar' || item.tipe_transaksi === 'Pindah Buku') && (
                                                        <span className="text-[8px] font-black text-slate-400 uppercase">DARI: <span className="text-slate-600">{item.expand?.rekening_sumber_id?.nama_rekening || '-'}</span></span>
                                                    )}
                                                    {item.tipe_transaksi === 'Pindah Buku' && <ChevronRight className="w-2 h-2 text-slate-300" />}
                                                    {(item.tipe_transaksi === 'Masuk' || item.tipe_transaksi === 'Pindah Buku') && (
                                                        <span className="text-[8px] font-black text-slate-400 uppercase">KE: <span className="text-slate-600">{item.expand?.rekening_tujuan_id?.nama_rekening || '-'}</span></span>
                                                    )}
                                                </div>
                                                {item.bukti_file && (
                                                    <a href={pb.files.getUrl(item, item.bukti_file)} target="_blank" className="flex items-center gap-1 text-[8px] font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-wider mt-1.5 w-fit">
                                                        <FileText className="w-2.5 h-2.5" /> LIHAT DOKUMEN BUKTI
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={cn(
                                                "text-[13px] font-black tracking-tighter font-mono",
                                                item.tipe_transaksi === 'Masuk' ? 'text-emerald-600' :
                                                item.tipe_transaksi === 'Keluar' ? 'text-rose-600' : 'text-slate-900'
                                            )}>
                                                {item.tipe_transaksi === 'Keluar' ? '-' : item.tipe_transaksi === 'Masuk' ? '+' : ''}
                                                Rp {item.nominal.toLocaleString('id-ID')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-10">
                                            <div className="flex gap-1.5 justify-end items-center opacity-40 group-hover:opacity-100 transition-all">
                                                <Link href={`/panel/dashboard/bku/transaksi/${item.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100" title="Koreksi Transaksi">
                                                        <RefreshCw className="w-3.5 h-3.5" />
                                                    </button>
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100" title="Batalkan Jurnal">
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

            {/* Audit Status (Bansos Inspired) */}
            <div className="flex items-center gap-3 p-4 bg-emerald-950 text-white rounded-2xl shadow-xl shadow-emerald-950/10 group border border-white/5">
                <div className="relative">
                    <Activity className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-emerald-400/20 blur-lg rounded-full animate-pulse" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                        Sistem Validasi Keuangan Terintegrasi
                    </p>
                    <p className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest opacity-60">
                        Seluruh mutasi tercatat secara permanen dalam ledger pemerintah desa.
                    </p>
                </div>
            </div>
        </div>
    );
}
