"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { pb } from "@/lib/pb";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Loader2, Save, Building2, BookOpen } from "lucide-react";

const profilSchema = z.object({
    nama_desa: z.string().min(3, "Nama desa minimal 3 karakter"),
    sejarah_desa: z.string().optional(),
    visi_misi: z.string().optional(),
});

type ProfilInputs = z.infer<typeof profilSchema>;

export default function ProfilDesaPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [recordId, setRecordId] = useState<string | null>(null);

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<ProfilInputs>({
        resolver: zodResolver(profilSchema),
        defaultValues: {
            nama_desa: "",
            sejarah_desa: "",
            visi_misi: "",
        }
    });

    useEffect(() => {
        const fetchProfil = async () => {
            try {
                const record = await pb.collection('profil_desa').getFirstListItem("");
                if (record) {
                    setRecordId(record.id);
                    setValue("nama_desa", record.nama_desa || "");
                    setValue("sejarah_desa", record.sejarah_desa || "");
                    setValue("visi_misi", record.visi_misi || "");
                }
            } catch (e: any) {
                if (e.status === 404) {
                    console.log("No profil record found. Ready to create.");
                } else {
                    console.error("Error fetching profil_desa", e);
                }
            }
        };
        fetchProfil();
    }, [setValue]);

    const onSubmit = async (data: ProfilInputs) => {
        setIsLoading(true);
        try {
            if (recordId) {
                await pb.collection('profil_desa').update(recordId, data);
                alert("Profil Desa berhasil diperbarui.");
            } else {
                const newRecord = await pb.collection('profil_desa').create(data);
                setRecordId(newRecord.id);
                alert("Profil Desa berhasil disimpan.");
            }
        } catch (e) {
            console.error("Save failed", e);
            alert("Gagal menyimpan profil desa.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Standard Header - Transparent */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                            Profil & Sejarah Desa
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola identitas, cerita historis, dan arah pandang desa secara komprehensif.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        )}
                        Simpan Perubahan
                    </button>
                </div>

                {/* Identity Card - Large full width but compact fields */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Identitas Desa</h3>
                    </div>
                    
                    <div className="max-w-2xl">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Lengkap Desa</label>
                        <input
                            {...register("nama_desa")}
                            className="w-full text-base font-bold placeholder:font-normal px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white outline-none transition-all text-slate-700"
                            placeholder="Contoh: Desa Sumberanyar"
                        />
                        {errors.nama_desa && <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-tight">{errors.nama_desa.message}</p>}
                    </div>
                </div>

                {/* Dual Column Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sejarah Desa Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Sejarah Desa</h3>
                        </div>
                        <div className="flex-1 min-h-[400px]">
                            <Controller
                                name="sejarah_desa"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        placeholder="Ceritakan asal mula terbentuknya desa, pendiri, dan tokoh-tokoh penting..."
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Visi Misi Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Visi & Misi</h3>
                        </div>
                        <div className="flex-1 min-h-[400px]">
                            <Controller
                                name="visi_misi"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        placeholder="Apa visi dan misi kepala desa saat ini? Jabarkan dengan rinci..."
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
