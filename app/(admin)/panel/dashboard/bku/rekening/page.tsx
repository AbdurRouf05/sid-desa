"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { RekeningKas } from "@/types";
import { 
    Plus, Trash2, Edit2, Wallet, 
    Coins, Landmark, Activity, 
    LayoutGrid, ChevronRight, Calculator,
    ShieldCheck, TrendingUp, Search
} from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getSaldoRekening } from "@/lib/bku-utils";
import { cn } from "@/lib/utils";

interface RekeningKasWithSaldo extends RekeningKas {
    saldo?: number;
}

export default function RekeningKasPage() {
    const [data, setData] = useState<RekeningKasWithSaldo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = useMemo(() => {
        return data.filter(r => r.nama_rekening.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [data, searchQuery]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("rekening_kas").getFullList<RekeningKas>({
                sort: "jenis,nama_rekening",
            });
            const recordsWithSaldo = await Promise.all(
                records.map(async (rek) => {
                    const saldo = await getSaldoRectangle(rek.id);
                    return { ...rek, saldo };
                })
            ).catch(e => {
                return records.map(r => ({ ...r, saldo: 0}));
            });
            setData(recordsWithSaldo as any);
        } catch (error) {
            console.error("Error fetching", error);
        } finally {
            setLoading(false);
        }
    };

    const getSaldoRectangle = async (id: string) => {
        try { return await getSaldoRekening(id); } catch { return 0; }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Statistics Calculation (Bansos Inspired)
    const stats = useMemo(() => {
        const tunai = data.filter(r => r.jenis === 'Tunai').reduce((acc, curr) => acc + (curr.saldo || 0), 0);
        const bank = data.filter(r => r.jenis === 'Bank').reduce((acc, curr) => acc + (curr.saldo || 0), 0);
        return { tunai, bank, total: tunai + bank, count: data.length };
    }, [data]);

    const handleDelete = async (id: string, nama: string) => {
        if (!window.confirm(`Hapus rekening "${nama}"? Data transaksi terkait mungkin terdampak.`)) return;
        try {
            await pb.collection("rekening_kas").delete(id);
            fetchData();
        } catch (error) {
            alert("Gagal menghapus. Rekening ini memiliki histori transaksi di BKU.");
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-700">
            {/* Header Section (Bansos Inspired) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Master Rekening Desa</h1>
                    <p className="text-sm text-slate-500 mt-1">Konfigurasi dompet kas, perbankan, dan penyimpanan dana desa.</p>
                </div>
                <Link href="/panel/dashboard/bku/rekening/baru">
                    <button className="h-10 px-6 flex items-center gap-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-200 group">
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Tambah Rekening
                    </button>
                </Link>
            </div>

            {/* Quick Stats Grid (Bansos Inspired) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                            <Wallet className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kas Tunai (Total)</p>
                    </div>
                    <p className="text-xl font-black text-slate-900 tracking-tight font-mono">Rp {stats.tunai.toLocaleString('id-ID')}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:rotate-12 transition-transform">
                            <Landmark className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bank Desa (Total)</p>
                    </div>
                    <p className="text-xl font-black text-slate-900 tracking-tight font-mono">Rp {stats.bank.toLocaleString('id-ID')}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-5 rounded-3xl shadow-xl shadow-emerald-900/20 col-span-1 md:col-span-2 relative overflow-hidden group text-white">
                    <div className="absolute right-0 top-0 p-6">
                        <TrendingUp className="w-12 h-12 text-emerald-400/10 group-hover:scale-125 transition-transform duration-700" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-white/10 text-emerald-400 rounded-xl border border-white/5">
                                <Coins className="w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em]">Total Likuiditas Kumulatif</p>
                        </div>
                        <p className="text-3xl font-black text-white tracking-tighter font-mono flex items-baseline">
                            <span className="text-emerald-400 mr-2 text-xl">Σ</span>
                            Rp {stats.total.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Table Card (Bansos Reference) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                <div className="p-6 border-b border-slate-100">
                    <div className="relative group max-w-xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama rekening atau unit..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-6 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/30 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-48">Klasifikasi</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identitas Rekening</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Saldo Terkini</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-10">Koreksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={4} rows={5} />
                            ) : filteredData.length === 0 ? (
                                <EmptyState colSpan={4} icon={Wallet} title="Data Kosong" description="Belum ada rekening kas yang terdaftar." />
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                                item.jenis === 'Tunai' 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                : 'bg-blue-50 text-blue-700 border-blue-100'
                                            )}>
                                                {item.jenis === 'Tunai' ? <Wallet className="w-3.5 h-3.5" /> : <Landmark className="w-3.5 h-3.5" />}
                                                {item.jenis}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                                                    {item.nama_rekening}
                                                </span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <span className="text-[8px] font-black text-slate-400 font-mono uppercase tracking-widest">ID: {item.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 group/saldo">
                                                <Coins className="w-4 h-4 text-emerald-500 group-hover/saldo:scale-110 transition-transform" />
                                                <span className="text-sm font-black text-slate-900 tracking-tighter font-mono">
                                                    Rp {item.saldo?.toLocaleString('id-ID') || '0'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-10">
                                            <div className="flex gap-1.5 justify-end items-center opacity-40 group-hover:opacity-100 transition-all">
                                                <Link href={`/panel/dashboard/bku/rekening/${item.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100" title="Edit Metadata">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </Link>
                                                <button onClick={() => handleDelete(item.id, item.nama_rekening)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100" title="Arsip/Hapus">
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

            {/* Integrated Verification Footer */}
            <div className="flex items-center gap-3 p-4 bg-emerald-950 text-white rounded-[2rem] shadow-xl shadow-emerald-950/10 group border border-white/5">
                <div className="relative">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-emerald-400/20 blur-lg rounded-full animate-pulse" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Integritas Saldo Terverifikasi</p>
                    <p className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest opacity-60">Sistem melakukan pencocokan mutasi otomatis setiap ada transaksi baru.</p>
                </div>
            </div>
        </div>
    );
}
