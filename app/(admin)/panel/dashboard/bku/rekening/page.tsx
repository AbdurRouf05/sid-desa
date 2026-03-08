"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { RekeningKas } from "@/types";
import { Plus, Trash2, Edit2, Wallet, Building2, Coins } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getSaldoRekening } from "@/lib/bku-utils";

interface RekeningKasWithSaldo extends RekeningKas {
    saldo?: number;
}

export default function RekeningKasPage() {
    const [data, setData] = useState<RekeningKasWithSaldo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("rekening_kas").getFullList<RekeningKas>({
                sort: "jenis,nama_rekening",
            });
            
            // Calculate running balance for each
            const recordsWithSaldo = await Promise.all(
                records.map(async (rek) => {
                    const saldo = await getSaldoRekening(rek.id);
                    return { ...rek, saldo };
                })
            );
            
            setData(recordsWithSaldo);
        } catch (error) {
            console.error("Error fetching rekening_kas", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string, nama: string) => {
        if (!window.confirm(`Hapus rekening "${nama}"? Data transaksi yang terikat pada rekening ini mungkin terganggu.`)) return;
        try {
            await pb.collection("rekening_kas").delete(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Gagal menghapus rekening. Rekening mungkin sedang digunakan di Log Transaksi.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header - Single Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Master Rekening Desa</h1>
                    <p className="text-slate-500">Kelola dompet penyimpanan uang untuk Buku Kas Umum.</p>
                </div>
                <Link href="/panel/dashboard/bku/rekening/baru">
                    <TactileButton variant="primary">
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Rekening
                    </TactileButton>
                </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Tipe Saldo</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Nama Rekening/Dompet</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Total Saldo Berjalan</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={4} rows={3} />
                            ) : data.length === 0 ? (
                                <EmptyState
                                    colSpan={4}
                                    icon={Wallet}
                                    title="Belum ada Rekening"
                                    description="Tambahkan laci tunai kelurahan atau bank Kas Desa untuk memulai Buku Kas Umum."
                                />
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${
                                                item.jenis === 'Tunai' 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                : 'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                                {item.jenis === 'Tunai' ? <Wallet className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                                                {item.jenis}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900 text-lg">{item.nama_rekening}</div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                Dibuat: {new Date(item.created).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <Coins className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">ESTIMASI KAS</div>
                                                    <div className="font-bold text-slate-700">Rp {item.saldo?.toLocaleString('id-ID') || '0'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 justify-end">
                                                <Link href={`/panel/dashboard/bku/rekening/${item.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item.id, item.nama_rekening)}
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
        </div>
    );
}
