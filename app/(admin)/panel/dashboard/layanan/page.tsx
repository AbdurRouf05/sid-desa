"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { Plus, Edit, Trash2 } from "lucide-react";
import { LayananDesa } from "@/types";

export default function AdminLayananPage() {
    const [data, setData] = useState<LayananDesa[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await pb.collection("layanan_desa").getFullList<LayananDesa>({
                sort: "urutan,created",
            });
            setData(result);
        } catch (error) {
            console.error("Gagal memuat data Layanan", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Yakin ingin menghapus layanan ini?")) return;
        try {
            await pb.collection("layanan_desa").delete(id);
            fetchData();
        } catch (error) {
            alert("Gagal menghapus layanan");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Katalog Pusat Layanan</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola daftar layanan mandiri, panduan persyaratan, dan link eksternal yang tampil di beranda utama.</p>
                </div>
                <Link
                    href="/panel/dashboard/layanan/baru"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/10"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Layanan
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase w-16 text-center">Urutan</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase">Layanan & Deskripsi</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase">Status</th>
                                <th className="p-4 text-sm font-semibold text-slate-600 uppercase w-32 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500 flex flex-col items-center justify-center">
                                        <p>Belum ada layanan yang ditambahkan.</p>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 text-base font-medium text-slate-700 text-center">
                                            {item.urutan || '-'}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            <p className="font-bold text-slate-800 text-base">{item.nama_layanan}</p>
                                            <p className="text-slate-500 mt-1 line-clamp-2 max-w-md">{item.deskripsi}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${item.is_active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                                {item.is_active !== false ? "Aktif" : "Non-Aktif"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/panel/dashboard/layanan/${item.id}`}
                                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
