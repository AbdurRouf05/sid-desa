"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { PajakLog } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckCircle2, CircleDashed, Receipt, Landmark } from "lucide-react";

export default function BukuPajakPage() {
    const [data, setData] = useState<PajakLog[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "Belum Disetor" ? "Sudah Disetor" : "Belum Disetor";
        if (!window.confirm(`Ubah status pajak ini menjadi "${newStatus}"?`)) return;
        
        try {
            await pb.collection("pajak_log").update(id, { status: newStatus });
            fetchData();
        } catch (error) {
            console.error("Error updating status", error);
            alert("Gagal merubah status pajak.");
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
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => handleToggleStatus(item.id, item.status)}
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
        </main>
    );
}
