"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { Plus, Trash2, Save, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const KATEGORI_OPTIONS = ["Jenis Kelamin", "Kelompok Usia", "Agama", "Pendidikan", "Pekerjaan"];

interface DemografiRecord {
    id: string;
    kategori: string;
    label: string;
    jumlah: number;
    tahun: number;
}

export default function DemografiPage() {
    const [data, setData] = useState<DemografiRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedKategori, setSelectedKategori] = useState("Semua");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ kategori: KATEGORI_OPTIONS[0], label: "", jumlah: 0, tahun: new Date().getFullYear() });
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const records = await pb.collection('statistik_demografi').getFullList({ sort: 'kategori,label' });
            setData(records as unknown as DemografiRecord[]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async () => {
        if (!form.label.trim()) { toast.error("Label tidak boleh kosong"); return; }
        if (form.jumlah < 0) { toast.error("Jumlah tidak boleh negatif"); return; }
        setSaving(true);
        try {
            await pb.collection('statistik_demografi').create(form);
            toast.success("Data berhasil ditambahkan");
            setForm({ kategori: KATEGORI_OPTIONS[0], label: "", jumlah: 0, tahun: new Date().getFullYear() });
            setShowForm(false);
            fetchData();
        } catch (e) {
            toast.error("Gagal menyimpan data");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin hapus data ini?")) return;
        try {
            await pb.collection('statistik_demografi').delete(id);
            toast.success("Data dihapus");
            fetchData();
        } catch (e) {
            toast.error("Gagal menghapus");
        }
    };

    const handleInlineUpdate = async (id: string, jumlah: number) => {
        try {
            await pb.collection('statistik_demografi').update(id, { jumlah });
            toast.success("Jumlah diperbarui");
        } catch (e) {
            toast.error("Gagal update");
        }
    };

    const filtered = selectedKategori === "Semua" ? data : data.filter(d => d.kategori === selectedKategori);

    // Group data by kategori for summary
    const grouped = KATEGORI_OPTIONS.reduce((acc, kat) => {
        acc[kat] = data.filter(d => d.kategori === kat);
        return acc;
    }, {} as Record<string, DemografiRecord[]>);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Statistik Demografi</h1>
                    <p className="text-slate-500">Kelola data ringkasan kependudukan Desa Sumberanyar.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Data
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {KATEGORI_OPTIONS.map(kat => (
                    <div key={kat} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{kat}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{grouped[kat]?.length || 0}</p>
                        <p className="text-[10px] text-slate-400">entri</p>
                    </div>
                ))}
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-600" /> Tambah Data Demografi Baru
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Kategori</label>
                            <select
                                value={form.kategori}
                                onChange={e => setForm({ ...form, kategori: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            >
                                {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Label</label>
                            <input
                                type="text"
                                placeholder="Misal: Laki-Laki"
                                value={form.label}
                                onChange={e => setForm({ ...form, label: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Jumlah</label>
                            <input
                                type="number"
                                min={0}
                                value={form.jumlah}
                                onChange={e => setForm({ ...form, jumlah: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Tahun</label>
                            <input
                                type="number"
                                min={1900}
                                max={2100}
                                value={form.tahun}
                                onChange={e => setForm({ ...form, tahun: parseInt(e.target.value) || new Date().getFullYear() })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={handleCreate}
                            disabled={saving}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                        >
                            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {["Semua", ...KATEGORI_OPTIONS].map(kat => (
                    <button
                        key={kat}
                        onClick={() => setSelectedKategori(kat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${selectedKategori === kat
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        {kat}
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                            <tr>
                                <th className="px-4 py-3">Kategori</th>
                                <th className="px-4 py-3">Label</th>
                                <th className="px-4 py-3">Jumlah</th>
                                <th className="px-4 py-3">Tahun</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-8 text-slate-400">Memuat data...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-slate-400">Belum ada data demografi.</td></tr>
                            ) : (
                                filtered.map(item => (
                                    <tr key={item.id} className="border-b hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                                {item.kategori}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{item.label}</td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                defaultValue={item.jumlah}
                                                min={0}
                                                className="w-24 px-2 py-1 rounded border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                onBlur={(e) => {
                                                    const newVal = parseInt(e.target.value) || 0;
                                                    if (newVal !== item.jumlah) handleInlineUpdate(item.id, newVal);
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{item.tahun}</td>
                                        <td className="px-4 py-3 text-right">
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
