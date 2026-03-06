"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { BkuTransaksi } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { Plus, Trash2, ArrowDownCircle, ArrowUpCircle, RefreshCw, FileText, Download, Printer, FileSpreadsheet } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PajakLog } from "@/types";
import { exportBkuToXlsx } from "@/lib/export-bku-xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TransaksiBkuPage() {
    const [data, setData] = useState<BkuTransaksi[]>([]);
    const [pajakData, setPajakData] = useState<PajakLog[]>([]);
    const [loading, setLoading] = useState(true);
    
    // PDF Export Filters
    const currentDate = new Date();
    const [filterBulan, setFilterBulan] = useState(String(currentDate.getMonth() + 1).padStart(2, '0'));
    const [filterTahun, setFilterTahun] = useState(String(currentDate.getFullYear()));

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("bku_transaksi").getFullList<BkuTransaksi>({
                sort: "-tanggal,-created",
                expand: "rekening_sumber_id,rekening_tujuan_id"
            });
            setData(records);

            // Fetch pajak data for XLSX export
            const pajakRecords = await pb.collection("pajak_log").getFullList<PajakLog>({
                sort: "-created",
                expand: "bku_id"
            });
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

    const handleDelete = async (id: string) => {
        if (!window.confirm(`Hapus permanen log transaksi ini? Data pajak terkait juga akan dihapus. Aksi ini akan mempengaruhi jumlah saldo berjalan.`)) return;
        try {
            // Cascade: delete related pajak_log records first
            const relatedPajak = await pb.collection("pajak_log").getFullList({ filter: `bku_id = "${id}"` });
            await Promise.all(relatedPajak.map(p => pb.collection("pajak_log").delete(p.id)));

            await pb.collection("bku_transaksi").delete(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Gagal menghapus transaksi.");
        }
    };

    const handleExportPDF = () => {
        // Filter data by selected month and year
        const filteredData = data.filter(item => {
            const date = new Date(item.tanggal);
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const y = String(date.getFullYear());
            return m === filterBulan && y === filterTahun;
        });

        if (filteredData.length === 0) {
            alert("Tidak ada transaksi pada periode ini untuk diekspor.");
            return;
        }

        const doc = new jsPDF('p', 'pt', 'a4');
        const margin = 40;

        // Kop Laporan
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("BUKU KAS UMUM (BKU)", doc.internal.pageSize.width / 2, margin, { align: "center" });
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const monthNames = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        doc.text(`Periode: ${monthNames[parseInt(filterBulan)]} ${filterTahun}`, doc.internal.pageSize.width / 2, margin + 15, { align: "center" });

        // Calculate Totals
        let totalPenerimaan = 0;
        let totalPengeluaran = 0;

        // Data processing for AutoTable
        const tableData = filteredData.map((item, index) => {
            const dateStr = new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
            let penerimaan = "-";
            let pengeluaran = "-";

            if (item.tipe_transaksi === "Masuk") {
                penerimaan = item.nominal.toLocaleString('id-ID');
                totalPenerimaan += item.nominal;
            } else if (item.tipe_transaksi === "Keluar") {
                pengeluaran = item.nominal.toLocaleString('id-ID');
                totalPengeluaran += item.nominal;
            } else if (item.tipe_transaksi === "Pindah Buku") {
                // Pindah buku tercatat di kedua kolom secara akuntansi
                penerimaan = item.nominal.toLocaleString('id-ID');
                pengeluaran = item.nominal.toLocaleString('id-ID');
            }

            return [
                index + 1,
                dateStr,
                item.uraian,
                penerimaan,
                pengeluaran
            ];
        });

        autoTable(doc, {
            startY: margin + 30,
            head: [['No.', 'Tanggal', 'Uraian Kas', 'Penerimaan (Rp)', 'Pengeluaran (Rp)']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [51, 65, 85], textColor: 255 },
            styles: { fontSize: 9, cellPadding: 5 },
            columnStyles: {
                0: { cellWidth: 30, halign: 'center' },
                1: { cellWidth: 70 },
                2: { cellWidth: 'auto' },
                3: { cellWidth: 80, halign: 'right' },
                4: { cellWidth: 80, halign: 'right' },
            },
            foot: [['', '', 'TOTAL MUTASI', totalPenerimaan.toLocaleString('id-ID'), totalPengeluaran.toLocaleString('id-ID')]],
            footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold', halign: 'right' }
        });

        // Signature Area
        const finalY = (doc as any).lastAutoTable.finalY || 0;
        doc.setFontSize(10);
        doc.text("Mengetahui,", doc.internal.pageSize.width - margin - 40, finalY + 40, { align: "center" });
        doc.text("Kepala Desa", doc.internal.pageSize.width - margin - 40, finalY + 55, { align: "center" });
        doc.text("(...................................)", doc.internal.pageSize.width - margin - 40, finalY + 110, { align: "center" });
        
        doc.text("Bendahara Desa", margin + 40, finalY + 55, { align: "center" });
        doc.text("(...................................)", margin + 40, finalY + 110, { align: "center" });

        doc.save(`BKU_${monthNames[parseInt(filterBulan)]}_${filterTahun}.pdf`);
    };

    return (
        <main>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <SectionHeading 
                    title="Buku Kas Umum" 
                    subtitle="Monitor aliran dana Masuk (Debet) dan Keluar (Kredit) Pemerintahan Desa." 
                />
                <div className="flex flex-col sm:flex-row gap-2 items-end">
                    <div className="flex gap-2">
                        <select 
                            value={filterBulan} 
                            onChange={(e) => setFilterBulan(e.target.value)}
                            className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        >
                            <option value="01">Januari</option>
                            <option value="02">Februari</option>
                            <option value="03">Maret</option>
                            <option value="04">April</option>
                            <option value="05">Mei</option>
                            <option value="06">Juni</option>
                            <option value="07">Juli</option>
                            <option value="08">Agustus</option>
                            <option value="09">September</option>
                            <option value="10">Oktober</option>
                            <option value="11">November</option>
                            <option value="12">Desember</option>
                        </select>
                        <select 
                            value={filterTahun} 
                            onChange={(e) => setFilterTahun(e.target.value)}
                            className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        >
                            {[...Array(5)].map((_, i) => {
                                const year = new Date().getFullYear() - i;
                                return <option key={year} value={year}>{year}</option>
                            })}
                        </select>
                        <button 
                            onClick={handleExportPDF}
                            disabled={data.length === 0}
                            className="h-10 px-4 flex items-center gap-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            <Printer className="w-4 h-4" /> Cetak PDF
                        </button>
                        <button 
                            onClick={() => exportBkuToXlsx({ transactions: data, pajakData, bulan: filterBulan, tahun: filterTahun })}
                            disabled={data.length === 0}
                            className="h-10 px-4 flex items-center gap-2 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                            <FileSpreadsheet className="w-4 h-4" /> Ekspor Excel
                        </button>
                    </div>
                    
                    <Link href="/panel/dashboard/bku/transaksi/baru">
                        <TactileButton variant="primary">
                            <Plus className="w-5 h-5 mr-2" />
                            Catat Transaksi
                        </TactileButton>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Tanggal</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Tipe & Uraian</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Rekening</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Nominal</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={5} rows={5} />
                            ) : data.length === 0 ? (
                                <EmptyState
                                    colSpan={5}
                                    icon={FileText}
                                    title="Buku Kas masih kosong"
                                    description="Belum ada catatan aktivitas masuk/keluar terkait dana kas dompet."
                                />
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 text-sm text-slate-600 font-medium whitespace-nowrap">
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <div className="flex gap-3">
                                                <div className="mt-1 flex-shrink-0">
                                                    {item.tipe_transaksi === 'Masuk' && <ArrowDownCircle className="w-5 h-5 text-emerald-500" />}
                                                    {item.tipe_transaksi === 'Keluar' && <ArrowUpCircle className="w-5 h-5 text-red-500" />}
                                                    {item.tipe_transaksi === 'Pindah Buku' && <RefreshCw className="w-5 h-5 text-blue-500" />}
                                                </div>
                                                <div>
                                                    <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${
                                                        item.tipe_transaksi === 'Masuk' ? 'text-emerald-600' :
                                                        item.tipe_transaksi === 'Keluar' ? 'text-red-600' : 'text-blue-600'
                                                    }`}>{item.tipe_transaksi}</span>
                                                    <p className="text-sm font-medium text-slate-800 line-clamp-2">{item.uraian}</p>
                                                    
                                                    {item.bukti_file && (
                                                        <a 
                                                            href={pb.files.getUrl(item, item.bukti_file)} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex mt-2 items-center text-xs font-medium text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded-md"
                                                        >
                                                            <FileText className="w-3 h-3 mr-1" /> Nota/Bukti terlampir
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm whitespace-nowrap">
                                            {item.tipe_transaksi === 'Masuk' && (
                                                <span className="bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded-md text-xs">
                                                    Ke: {item.expand?.rekening_tujuan_id?.nama_rekening || '-'}
                                                </span>
                                            )}
                                            {item.tipe_transaksi === 'Keluar' && (
                                                <span className="bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded-md text-xs">
                                                    Dari: {item.expand?.rekening_sumber_id?.nama_rekening || '-'}
                                                </span>
                                            )}
                                            {item.tipe_transaksi === 'Pindah Buku' && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-slate-500">Dari: {item.expand?.rekening_sumber_id?.nama_rekening || '-'}</span>
                                                    <span className="text-xs text-slate-800 font-medium">Ke: {item.expand?.rekening_tujuan_id?.nama_rekening || '-'}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className={`font-bold whitespace-nowrap ${
                                                item.tipe_transaksi === 'Masuk' ? 'text-emerald-600' :
                                                item.tipe_transaksi === 'Keluar' ? 'text-red-600' : 'text-slate-700'
                                            }`}>
                                                {item.tipe_transaksi === 'Keluar' && '- '}
                                                {item.tipe_transaksi === 'Masuk' && '+ '}
                                                Rp {item.nominal.toLocaleString('id-ID')}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 justify-end">
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
        </main>
    );
}
