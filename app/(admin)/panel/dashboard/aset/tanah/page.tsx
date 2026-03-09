"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { TanahDesa } from "@/lib/validations/aset";
import { Plus, Trash2, Pencil, Map } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function TanahDesaPage() {
    const [data, setData] = useState<(TanahDesa & { id: string, created: string })[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection("tanah_desa").getFullList({ sort: "-created" });
            setData(records as any);
        } catch (error) {
            console.error("Error fetching tanah_desa", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Hapus data tanah di lokasi ${name}?`)) return;
        try {
            await pb.collection("tanah_desa").delete(id);
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
                    <h1 className="text-2xl font-bold text-slate-900">Aset Tanah Desa</h1>
                    <p className="text-slate-500">Inventarisasi bidang tanah milik pemerintahan desa (TKD/Fasum).</p>
                </div>
                <Link href="/panel/dashboard/aset/tanah/baru">
                    <TactileButton variant="primary">
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Data Tanah
                    </TactileButton>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Lokasi</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Luas (m²)</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Peruntukan</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Pemegang Hak</th>
                                <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <TableSkeleton columns={5} rows={3} />
                            ) : data.length === 0 ? (
                                <EmptyState
                                    colSpan={5}
                                    icon={Map}
                                    title="Belum ada data tanah desa"
                                    description="Tambahkan data bidang tanah milik pemerintahan desa."
                                />
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-800">{item.lokasi}</td>
                                        <td className="p-4 text-slate-600">{(item.luas_m2 || 0).toLocaleString('id-ID')} m²</td>
                                        <td className="p-4 text-slate-600">{item.peruntukan || '-'}</td>
                                        <td className="p-4 text-slate-600">{item.pemegang_hak || '-'}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2 justify-end">
                                                <Link href={`/panel/dashboard/aset/tanah/${item.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item.id, item.lokasi)}
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
