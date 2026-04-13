"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { Plus, Edit, Trash2, ListChecks, HelpCircle, Eye, EyeOff } from "lucide-react";
import { LayananDesa } from "@/types";
import { cn } from "@/lib/utils";

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
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Katalog Pusat Layanan</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola daftar layanan mandiri, panduan persyaratan, dan link eksternal desa.</p>
                </div>
                <Link
                    href="/panel/dashboard/layanan/baru"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm w-full sm:w-auto justify-center"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Tambah Layanan
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-24 text-center">Urutan</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Layanan & Deskripsi</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Sinkronisasi data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-200">
                                            <ListChecks className="w-12 h-12" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Belum ada layanan aktif.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 font-mono font-bold text-xs border border-slate-100">
                                                {item.urutan || '0'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900 text-sm">{item.nama_layanan}</p>
                                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 max-w-sm font-medium">{item.deskripsi}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.is_active !== false ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    <Eye className="w-3 h-3" /> Publik
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-400 border border-slate-200">
                                                    <EyeOff className="w-3 h-3" /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/panel/dashboard/layanan/${item.id}`}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
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
            
            {/* Info Hint */}
            <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                <p className="text-xs text-blue-600 leading-relaxed font-medium">
                    <span className="font-bold uppercase tracking-widest text-[9px] block mb-0.5">Tips Urutan:</span>
                    Gunakan angka urutan (1, 2, 3...) untuk menentukan posisi layanan di halaman beranda warga. Angka terkecil akan tampil paling awal.
                </p>
            </div>
        </div>
    );
}
