"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { SuratKeluar } from "@/types";
// import { SectionHeading } from "@/components/ui/section-heading"; // Removed for layout consistency
import { Plus, Search, Trash2, Edit2, FileText, Download, Printer } from "lucide-react";
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

    return (
        <main>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Buku Agenda Surat Keluar</h1>
                    <p className="text-slate-500">Manajemen pendataan nomor registrasi surat layanan desa.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/panel/dashboard/surat/baru">
                        <TactileButton variant="primary">
                            <Plus className="w-5 h-5 mr-2" />
                            Tambah Surat
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
                            placeholder="Cari Nomor, NIK, atau Nama..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>
                    
                    <div className="flex gap-2 self-start md:self-auto overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
                        {["Semua", "Pengantar", "SKTM", "Domisili", "Keterangan Usaha", "Lainnya"].map((jenis) => (
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
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">No. Surat & Tgl</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Pemohon</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Jenis Surat</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Arsip PDF</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={5} rows={4} />
                            ) : filteredData.length === 0 ? (
                                <EmptyState
                                    colSpan={5}
                                    icon={FileText}
                                    title="Belum ada surat diregister"
                                    description="Draf surat keluar akan tampil di sini saat admin membuat surat."
                                />
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2 py-1 inline-block mb-1">
                                                {item.nomor_agenda}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {formatDate(item.tanggal_dibuat, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{item.nama_pemohon}</div>
                                            <div className="text-sm text-slate-500 flex justify-between items-center group-hover:text-slate-600">
                                                <span>NIK: {item.nik_pemohon}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold border",
                                                getJenisBadgeColor(item.jenis_surat)
                                            )}>
                                                {item.jenis_surat}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {item.file_pdf ? (
                                                <a 
                                                    href={pb.files.getUrl(item, item.file_pdf)} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors border border-blue-100"
                                                >
                                                    <Download className="w-3.5 h-3.5" /> Unduh PDF
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 opacity-50" /> Belum ada
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 justify-end">
                                                <Link href={`/panel/dashboard/surat/${item.id}/cetak`} target="_blank">
                                                    <button 
                                                        title="Cetak Blangko Surat"
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <Link href={`/panel/dashboard/surat/${item.id}`}>
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
        </main>
    );
}
