"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pb";
import { Loader2, Save, Image as ImageIcon, ArrowLeft, Info, Activity, Sparkles, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { getAssetUrl } from "@/lib/cdn";
import { cn } from "@/lib/utils";

interface BannerFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function BannerForm({ initialData, isEdit = false }: BannerFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // File states
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [desktopPreviewUrl, setDesktopPreviewUrl] = useState<string>(
        initialData?.image_desktop ? getAssetUrl(initialData, initialData.image_desktop) :
            (initialData?.image ? getAssetUrl(initialData, initialData.image) : "") 
    );

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: initialData?.title || "",
            subtitle: initialData?.subtitle || "",
            order: initialData?.order || 0,
            active: initialData?.active ?? true,
        }
    });

    const handleDesktopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDesktopFile(file);
            setDesktopPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("subtitle", data.subtitle);
            formData.append("order", data.order);
            formData.append("active", data.active);

            if (desktopFile) {
                formData.append("image", desktopFile);
            }

            if (isEdit && initialData?.id) {
                await pb.collection('hero_banners').update(initialData.id, formData);
            } else {
                await pb.collection('hero_banners').create(formData);
            }

            router.push("/panel/dashboard/banners");
        } catch (e) {
            console.error(e);
            alert("Gagal menyimpan banner.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 px-4 md:px-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Integrated Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/banners"
                            className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {isEdit ? "Edit Hero Banner" : "Tambah Banner Utama"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Kelola konten visual dan pesan utama yang akan tampil di beranda depan desa.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 group"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        )}
                        Simpan Banner
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content Column */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Informasi Teks Banner</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Judul Utama</label>
                                    <input 
                                        {...register("title", { required: true })} 
                                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-900 text-lg uppercase tracking-tight" 
                                        placeholder="Misal: Selamat Datang di Desa Sumberanyar" 
                                    />
                                    {errors.title && <p className="text-[10px] text-red-500 font-bold uppercase mt-1 tracking-tight">Judul wajib diisi</p>}
                                </div>

                                {/* Subtitle */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pesan Tambahan (Subtitle)</label>
                                    <textarea 
                                        {...register("subtitle")} 
                                        rows={4}
                                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm text-slate-600 font-medium leading-relaxed resize-none" 
                                        placeholder="Tuliskan pesan singkat yang akan muncul di bawah judul..." 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Visual Card - Large Version */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Gambar Latar Belakang</h3>
                            </div>

                            <div className="relative aspect-[21/9] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 overflow-hidden hover:bg-slate-100/50 hover:border-emerald-200 transition-all group flex flex-col items-center justify-center cursor-pointer">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleDesktopChange} 
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                                />
                                {desktopPreviewUrl ? (
                                    <img src={desktopPreviewUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-slate-300">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-50 border-white/5 opacity-50">
                                            <ImageIcon className="w-10 h-10" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">Klik untuk unggah foto (21:9)</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white p-4">
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/30">Ganti Media</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center italic">Disarankan menggunakan foto landscape resolusi tinggi untuk hasil terbaik.</p>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                        {/* Config Sidebar */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                                    <Settings className="w-4 h-4" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Konfigurasi Slide</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Order */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Urutan Tampil</label>
                                    <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                                        <input 
                                            type="number" 
                                            {...register("order")} 
                                            className="w-16 bg-transparent outline-none font-black text-emerald-600 text-2xl font-mono" 
                                        />
                                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight leading-none italic">
                                            Makin kecil angkanya, makin awal muncul slide ini.
                                        </div>
                                    </div>
                                </div>

                                {/* Active Toggle */}
                                <div className="pt-2">
                                    <label className={cn(
                                        "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border",
                                        watch("active") ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-200"
                                    )}>
                                        <div className="relative inline-flex items-center">
                                            <input type="checkbox" {...register("active")} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">Status Aktif</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Tampilkan di Publik</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Tip Card */}
                        <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-xl shadow-emerald-950/20 relative overflow-hidden group border border-white/5">
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full transition-transform group-hover:scale-110" />
                                <div className="relative z-10 space-y-4">
                                    <div className="p-2 bg-white/10 w-fit rounded-lg">
                                        <Info className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-wider">Tips Visual</h3>
                                    <p className="text-[10px] text-emerald-100/60 leading-relaxed font-bold uppercase tracking-tight">
                                        Pilihlah foto desa dengan pemandangan terbaik untuk menyambut setiap warga yang berkunjung ke portal web desa.
                                    </p>
                                </div>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}

function Settings({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
    )
}
