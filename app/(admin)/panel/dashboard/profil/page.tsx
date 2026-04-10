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
        <main className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-300">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-40 border-b border-slate-200 -mx-8 px-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Profil & Sejarah Desa
                        </h1>
                        <p className="text-sm text-slate-500">
                            Kelola identitas, cerita historis, dan arah pandang desa secara komprehensif.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Simpan Perubahan
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                        <div className="flex items-center gap-3 mb-2 border-b pb-4">
                            <Building2 className="w-6 h-6 text-emerald-600" />
                            <h3 className="text-lg font-bold text-slate-800">Identitas Utama Desa</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Desa</label>
                            <input
                                {...register("nama_desa")}
                                className="w-full text-lg font-bold placeholder:font-normal px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                placeholder="Contoh: Sumberanyar"
                            />
                            {errors.nama_desa && <p className="text-sm text-red-500 mt-1">{errors.nama_desa.message}</p>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-4 border-b pb-4">
                            <BookOpen className="w-6 h-6 text-emerald-600" />
                            <h3 className="text-lg font-bold text-slate-800">Sejarah Desa</h3>
                        </div>
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

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-4 border-b pb-4">
                            <Building2 className="w-6 h-6 text-emerald-600" />
                            <h3 className="text-lg font-bold text-slate-800">Visi & Misi</h3>
                        </div>
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
            </form>
        </main>
    );
}
