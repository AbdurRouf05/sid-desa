"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pb";
import Link from "next/link";
import { ArrowLeft, Save, Upload } from "lucide-react";
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
            formData.append('nip', data.nip);
            formData.append('is_aktif', String(data.is_aktif));
            formData.append('sosmed_fb', data.sosmed_fb);
            formData.append('sosmed_ig', data.sosmed_ig);
            formData.append('sosmed_wa', data.sosmed_wa);
            formData.append('sosmed_x', data.sosmed_x);
            
            if (data.foto && data.foto.length > 0) {
                formData.append('foto', data.foto[0]);
            }

            if (isEdit && initialData?.id) {
                await pb.collection('perangkat_desa').update(initialData.id, formData);
                alert("Perangkat desa diperbarui!");
            } else {
                await pb.collection('perangkat_desa').create(formData);
                alert("Perangkat desa ditambahkan!");
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
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/panel/dashboard/perangkat-desa" className="text-slate-500 hover:text-emerald-600 flex items-center gap-2 mb-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">
                    {isEdit ? "Edit Perangkat Desa" : "Tambah Perangkat Desa"}
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">

                {/* Nama & Jabatan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Nama Lengkap *</label>
                        <input
                            {...register("nama", { required: true })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="Contoh: Budi Santoso"
                        />
                        {errors.nama && <span className="text-xs text-red-500">Wajib diisi</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Jabatan *</label>
                        <input
                            {...register("jabatan", { required: true })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="Contoh: Kepala Desa"
                        />
                        {errors.jabatan && <span className="text-xs text-red-500">Wajib diisi</span>}
                    </div>
                </div>

                {/* NIP */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">NIP / NIK (Opsional)</label>
                    <input
                        {...register("nip")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder="Nomor Induk Pegawai"
                    />
                </div>

                {/* Foto */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Foto Profil</label>
                    {isEdit && initialData?.foto && (
                        <div className="mb-2">
                            <img 
                                src={pb.files.getURL(initialData, initialData.foto)} 
                                alt="Foto" 
                                className="w-20 h-20 object-cover rounded-lg border border-slate-200" 
                            />
                        </div>
                    )}
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            {...register("foto")}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                    </div>
                </div>

                {/* Sosial Media */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">Tautan Sosial Media (Opsional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Facebook URL</label>
                            <input
                                {...register("sosmed_fb")}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instagram URL</label>
                            <input
                                {...register("sosmed_ig")}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">WhatsApp URL/Number</label>
                            <input
                                {...register("sosmed_wa")}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                                placeholder="https://wa.me/628..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">X (Twitter) URL</label>
                            <input
                                {...register("sosmed_x")}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-800 text-sm"
                                placeholder="https://x.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Meta */}
                <div className="pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register("is_aktif")}
                            id="is_aktif"
                            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="is_aktif" className="text-sm font-medium text-slate-700 cursor-pointer">
                            Status Aktif (Tampilkan di Website)
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={cn(
                            "bg-emerald-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors",
                            isSaving && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Menyimpan..." : "Simpan Data"}
                    </button>
                </div>

            </form>
        </div>
    );
}
