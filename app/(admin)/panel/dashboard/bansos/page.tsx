"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { PenerimaBansos } from "@/types";
import { Plus, Search, Trash2, Edit2, Users, FileText, Calendar } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export default function BansosPage() {
    const [data, setData] = useState<PenerimaBansos[]>([]);
    const [kategori, setKategori] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterJenis, setFilterJenis] = useState<string>("Semua");

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch recipients and categories in parallel
            const [bansosRecords, kategoriRecords] = await Promise.all([
                pb.collection("penerima_bansos").getFullList<PenerimaBansos>({
                    sort: "-created",
                    expand: "jenis_bantuan",
                }),
                pb.collection("kategori_bantuan").getFullList({
                    sort: "nama",
                })
            ]);
            
            setData(bansosRecords);
            setKategori(kategoriRecords);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data penerima bansos ini?")) return;
        try {
            await pb.collection("penerima_bansos").delete(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Gagal menghapus data.");
        }
    };

    // Calculate dynamic categories (murni dari database)
    const allCategories = useMemo(() => {
        const fromDB = kategori.map(k => k.nama);
        return ["Semua", ...fromDB];
    }, [kategori]);

    // Statistics breakdown
    const stats = useMemo(() => {
        const total = data.length;
        const breakdown = data.reduce((acc: any, curr) => {
            const namaBantuan = curr.expand?.jenis_bantuan?.nama || "Lainnya";
            acc[namaBantuan] = (acc[namaBantuan] || 0) + 1;
            return acc;
        }, {});
        return { total, breakdown };
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  (item.nik && item.nik.includes(searchQuery));
            const matchesFilter = filterJenis === "Semua" || 
                                  (item.expand?.jenis_bantuan?.nama === filterJenis);
            return matchesSearch && matchesFilter;
        });
    }, [data, searchQuery, filterJenis]);

    const getJenisBadgeColor = (jenis: string) => {
        if (!jenis) return "bg-slate-50 text-slate-400 border-slate-100";
        const colors = [
            "bg-blue-50 text-blue-600 border-blue-100",
            "bg-emerald-50 text-emerald-600 border-emerald-100",
            "bg-amber-50 text-amber-600 border-amber-100",
            "bg-rose-50 text-rose-600 border-rose-100",
            "bg-indigo-50 text-indigo-600 border-indigo-100"
        ];
        // Hash string to pick a color
        let hash = 0;
        for (let i = 0; i < jenis.length; i++) hash = jenis.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <main className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Penerima Bansos</h1>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Pusat pengelolaan data bantuan sosial desa
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/panel/dashboard/bansos/baru">
                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Tambah Penerima
                    </button>
                </Link>
                </div>
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-blue-400 group-hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">Penerima</span>
                    </div>
                    <div className="text-4xl font-black text-slate-900 leading-none mb-2">{stats.total}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Warga Terdaftar</div>
                </div>

                {kategori.slice(0, 3).map((cat, idx) => (
                    <div key={cat.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn(
                                "p-3 rounded-2xl",
                                idx === 0 ? "bg-blue-50 text-blue-500" : 
                                idx === 1 ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"
                            )}>
                                <FileText className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-slate-300 group-hover:text-slate-500 transition-colors uppercase tracking-[0.2em]">{cat.nama}</span>
                        </div>
                        <div className="text-4xl font-black text-slate-900 leading-none mb-2">{stats.breakdown[cat.nama] || 0}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Penerima Aktif</div>
                    </div>
                ))}
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-100 transition-all">
                {/* Search & Tabs */}
                <div className="flex flex-col gap-10 mb-10">
                    <div className="relative group max-w-2xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan NIK atau Nama Lengkap..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-6 bg-slate-50/50 border border-slate-200 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-600 shadow-inner"
                        />
                    </div>
                    
                    <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit self-start lg:self-auto overflow-x-auto max-w-full no-scrollbar">
                            {allCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterJenis(cat)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-tight",
                                        filterJenis === cat
                                            ? "bg-white text-emerald-700 shadow-sm border border-emerald-100"
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr>
                                <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Informasi Penerima</th>
                                <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Jenis Bantuan</th>
                                <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Tahun</th>
                                <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] text-right">Opsi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableSkeleton columns={4} rows={4} />
                            ) : filteredData.length === 0 ? (
                                <EmptyState
                                    colSpan={4}
                                    icon={Users}
                                    title="Penerima Tidak Ditemukan"
                                    description="Sesuaikan kata kunci pencarian atau filter kategori Anda."
                                />
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="group hover:scale-[1.005] transition-all">
                                        <td className="px-6 py-6 bg-slate-50/50 rounded-l-[1.5rem] border-y border-l border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm">
                                            <div className="font-black text-slate-800 uppercase tracking-tight text-sm mb-1">{item.nama}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                NIK: {item.nik}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 bg-slate-50/50 border-y border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm">
                                            <span className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                                getJenisBadgeColor(item.expand?.jenis_bantuan?.nama || "")
                                            )}>
                                                {item.expand?.jenis_bantuan?.nama || "Kategori Dihapus"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 bg-slate-50/50 border-y border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm text-slate-600">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-black shadow-sm">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                {item.tahun_penerimaan}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 bg-slate-50/50 rounded-r-[1.5rem] border-y border-r border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm">
                                            <div className="flex gap-2 justify-end opacity-50 group-hover:opacity-100 transition-all">
                                                <Link href={`/panel/dashboard/bansos/${item.id}`}>
                                                    <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-95" title="Edit Data">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95"
                                                    title="Hapus Data"
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
