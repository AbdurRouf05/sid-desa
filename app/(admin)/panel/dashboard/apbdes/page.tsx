"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, CreditCard, PieChart } from "lucide-react";
import { ApbdesRealisasi } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminApbdesPage() {
    const [data, setData] = useState<ApbdesRealisasi[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await pb.collection("apbdes_realisasi").getFullList<ApbdesRealisasi>({
                sort: "-tahun_anggaran,kategori",
            });
            setData(result);
        } catch (error) {
            console.error("Gagal memuat data APBDes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Yakin ingin menghapus data ini?")) return;
        try {
            await pb.collection("apbdes_realisasi").delete(id);
            fetchData();
        } catch (error) {
            alert("Gagal menghapus data");
        }
    };

    const formatRupiah = (nominal: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(nominal);
    };

    // Summary stats
    const totalAnggaran = data.reduce((acc, curr) => acc + (curr.anggaran || 0), 0);
    const totalRealisasi = data.reduce((acc, curr) => acc + (curr.realisasi || 0), 0);
    const persentase = totalAnggaran > 0 ? (totalRealisasi / totalAnggaran) * 100 : 0;

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Transparansi APBDes</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola data anggaran dan realisasi berdasarkan sumber dana desa.</p>
                </div>
                <Link
                    href="/panel/dashboard/apbdes/baru"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm w-full sm:w-auto justify-center"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Input Anggaran
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-emerald-100 transition-all">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Anggaran</p>
                        <p className="text-lg font-black text-slate-900 tracking-tight mt-0.5">{formatRupiah(totalAnggaran)}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-emerald-100 transition-all">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <TrendingDown className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Realisasi</p>
                        <p className="text-lg font-black text-slate-900 tracking-tight mt-0.5">{formatRupiah(totalRealisasi)}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-amber-100 transition-all">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
                        <PieChart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Persentase</p>
                        <p className="text-lg font-black text-slate-900 tracking-tight mt-0.5">{persentase.toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tahun</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sumber Dana</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Bidang</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Anggaran</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Realisasi</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                                            <p className="text-xs font-bold uppercase tracking-widest mt-2">Memuat data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <CreditCard className="w-12 h-12 text-slate-200" />
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Belum ada data APBDes.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm text-slate-900">{item.tahun_anggaran}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                                                item.kategori === 'Alokasi Dana Desa (ADD)' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                item.kategori === 'Dana Desa (DD)' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                item.kategori === 'BHP/BHR' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                'bg-indigo-50 text-indigo-700 border-indigo-100'
                                            )}>
                                                {item.kategori}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-700">{item.nama_bidang}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="font-mono text-sm font-bold text-slate-900">{formatRupiah(item.anggaran)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="font-mono text-sm font-bold text-emerald-600">{formatRupiah(item.realisasi)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/panel/dashboard/apbdes/${item.id}`}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                                    title="Hapus"
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
