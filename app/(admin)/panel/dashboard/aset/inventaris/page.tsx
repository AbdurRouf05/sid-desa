"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { InventarisDesa } from "@/types";
import { Plus, Trash2, Pencil, Package } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function InventarisDesaPage() {
    const [data, setData] = useState<(InventarisDesa)[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("inventaris_desa").getFullList({ sort: "-created" });
            setData(records as any);
        } catch (error) {
            console.error("Error fetching inventaris_desa", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Hapus data aset ${name}?`)) return;
        try {
            await pb.collection("inventaris_desa").delete(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Gagal menghapus data.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header - Single Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventaris Aset</h1>
                    <p className="text-slate-500">Manajemen dan siklus hidup aset barang & bangunan pemerintahan desa.</p>
                </div>
                <Link href="/panel/dashboard/aset/inventaris/baru">
                    <TactileButton variant="primary">
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Barang
                    </TactileButton>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Nama Barang/Aset</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Kategori</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Tahun & Kuantitas</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Kondisi</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={5} rows={3} />
                            ) : data.length === 0 ? (
                                <EmptyState
                                    colSpan={5}
                                    icon={Package}
                                    title="Belum ada pencatatan inventaris"
                                    description="Tambahkan data barang inventaris milik desa."
                                />
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-bold text-slate-800">{item.nama_barang}</td>
                                        <td className="p-4 text-slate-600">
                                            <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-medium text-slate-700">{item.kategori}</span>
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            <div className="text-sm font-medium">{item.kuantitas} Unit</div>
                                            <div className="text-xs text-slate-400">Tahun {item.tahun_perolehan}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                item.kondisi === "Baik" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                item.kondisi === "Rusak Ringan" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                item.kondisi === "Rusak Berat" ? "bg-red-50 text-red-700 border-red-200" :
                                                "bg-slate-100 text-slate-500 border-slate-200"
                                            }`}>
                                                {item.kondisi}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 justify-end">
                                                <Link href={`/panel/dashboard/aset/inventaris/${item.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.nama_barang)}
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
