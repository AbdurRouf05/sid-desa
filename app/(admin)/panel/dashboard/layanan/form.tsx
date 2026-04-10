"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { pb } from "@/lib/pb";
import { Loader2, Save, ArrowLeft, HelpCircle, Plus, Trash2, ListChecks } from "lucide-react";
import Link from "next/link";
import { LayananDesa } from "@/types";

const LayananSchema = z.object({
    nama_layanan: z.string().min(3, "Nama layanan minimal 3 karakter"),
    deskripsi: z.string().min(5, "Deskripsi minimal 5 karakter"),
    konten: z.string().optional(),
    icon: z.string().optional(),
    tipe: z.enum(['panduan', 'lapor', 'bansos', 'link_eksternal', 'halaman_statis']),
    aksi_url: z.string().optional(),
    is_active: z.boolean().default(true),
    urutan: z.coerce.number().default(0),
});

type LayananData = z.infer<typeof LayananSchema>;

export default function LayananFormPage({ isEdit = false }: { isEdit?: boolean }) {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [requirements, setRequirements] = useState<string[]>([]);
    const [newItem, setNewItem] = useState("");

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LayananData>({
        resolver: zodResolver(LayananSchema) as any,
        defaultValues: {
            nama_layanan: "",
            deskripsi: "",
            konten: "",
            icon: "FileSignature",
            tipe: "panduan",
            aksi_url: "",
            is_active: true,
            urutan: 0,
        }
    });

    useEffect(() => {
        if (isEdit && params?.id) {
            const fetchData = async () => {
                try {
                    const record = await pb.collection("layanan_desa").getOne<LayananDesa>(params.id as string);
                    setValue("nama_layanan", record.nama_layanan);
                    setValue("deskripsi", record.deskripsi);
                    setValue("konten", record.konten || "");
                    setValue("icon", record.icon || "FileSignature");
                    setValue("tipe", record.tipe);
                    setValue("is_active", record.is_active !== false);
                    setValue("urutan", record.urutan || 0);

                    // Parse HTML requirements to array
                    if (record.konten) {
                        const items = Array.from(record.konten.matchAll(/<li>(.*?)<\/li>/g), m => {
                            // Basic HTML Entity decoing
                            return m[1].replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
                        });
                        setRequirements(items);
                    }
                } catch (e) {
                    console.error("Gagal memuat data Layanan", e);
                    alert("Gagal memuat data");
                    router.push("/panel/dashboard/layanan");
                }
            };
            fetchData();
        }
    }, [isEdit, params, setValue, router]);

    const addRequirement = () => {
        if (newItem.trim()) {
            setRequirements([...requirements, newItem.trim()]);
            setNewItem("");
        }
    };

    const removeRequirement = (index: number) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: LayananData) => {
        setIsLoading(true);
        try {
            // Construct HTML from requirements list
            const htmlContent = `<div><strong>Berkas yang wajib dibawa:</strong><ul class="mt-2 list-disc pl-5 space-y-1">${requirements.map(r => `<li>${r}</li>`).join('')}</ul></div>`;
            const finalData = { ...data, konten: htmlContent };

            if (isEdit && params?.id) {
                await pb.collection("layanan_desa").update(params.id as string, finalData);
            } else {
                await pb.collection("layanan_desa").create(finalData);
            }
            router.push("/panel/dashboard/layanan");
        } catch (e) {
            console.error("Gagal menyimpan data Layanan", e);
            alert("Gagal menyimpan data Layanan. Silakan periksa isian Anda.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-3xl mx-auto pb-20">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-40 border-b border-slate-200 -mx-8 px-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/panel/dashboard/layanan"
                            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {isEdit ? "Edit Informasi Syarat" : "Tambah Panduan Syarat Baru"}
                            </h1>
                            <p className="text-sm text-slate-500">
                                Atur berkas-berkas apa saja yang harus dibawa warga.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 transition-all disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Simpan Panduan
                    </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Surat / Layanan</label>
                        <input
                            {...register("nama_layanan")}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            placeholder="Contoh: Surat Pengantar KTP"
                        />
                        {errors.nama_layanan && <p className="text-sm text-red-500 mt-1">{errors.nama_layanan.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Penjelasan Singkat</label>
                        <input
                            {...register("deskripsi")}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            placeholder="Contoh: Syarat utama untuk pengurusan KTP di kantor desa."
                        />
                        {errors.deskripsi && <p className="text-sm text-red-500 mt-1">{errors.deskripsi.message}</p>}
                    </div>

                    {/* Simplified Requirement List Editor */}
                    <div className="pt-4 border-t border-slate-50">
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                                <ListChecks className="w-4 h-4 text-emerald-600" />
                                Daftar Syarat (Apa Saja yang Dibawa?)
                            </label>
                            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Berkas yang wajib dibawa:
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            {requirements.map((req, idx) => (
                                <div key={idx} className="flex items-center gap-2 group animate-in slide-in-from-left-2 duration-200">
                                    <div className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 flex items-center justify-between">
                                        <span>{req}</span>
                                        <button 
                                            type="button"
                                            onClick={() => removeRequirement(idx)}
                                            className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                                placeholder="Tulis syarat baru (Contoh: Fotokopi KK)..."
                            />
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3 italic flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            Syarat akan otomatis ditampilkan sebagai daftar poin di portal publik.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                         <label className="block text-sm font-bold text-slate-700 mb-2">Peringkat Urutan Tampil</label>
                         <div className="flex items-center gap-3">
                            <input
                                type="number"
                                {...register("urutan")}
                                className="w-32 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-mono text-sm"
                                placeholder="1"
                            />
                            <div className="flex-1 flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    {...register("is_active")} 
                                    id="is_active"
                                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" 
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-slate-600 cursor-pointer">Tampilkan di Publik</label>
                            </div>
                         </div>
                    </div>
                </div>
            </form>
        </main>
    );
}
