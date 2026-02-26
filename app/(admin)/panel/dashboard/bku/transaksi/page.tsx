"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { BkuTransaksi } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { Plus, Trash2, ArrowDownCircle, ArrowUpCircle, RefreshCw, FileText } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";

export default function TransaksiBkuPage() {
    const [data, setData] = useState<BkuTransaksi[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("bku_transaksi").getFullList<BkuTransaksi>({
                sort: "-tanggal,-created",
                expand: "rekening_sumber_id,rekening_tujuan_id"
            });
            setData(records);
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
        if (!window.confirm(`Hapus permanen log transaksi ini? Aksi ini akan mempengaruhi jumlah saldo berjalan.`)) return;
        try {
            await pb.collection("bku_transaksi").delete(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Gagal menghapus transaksi.");
        }
    };

    return (
        <main>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <SectionHeading 
                    title="Buku Kas Umum" 
                    subtitle="Monitor aliran dana Masuk (Debet) dan Keluar (Kredit) Pemerintahan Desa." 
                />
                <div className="flex gap-2">
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
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">Memuat log Buku Kas Umum...</td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <FileText className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="font-semibold text-slate-700">Buku Kas masih kosong</p>
                                            <p className="text-sm mt-1">Belum ada catatan aktivitas masuk/keluar terkait dana kas dompet.</p>
                                        </div>
                                    </td>
                                </tr>
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
