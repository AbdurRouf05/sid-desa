"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { getAssetUrl } from "@/lib/cdn";

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
            fetchBanners(); // Refresh
        } catch (e) {
            alert("Gagal menghapus.");
        }
    };

    return (
        <main className="space-y-8">
            {/* Standardized Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Hero Banners</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola gambar slide dan pesan selamat datang di halaman depan.</p>
                </div>
                <Link href="/panel/dashboard/banners/baru">
                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95 group text-sm">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Tambah Banner
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                    <Loader2 className="animate-spin w-8 h-8 mb-3" />
                    <p className="font-medium">Memuat koleksi banner...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((item) => (
                        <div key={item.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden flex flex-col">
                            
                            {/* Premium Image Preview */}
                            <div className="relative aspect-[16/9] bg-slate-50 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {(item.image_desktop || item.image || item.foreground_image) ? (
                                    <img
                                        src={getAssetUrl(item, item.image_desktop || item.image || item.foreground_image)}
                                        alt={item.title}
                                        className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${(item.image_desktop || item.image) ? 'object-cover' : 'object-contain p-6'}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                        <ImageIcon className="w-10 h-10 mb-2 opacity-30" />
                                        <span className="text-xs font-bold uppercase tracking-widest">No Media</span>
                                    </div>
                                )}
                                
                                {/* Status Float */}
                                <div className="absolute top-3 right-3 z-20">
                                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm border ${
                                        item.active 
                                        ? 'bg-emerald-500 text-white border-emerald-400' 
                                        : 'bg-white text-slate-400 border-slate-100'
                                    }`}>
                                        {item.active ? 'Aktif' : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex-grow space-y-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">Order {item.order}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">{item.title}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                        {item.subtitle || "Tidak ada deskripsi tambahan untuk banner ini."}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-end gap-2">
                                    <Link 
                                        href={`/panel/dashboard/banners/${item.id}`} 
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        <span>Edit</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Hapus</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {banners.length === 0 && (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                            <div className="p-5 bg-white rounded-2xl shadow-sm mb-4">
                                <ImageIcon className="w-10 h-10 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Belum ada banner yang dibuat</p>
                            <Link href="/panel/dashboard/banners/baru" className="mt-4 text-emerald-600 font-bold text-sm hover:underline">
                                Buat banner pertama Anda &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}

// Icon helper
function ImageIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
    )
}
