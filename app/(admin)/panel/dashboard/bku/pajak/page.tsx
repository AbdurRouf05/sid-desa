"use client";

import { useEffect, useState, useMemo } from "react";
import { pb } from "@/lib/pb";
import { PajakLog } from "@/types";
import { 
    CheckCircle2, CircleDashed, Receipt, Landmark, 
    Upload, X, Loader2, FileText, Download, 
    Sparkles, LayoutGrid, Activity, 
    ChevronRight, Calculator, ShieldCheck,
    Search, Filter, Clock, AlertCircle
} from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export default function BukuPajakPage() {
    const [data, setData] = useState<PajakLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("Semua");
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPajak, setSelectedPajak] = useState<PajakLog | null>(null);
    const [ntpnInput, setNtpnInput] = useState("");
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("pajak_log").getFullList<PajakLog>({
                sort: "-created",
                expand: "bku_id",
            });
            setData(records);
        } catch (error) {
            console.error("Error fetching", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Statistics Calculation (Bansos Inspired)
    const stats = useMemo(() => {
        const belumSetor = data.filter(p => p.status === "Belum Disetor");
        const sudahSetor = data.filter(p => p.status === "Sudah Disetor");
        
        const nominalBelumSetor = belumSetor.reduce((acc, curr) => acc + curr.nominal_pajak, 0);
        const nominalSudahSetor = sudahSetor.reduce((acc, curr) => acc + curr.nominal_pajak, 0);

        return {
            countBelum: belumSetor.length,
            countSudah: sudahSetor.length,
            nominalBelum: nominalBelumSetor,
            nominalSudah: nominalSudahSetor,
            totalPajak: data.length
        };
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const bku = item.expand?.bku_id;
            const matchesSearch = bku?.uraian.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  item.jenis_pajak.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === "Semua" || item.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [data, searchQuery, filterStatus]);

    const handleToggleStatus = async (item: PajakLog) => {
        if (item.status === "Sudah Disetor") {
            if (!window.confirm('Batalkan status setoran? NTPN dan lampiran bukti akan dihapus dari sistem.')) return;
            try {
                await pb.collection("pajak_log").update(item.id, { 
                    status: "Belum Disetor",
                    ntpn: "",
                    bukti_setor: null
                });
                fetchData();
            } catch (error) {
                console.error("Error reverting", error);
            }
        } else {
            setSelectedPajak(item);
            setNtpnInput("");
            setFileInput(null);
            setIsModalOpen(true);
        }
    };

    const handleSavePelunasan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPajak || !ntpnInput.trim()) return;

        setIsSaving(true);
        const submitData = new FormData();
        submitData.append("status", "Sudah Disetor");
        submitData.append("ntpn", ntpnInput.toUpperCase());
        if (fileInput) {
            submitData.append("bukti_setor", fileInput);
        }

        try {
            await pb.collection("pajak_log").update(selectedPajak.id, submitData);
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Save error", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-700">
            {/* Header Section (Bansos Inspired) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Buku Pembantu Pajak</h1>
                    <p className="text-sm text-slate-500 mt-1">Audit kepatuhan penyetoran pajak negara (PPN/PPh) desa.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                        Tax Compliance Verified
                    </span>
                </div>
            </div>

            {/* Quick Stats Grid (Bansos Inspired) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:rotate-12 transition-transform">
                            <Clock className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pajak Belum Setor</p>
                    </div>
                    <p className="text-xl font-black text-amber-600 tracking-tight font-mono">Rp {stats.nominalBelum.toLocaleString('id-ID')}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stats.countBelum} Dokumen Pending</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pajak Sudah Setor</p>
                    </div>
                    <p className="text-xl font-black text-emerald-600 tracking-tight font-mono">Rp {stats.nominalSudah.toLocaleString('id-ID')}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stats.countSudah} Dokumen Valid</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-5 rounded-3xl shadow-xl shadow-emerald-900/20 col-span-1 md:col-span-2 relative overflow-hidden group text-white">
                    <div className="absolute right-0 top-0 p-6">
                        <Landmark className="w-12 h-12 text-white/5 group-hover:scale-125 transition-transform duration-700" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/10 text-emerald-400 rounded-xl border border-white/5">
                                <Activity className="w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em]">Total Akumulasi Pajak</p>
                        </div>
                        <p className="text-3xl font-black text-white tracking-tighter font-mono">
                            <span className="text-emerald-400 mr-2">Σ</span>
                            Rp {(stats.nominalBelum + stats.nominalSudah).toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Table Card (Bansos Reference) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                {/* Search & Tabs Toolbar */}
                <div className="p-6 border-b border-slate-100 space-y-6">
                    <div className="relative group max-w-xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari referensi BKU atau jenis pajak..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {["Semua", "Belum Disetor", "Sudah Disetor"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border outline-none flex items-center gap-2",
                                    filterStatus === status
                                        ? "bg-emerald-800 border-emerald-800 text-white shadow-lg shadow-emerald-900/10"
                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                {status}
                                {filterStatus === status && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-white text-[9px]">
                                        {filteredData.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/30 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32">Tanggal</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Referensi Jurnal (BKU)</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kewajiban Potongan</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-10">Status & NTPN</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={4} rows={10} />
                            ) : filteredData.length === 0 ? (
                                <EmptyState colSpan={4} icon={Landmark} title="Pajak Nihil" description="Belum ada tarikan pajak pada sistem." />
                            ) : (
                                filteredData.map((item) => {
                                    const bku = item.expand?.bku_id;
                                    const isPaid = item.status === "Sudah Disetor";
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="px-6 py-4">
                                                <div className="text-[11px] font-black text-emerald-950 uppercase">
                                                    {bku?.tanggal ? new Date(bku.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col min-w-0">
                                                    <p className="text-[11px] font-bold text-slate-800 truncate uppercase tracking-tight group-hover:text-emerald-600 transition-colors" title={bku?.uraian}>{bku?.uraian || "Data Terhapus"}</p>
                                                    <span className="text-[8px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">BKU NILAI: RP {bku?.nominal?.toLocaleString('id-ID')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "p-2 rounded-xl flex-shrink-0 flex items-center justify-center",
                                                        isPaid ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                    )}>
                                                        <Receipt className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.jenis_pajak}</div>
                                                        <div className={cn("text-[12px] font-black font-mono tracking-tight", isPaid ? "text-emerald-700" : "text-amber-700")}>
                                                            Rp {item.nominal_pajak.toLocaleString('id-ID')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right pr-10">
                                                <div className="flex flex-col items-end gap-2">
                                                    <button 
                                                        onClick={() => handleToggleStatus(item)}
                                                        className={cn(
                                                            "h-8 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 flex items-center gap-2",
                                                            isPaid 
                                                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-900/10' 
                                                                : 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'
                                                        )}
                                                    >
                                                        {isPaid ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-100" /> : <Clock className="w-3.5 h-3.5" />}
                                                        {item.status}
                                                    </button>
                                                    {isPaid && (
                                                        <div className="flex flex-col items-end group/ntpn">
                                                            <span className="text-[9px] font-black text-emerald-500 font-mono uppercase tracking-widest">NTPN: {item.ntpn || "-"}</span>
                                                            {item.bukti_setor && (
                                                                <a 
                                                                    href={pb.files.getUrl(item as any, item.bukti_setor)} 
                                                                    target="_blank" 
                                                                    className="flex items-center gap-1 text-[8px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest mt-1 transition-colors"
                                                                >
                                                                    <FileText className="w-2.5 h-2.5" /> LIHAT LAMPIRAN BUKTI
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tax Education Tip (Bansos Inspired) */}
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex items-center gap-4 group transition-all hover:bg-amber-100/50">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-500 group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <p className="text-[10px] text-amber-800 font-bold uppercase tracking-tight leading-relaxed">
                    <span className="block text-amber-900 mb-0.5">Protokol Penyetoran Pajak:</span>
                    Pastikan kode NTPN (Nomor Transaksi Penerimaan Negara) yang diinput sesuai dengan bukti setor resmi dari bank atau kantor pos. Kesalahan input data dapat mempengaruhi laporan realisasi anggaran tahunan.
                </p>
            </div>

            {/* Modal: Pelunasan Pajak (Inquiries reference for sleek modal) */}
            {isModalOpen && selectedPajak && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden flex flex-col border border-slate-100 shadow-emerald-900/20 translate-y-0 scale-100 transition-all">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xs font-black text-emerald-950 uppercase tracking-[0.2em]">Pelunasan Pajak</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Validasi Setoran Negara</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-100">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="bg-emerald-950 p-5 rounded-2xl flex items-center gap-4 text-white shadow-xl shadow-emerald-200">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <Receipt className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">{selectedPajak.jenis_pajak}</p>
                                    <p className="text-lg font-black tracking-tighter font-mono">Rp {selectedPajak.nominal_pajak.toLocaleString('id-ID')}</p>
                                </div>
                            </div>

                            <form id="pelunasan-form" onSubmit={handleSavePelunasan} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3" /> Masukkan Kode NTPN
                                    </label>
                                    <input 
                                        type="text" value={ntpnInput} onChange={(e) => setNtpnInput(e.target.value)}
                                        placeholder="CONTOH: 7C1234567890ABC"
                                        className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black uppercase tracking-tight outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-800"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Scan Bukti Setoran (PDF/JPG)
                                    </label>
                                    <label className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-slate-50 transition-all group">
                                        <Upload className={cn("w-6 h-6 mb-2 transition-all group-hover:translate-y-[-2px]", fileInput ? "text-emerald-500" : "text-slate-300")} />
                                        <span className="text-[9px] font-black text-slate-500 uppercase px-4 text-center">
                                            {fileInput ? fileInput.name : "KLIK UNTUK UNGGAH DIGITAL NOTA"}
                                        </span>
                                        <input type="file" className="hidden" accept="image/jpeg,image/png,application/pdf" onChange={(e) => e.target.files && setFileInput(e.target.files[0])} />
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-slate-50 flex items-center gap-3 bg-slate-50/50">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 h-11 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Batal</button>
                            <button 
                                type="submit" 
                                form="pelunasan-form" 
                                disabled={isSaving}
                                className="flex-[2] h-11 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all hover:bg-emerald-700"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                                Sahkan Setoran
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
