"use client";

import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { MutasiPenduduk } from "@/types";
import { Plus, Search, Trash2, Edit2, FileText, Download, Users } from "lucide-react";
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
            case "Lahir": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "Mati": return "bg-red-50 text-red-700 border-red-100";
            case "Datang": return "bg-blue-50 text-blue-700 border-blue-100";
            case "Pergi": return "bg-orange-50 text-orange-700 border-orange-100";
            default: return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    const handleExportWord = async () => {
        if (filteredData.length === 0) {
            alert("Tidak ada data untuk diekspor");
            return;
        }

        const tableRows = [
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ text: "No", alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: "Tanggal", alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: "NIK", alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: "Nama Lengkap", alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: "Jenis Mutasi", alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: "Keterangan", alignment: AlignmentType.CENTER })] }),
                ],
            }),
            ...filteredData.map((item, index) => 
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })] }),
                        new TableCell({ children: [new Paragraph({ text: formatDate(item.tanggal_mutasi, { day: 'numeric', month: 'short', year: 'numeric' }) })] }),
                        new TableCell({ children: [new Paragraph({ text: item.nik || "-" })] }),
                        new TableCell({ children: [new Paragraph({ text: item.nama_lengkap })] }),
                        new TableCell({ children: [new Paragraph({ text: item.jenis_mutasi })] }),
                        new TableCell({ children: [new Paragraph({ text: item.keterangan || "-" })] }),
                    ]
                })
            )
        ];

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: "Laporan Mutasi Penduduk",
                        heading: "Heading1",
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }),
                    new Table({
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        rows: tableRows,
                    }),
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Laporan-Mutasi-Penduduk-${new Date().toISOString().split('T')[0]}.docx`);
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Mutasi Penduduk</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola riwayat kelahiran, kematian, kedatangan, dan kepindahan warga.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleExportWord}
                        disabled={filteredData.length === 0}
                        className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Cetak Word
                    </button>
                    <Link
                        href="/panel/dashboard/mutasi/baru"
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Tambah Mutasi
                    </Link>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari NIK atau Nama Lengkap..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    
                    <div className="flex gap-2 self-start md:self-auto overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
                        {["Semua", "Lahir", "Mati", "Datang", "Pergi"].map((jenis) => (
                            <button
                                key={jenis}
                                onClick={() => setFilterJenis(jenis)}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                                    filterJenis === jenis 
                                        ? "bg-emerald-800 border-emerald-800 text-white shadow-md shadow-emerald-900/10"
                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
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
                            <tr className="border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tanggal</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Lengkap & NIK</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jenis Mutasi</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dokumen</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</th>
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
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {formatDate(item.tanggal_mutasi, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-sm text-slate-900">{item.nama_lengkap}</div>
                                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                                                NIK: {item.nik || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border",
                                                getJenisBadgeColor(item.jenis_mutasi)
                                            )}>
                                                {item.jenis_mutasi}
                                            </span>
                                            {item.keterangan && (
                                                <p className="text-[10px] text-slate-400 mt-1.5 max-w-[200px] truncate" title={item.keterangan}>
                                                    {item.keterangan}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.dokumen_bukti ? (
                                                <a 
                                                    href={pb.files.getUrl(item, item.dokumen_bukti)} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
                                                >
                                                    <FileText className="w-3.5 h-3.5" /> Lihat File
                                                </a>
                                            ) : (
                                                <span className="text-[10px] text-slate-300 flex items-center gap-1.5 font-medium">
                                                    <FileText className="w-3.5 h-3.5" /> Tidak ada
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 justify-end">
                                                <Link href={`/panel/dashboard/mutasi/${item.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
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
