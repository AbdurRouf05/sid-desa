"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ApbdesRealisasi } from "@/types";

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

    return (
        <main>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Transparansi APBDes</h1>
                    <p className="text-slate-500">Kelola data anggaran dan realisasi (Pendapatan, Belanja, Pembiayaan).</p>
                </div>
                <Link
                    href="/panel/dashboard/apbdes/baru"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/10"
                >
                    <Plus className="w-5 h-5" />
                    Input APBDes Baru
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm">Tahun</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm">Kategori</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm">Nama Bidang</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm text-right">Anggaran</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm text-right">Realisasi</th>
                                <th className="px-6 py-4 font-bold text-slate-700 text-sm text-right w-24">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        Belum ada data APBDes.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{item.tahun_anggaran}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                item.kategori === 'Pendapatan' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                item.kategori === 'Belanja' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                                {item.kategori}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{item.nama_bidang}</td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-700">{formatRupiah(item.anggaran)}</td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-700">{formatRupiah(item.realisasi)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/panel/dashboard/apbdes/${item.id}`}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
        </main>
    );
}
