"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pb";
import { Loader2, Save, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getAssetUrl } from "@/lib/cdn";
import { SmartLinkInput } from "@/components/admin/smart-link-input";

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

    const { register, control, handleSubmit, formState: { errors } } = useForm({
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
                alert("Banner diperbarui!");
            } else {
                await pb.collection('hero_banners').create(formData);
                alert("Banner dibuat!");
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
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Standardized Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/panel/dashboard/banners" 
                        className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                            {isEdit ? "Edit Banner" : "Tambah Banner"}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">Kelola konten visual dan pesan utama halaman depan.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT: CONTENT & SETTINGS */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                            <h2 className="font-black text-slate-800 uppercase tracking-wider text-xs">Pesan & Informasi</h2>
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Judul Utama</label>
                            <input 
                                {...register("title", { required: true })} 
                                className="w-full px-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 text-lg" 
                                placeholder="Misal: Selamat Datang di Desa Sumberanyar" 
                            />
                            {errors.title && <p className="text-[10px] text-rose-500 font-bold px-1 mt-1">Judul wajib diisi</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Deskripsi Tambahan</label>
                            <textarea 
                                {...register("subtitle")} 
                                className="w-full px-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm text-slate-600 min-h-[120px] leading-relaxed" 
                                placeholder="Tuliskan pesan singkat yang akan muncul di bawah judul..." 
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 pt-2">
                            <div className="space-y-1">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Urutan Tampilan</label>
                                <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                    <input 
                                        type="number" 
                                        {...register("order")} 
                                        className="w-full bg-transparent outline-none font-black text-emerald-600 text-2xl" 
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium leading-tight">Makin kecil angkanya, makin awal munculnya.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Config */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-4">
                                <div className="space-y-0.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Status Aktif</label>
                                    <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">Matikan untuk menyembunyikan</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" {...register("active")} className="sr-only peer" />
                                    <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
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
                                <>
                                    <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Simpan Banner
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* RIGHT: PHOTO UPLOAD */}
                <div className="lg:col-span-5 space-y-6 h-full">
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6 flex flex-col h-full sticky top-8">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                            <h2 className="font-black text-slate-800 uppercase tracking-wider text-xs">Visual Banner</h2>
                        </div>

                        <div className="flex-grow">
                            <div className="border-4 border-dashed border-slate-50 rounded-[2.5rem] p-4 text-center hover:bg-slate-50 hover:border-emerald-100 transition-all cursor-pointer relative group h-[450px] flex flex-col items-center justify-center overflow-hidden">
                                <input type="file" accept="image/*" onChange={handleDesktopChange} className="absolute inset-0 opacity-0 cursor-pointer z-50" />
                                {desktopPreviewUrl ? (
                                    <img src={desktopPreviewUrl} alt="Preview" className="w-full h-full object-cover rounded-[2rem]" />
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                                            <ImageIcon className="w-10 h-10" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-slate-600 uppercase tracking-tight">Klik untuk Upload Foto</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Aspek 16:9 disarankan</p>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform">
                                    <div className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-2xl shadow-xl">Ganti Background</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic text-center">
                                "Pilihlah foto desa dengan pemandangan terbaik untuk menyambut setiap warga yang berkunjung ke website."
                            </p>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
