"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Sparkles, LayoutGrid } from "lucide-react";
import { getAssetUrl } from "@/lib/cdn";
import { cn } from "@/lib/utils";

export default function BannersPage() {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const records = await pb.collection('hero_banners').getList(1, 50, {
                sort: 'order',
            });
            setBanners(records.items);
        } catch (e) {
            console.error("Error fetching banners", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;
        try {
            await pb.collection('hero_banners').delete(id);
            fetchBanners();
        } catch (e) {
            alert("Gagal menghapus.");
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-2 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Hero Banners</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola gambar slide dan pesan selamat datang di halaman depan desa.</p>
                </div>
                <Link href="/panel/dashboard/banners/baru" className="w-full md:w-auto">
                    <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm w-full md:w-auto">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Tambah Banner
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
                    <Loader2 className="animate-spin w-8 h-8 mb-3 text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest mt-2">Sinkronisasi Media...</p>
                </div>
            ) : banners.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                    <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                        <ImageIcon className="w-10 h-10 text-slate-200" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Belum ada slide banner aktif</p>
                    <Link href="/panel/dashboard/banners/baru" className="mt-4 text-emerald-600 font-bold text-xs hover:underline uppercase tracking-widest">
                        Buat banner pertama Anda &rarr;
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((item) => (
                        <div key={item.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col overflow-hidden">
                            {/* Image Preview Container */}
                            <div className="relative aspect-[16/9] bg-slate-50 overflow-hidden border-b border-slate-50">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                {item.image || item.image_desktop ? (
                                    <img
                                        src={getAssetUrl(item, item.image || item.image_desktop)}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                                        <ImageIcon className="w-10 h-10 opacity-30" />
                                        <span className="text-[9px] font-black uppercase tracking-widest mt-2">Tanpa Media</span>
                                    </div>
                                )}
                                
                                <div className="absolute top-3 right-3 z-20">
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                        item.active 
                                            ? "bg-emerald-500 text-white border-emerald-400" 
                                            : "bg-white/90 backdrop-blur-sm text-slate-400 border-slate-100"
                                    )}>
                                        {item.active ? <Sparkles className="w-3 h-3" /> : null}
                                        {item.active ? 'Publik' : 'Draft'}
                                    </span>
                                </div>
                                
                                <div className="absolute bottom-3 left-3 z-20">
                                    <span className="px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-md border border-white/10">
                                        Urutan {item.order}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex flex-col flex-grow bg-white">
                                <div className="flex-grow space-y-1">
                                    <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors uppercase tracking-tight text-sm">
                                        {item.title}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                                        {item.subtitle || "Tidak ada pesan tambahan."}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-end gap-2">
                                    <Link 
                                        href={`/panel/dashboard/banners/${item.id}`} 
                                        className="inline-flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        <span>Edit</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="inline-flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Hapus</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
