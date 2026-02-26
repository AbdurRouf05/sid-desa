"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, MapPin, Search } from "lucide-react";
import { pb } from "@/lib/pb";

export default function PerangkatDesaPage() {
    const [perangkat, setPerangkat] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchPerangkat = async () => {
        setLoading(true);
        try {
            const records = await pb.collection('perangkat_desa').getFullList({
                sort: '-created',
            });
            setPerangkat(records);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerangkat();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus perangkat desa ini?")) {
            try {
                await pb.collection('perangkat_desa').delete(id);
                fetchPerangkat();
            } catch (e) {
                alert("Gagal menghapus perangkat desa.");
            }
        }
    };

    const filtered = perangkat.filter(p =>
        (p.nama || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.jabatan || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Perangkat Desa</h1>
                    <p className="text-slate-500">Kelola daftar perangkat desa dan staf pemerintahan.</p>
                </div>
                <Link href="/panel/dashboard/perangkat-desa/baru" className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Tambah Perangkat
                </Link>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative max-w-sm mb-4">
                    <input
                        type="text"
                        placeholder="Cari nama atau jabatan..."
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
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Jabatan</th>
                                <th className="px-4 py-3">NIP</th>
                                <th className="px-4 py-3 text-center">Status Aktif</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-8">Memuat data...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8">Tidak ada data perangkat desa.</td></tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            {item.nama}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.jabatan}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">
                                            {item.nip || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.is_aktif ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                {item.is_aktif ? 'Aktif' : 'Non-Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <Link href={`/panel/dashboard/perangkat-desa/${item.id}`} className="inline-flex p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
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
