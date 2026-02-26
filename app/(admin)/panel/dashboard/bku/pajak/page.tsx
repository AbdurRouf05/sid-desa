"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { PajakLog } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckCircle2, CircleDashed, Receipt, Landmark, Upload, X, Loader2, FileText, Download } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { TactileButton } from "@/components/ui/tactile-button";

export default function BukuPajakPage() {
    const [data, setData] = useState<PajakLog[]>([]);
    const [loading, setLoading] = useState(true);
    
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
            console.error("Error fetching pajak_log", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleStatus = async (item: PajakLog) => {
        if (item.status === "Sudah Disetor") {
            // Confirm to revert
            if (!window.confirm('Batalkan status "Sudah Disetor"? NTPN dan Bukti akan dihapus.')) return;
            try {
                await pb.collection("pajak_log").update(item.id, { 
                    status: "Belum Disetor",
                    ntpn: "",
                    bukti_setor: null
                });
                fetchData();
            } catch (error) {
                console.error("Error reverting status", error);
                alert("Gagal membatalkan status pajak.");
            }
        } else {
            // Open Modal
            setSelectedPajak(item);
            setNtpnInput("");
            setFileInput(null);
            setIsModalOpen(true);
        }
    };

    const handleSavePelunasan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPajak) return;
        if (!ntpnInput.trim()) {
            alert("NTPN tidak boleh kosong!");
            return;
        }

        setIsSaving(true);
        const submitData = new FormData();
        submitData.append("status", "Sudah Disetor");
        submitData.append("ntpn", ntpnInput);
        if (fileInput) {
            submitData.append("bukti_setor", fileInput);
        }

        try {
            await pb.collection("pajak_log").update(selectedPajak.id, submitData);
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Save error", error);
            alert("Gagal menyimpan pelunasan.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <SectionHeading 
                    title="Buku Pembantu Pajak" 
                    subtitle="Monitor kewajiban potongan pajak PPN/PPh dari transaksi pengeluaran BKU." 
                />
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Tgl BKU Asal</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Uraian Transaksi BKU</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Jenis & Nominal Pajak</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Status Setoran</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">Memuat rekap pajak...</td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <Landmark className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="font-semibold text-slate-700">Belum ada Log Potongan Pajak</p>
                                            <p className="text-sm mt-1">Gunakan form transaksi (Kas Keluar) dan centang opsi pajak untuk mulai merekam titipan pajak.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => {
                                    const bku = item.expand?.bku_id;
                                    const isPaid = item.status === "Sudah Disetor";
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-4 text-sm text-slate-600 font-medium">
                                                {bku?.tanggal ? new Date(bku.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800 line-clamp-2">{bku?.uraian || "Referensi Transaksi Hilang"}</div>
                                                <div className="text-xs text-slate-400 mt-1">Nilai BKU: Rp {bku?.nominal?.toLocaleString('id-ID')}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <Receipt className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.jenis_pajak}</div>
                                                        <div className="font-bold text-slate-700">Rp {item.nominal_pajak.toLocaleString('id-ID')}</div>
                                                        
                                                        {isPaid && item.ntpn && (
                                                            <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                                                                NTPN: <span className="font-mono">{item.ntpn}</span>
                                                            </div>
                                                        )}
                                                         {isPaid && item.bukti_setor && (
                                                            <div className="mt-1">
                                                                <a 
                                                                    href={pb.files.getUrl(item as any, item.bukti_setor)} 
                                                                    target="_blank" 
                                                                    rel="noreferrer"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 w-max"
                                                                >
                                                                    <Download className="w-3 h-3" /> Unduh Bukti
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => handleToggleStatus(item)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                                        isPaid 
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                                    }`}
                                                >
                                                    {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CircleDashed className="w-3.5 h-3.5" />}
                                                    {item.status}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Pelunasan */}
            {isModalOpen && selectedPajak && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Pelunasan Pajak</h3>
                                <p className="text-sm text-slate-500">{selectedPajak.jenis_pajak} - Rp {selectedPajak.nominal_pajak.toLocaleString('id-ID')}</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="pelunasan-form" onSubmit={handleSavePelunasan} className="space-y-6">
                                <div>
                                    <FormInput
                                        label="Nomor Tanda Penerimaan Negara (NTPN)"
                                        type="text"
                                        value={ntpnInput}
                                        onChange={(e) => setNtpnInput(e.target.value)}
                                        placeholder="Contoh: 0123456789ABCDEF"
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-1">NTPN wajib diisi setelah penyetoran modul penerimaan negara.</p>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-2">Unggah Bukti Setor Bank/Pos (Opsional)</label>
                                    
                                    {fileInput ? (
                                        <div className="flex items-center justify-between p-3 border border-emerald-200 bg-emerald-50 rounded-xl">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                                <span className="text-sm font-medium text-emerald-800 truncate">{fileInput.name}</span>
                                            </div>
                                            <button type="button" onClick={() => setFileInput(null)} className="p-1 hover:bg-emerald-100 rounded-full text-emerald-700">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-center">
                                            <Upload className="w-6 h-6 text-slate-400 mb-2" />
                                            <span className="text-sm font-medium text-slate-600">Klik untuk memilih file</span>
                                            <span className="text-xs text-slate-400 mt-1">JPG, PNG, PDF (Maks 5MB)</span>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/jpeg,image/png,application/pdf"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        setFileInput(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <TactileButton 
                                type="submit" 
                                form="pelunasan-form" 
                                variant="primary" 
                                disabled={isSaving || !ntpnInput.trim()}
                            >
                                {isSaving ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                                ) : (
                                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Sahkan Pembayaran</>
                                )}
                            </TactileButton>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
