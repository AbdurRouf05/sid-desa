"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, MapPin, Search } from "lucide-react";
import { pb } from "@/lib/pb";

export default function BranchesPage() {
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const records = await pb.collection('branches').getFullList({
                sort: 'sort_order',
            });
            setBranches(records);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus kantor cabang ini?")) {
            try {
                await pb.collection('branches').delete(id);
                fetchBranches();
            } catch (e) {
                alert("Gagal menghapus cabang.");
            }
        }
    };

    const filtered = branches.filter(b =>
        (b.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.address || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Kantor Cabang</h1>
                    <p className="text-slate-500">Kelola daftar lokasi kantor layanan.</p>
                </div>
                <Link href="/panel/dashboard/cabang/baru" className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Tambah Cabang
                </Link>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative max-w-sm mb-4">
                    <input
                        type="text"
                        placeholder="Cari cabang..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                            <tr>
                                <th className="px-4 py-3">Nama Kantor</th>
                                <th className="px-4 py-3">Tipe</th>
                                <th className="px-4 py-3">Alamat</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-8">Memuat data...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8">Tidak ada data cabang.</td></tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            {item.name}
                                            {item.phone_wa && <div className="text-xs text-slate-400 font-normal">{item.phone_wa}</div>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.type === 'Pusat' ? 'bg-emerald-100 text-emerald-800' :
                                                item.type === 'Kas' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 max-w-md truncate" title={item.address}>
                                            {item.address}
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <Link href={`/panel/dashboard/cabang/${item.id}`} className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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
