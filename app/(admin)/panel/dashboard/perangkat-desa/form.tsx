"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pb";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, User, Briefcase, Share2, CreditCard, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerangkatFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function PerangkatForm({ initialData, isEdit }: PerangkatFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            nama: initialData?.nama || "",
            jabatan: initialData?.jabatan || "",
            nip: initialData?.nip || "",
            is_aktif: initialData?.is_aktif ?? true,
            sosmed_fb: initialData?.sosmed_fb || "",
            sosmed_ig: initialData?.sosmed_ig || "",
            sosmed_wa: initialData?.sosmed_wa || "",
            sosmed_x: initialData?.sosmed_x || "",
            foto: null,
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('nama', data.nama);
            formData.append('jabatan', data.jabatan);
            if (data.nip && data.nip.trim()) formData.append('nip', data.nip);
            formData.append('is_aktif', String(data.is_aktif));
            if (data.sosmed_fb && data.sosmed_fb.trim()) formData.append('sosmed_fb', data.sosmed_fb);
            if (data.sosmed_ig && data.sosmed_ig.trim()) formData.append('sosmed_ig', data.sosmed_ig);
            if (data.sosmed_wa && data.sosmed_wa.trim()) formData.append('sosmed_wa', data.sosmed_wa);
            if (data.sosmed_x && data.sosmed_x.trim()) formData.append('sosmed_x', data.sosmed_x);
            
            if (data.foto && data.foto.length > 0) {
                formData.append('foto', data.foto[0]);
            }

            if (isEdit && initialData?.id) {
                await pb.collection('perangkat_desa').update(initialData.id, formData);
            } else {
                await pb.collection('perangkat_desa').create(formData);
            }
            router.push("/panel/dashboard/perangkat-desa");
        } catch (e) {
            console.error(e);
            alert("Gagal menyimpan data.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 px-4 md:px-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Clean Integrated Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/perangkat-desa"
                            className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md bg-slate-50 md:bg-transparent"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                {isEdit ? "Perbarui Perangkat" : "Tambah Perangkat"}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Kelola informasi perangkat desa dan staf pemerintahan.
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
                        {isSaving ? "Menyimpan..." : "Simpan Data"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content - 8 Cols */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Section: Identitas */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Identitas</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Nama Lengkap <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        {...register("nama", { required: true })}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold uppercase tracking-wide"
                                        placeholder="CONTOH: BUDI SANTOSO"
                                    />
                                    {errors.nama && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">Wajib diisi</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Jabatan <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        {...register("jabatan", { required: true })}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm"
                                        placeholder="Contoh: Kepala Desa"
                                    />
                                    {errors.jabatan && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">Wajib diisi</p>}
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NIP / NIK (Opsional)</label>
                                    <input
                                        {...register("nip")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all font-mono text-sm"
                                        placeholder="Nomor Induk Pegawai"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Sosial Media */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Share2 className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Sosial Media</h3>
                                <span className="text-[10px] text-slate-400 font-medium">(Opsional)</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Facebook</label>
                                    <input
                                        {...register("sosmed_fb")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Instagram</label>
                                    <input
                                        {...register("sosmed_ig")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-pink-500/5 focus:border-pink-500 focus:bg-white outline-none transition-all text-sm"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">WhatsApp</label>
                                    <input
                                        {...register("sosmed_wa")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-green-500/5 focus:border-green-500 focus:bg-white outline-none transition-all text-sm"
                                        placeholder="https://wa.me/628..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">X (Twitter)</label>
                                    <input
                                        {...register("sosmed_x")}
                                        className="w-full px-5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-slate-500/5 focus:border-slate-500 focus:bg-white outline-none transition-all text-sm"
                                        placeholder="https://x.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - 4 Cols */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Section: Foto Profil */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Camera className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Foto Profil</h3>
                            </div>

                            {isEdit && initialData?.foto && (
                                <div className="mb-4">
                                    <div className="aspect-square w-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                        <img 
                                            src={pb.files.getURL(initialData, initialData.foto)} 
                                            alt="Foto" 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative group cursor-pointer">
                                <div className="aspect-[3/2] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 group-hover:bg-slate-100 transition-all">
                                    <User className="w-10 h-10 text-slate-300 mb-2" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Foto</p>
                                    <p className="text-[10px] text-slate-400 mt-1">JPG, PNG maks 2MB</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("foto")}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Section: Status */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Status</h3>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50/50 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                                <input
                                    type="checkbox"
                                    {...register("is_aktif")}
                                    className="w-5 h-5 text-emerald-600 rounded-lg focus:ring-emerald-500 border-slate-300"
                                />
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Status Aktif</p>
                                    <p className="text-[10px] text-slate-400">Tampilkan di website publik</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
