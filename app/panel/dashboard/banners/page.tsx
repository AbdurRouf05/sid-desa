"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pb } from "@/lib/pb";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { TactileButton } from "@/components/ui/tactile-button";
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
        <main>
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-bmt-green-700 to-primary-dark text-white relative overflow-hidden shadow-lg flex justify-between items-center">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold font-display">Hero Banners</h1>
                    <p className="text-emerald-100 mt-2">Kelola gambar slide halaman depan.</p>
                </div>
                <div className="relative z-10">
                    <Link href="/panel/dashboard/banners/baru">
                        <TactileButton className="bg-gold-400 text-slate-900 hover:bg-gold-500 border-gold-500">
                            <Plus className="w-4 h-4 mr-2" /> Tambah Banner
                        </TactileButton>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500"><Loader2 className="animate-spin w-8 h-8 mx-auto mb-2" />Memuat data...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">

                            {/* Image Preview */}
                            <div className="aspect-video bg-slate-100 relative group-hover:opacity-90 transition-opacity">
                                {(item.image_desktop || item.image || item.foreground_image) ? (
                                    <img
                                        src={getAssetUrl(item, item.image_desktop || item.image || item.foreground_image)}
                                        alt={item.title}
                                        className={`w-full h-full ${(item.image_desktop || item.image) ? 'object-cover' : 'object-contain p-4 bg-slate-50'}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                                        <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                                        <span className="text-xs">No Image</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${item.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                        {item.active ? 'Aktif' : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">{item.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{item.subtitle || "Tanpa subtitle"}</p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                    <div className="text-xs font-mono text-slate-400">Order: {item.order}</div>
                                    <div className="flex gap-2">
                                        <Link href={`/panel/dashboard/banners/${item.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {banners.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Belum ada banner.</p>
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
