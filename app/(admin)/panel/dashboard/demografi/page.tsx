"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pb";
import { Plus, Trash2, Save, BarChart3, Users, X, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const KATEGORI_OPTIONS = ["Jenis Kelamin", "Kesejahteraan", "Status", "Kelompok Usia", "Agama", "Pendidikan", "Pekerjaan"];

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
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Statistik Demografi</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola data ringkasan kependudukan Desa Sumberanyar.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm"
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />}
                    {showForm ? "Tutup Form" : "Tambah Data"}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                {KATEGORI_OPTIONS.map(kat => (
                    <div key={kat} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-emerald-100 group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-emerald-500 transition-colors">{kat}</p>
                        <div className="flex items-baseline gap-1 mt-2">
                            <p className="text-2xl font-black text-slate-900 tracking-tight">{grouped[kat]?.length || 0}</p>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">entri</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Tambah Data Demografi Baru</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategori</label>
                            <select
                                value={form.kategori}
                                onChange={e => setForm({ ...form, kategori: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium appearance-none"
                            >
                                {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Label</label>
                            <input
                                type="text"
                                placeholder="Misal: Laki-Laki"
                                value={form.label}
                                onChange={e => setForm({ ...form, label: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jumlah</label>
                            <input
                                type="number"
                                min={0}
                                value={form.jumlah}
                                onChange={e => setForm({ ...form, jumlah: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tahun</label>
                            <input
                                type="number"
                                min={1900}
                                max={2100}
                                value={form.tahun}
                                onChange={e => setForm({ ...form, tahun: parseInt(e.target.value) || new Date().getFullYear() })}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                        <button
                            onClick={handleCreate}
                            disabled={saving}
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 active:scale-95 disabled:opacity-50 flex items-center gap-2 text-sm font-bold"
                        >
                            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Data"}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all font-bold text-sm"
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
                        className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 outline-none",
                            selectedKategori === kat
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10"
                                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        )}
                    >
                        {kat}
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategori</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Label</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jumlah</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tahun</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memuat data...</p>
                                    </div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <BarChart3 className="w-10 h-10 text-slate-200" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Belum ada data demografi.</p>
                                    </div>
                                </td></tr>
                            ) : (
                                filtered.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                {item.kategori}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm text-slate-900">{item.label}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative w-32 group">
                                                <input
                                                    type="number"
                                                    defaultValue={item.jumlah}
                                                    min={0}
                                                    className="w-full px-3 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                                    onBlur={(e) => {
                                                        const newVal = parseInt(e.target.value) || 0;
                                                        if (newVal !== item.jumlah) handleInlineUpdate(item.id, newVal);
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">{item.tahun}</td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
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

            {/* Hint */}
            <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <Info className="w-5 h-5 text-blue-500" />
                <p className="text-xs text-blue-600 leading-relaxed font-medium">
                    <span className="font-bold uppercase tracking-widest text-[9px] block mb-0.5">Tip Admin:</span>
                    Anda dapat memperbarui jumlah statistik secara langsung melalui kolom input di tabel di atas.
                </p>
            </div>
        </div>
    );
}
